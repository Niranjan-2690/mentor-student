const express = require('express');
const {connection} = require("./database/connection")

const app = express();
app.use(express.json());

app.use("/mentors", require("./modules/mentor/mentor.controller"))
app.use("/students", require("./modules/student/student.controller"))



// Start the Server
app.listen(3000, "0.0.0.0", (err)=>{
  if(err){
    console.log("Error", err)
  }else{
    console.log("Server is connected")
  }
  connection()
})