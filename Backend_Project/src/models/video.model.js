import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type:String,
            require:true,
        },
        thumbnil: {
            type:String,
            required:true
        },
        title: {
            type:String,
            require:true,
        },
        description: {
            type:String,
            required:true
        },
        duration: {
            type:Number, //information getting from Cloudinary
            required:true
        },
        views: {
            type:Number,
            default:0
        },
        isPublished: {
            type:Boolean,
            default:true
        },
        owner: {
            type:Schema.Types.ObjectId,
            ref:"User"
        }



    }
    ,
    {
        timestamp:true
    }

);

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema);