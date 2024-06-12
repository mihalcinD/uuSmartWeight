import { db } from "../utils/db.server";

export async function getActiveExerciseOrCreateNew(deviceId: number, date: Date): Promise<number> {
  let activeExerciseID = 0;

  try {
      const activeSeries = await db.exercise.findFirstOrThrow({
          where: {
              deviceId,
              endedAt: null,
          }
      });
      activeExerciseID = activeSeries.id;
  } catch {
    activeExerciseID = await createExercise(deviceId, date);
  }

  return activeExerciseID;
}

export async function createExercise(deviceId: number, date: Date): Promise<number> {
  // End unfinished Exercises and Series
  {  
    await db.exercise.updateMany({
      where: {
        deviceId,
        endedAt: null,
      },
      data: { endedAt: date },
    });
    await db.series.updateMany({
      where: {
        exercise: {
          deviceId,
          endedAt: null,
        }
      },
      data: { endedAt: date },
    });
  }
  //

  // Create new Exercise, return new Exercise ID
  const dbExercise = await db.exercise.create({
    data: {
      createdAt: date,
      deviceId: deviceId,
    }
  });

  return dbExercise.id;
  //
}

export async function endExercise(deviceId: number, date: Date): Promise<void> {
  // End all unfinished Exercises (TODO: only one ?)
  {
    await db.series.updateMany({
      where: {
        exercise: {
          deviceId: deviceId,
          endedAt: null,
        },
        endedAt: null,
      },
      data: {
        endedAt: date,
      }
    });

    await db.exercise.updateMany({
      where: {
        deviceId: deviceId,
        endedAt: null,
      },
      data: {
        endedAt: date,
      }
    });
  }
  //
}
