import mongoose,{Schema} from "mongoose";

const commentSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    post:{
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    commentedBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{timestamps: true})

export const Comment = mongoose.model("Comment",commentSchema);