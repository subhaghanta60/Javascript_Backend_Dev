import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const likeSchema = new Schema(
    {
        video: {
            types:Schema.Types.ObjectId,
            ref:"Video"
        },
        comment: {
            types:Schema.Types.ObjectId,
            ref:"Comment"
        },
        Likedby: {
            types:Schema.Types.ObjectId,
            ref:"User"
        },
        tweet: {
            types:Schema.Types.ObjectId,
            ref:"Tweet"
        }

    },
    {timestamps:true}

)


export const Like = mongoose.model("Like",likeSchema);