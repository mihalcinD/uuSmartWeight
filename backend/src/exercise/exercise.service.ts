import { db } from "../utils/db.server";

type Exercise = {
    id: number
    name: string
}

export const listExercises = async (): Promise<Exercise[]> => {
    const exercises: Exercise[] = await db.exercise.findMany({
        select: {
            id: true,
            name: true,
        }
    });
    return exercises;
};