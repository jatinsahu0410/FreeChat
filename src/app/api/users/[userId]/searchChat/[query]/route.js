import Chat from "@models/Chat";
import Message from "@models/Message";
import User from "@models/User";
import { connectdb } from "@mongodb"

export const GET = async (req, { params }) => {
    try {
        await connectdb();

        const { userId, query } = params;
        console.log("user id : ", userId);
        console.log("Query is ", query);

        const searchChat = await Chat.find({
            members: userId,
            name: {$regex: query, $options: "i"},
        }).populate({
            path: "members",
            model: User
        }).populate({
            path:"messages",
            model: Message,
            populate: {
                path: "sender seenBy",
                model: User
            }
        }).exec();

        return new Response(JSON.stringify(searchChat), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Failed to get all chats", { status: 500 });
    }
}