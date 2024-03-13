import type { Request, Response } from "express";
import * as express from "express";
import { body, checkSchema } from "express-validator";

import { validate } from "../utils/validator";
import * as RepetitionEntryService from "./repetition-entry.service";

export const repetitionRouter = express.Router();

export enum RepetitionEntryType {
    PEAK = 1,
    END = 2,
} 

const repetitonEntrySchema =  {
    "type": {
        optional: true,
        isIn: {
            options: [[RepetitionEntryType.PEAK, RepetitionEntryType.END]],
            errorMessage: "No enum value matched."
        },
        errorMessage: "RepetitonEntryType must be int"
    }
}

// Add repetition entry
repetitionRouter.post("/",
    checkSchema(repetitonEntrySchema),
    validate([
        body("timestamp").isInt(),
        body("value").isFloat(),
    ]), 
    async (req: Request, res: Response) => {
    try {
        await RepetitionEntryService.createRepetitionEntry(req.body.value, req.body.timestamp, req.body.type);
        return res.status(200);
    } catch (e: any) {
        return res.status(500).json(e.message);
    }
})