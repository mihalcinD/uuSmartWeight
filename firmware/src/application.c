#include <application.h>

twr_led_t led;       // Declare LED instance for controlling the LED
twr_button_t button; // Declare button instance for button event handling

twr_lis2dh12_t a;                 // Declare accelerometer instance for accelerometer readings
twr_lis2dh12_result_g_t a_result; // Declare structure to hold accelerometer results

bool is_measuring = false;  // Flag to track if measurement is in progress
bool is_new_set = true;     // Flag to track if new set
bool is_active_set = false; // Flag to track if set is active
uint8_t reps_count = 0;     // Counter for repetitions
uint8_t series_count = 0;   // Counter for series
int series_start_time = 0;  // Variable to store the start time of a series
int set_start_time = 0;     // Variable to store the start time of a set

#define ACCELERATION_THRESHOLD_START 0.2f // Define threshold for starting a movement
#define ACCELERATION_THRESHOLD_END 0.1f   // Define threshold for ending a movement
#define REPETITION_TIME_THRESHOLD 500     // Define minimum time for a repetition (in milliseconds)

bool movement_started = false; // Flag to track if a movement has started
int movement_start_time = 0;   // Variable to store the start time of a movement

// Event handler for button events
void button_event_handler(twr_button_t *self, twr_button_event_t event, void *event_param)
{
    (void)self;
    (void)event_param;
    if (event == TWR_BUTTON_EVENT_PRESS && is_active_set) // If the button is pressed and is there active set
    {
        if (!is_measuring) // If not currently measuring
        {
            // Start measuring and turn LED on
            is_measuring = true;
            twr_led_set_mode(&led, TWR_LED_MODE_ON);
            series_start_time = twr_tick_get();                    // Record the start time of the series
            series_count++;                                        // Increment series count
            twr_log_debug("Starting series %d\r\n", series_count); // Log the start of a new series
        }
        else // If already measuring
        {
            // Stop measuring and turn LED off
            is_measuring = false;
            twr_led_set_mode(&led, TWR_LED_MODE_OFF);
            int series_duration = twr_tick_get() - series_start_time;                                                     // Calculate the duration of the series
            twr_log_debug("Series %d ended with %d repetitions in %d ms\r\n", series_count, reps_count, series_duration); // Log the end of a series
            reps_count = 0;                                                                                               // Reset repetition count
        }
    }
    else if (event == TWR_BUTTON_EVENT_HOLD) // If the button is held
    {
        if (is_new_set) // If new set
        {
            // Start measuring and blink LED
            is_new_set = false;
            is_active_set = true;
            set_start_time = twr_tick_get();         // Record the start time of the set
            twr_log_debug("Starting a new set\r\n"); // Log the start of a new set
            twr_led_set_mode(&led, TWR_LED_MODE_BLINK);
        }
        else // If set ends
        {
            // Stop measuring and turn LED off
            is_measuring = false;
            is_new_set = true;
            is_active_set = false;
            int set_duration = twr_tick_get() - set_start_time;                                 // Calculate the duration of the set
            twr_log_debug("Set ended with %d series in %d ms\r\n", series_count, set_duration); // Log the end of a set
            twr_led_set_mode(&led, TWR_LED_MODE_OFF);
            series_count = 0; // Reset series count
        }
        // Reset or start a new set and make LED blink
    }
}

// Event handler for accelerometer events
void lis2_event_handler(twr_lis2dh12_t *self, twr_lis2dh12_event_t event, void *event_param)
{
    (void)self;
    (void)event_param;

    if (event == TWR_LIS2DH12_EVENT_UPDATE) // If new accelerometer data is available
    {
        if (is_measuring) // If is active series
        {
            twr_lis2dh12_get_result_g(&a, &a_result); // Retrieve the latest accelerometer data

            // Logic to detect a repetition
            if (!movement_started && a_result.z_axis > ACCELERATION_THRESHOLD_START) // If movement has not started and acceleration exceeds start threshold
            {
                movement_started = true;              // Mark the start of a movement
                movement_start_time = twr_tick_get(); // Record the start time
            }
            else if (movement_started && a_result.z_axis < ACCELERATION_THRESHOLD_END) // If movement has started and acceleration is below end threshold
            {
                movement_started = false;                                     // Mark the end of a movement
                int movement_duration = twr_tick_get() - movement_start_time; // Calculate the duration of the movement

                if (movement_duration > REPETITION_TIME_THRESHOLD) // If the movement duration is above the repetition time threshold
                {
                    reps_count++;                                             // Increment the repetition count
                    twr_log_debug("Repetition detected: %d\r\n", reps_count); // Log the detection of a repetition
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
}