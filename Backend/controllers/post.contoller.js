import { User } from "../models/user.model.js";
import {Post} from "../models/post.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import path from "path";

const createPost = async (req,res)=>{
    //get title,postImage,content
    //validate if title and content is not empty
    //if postImage then send to cloudinary
    //send res
 
    const {title,content} = req.body;
    if(!content){
        return res.status(400).json({message:"Content is Required"});
    }

    let postImageUrl;
    if(req.file?.path){
        const uploadPostImage = await uploadOnCloudinary(req.file.path);
        postImageUrl = uploadPostImage?.url || ''
    }

    const post = await Post.create({
        title: title,
        content: content,
        postImage: postImageUrl,
        owner: req.user._id
    })

    return res.status(200).json({message:"Post created Successfully"});
}

const deletePost = async (req,res)=>{
    //get post ID through params
    // delete from database

    const {postId} = req.params;
    // console.log(postID);
    
    const post = await Post.findOneAndDelete({_id: postId, owner: req.user._id})
    // console.log(post);
    
    if(!post){
        return res.status(404).json({message:"Post not found or unauthorized"})
    }

    return res.status(200).json({message:"Post Deleted Successfully"})
}

const updatePost = async (req,res)=>{
    //get postID from url
    //get title/content
    //imagePath confirmation if req
    // check if the crrent user is the owner of the post and updae the content
    const {postId} = req.params
    const {title,content} = req.body
    
    let postImageUrl = "";
    if(req.file?.path){
        const uploadResult = await uploadOnCloudinary(req.file.path)
        postImageUrl = uploadResult?.url || ""
    }

    const updateData = {
        ...(title && {title}),
        ...(content && {content}),
        ...(postImageUrl && {postImage: postImageUrl})
    }

    const post = await Post.findOneAndUpdate(
        {_id: postId, owner: req.user._id},
        {$set: updateData},
        {new: true}
    )
    if(!post){
        return res.status(404).json({message:"Post not Found or unauthorized"})
    }

    return res.status(200).json({message:"Post updated successfully"})

}

const getAllPosts = async (req,res)=>{
   const posts =  await Post.find({})
    .populate("owner","name department profilePicture")
    .populate({
        path:"comments",
        populate:{
            path:"commentedBy",
            select:"name department role profilePicture"
        }
    })
    .populate({
        path: "likes",
        populate: {path: "likedBy", select: "name"}
    })
    .sort({createdAt: -1})

    if(!posts.length){
        return res.status(404).json({message:"No Posts Found"})
    }

    return res.status(200).json({message:"Posts fetched Successfully", data: posts,user:req.user})
}

const getMyPosts = async (req, res) => {
    try {
        const posts = await Post.find({ owner: req.user._id })
        .populate("likes")
        .populate("comments")
        .sort({ createdAt: -1 });
  
        res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user's posts", error: error.message });
    }
  };

export {createPost,deletePost,updatePost,getAllPosts,getMyPosts}