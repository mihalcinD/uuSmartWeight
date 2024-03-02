import type { Request, Response } from "express";
import * as express from "express";
import { body, validationResult } from "express-validator";

import * as RepetitionService from "./repetition.service";
import { request } from "http";

export const repetitionRouter = express.Router();

// Get all repetitions
repetitionRouter.get("/", async (request: Request, response: Response) => {
    try {
        const repetitions = await RepetitionService.listRepetitions();
        return response.status(200).json(repetitions);
    } catch (e: any) {
        return response.status(500).json(e.message);
    }
})