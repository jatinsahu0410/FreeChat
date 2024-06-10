const { default: NextAuth } = require("next-auth/next");
import User from "@models/User";
import { connectdb } from "@mongodb";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers:[
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials, req){
                if(!credentials.email || !credentials.password){
                    throw new Error("Invalid credentials");
                }

                await connectdb();

                const user = await  User.findOne({email: credentials.email});
                if(!user || !user?.password){
                    throw new Error("Invalid credentials");
                }

                const isMatch = await compare(credentials.password, user.password);
                if(!isMatch){
                    throw new Error("Invalid password");
                }

                return user;
            },
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET,

    callbacks:{
        async session({session}){
            const mongodbUser = await User.findOne({email: session.user.email})
            session.user.id = mongodbUser._id.toString();

            session.user = {...session.user, ...mongodbUser._doc}
            return session;
        }
    }
});

export { handler as GET, handler as POST};