import type { Request, Response } from "express";
import * as express from "express";

import * as ExerciseService from "./device.service";

export const deviceRouter = express.Router();

deviceRouter.get("/detail",
    async (req: Request, res: Response) => {
        try {
            const deviceID = Number(req.query.id);

            const parsedDateQuery = Date.parse(String(req.query.date));
            
            if (isNaN(deviceID) || isNaN(parsedDateQuery)) {
                return res.status(400).send("invalid query data");
            }

            const date = new Date(parsedDateQuery);
            date.setHours(1);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);

            const deviceDetail = await ExerciseService.getDeviceDetail(Number(req.query.id), date);

            return res.status(200).json(deviceDetail);
        } catch (e: any) {
            console.error(e);
            return res.status(500).json(e.message).send();
        }
    }
);