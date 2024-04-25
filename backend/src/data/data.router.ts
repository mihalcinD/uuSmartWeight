import type { Request, Response } from "express";
import * as express from "express";
import { check, checkSchema, header } from "express-validator";

import { validate } from "../utils/validator";
import * as DataService from "./data.service";
import { Data, EventType } from "./data.service";

export const dataRouter = express.Router();

dataRouter.post("/bulk", 
    validate([
        header("Authorization").isString(),
        check("*.event").isIn(Object.values(EventType)).not().isEmpty(),
        check("*.ts").isInt().not().isEmpty(),
        check("*.value").isInt(),
        check("*.id").isInt(),
        check("*.deviceToken").isString(),
    ]),
    async (req: Request, res: Response) => {
        try {
            const doneIDs = await DataService.createBulk(req.body.sort((data1: Data, data2: Data) => data1.ts - data2.ts));

            return res.status(200).send(doneIDs);
        } catch (e: any) {
            console.error(e);

            return res.status(500).json(e.message).send();
        }
    }
);