import { db } from "../utils/db.server";

type Repetiton = {
    id: number
    name: string
}

export async function listRepetitions(): Promise<Repetiton[]> {
    //return [{id: 1, name: "xx"}];
    const repetitions: any[] = await db.repetition.findMany({
        select: { id: true}
    });
    return repetitions;
};