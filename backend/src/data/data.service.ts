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
    const device: any = await db.device.findUnique({
        where: {token: deviceToken},
        select: {
            id: true,
        },
    });
    
    const deviceId = device.id;

    const lastExercise = await db.exercise.findFirst({
        where: { deviceId },
        orderBy: {
            createdAt: "desc",
        },    
    });

    const lastSeries = await db.series.findFirst({
        where: {
            exercise: { deviceId }
        },
        orderBy: {
            createdAt: "desc",
        },    
    });

    const lastPoint = await db.point.findFirst({
        where: {
            series: {
                exercise: { deviceId }
            }
        },
        orderBy: {
            createdAt: "desc",
        },    
    });

    let latestTimestamp = lastExercise.endedAt ?? lastExercise.createdAt;

    const latestSeriesTimestamp = lastSeries.endedAt ?? lastSeries.createdAt;
    if (latestSeriesTimestamp > latestTimestamp) latestTimestamp = latestSeriesTimestamp;

    if (lastPoint.createdAt > latestTimestamp) latestTimestamp = lastPoint.createdAt;

    if (bulkData[bulkData.length - 1].ts < latestTimestamp.getMilliseconds()) {
        throw Error("Latest data in build has timestamp before lates timestamp in database");
    }

    for await (const data of bulkData) {
        const curDate = new Date(data.ts);
        
        try {
            switch(data.event) {
                case EventType.EXERCISE_START: createExercise(deviceId, curDate);
                case EventType.SERIES_START: createSeries(deviceId, curDate);
                case EventType.RAW_VALUE: createPoint(deviceId, curDate, data.value);
                case EventType.REP_COUNT: updateRepCount(deviceId, data.value);
                case EventType.SERIES_END: endSeries(deviceId, curDate);
                case EventType.EXERCISE_END: endExercise(deviceId, curDate);
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