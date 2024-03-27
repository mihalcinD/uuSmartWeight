import { db } from "../utils/db.server";

export async function createSeries(deviceID: number, date: Date): Promise<void> {
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

  // Create new Series
  {
    const unfinishedExercies = await db.exercise.findMany({
        where: {
            deviceId: deviceID,
            endedAt: null,
        }
    });

    if (unfinishedExercies.length > 1) {
        throw Error("more than 1 unfinished Exercise")
    }

    if (unfinishedExercies.length == 0) {
        throw Error("no unfinished Exercises")
    }
  
    await db.series.create({
      data: {
        createdAt: date,
        exerciseId: unfinishedExercies[0].id,
        numberOfRepetitions: 0,
      }
    });
  }
  //
}

export async function endSeries(deviceID: number, date: Date): Promise<void> {
  // End all unfinished Series (TODO: only one ?)
  await db.series.updateMany({
    where: {
        exercise: {
            deviceId: deviceID,
        },
        endedAt: null,
    },
    data: {
      endedAt: date,
    }
  });
}
