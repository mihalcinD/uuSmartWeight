import type { Request, Response } from "express";
import * as express from "express";

import * as ExerciseService from "./exercise.service";

export const exerciseRouter = express.Router();

// Get all exercises
exerciseRouter.get("/", async (req: Request, res: Response) => {
  try {
    const exercises = await ExerciseService.listExercises();
    return res.status(200).json(exercises);
  } catch (e: any) {
    return res.status(500).json(e.message);
  }
});

// Create exercise
exerciseRouter.post("/create", async (req: Request, res: Response) => {
    try {
      await ExerciseService.createExercise();
      return res.status(200);
    } catch (e: any) {
      return res.status(500).json(e.message);
    }
  }
);

// End exercise
exerciseRouter.post("/end", async (req: Request, res: Response) => {
    try {
      await ExerciseService.endExercise();
      return res.status(200);
    } catch (e: any) {
      return res.status(500).json(e.message);
    }
  }
);
