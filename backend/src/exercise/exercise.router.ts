import type { Request, Response } from "express";
import * as express from "express";

import * as ExerciseService from "./exercise.service";

export const exerciseRouter = express.Router();