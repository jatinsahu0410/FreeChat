import Message from "@models/Message";
import User from "@models/User";
import { connectdb } from "@mongodb"

export const GET = async (req, { params }) => {
    try {
        await connectdb();

        const { query } = params;

        const searchContact = await User.find({
            $or: [
                { userName: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ],
        }).populate({
            path: "members",
            model: User
        }).populate({
            path : "messages",
            model: Message,
            populate: {
                path: "sender seenBy",
                model: User
            }
        }).exec();
        
        return new Response(JSON.stringify(searchContact), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify(err), { status: 500 });
    }

}