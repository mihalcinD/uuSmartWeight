import { db } from "../utils/db.server";

interface DeviceDetail {
  numberOfExercises: number
  numberOfSeries: number
  totalTime: number
  points: number
}

export async function getDeviceDetail(deviceToken: string, currentDate: Date): Promise<DeviceDetail> {
  try {
      const dbDevice = await db.device.findUniqueOrThrow({
          where: {
              token: deviceToken,
          },
          select: {
            exercises: {
              where: {
                endedAt: {
                  not: null,
                },
              },
              select: {
                createdAt: true,
                endedAt: true,
                series: {
                  select: {
                    numberOfRepetitions: true,
                  }
                }
              }
            }
          }
      });
      
      let numberOfSeries = 0;
      let totalTime = 0;
      let points = 0;

      for (const dbExercise of dbDevice.exercises) {
        numberOfSeries += dbExercise.series.length;
        totalTime += dbExercise.endedAt.getTime() - dbExercise.endedAt.getTime();

        points += 10 + dbExercise.series.length * 5;
        for (const dbSeries of dbExercise.series) {
          points += dbSeries.numberOfRepetitions * 2;
        }
      }

      points += totalTime % 60_000; 

      return {
        numberOfExercises: dbDevice.exercises.length,
        numberOfSeries,
        totalTime,
        points,
      };
  } catch(e) {
    throw(e);
  }
}