import mongoose, { Schema } from "mongoose";
import { Comment } from "./comment.model.js";
import { Like } from "./like.model.js";

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        default: ''
    },
    content:{
        type: String,
        required: true
    },
    postImage:{
        type: String,
        default: ''
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    likes:[{
        type: Schema.Types.ObjectId,
        ref: "Like",
        default:[]
    }],
    comments:[{
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default:[]
    }]
},{timestamps: true});

export const Post = mongoose.model("Post",postSchema);