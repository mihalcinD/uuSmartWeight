#include <application.h>
#include <stdio.h>  // Include for sscanf
#include <stdint.h> // Include for int64_t
#include <string.h>
#include <stdlib.h>
#include <math.h>

// Declare LED instance for controlling the LED
twr_led_t led;

// Declare button instance for button event handling
twr_button_t button;

// Declare accelerometer instance for accelerometer readings
twr_lis2dh12_t a;

// Declare structure to hold accelerometer results
twr_lis2dh12_result_g_t a_result;

// Flags and counters for tracking exercise status and repetitions
bool is_measuring = false; // Flag to track if measurement is in progress
bool is_new_ex = true;     // Flag to track if new exercise
bool is_active_ex = false; // Flag to track if exercise is active
uint8_t reps_count = 0;    // Counter for repetitions
uint8_t series_count = 0;  // Counter for series
int64_t current_time = 0;  // Variable to hold current time

// Device token for logging purposes
char device_token[6] = "R2D2\0";

// Constants for movement detection thresholds
#define ALPHA 0.1
#define ACCELERATION_THRESHOLD_START 0.2f // Define threshold for starting a movement
#define ACCELERATION_THRESHOLD_END 0.01f  // Define threshold for ending a movement
#define REPETITION_TIME_THRESHOLD 500     // Define minimum time for a repetition (in milliseconds)

// Variables for movement detection
bool movement_started = false; // Flag to track if a movement has started
int movement_start_time = 0;   // Variable to store the start time of a movement

// Previous filtered value for low pass filter
float prevFilteredValueY = 0.0;

// Low pass filter function to filter accelerometer data
float lowPassFilter(float currentValue, float *prevFilteredValue, float alpha)
{
    float filteredValue = alpha * currentValue + (1 - alpha) * (*prevFilteredValue);
    *prevFilteredValue = filteredValue;
    return filteredValue;
}

// Event handler for button events
void button_event_handler(twr_button_t *self, twr_button_event_t event, void *event_param)
{
    (void)self;
    (void)event_param;

    // If the button is pressed and there is an active exercise
    if (event == TWR_BUTTON_EVENT_CLICK && is_active_ex)
    {
        if (!is_measuring) // If not currently measuring
        {
            // Start measuring and turn LED on
            is_measuring = true;
            twr_led_set_mode(&led, TWR_LED_MODE_ON);
            series_count++; // Increment series count
            twr_log_debug("{\"ts\": \"%lld\", \"event\": \"1\", \"deviceToken\": \"%s\"}", current_time, device_token);
        }
        else // If already measuring
        {
            // Stop measuring and turn LED off
            is_measuring = false;
            twr_led_set_mode(&led, TWR_LED_MODE_BLINK);
            twr_log_debug("{\"ts\": \"%lld\", \"event\": \"4\", \"deviceToken\": \"%s\"}", current_time, device_token);
            reps_count = 0; // Reset repetition count
        }
    }
    else if (event == TWR_BUTTON_EVENT_HOLD) // If the button is held
    {
        // Reset or start a new set and make LED blink
        if (is_new_ex) // If new exercise
        {
            // Start measuring and blink LED
            is_new_ex = false;
            is_active_ex = true;
            twr_log_debug("{\"ts\": \"%lld\", \"event\": \"0\", \"deviceToken\": \"%s\"}", current_time, device_token);
            twr_led_set_mode(&led, TWR_LED_MODE_BLINK);
        }
        else // If exercise ends
        {
            // Stop measuring and turn LED off
            is_measuring = false;
            is_new_ex = true;
            is_active_ex = false;
            twr_log_debug("{\"ts\": \"%lld\", \"event\": \"5\", \"deviceToken\": \"%s\"}", current_time, device_token);
            twr_led_set_mode(&led, TWR_LED_MODE_OFF);
            series_count = 0; // Reset series count
        }
    }
}

// Event handler for accelerometer events
void lis2_event_handler(twr_lis2dh12_t *self, twr_lis2dh12_event_t event, void *event_param)
{
    (void)self;
    (void)event_param;

    // Update current time
    if (current_time != 0)
    {
        current_time += 100;
    }

    // If new accelerometer data is available
    if (event == TWR_LIS2DH12_EVENT_UPDATE)
    {
        // If it is an active series
        if (is_measuring)
        {
            // Retrieve the latest accelerometer data
            twr_lis2dh12_get_result_g(&a, &a_result);

            // Apply low pass filter to the y-axis data
            float filteredY = lowPassFilter(a_result.y_axis, &prevFilteredValueY, ALPHA);

            // Log the filtered data
            twr_log_debug("{\"ts\": \"%lld\", \"event\": \"2\", \"value\": \"%f\", \"deviceToken\": \"%s\"}", current_time, filteredY, device_token);

            // Logic to detect a repetition
            if (!movement_started && filteredY > ACCELERATION_THRESHOLD_START)
            {
                // If movement has not started and acceleration exceeds start threshold
                movement_started = true;              // Mark the start of a movement
                movement_start_time = twr_tick_get(); // Record the start time
            }
            else if (movement_started && filteredY < ACCELERATION_THRESHOLD_END)
            {
                // If movement has started and acceleration is below end threshold
                movement_started = false;                                     // Mark the end of a movement
                int movement_duration = twr_tick_get() - movement_start_time; // Calculate the duration of the movement

                if (movement_duration > REPETITION_TIME_THRESHOLD)
                {
                    // If the movement duration is above the repetition time threshold
                    reps_count++; // Increment the repetition count
                    twr_log_debug("{\"ts\": \"%lld\", \"event\": \"3\", \"value\": \"%d\", \"deviceToken\": \"%s\"}", current_time, reps_count, device_token);
                }
            }
        }
    }
}

// Initialization function called at the start of the application
void application_init(void)
{
    twr_log_init(TWR_LOG_LEVEL_DEBUG, TWR_LOG_TIMESTAMP_OFF); // Initialize logging with debug level and no timestamps

    // Initialize the LED and set its initial mode to off
    twr_led_init(&led, TWR_GPIO_LED, false, false);
    twr_led_set_mode(&led, TWR_LED_MODE_OFF);

    // Initialize the button, set it to pull-down configuration, and assign the button event handler
    twr_button_init(&button, TWR_GPIO_BUTTON, TWR_GPIO_PULL_DOWN, false);
    twr_button_set_event_handler(&button, button_event_handler, NULL);

    // Initialize the accelerometer, set its event handler, and configure it to update every 100 milliseconds
    twr_lis2dh12_init(&a, TWR_I2C_I2C0, 0x19);
    twr_lis2dh12_set_event_handler(&a, lis2_event_handler, NULL);
    twr_lis2dh12_set_update_interval(&a, 100);

    // Initialize UART and set event handler
    twr_uart_init(TWR_UART_UART2, TWR_UART_BAUDRATE_115200, TWR_UART_SETTING_8N1);
}

// Function called periodically by the scheduler
void application_task()
{
    // Request current time
    twr_log_debug("{\"getTime\": true}");

    // Define receive buffer
    uint8_t uart_rx[32];

    // Synchronous reading
    size_t number_of_rx_bytes = twr_uart_read(TWR_UART_UART2, uart_rx, sizeof(uart_rx), 500);

    // Output the received data
    if (number_of_rx_bytes > 0)
    {
        // Convert the received string directly to int64_t
        sscanf((char *)uart_rx, "%" SCNd64, &current_time);
    }

    // If current time is zero, reschedule the task
    if (current_time == 0)
    {
        twr_scheduler_plan_current_now();
    }
}
