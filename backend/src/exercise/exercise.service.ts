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

export async function createExercise(
  exercise: Omit<Exercise, "id">
): Promise<Exercise> {
  const result = await db.exercise.create({
    data:{
      isDeadLift:exercise.isDeadLift
    }
  });

  return result;
}
