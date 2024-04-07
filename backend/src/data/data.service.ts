import { createExercise, endExercise } from "../exercise/exercise.service";
import { createSeries, endSeries, getActiveSeriesOrCreateNew } from "../series/series.service";
import { db } from "../utils/db.server";

export enum EventType {
    EXERCISE_START = 0,
    SERIES_START,
    RAW_VALUE,
    REP_COUNT,
    SERIES_END,
    EXERCISE_END,
} 

export interface Data {
    ts: number
    event: EventType
    value?: number
}

export async function createBulk(deviceToken: string, bulkData: Data[]): Promise<void> {
    let deviceId = 0;

    const deviceFromToken: any = await db.device.findUnique({
        where: {token: deviceToken},
        select: {
            id: true,
        },
    });

    // If device was already created check if timestamp of 
    if (deviceFromToken != null) {
        deviceId = deviceFromToken.id;

        const lastExercise: any = await db.exercise.findFirst({
            where: { deviceId },
            select: {
                createdAt: true,
                endedAt: true,
            }, 
            orderBy: {
                createdAt: "desc",
            },    
        });
    
        const lastSeries: any = await db.series.findFirst({
            where: {
                exercise: { deviceId }
            },
            select: {
                createdAt: true,
                endedAt: true,
            }, 
            orderBy: {
                createdAt: "desc",
            },    
        });
    
        const lastPoint: any = await db.point.findFirst({
            where: {
                series: {
                    exercise: { deviceId }
                }
            },
            select: { createdAt: true }, 
            orderBy: {
                createdAt: "desc",
            },    
        });
        
        let latestTimestamp = lastExercise?.endedAt ?? lastExercise?.createdAt;
    
        const latestSeriesTimestamp = lastSeries?.endedAt ?? lastSeries?.createdAt;
        if (latestSeriesTimestamp && latestSeriesTimestamp > latestTimestamp) latestTimestamp = latestSeriesTimestamp;
    
        if (lastPoint && lastPoint.createdAt > latestTimestamp) latestTimestamp = lastPoint.createdAt;
       
        if (latestTimestamp && bulkData[0].ts < latestTimestamp.getTime()) {
            throw Error("First data in bulk has timestamp before lates timestamp in database");
        }
    } else {
        // If there is no device mathing the token we create a new one
        const dbDevice = await db.device.create({
            data: {
                token: deviceToken,
            }
        });

        deviceId = dbDevice.id;
    } 

    for await (const data of bulkData) {
        const curDate = new Date(data.ts);

        try {
            switch(data.event) {
                case EventType.EXERCISE_START: {
                    await createExercise(deviceId, curDate);
                    break;
                }
                case EventType.SERIES_START: {
                    await createSeries(deviceId, curDate);
                    break;
                }
                case EventType.RAW_VALUE: {
                    await createPoint(deviceId, curDate, data.value);
                    break;
                }
                case EventType.REP_COUNT: {
                    await updateRepCount(deviceId, curDate, data.value);
                    break;
                }
                case EventType.SERIES_END: {
                    await endSeries(deviceId, curDate);
                    break;
                }
                case EventType.EXERCISE_END: {
                    await endExercise(deviceId, curDate);
                    break;
                }
            }
        } catch(e) {
            throw(e);
        }
    }
}

async function createPoint(deviceId: number, date: Date, value: number): Promise<void> {
    // Create new Point for active Series
        const activeSeriesID = await getActiveSeriesOrCreateNew(deviceId, date);

        await db.point.create({
            data: {
              createdAt: date,
              value,
              series: {
                connect: {id: activeSeriesID}
              }
            }
        });
    //
}

async function updateRepCount(deviceId: number, date: Date, numberOfRepetitions: number): Promise<void> {
    // Create new Point for active Series
        const activeSeriesID = await getActiveSeriesOrCreateNew(deviceId, date);

        await db.series.update({
            where: {
                id: activeSeriesID,
            },
            data: {
                numberOfRepetitions,
            }
        })
    //
}