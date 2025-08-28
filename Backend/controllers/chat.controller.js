import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";

const accessChat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("UserID param not send with request");
        return res.sendStatus(400);
    }
 
    try {
        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { members: { $elemMatch: { $eq: req.user._id } } },
                { members: { $elemMatch: { $eq: userId } } },
            ],
        }).populate("members", "-password").populate("latestMessage");

        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name profilePicture email",
        });

        if (isChat.length > 0) {
            res.send(isChat[0]);
        } else {
            const chatData = {
                chatName: `${req.user.name} - ${userId}`,
                isGroupChat: false,
                members: [req.user._id, userId],
            };

            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("members", "-password");

            res.status(200).send(fullChat);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const fetchChat = async (req, res) => {
    try {
        const results = await Chat.find({ members: { $elemMatch: { $eq: req.user._id } } })
            .populate("members", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        const populatedResults = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name profilePicture email",
        });

        res.status(200).send(populatedResults);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the fields" });
    }

    let users = JSON.parse(req.body.users);
    if (users.length < 2) {
        return res.status(400).send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            members: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("members", "-password -refreshToken")
            .populate("groupAdmin", "-password -refreshToken");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;

    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName,
            },
            {
                new: true,
            }
        )
            .populate("members", "-password -refreshToken")
            .populate("groupAdmin", "-password -refreshToken");

        if (!updatedChat) {
            res.status(404);
            throw new Error("Chat Not Found");
        } else {
            res.json(updatedChat);
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

const removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    try {
        const removed = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: { members: userId },
            },
            {
                new: true,
            }
        )
            .populate("members", "-password")
            .populate("groupAdmin", "-password");

        if (!removed) {
            res.status(404);
            throw new Error("Chat Not Found");
        } else {
            res.json(removed);
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    try {
        const added = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { members: userId },
            },
            {
                new: true,
            }
        )
            .populate("members", "-password")
            .populate("groupAdmin", "-password");

        if (!added) {
            res.status(404);
            throw new Error("Chat Not Found");
        } else {
            res.json(added);
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

export { accessChat, fetchChat, createGroupChat, renameGroup, removeFromGroup, addToGroup };
