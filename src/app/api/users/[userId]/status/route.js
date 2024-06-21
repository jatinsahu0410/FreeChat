import { pusherServer } from "@lib/pusher";
import User from "@models/User";
import { connectdb } from "@mongodb";

export const POST = async (req) => {
    try {
        await connectdb();

        const { userId, status } = await req.json();
        const user = await User.findByIdAndUpdate(userId, 
            { status: status},
            {new: true}
        );
        // Trigger Pusher event for user status change
        await pusherServer.trigger('presence-chat', 'user-status', {
            userId,
            status
        });

        return new Response(JSON.stringify(user), {status: 200});
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), { status: 500 });
    }
};
