import * as express from "express";
import * as cors from "cors";
import * as dotenv from "dotenv";

import { exerciseRouter } from "./exercise/exercise.router";

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

async function main() {
    // Settings
    // await AppDataSource.initialize();

    const app = express();
    app.use(cors({origin:true,credentials: true}));
    app.use(express.json());
    app.use("/exercise", exerciseRouter);

    app.listen(process.env.PORT, () => console.log(`Express app running on port ${process.env.PORT}!`));
}

// Start
main();