import { db } from "../utils/db.server";

type Exercise = {
    id: number
    name: string
}

export async function listExercises(): Promise<Exercise[]> {
    //return [{id: 1, name: "xx"}];
    const exercises: any[] = await db.exercise.findMany({
        select: { id: true }
    });
    return exercises;
}