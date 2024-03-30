import type { Request, Response } from "express";
import express from "express";
//import { body, validationResult } from "express-validator";

//import ExerciseService from "./exercise.service";
import { request } from "http";


//type MockRes = 200|400|500

//TODO ask Jakub why the file cannot be compiled, some problem with MockRes type 
//and switch cases. For now type is number
let mockRes: number = 200


//Sleep function. Needs to be called in async func with await
const sleep = (delay: number) => new Promise((response) => setTimeout(response, delay))

const sleepTimes = [2000, 3000]
let currSleepTime = 0

export const mockRouter = express.Router();

// postData
mockRouter.post("/postData", async (request: Request, response: Response) => {
  
    //log REQ body
    console.log("[REQ body]: ")
    console.log(request.body)
    
    //Used to test gateway timeout
    console.log("[Mock Server] going to sleep")
    currSleepTime++
    await sleep(sleepTimes[currSleepTime%2])
    console.log("[Mock Server] awake")
    

    //responses
    switch (mockRes) {
        case 200:
            
            return response.status(200).json("OKok");

            break;
    
        case 400:
            
            return response.status(400).json("Client Side Error");

            break;
    
        case 500:
            
            return response.status(500).json("Server Side Error");

            break;
    

        default:
            break;
    }  
});
