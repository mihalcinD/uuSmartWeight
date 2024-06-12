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
    id: number
    ts: number
    event: EventType
    value?: number
    deviceToken: string
}

type DeviceTokenDeviceID = {
    [key: string]: number;
  };

interface CreateBulkResponse {
    doneIDs: number[]
    errored: boolean
}

export async function createBulk(bulkData: Data[]): Promise<CreateBulkResponse> {
    let deviceTokenDeviceID: DeviceTokenDeviceID = {};

    for (const data of bulkData) {
        const deviceFromToken: any = await db.device.findUnique({
            where: {token: data.deviceToken},
            select: {
                id: true,
            },
        });
    
        // If device was already created check if timestamp of 
        if (deviceFromToken != null) {
            deviceTokenDeviceID[data.deviceToken] = deviceFromToken.id;
    
            const lastExercise: any = await db.exercise.findFirst({
                where: { deviceId: deviceFromToken.id },
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
                    exercise: { deviceId: deviceFromToken.id }
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
                        exercise: { deviceId: deviceFromToken.id }
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
                return {doneIDs: [], errored: true};
            }
        } else {
            // If there is no device mathing the token we create a new one
            const dbDevice = await db.device.create({
                data: {
                    token: data.deviceToken,
                }
            });
            
            deviceTokenDeviceID[data.deviceToken] = dbDevice.id;
        } 
    }

    const doneIDs: number[] = [];

    for await (const data of bulkData) {
        const curDate = new Date(data.ts);
        const activeDeviceID = deviceTokenDeviceID[data.deviceToken];

        try {
            switch(data.event) {
                case EventType.EXERCISE_START: {
                    await createExercise(activeDeviceID, curDate);
                    break;
                }
                case EventType.SERIES_START: {
                    await createSeries(activeDeviceID, curDate);
                    break;
                }
                case EventType.RAW_VALUE: {
                    await createPoint(activeDeviceID, curDate, data.value);
                    break;
                }
                case EventType.REP_COUNT: {
                    await updateRepCount(activeDeviceID, curDate, data.value);
                    break;
                }
                case EventType.SERIES_END: {
                    await endSeries(activeDeviceID, curDate);
                    break;
                }
                case EventType.EXERCISE_END: {
                    await endExercise(activeDeviceID, curDate);
                    break;
                }
            }
            doneIDs.push(data.id);
        } catch(e) {
            return {doneIDs, errored: true};
        }
    }

    return {doneIDs, errored: false};
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