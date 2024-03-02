import * as express from "express";
import * as cors from "cors";
import * as dotenv from "dotenv";

import { exerciseRouter } from "./exercise/exercise.router";
import { seriesRouter } from "./series/series.router";
import { repetitionRouter } from "./repetition/repetition.router";

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

function main() {
    const app = express();
    app.use(cors({origin:true,credentials: true}));
    app.use(express.json());

    app.use("/exercise", exerciseRouter);
    app.use("/series", seriesRouter);
    app.use("/repetition", repetitionRouter);

    app.listen(process.env.PORT, () => console.log(`Express app running on port ${process.env.PORT}!`));
}

// Start
main();