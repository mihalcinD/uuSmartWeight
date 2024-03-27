import type { Request, Response } from "express";
import * as express from "express";

import * as SeriesService from "./series.service";

export const seriesRouter = express.Router();
