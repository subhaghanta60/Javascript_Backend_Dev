import mongoose, { Mongoose, Schema } from "mongoose";

const tweetsSchema = Schema(
    {
        content: {
            types:String,
            required:true
        },
        owner: {
            types:Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {timestamps:true}

)

export const Tweets = mongoose.model("Tweets",tweetsSchema);