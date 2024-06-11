import type { Request, Response } from "express";
import * as express from "express";

import * as SeriesService from "./series.service";

export const seriesRouter = express.Router();


seriesRouter.get("/detail",
    async (req: Request, res: Response) => {
        try {
            const seriesID = Number(req.query.id);

            if (isNaN(seriesID)) {
                return res.status(400).send("invalid query data");
            }

            const seriesDetail = await SeriesService.getSeriesDetail(seriesID);

            return res.status(200).json(seriesDetail);
        } catch (e: any) {
            console.error(e);
            return res.status(500).json(e.message).send();
        }
    }
);