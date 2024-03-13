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

export async function nextSeries(): Promise<void> {
    const dbCurrentSeries = await db.series.findFirstOrThrow({
        where: {
            endedAt: null,
        }
    });

    await db.series.update({
        where: {
            id: dbCurrentSeries.id,
        },
        data: {
            endedAt: new Date(),
        }
    })
  
    const newDbSeries =  await db.series.create({
      data: {
        exerciseId: dbCurrentSeries.exerciseId,
      }
    });

    await db.repetition.create({
        data: {
          seriesId: newDbSeries.id,
        }
    });
  }