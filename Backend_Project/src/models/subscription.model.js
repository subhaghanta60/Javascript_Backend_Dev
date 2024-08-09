import mongoose,{Mongoose, Schema} from "mongoose";
import { User } from "./user.model";

const subscriptionSchema = new Schema(
    {
        subscriber: {
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        channel:  {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
        
    },
    {timestamp:true}

)

export const Subcription = mongoose.model("Subcription",subscriptionSchema);