const express = require("express"); //In JS we use require. In TS we use import.
const cors = require("cors")

const PORT = 3000

const app = express()

//How to use CORS?
//app.use(cors)
app.use(express.json())


app.use("/gateway", gateway);


app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})
