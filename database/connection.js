const mongoose = require('mongoose')

const uri = "mongodb://localhost:27017"

async function connection(){
    try{
        const connect = await mongoose.connect(uri, {dbname: "mentor-student"})
        console.log("MongoDB connection success")
    }catch(error){
        console.log("Error", error)
    }
    
}

module.exports = {connection}