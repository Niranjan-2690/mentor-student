const mongoose = require('mongoose')

const uri = "mongodb://localhost:27017/"

async function connection(){
    try{
        const connect = await mongoose.connect(uri)
        console.log(connect)
    }catch(error){
        console.log("Error", error)
    }
    
}

module.exports = {connection}