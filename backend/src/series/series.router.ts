import type { Request, Response } from "express";
import * as express from "express";
import { body, validationResult } from "express-validator";

import * as SeriesService from "./series.service";
import { request } from "http";

export const seriesRouter = express.Router();

// Get all repetitions
seriesRouter.get("/", async (request: Request, response: Response) => {
    try {
        const series = await SeriesService.listSeries();
        return response.status(200).json(series);
    } catch (e: any) {
        return response.status(500).json(e.message);
    }
})