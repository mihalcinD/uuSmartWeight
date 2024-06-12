//const express = require("express"); //In JS we use require. In TS we use import.
//const cors = require("cors")

import express from "express";
import http from "http";

import cors from "cors";

import { mockRouter } from "./mock.router";


const PORT = 8080


const app = express()

//How to use CORS?
//app.use(cors)
app.use(express.json())

app.use("/data", mockRouter);

const httpServer = http.createServer(app);

httpServer.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})

app.get('/', (req,res)=>{
    res.send("Hello from express server.")
})


/*
app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})
*/