import { Prisma } from "@prisma/client";
import { db } from "../utils/db.server";
import { RepetitionEntryType } from "./repetition-entry.router";

export async function createRepetitionEntry(value: number, timestamp: number, type?: RepetitionEntryType): Promise<void> {
    let activeRepetitionID = 0

    const activeRepetition = await db.repetition.findFirst({
        where: {
            endedAt: null,
        },
        select: {
            id: true,
        }
    });

    if (activeRepetition) {
        activeRepetitionID = activeRepetition.id;
    } else {
        const activeSeries = await db.series.findFirstOrThrow({
            where: {
                endedAt: null,
            }
        });

        const newRepetition = await db.repetition.create({
            data: {
                seriesId: activeSeries.id,
            }
        });
        activeRepetitionID = newRepetition.id;
    }

    const currentTime = new Date(timestamp);

    const repetitionCreateData: Prisma.RepetitionEntryCreateInput = Prisma.validator<Prisma.RepetitionEntryCreateInput>()({
        value: value,
        timestamp: currentTime,
        peakRepetition: {connect: {id: activeRepetitionID}}
    });

    if (type) {
        switch(type) {
            case RepetitionEntryType.PEAK: {
                repetitionCreateData.peakRepetition = {connect: {id: activeRepetitionID}};
                await db.repetition.update({
                    where: {
                        id: activeRepetitionID,
                    },
                    data: {
                        peakedReachedAt: currentTime,
                    }
                });
                break;
            }
            case RepetitionEntryType.END: {
                repetitionCreateData.endRepetition = {connect: {id: activeRepetitionID}};
                await db.repetition.update({
                    where: {
                        id: activeRepetitionID,
                    },
                    data: {
                        endedAt: currentTime,
                    }
                });
                break;
            }
            default: repetitionCreateData.repetition = {connect: {id: activeRepetition.id}};
        }
    }
    
    await db.repetitionEntry.create({
        data: repetitionCreateData,
    });
};