import type { Request, Response } from "express";
import * as express from "express";

import * as RepetitionService from "./repetition.service";

export const repetitionRouter = express.Router();

// Get all repetitions
repetitionRouter.get("/", async (req: Request, res: Response) => {
    try {
        const repetitions = await RepetitionService.listRepetitions();
        return res.status(200).json(repetitions);
    } catch (e: any) {
        return res.status(500).json(e.message);
    }
})