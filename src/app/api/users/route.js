import Message from "@models/Message";
import User from "@models/User";
import { connectdb } from "@mongodb"

export const GET = async(req, res) =>{
    try {
        await connectdb();

        const allUsers = await User.find();
        return new Response(JSON.stringify(allUsers), {status: 200});
    } catch (error) {
        console.log(error);
        return new Response("Failed to get all users", {status: 500});
    }
}