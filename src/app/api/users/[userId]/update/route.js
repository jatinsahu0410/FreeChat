import User from "@models/User";
import { connectdb } from "@mongodb"

export const POST = async(req, {params}) => {
    try {
        await connectdb();

        const {userId} = params;

        const body = await req.json()

        const {userName, profilePicture} = body;
        console.log(userName, profilePicture);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                userName,
                profilePicture
            },
            {
                new: true
            }
        )

        return new Response(JSON.stringify(updatedUser), {status: 200})
    } catch (error) {
        console.log(error);
        return new Response("Failed to update user", {status: 500})
    }
}