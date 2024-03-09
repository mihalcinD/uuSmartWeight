//const express = require("express"); //In JS we use require. In TS we use import.
//const cors = require("cors")

import express from "express";
import cors from "cors";

import { mockRouter } from "./mock.router";


const PORT = 3000


const app = express()

//How to use CORS?
//app.use(cors)
app.use(express.json())

app.use("/gateway", mockRouter);

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})
