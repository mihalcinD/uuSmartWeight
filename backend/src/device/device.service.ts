import { db } from "../utils/db.server";

interface DeviceDetailSeries {
  id: number
  numberOfRepetitions: number
  createdAt?: Date
  endedAt?:   Date
}
interface DeviceDetail {
  numberOfExercises: number
  series: DeviceDetailSeries[]
  totalTime: number
  points: number
  bestScore: number
}

const MINUTE_MULTIPLIER = 1/60_000;

export async function getDeviceDetail(id: number, currentDate: Date, detailed: boolean): Promise<DeviceDetail> {
  try {
      const tommorow = new Date(currentDate)
      tommorow.setDate(currentDate.getDate() + 1);

      const dbDevice: any = await db.device.findUniqueOrThrow({
          where: {
            id,
          },
          select: {
            bestScore: true,
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
                  select: detailed ? undefined : {
                    numberOfRepetitions: true,
                  },
                  where: {
                    endedAt: {
                      not: null,
                    }
                  }
                },
              }
            }
          }
      });
      
      let numberOfSeries = 0;
      let series: DeviceDetailSeries[] = [];
      let totalTime = 0;
      let points = 0;

      for (const dbExercise of dbDevice.exercises) {
        numberOfSeries += dbExercise.series.length;
        totalTime += dbExercise.endedAt.getTime() - dbExercise.createdAt.getTime();

        points += 10 + dbExercise.series.length * 5;
        for (const dbSeries of dbExercise.series) {
          series.push(dbSeries);
          points += dbSeries.numberOfRepetitions * 2;
        }
      }

      points += Math.round(totalTime * MINUTE_MULTIPLIER);

      let bestScore = 0;
      if (dbDevice?.bestScore > points) {
        bestScore = dbDevice.bestScore
      } else {
        await db.device.update({
          where: {
            id,
          },
          data: {
            bestScore: points,
          },
        });
        bestScore = points;
      }

      return {
        numberOfExercises: dbDevice.exercises.length,
        series,
        totalTime,
        points,
        bestScore,
      };
  } catch(e) {
    throw(e);
  }
}