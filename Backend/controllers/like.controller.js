import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { Post } from "../models/post.model.js";

const likePost = async(req,res)=>{
    try {
        //get postId or commentId from frontend
        //checked if post or comment have already been liked by user
        const {postId,commentId} = req.body
        if(!postId && !commentId){
            return res.status(400).json({message:"Either postId or commentId is required"})
        }

        const existingLike = await Like.findOne({
            post: postId || undefined,
            comment: commentId || undefined,
            likedBy: req.user._id
        })
        if(existingLike){
            return res.status(400).json({message:"You have already liked this post or comment"})
        }

        const newLike = await Like.create({
            post: postId || undefined,
            comment: commentId || undefined,
            likedBy: req.user._id
        })

        if(postId){
            await Post.findByIdAndUpdate(postId,{$push:{likes: newLike._id}})
        }
        if(commentId){
            await Comment.findByIdAndUpdate(commentId,{$push:{likes: newLike._id}})
        }

        return res.status(201).json({message:"liked",like: newLike})

    } catch (error) {
        console.log("Something went wrong while liking a post or comment",error);
    }
}

const unlikePost = async(req,res)=>{
    try {
        //get postId or commentId
        //delete like from post or comment

        const {postId,commentId} = req.body
        if(!postId && !commentId){
            return res.status(400).json({message:"Either postId or commentId is required"})
        }

        const deletedLike = await Like.findOneAndDelete({
            post: postId || undefined,
            comment: commentId || undefined,
            likedBy: req.user._id
        })

        if(!deletedLike){
            return res.status(404).json({message:"Like not Found"})
        }

        if(postId){
            await Post.findByIdAndUpdate(postId,{$pull:{likes: deletedLike._id}})
        }
        if(commentId){
            await Comment.findOneAndUpdate(commentId,{$pull:{likes: deletedLike._id}})
        }

        return res.status(200).json({message:"unliked"})

    } catch (error) {
        console.log("Error while unliking post or comment",error);
    }
}

export {likePost,unlikePost}