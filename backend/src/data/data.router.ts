import type { Request, Response } from "express";
import * as express from "express";
import { checkSchema, header } from "express-validator";

import { validate } from "../utils/validator";
import * as DataService from "./data.service";
import { EventType } from "./data.service";

export const dataRouter = express.Router();

// TODO check
const bulkSchema =  {
    events: {
        isArray: {
            bail:true,
            options: {
              min: 0,
            },
        },
    },
    "events.*.event": {
        isIn: {
            options: [Object.values(EventType)],
            errorMessage: "No enum value matched."
        },
        errorMessage: "RepetitonEntryType must be int"
    },
    "events.*.ts": {
        isInt: true,
        errorMessage: "Timestamp must be int, specifically milliseconds"
    },
    "events.*.value": {
        isInt: true,
        optional: true,
        errorMessage: "Value must be int, numberOfRepetitions | y-axis-value"
    }
};

dataRouter.post("/bulk", 
    validate([
        header("Authorization").isString(),
    ]), checkSchema(bulkSchema), async (req: Request, res: Response) => {

    try {
        await DataService.createBulk(req.header("Authorization"), req.body);

        return res.status(200).send();
    } catch (e: any) {
        console.error(e);

        return res.status(500).json(e.message).send();
    }
  }
);