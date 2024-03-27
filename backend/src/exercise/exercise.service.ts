import { db } from "../utils/db.server";

export async function createExercise(deviceId: number, date: Date): Promise<void> {
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

  // Create new Exercise and Series
  {
    const dbExercise = await db.exercise.create({
      data: {
        createdAt: date,
        deviceId: deviceId,
      }
    });
  
    await db.series.create({
      data: {
        createdAt: date,
        exerciseId: dbExercise.id,
        numberOfRepetitions: 0,
      }
    });
  }
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
