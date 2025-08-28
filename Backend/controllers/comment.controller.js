import {Comment} from "../models/comment.model.js";
import {Post} from "../models/post.model.js";

const createComment = async(req,res)=>{
    try {
        //get postId, content from the user
        
        const {postId,content} = req.body
        if(!content?.trim()){
            return res.status(400).json({message:"Content is required"})
        }

        const post = await Post.findById(postId)

        if(!post){
            return res.status(404).json({message:"Post not found"})
        }

        const newComment = await Comment.create({
            content,
            post: postId,
            commentedBy: req.user._id
        })
        await newComment.populate("commentedBy","name email profilePicture")
        
        post.comments.push(newComment._id)
        await post.save()

        return res.status(200).json({message:"comment created successfully",comment: newComment})

    } catch (error) {
        console.log("Error while creating Comment: ",error);
    }
}

const updateComment = async(req,res)=>{
    try {
        const {commentId} = req.params
        const {content} = req.body

        if(!content){
            return res.status(400).json({message:"Content is required"})
        }

        const updatedComment = await Comment.findOneAndUpdate(
            {_id: commentId, commentedBy: req.user._id },
            {$set: {content}},
            {new: true}
        )
        if(!updatedComment){
            return res.status(404).json({message:"Comment not found or unauthorized"})
        }

        return res.status(200).json({message:"comment updated successfully",comment: updatedComment})
        
    } catch (error) {
        console.log("Error while updating Comment: ",error);
    }
}

const deleteComment = async(req,res)=>{
    try {
        const {commentId} = req.params

        const comment = await Comment.findOneAndDelete({_id: commentId, commentedBy: req.user._id})
        if(!comment){
            return res.status(400).json({message:"Comment not found or unauthorized"})
        }

        await Post.findByIdAndUpdate(comment.post,{$pull:{comments: comment._id}})
        
        return res.status(200).json({message:"Comment deleted Successfully"})
        
    } catch (error) {
        console.log("Error while deleting Comment: ",error);
    }
}

const getComments = async(req,res)=>{
    try {
        //get postId
        //find post and populate all the comments along with users name, profilePicture
        // send response

        const {postId} = req.params;
        
        const post = await Post.findById(postId).populate({
            path: "comments",
            populate: {path:"commentedBy", select: "name profilePicture"}
        })
        if(!post){
            return res.status(400).json({message:"Post not Found"})
        }

        return res.status(200).json({message:"Comments fetched successfully",comment: post.comments})

    } catch (error) {
        console.log("Error while getting all the comments");
    }
}

export {createComment,updateComment,deleteComment,getComments}