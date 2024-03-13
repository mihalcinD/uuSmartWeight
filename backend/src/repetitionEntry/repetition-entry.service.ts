import { Prisma } from "@prisma/client";
import { db } from "../utils/db.server";
import { RepetitionEntryType } from "./repetition-entry.router";

export async function createRepetitionEntry(value: number, timestamp: number, type?: RepetitionEntryType): Promise<void> {
    const activeRepetition = await db.repetition.findFirstOrThrow({
        where: {
            endedAt: null,
        },
        select: {
            id: true,
        }
    })

    const repetitionCreateData: Prisma.RepetitionEntryCreateInput = Prisma.validator<Prisma.RepetitionEntryCreateInput>()({
        value: value,
        timestamp: new Date(timestamp),
        peakRepetition: {connect: {id: activeRepetition.id}}
    });

    if (type) {
        switch(type) {
            case RepetitionEntryType.PEAK: {
                repetitionCreateData.peakRepetition = {connect: {id: activeRepetition.id}};
                break;
            }
            case RepetitionEntryType.END: {
                repetitionCreateData.endRepetition = {connect: {id: activeRepetition.id}};
                break;
            }
            default: repetitionCreateData.repetition = {connect: {id: activeRepetition.id}};
        }
    }
    
    await db.repetitionEntry.create({
        data: repetitionCreateData,
    });
};