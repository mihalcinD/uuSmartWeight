import { createExercise, endExercise } from "../exercise/exercise.service";
import { createSeries, endSeries } from "../series/series.service";
import { db } from "../utils/db.server";

export enum EventType {
    EXERCISE_START = 0,
    SERIES_START,
    RAW_VALUE,
    REP_COUNT,
    SERIES_END,
    EXERCISE_END,
} 

interface Data {
    ts: number
    event: EventType
    value?: number
}

export async function createBulk(deviceToken: string, bulkData: Data[]): Promise<void> {
    const device = (await db.device.findUnique({where: {token: deviceToken}}));

    for await (const data of bulkData) {
        const curDate = new Date(data.ts);
        
        try {
            switch(data.event) {
                case EventType.EXERCISE_START: createExercise(device.id, curDate);
                case EventType.SERIES_START: createSeries(device.id, curDate);
                case EventType.RAW_VALUE: createPoint(device.id, curDate, data.value);
                case EventType.REP_COUNT: updateRepCount(device.id, data.value);
                case EventType.SERIES_END: endSeries(device.id, curDate);
                case EventType.EXERCISE_END: endExercise(device.id, curDate);
            }
        } catch(e) {
            throw(e);
        }
    }
}

async function createPoint(deviceId: number, date: Date, value: number): Promise<void> {
    // Create new Point for active Series
        const activeSeries = await db.series.findFirstOrThrow({
            where: {
                exercise: { deviceId },
                endedAt: null,
            }
        });

        await db.point.create({
            data: {
              createdAt: date,
              value,
              seriesId: activeSeries.id,
            }
        });
    //
}

async function updateRepCount(deviceId: number, numberOfRepetitions: number): Promise<void> {
    // Create new Point for active Series
        const activeSeries = await db.series.findFirstOrThrow({
            where: {
                exercise: { deviceId },
                endedAt: null,
            }
        });

        await db.series.update({
            where: {
                id: activeSeries.id,
            },
            data: {
                numberOfRepetitions,
            }
        })
    //
}