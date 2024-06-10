import { pusherServer } from "@lib/pusher";
import Chat from "@models/Chat";
import Message from "@models/Message";
import User from "@models/User";
import { connectdb } from "@mongodb"

export const POST = async (req) => {
    try {
        await connectdb();
        const body = await req.json();

        const { chatId, currUserId, text, photo } = body;
        // console.log("chatId : ", chatId, "currUserId : ", currUserId, "text : ", text, "photo : ", photo);

        const currUser = await User.findById(currUserId);

        const newMessage = await Message.create({
            chat : chatId,
            sender: currUser,
            text,
            photo,
            seenBy: currUserId,
        });
        console.log("newMessage : ", newMessage);
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: {
                    messages : newMessage._id
                },
                $set: {
                    lastMessageAt: newMessage.createdAt,
                }
            },
            {new: true}
        ).populate({
            path: "messages",
            model: Message,
            populate: {
                path: "sender seenBy",
                model: User
            }
        }).populate({
            path: "members",
            model: User,
        }).exec();
        console.log("Updated Chat An :", updatedChat);

        // trigering the pusher event for new message
        await pusherServer.trigger(chatId, "new-message", newMessage);

        /*Trigger the lastMessage  */
        const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
        updatedChat.members.forEach(async (member) => {
            try {
                await pusherServer.trigger(member._id.toString(), "last-message", {
                    id: chatId,
                    messages: [lastMessage]
                });
            } catch (error) {
                console.log("Error in update last message trigger", error); 
            }
        })
        return new Response(JSON.stringify(updatedChat), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Failed to create message", { status: 500 });
    }
}