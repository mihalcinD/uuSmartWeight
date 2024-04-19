import { db } from "../utils/db.server";

interface DeviceDetail {
  numberOfExercises: number
  numberOfSeries: number
  totalTime: number
  points: number
}

const MINUTE_MULTIPLIER = 1/60_000;

export async function getDeviceDetail(id: number, currentDate: Date): Promise<DeviceDetail> {
  try {
      const tommorow = new Date(currentDate)
      tommorow.setDate(currentDate.getDate() + 1);

      const dbDevice: any = await db.device.findUniqueOrThrow({
          where: {
            id,
          },
          select: {
            exercises: {
              where: {
                createdAt: {
                  gte: currentDate,
                  lte:  tommorow,
                },
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
        totalTime += dbExercise.endedAt.getTime() - dbExercise.createdAt.getTime();

        points += 10 + dbExercise.series.length * 5;
        for (const dbSeries of dbExercise.series) {
          points += dbSeries.numberOfRepetitions * 2;
        }
      }

      points += Math.round(totalTime * MINUTE_MULTIPLIER);

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