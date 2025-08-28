import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";

const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    const newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        let message = await Message.create(newMessage);

        message = await message.populate("sender", "fullName avatar");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.members",
            select: "fullName avatar email",
        });

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message
        });

        res.json(message);
    } catch (error) {
       res.status(400).json({ message: error.message });
    }
};

const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "fullName avatar email")
            .populate("chat");

        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

export { sendMessage, allMessages };
