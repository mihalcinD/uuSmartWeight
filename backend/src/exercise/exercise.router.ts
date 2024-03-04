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
});

// Create exercise
exerciseRouter.post(
  "/create",
  body("isDeadLift").isBoolean(),
  async (request: Request, response: Response) => {

    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      const exercise = request.body;
      const newExercise = await ExerciseService.createExercise(exercise);
      return response.status(200).json(newExercise);
    } catch (e: any) {
      return response.status(500).json(e.message);
    }
  }
);
