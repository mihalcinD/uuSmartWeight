import type { Request, Response } from "express";
import * as express from "express";

import * as ExerciseService from "./device.service";

export const deviceRouter = express.Router();