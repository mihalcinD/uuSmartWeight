import type { Request, Response } from "express";
import * as express from "express";
import { body, validationResult } from "express-validator";

import * as ExerciseService from "./exercise.service";
import { request } from "http";

export const exerciseRouter = express.Router();

// Get all exercises
exerciseRouter.get("/", async (request: Request, response: Response) => {
    try {
        const exercises = await ExerciseService.listExercises();
        return response.status(200).json(exercises);
    } catch (e: any) {
        return response.status(500).json(e.message);
    }
})