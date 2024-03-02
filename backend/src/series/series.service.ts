import { db } from "../utils/db.server";

type Series = {
    id: number
    name: string
}

export async function listSeries(): Promise<Series[]> {
    //return [{id: 1, name: "xx"}];
    const exercises: any[] = await db.series.findMany({
        select: { id: true}
    });
    return exercises;
}