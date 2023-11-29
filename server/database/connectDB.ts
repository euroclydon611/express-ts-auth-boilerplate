require("dotenv").config()
import mongoose from "mongoose";

const dbUri:string = process.env.DB_URI || ""


const connectDB = async () =>{
    try {
        await mongoose.connect(dbUri).then((data:any)=>{
            console.log(`Database connceted with ${data.connection.host}`)
        })
    } catch (error:any) {
        console.log(error)
        setTimeout(connectDB, 500)
    }
}

export default connectDB