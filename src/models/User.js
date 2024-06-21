import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    profilePicture:{
        type: String,
        default: "",
    },
    chats:{
        type: [{type: mongoose.Types.ObjectId, ref: "Chat"}],
        default: [],
    },
    status:{
        type: String,
        default: "offline"
    }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;