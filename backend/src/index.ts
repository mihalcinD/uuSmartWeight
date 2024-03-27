import * as express from "express";
import * as cors from "cors";
import * as dotenv from "dotenv";

import { exerciseRouter } from "./exercise/exercise.router";
import { seriesRouter } from "./series/series.router";
import { dataRouter } from "./data/data.router";
import * as expressValidator from "express-validator";

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

function main() {
    const app = express();
    app.use(cors({origin:true,credentials: true}));
    app.use(express.json());

    app.use("/data", dataRouter);

    app.listen(process.env.PORT, () => console.log(`Express app running on port ${process.env.PORT}!`));
}

// Start
main();