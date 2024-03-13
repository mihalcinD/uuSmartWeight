import type { Request, Response } from "express";
import * as express from "express";

import * as SeriesService from "./series.service";

export const seriesRouter = express.Router();

// Get all repetitions
seriesRouter.get("/", async (req: Request, res: Response) => {
    try {
        const series = await SeriesService.listSeries();
        return res.status(200).json(series);
    } catch (e: any) {
        return res.status(500).json(e.message);
    }
})

// End current series and start another
seriesRouter.post("/next", async (req: Request, res: Response) => {
    try {
        await SeriesService.nextSeries();
        return res.status(200);
    } catch (e: any) {
        return res.status(500).json(e.message);
    }
})