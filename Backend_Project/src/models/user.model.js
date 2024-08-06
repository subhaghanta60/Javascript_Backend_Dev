import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email: {
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullname: {
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar: {
            type:String, //Cloudinary URL
            required:true,
        },
        coverImage: {
            type:String //Cloudinary URL
        },
        watchHistory : [
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password: {
            type:String,
            required: [true,'Password is Required']
        },
        refreshToken: {
            type:String
        }
            
    

    }
    ,
    {
        timestamp:true
    }

)

export const User = mongoose.model("User",userSchema);