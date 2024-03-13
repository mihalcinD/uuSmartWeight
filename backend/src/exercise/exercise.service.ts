import { db } from "../utils/db.server";

type Exercise = {
  id: number;
  isDeadLift: boolean;
};

export async function listExercises(): Promise<Exercise[]> {
  //return [{id: 1, name: "xx"}];
  const exercises: any[] = await db.exercise.findMany({
    select: { id: true },
  });
  return exercises;
}

export async function createExercise(): Promise<void> {
  const dbExercise = await db.exercise.create({
    data: {
      isDeadLift: false,
    }
  });

  const dbSeries = await db.series.create({
    data: {
      exerciseId: dbExercise.id,
    }
  });

  await db.repetition.create({
    data: {
      seriesId: dbSeries.id,
    }
  });
}

export async function endExercise(): Promise<void> {
  const dbExercise = await db.exercise.findFirstOrThrow({
    where: {
      endedAt: null,
    }
  });

  await db.exercise.update({
    where: {
      id: dbExercise.id,
    },
    data: {
      endedAt: new Date(),
    }
  });

  await db.series.updateMany({
    where: {
      endedAt: null,
    },
    data: {
      endedAt: new Date(),
    }
  });

  await db.repetition.updateMany({
    where: {
      endedAt: null,
    },
    data: {
      endedAt: new Date(),
    }
  });
}
