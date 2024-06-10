import mongoose from "mongoose";

let isConnected = false;

export const connectdb = async () =>{
    mongoose.set('strictQuery', true);

    if(isConnected){
        console.log("already connected")
    }

    try{
        await mongoose.connect(process.env.DATABASE_URL, {
            dbName: 'FreeChat',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        isConnected = true;
        console.log("Db connected successfully")
    }catch(err){
        console.log("Db connection error: " + err)
    }
}