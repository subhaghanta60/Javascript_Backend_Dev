//require('dotenv').config({path:'./env'})
import dotenv from "dotenv";
dotenv.config({
    path: '.env'
});
import express from "express";
import connectDB from "./db/index.js";

const app = express();

connectDB()
.then(()=> {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is Running at PORT : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDb Connection Failed !!", err);
})


/*


;( async ()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI})/${DB_NAME}`)
       app.on("error", (error)=> {
        console.log("ERROR: ",error);
        
       })

       app.listen(process.env.PORT, () => {
        console.log(`App is listening on PORT ${process.env.PORT}`);
       })

    } catch (error) {
        console.log("ERROR: ",error);
    }

})() 
*/
