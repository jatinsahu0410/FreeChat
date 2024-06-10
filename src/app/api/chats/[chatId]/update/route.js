import Chat from "@models/Chat";
import { connectdb } from "@mongodb"

export const POST = async (req, { params }) => {
    try {
        await connectdb();

        const body = await req.json();
        const { chatId } = params;
        const { name, groupPhoto } = body;

        const updateGroupChat = await Chat.findByIdAndUpdate(
            chatId,
            {name, groupPhoto},
            {new: true},
        );

        return new Response(JSON.stringify(updateGroupChat), {status: 200});
    } catch (error) {
        console.log("Error in update Group info : ", error);
        return new Response("Failed to update group info", {status: 500});
    }
}