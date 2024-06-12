import { db } from "../utils/db.server";
import { getActiveExerciseOrCreateNew } from "../exercise/exercise.service";
import { countPeaks } from "../utils/count";

interface GetSeriesDetailPoint {
  value: number
  createdAt: Date
}

export async function getSeriesDetail(seriesID: number): Promise<GetSeriesDetailPoint[]> {
  try {
    const dbSeries: any = await db.series.findFirstOrThrow({
        where: {
          id: seriesID,
          endedAt: {
            not: null,
          }
        },
        select: {
          points: true,
        }
    });

    return dbSeries.points;
  } catch(e) {
    throw(e);
  }
}

export async function getActiveSeriesOrCreateNew(deviceId: number, date: Date): Promise<number> {
  let activeSeriesID = 0;

  try {
      const activeSeries = await db.series.findFirstOrThrow({
          where: {
              exercise: { deviceId },
              endedAt: null,
          }
      });
      activeSeriesID = activeSeries.id;
  } catch {
      activeSeriesID = await createSeries(deviceId, date);
  }

  return activeSeriesID;
}

export async function createSeries(deviceID: number, date: Date): Promise<number> {
  // End unfinished Series
  {  
    await db.series.updateMany({
      where: {
        exercise: { 
            deviceId: deviceID,
        },
        endedAt: null,
      },
      data: { endedAt: date },
    });
  }
  //

  // Create new Series and return its id
  const activeExerciseID = await getActiveExerciseOrCreateNew(deviceID, date);

  const newSeries = await db.series.create({
    data: {
      createdAt: date,
      numberOfRepetitions: 0,
      exercise: {
        connect: {id: activeExerciseID}
      }
    }
  });
  
  return newSeries.id;
}

export async function endSeries(deviceId: number, date: Date): Promise<void> {
  // Get active series
  const activeSeries = await db.series.findFirstOrThrow({
    where: {
        exercise: { deviceId },
        endedAt: null,
    },
    select: {
      points: {
        select: {
          value: true,
        }
      }
    }
  });
  //

  const numberOfRepetitions = countPeaks(activeSeries.points.map(point => point.value));

  // End all unfinished Series (TODO: only one ?)
  await db.series.updateMany({
    where: {
        exercise: { deviceId },
        endedAt: null,
    },
    data: {
      endedAt: date,
      numberOfRepetitions,
    }
  });
  //
}
