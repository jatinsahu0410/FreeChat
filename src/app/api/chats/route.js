import { pusherServer } from "@lib/pusher";
import Chat from "@models/Chat";
import User from "@models/User";
import { connectdb } from "@mongodb"

export const POST = async (req) => {
    try {
        await connectdb();

        const body = await req.json();
        console.log(body);

        const { currUserId, isGroup, members, name, groupPhoto } = body;

        // define the query 
        const query = isGroup ? { isGroup, name, groupPhoto, members: [currUserId, ...members] } : { members: { $all: [currUserId, ...members], $size: 2 } };

        let chat = await Chat.findOne(query);

        if (!chat) {
            chat = await new Chat(
                isGroup ? query : { members: [currUserId, ...members] }
            );

            await chat.save();

            const updateAllUsers = chat.members.map(async (userId) => {
                await User.findByIdAndUpdate(
                    userId,
                    { $addToSet: { chats: chat._id } },
                    { new: true }
                )
            })

            Promise.all(updateAllUsers);

            /* Trigger pusher event for each member of group chat  */
            chat.members.map((member) => {
                pusherServer.trigger(member._id.toString(), "new-chat", chat);
            })
        }
        return new Response(JSON.stringify(chat), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), { status: 500 });
    }
}