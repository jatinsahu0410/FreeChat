import Chat from "@models/Chat";
import Message from "@models/Message";
import User from "@models/User";
import { connectdb } from "@mongodb";


export const GET = async (req, { params }) => {
    try {
        await connectdb();

        const { chatId } = params;
        const chat = await Chat.findById(chatId).populate({
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

        return new Response(JSON.stringify(chat), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Failed to get user chat details", { status: 500 });
    }
}


export const POST = async (req, { params }) => {
    try {
        await connectdb();
        const { chatId } = params;
        const body = await req.json();
        const { currUserId } = body;

        await Message.updateMany(
            {chat: chatId},
            {$addToSet: {seenBy: currUserId}},
            {new : true}    
        ).populate({
            path: "sender seenBy",
            model: User
        }).exec();

        return new Response("Seen all messages by current user", {status: 200});
    } catch (error) {
        console.log(error);
        return new Response("Failed to update the seen messages", { status: 500 });
    }
}