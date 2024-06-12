import { db } from "../utils/db.server";

interface DeviceDetailSeries {
  id: number
  numberOfRepetitions: number
  createdAt?: Date
  endedAt?:   Date
}
interface DeviceDetailExercise {
  id: number
  series: DeviceDetailSeries[]
}

interface DeviceDetail {
  numberOfExercises: number
  exercises: DeviceDetailExercise[]
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
                id: true,
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
      let totalTime = 0;
      let points = 0;

      const exercises = new Array<DeviceDetailExercise>(dbDevice.exercises.length);

      for (let eIndex = 0; eIndex < dbDevice.exercises.length; eIndex++) {
        const dbExercise = dbDevice.exercises[eIndex];
        numberOfSeries += dbExercise.series.length;
        totalTime += dbExercise.endedAt.getTime() - dbExercise.createdAt.getTime();

        points += 10 + dbExercise.series.length * 5;

        const series = new Array<DeviceDetailSeries>(dbExercise.series.length);

        for (let sIndex = 0; sIndex < dbExercise.series.length; sIndex++) {
          const dbSeries = dbExercise.series[sIndex];
          series[sIndex] = dbSeries;
          points += dbSeries.numberOfRepetitions * 2;
        }

        exercises[eIndex] = {
          id: dbExercise.id,
          series,
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
        exercises,
        totalTime,
        points,
        bestScore,
      };
  } catch(e) {
    throw(e);
  }
}