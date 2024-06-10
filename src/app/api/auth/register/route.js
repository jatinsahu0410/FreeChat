import User from "@models/User";
import { connectdb } from "@mongodb"
import { hash } from "bcryptjs";

export const POST = async(req, res) =>{
    try {
        await connectdb();

        const body = await req.json();
        const {userName, email, password} = await body;
        console.log(userName, email, password);
        const existingUser = await User.findOne({email});
        console.log(existingUser)
        if(existingUser){
            return new Response('User already exists', {
                status: 400,
                statusText: "success"
            })
        }

        const hashedPassword = await hash(password, 10);

        const newUser = new User({
            userName,
            email,
            password:  hashedPassword,
        });

        await newUser.save();
        console.log("New user", newUser)
        return new Response(JSON.stringify(newUser),{
            message: "user created successfully", 
            success: true, 
            status: 200,
            statusText: "success"
        })
        
    } catch (error) {
        console.log(error)
        return new Response("User Not created",{
            status: 500,
            statusText: "failed"
        })
    }
}