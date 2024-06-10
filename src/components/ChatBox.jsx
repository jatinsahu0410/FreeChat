import { Groups3Outlined, Groups3TwoTone, Person2Rounded } from '@mui/icons-material'
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import React from 'react'

const ChatBox = ({ chat, currUser, currChatId }) => {

    const router = useRouter();
    // console.log("Chat in ChatBox", chat)

    const otherMembers = chat?.members?.filter(
        (member) => member._id !== currUser._id
    );
    // console.log("Other Members : ", otherMembers)

    const lastMessage = chat?.messages?.length > 0 && chat?.messages[chat?.messages.length - 1];

    const seen = lastMessage?.seenBy?.find((member) => member._id === currUser._id)

    return (
        <div className={`flex justify-between p-2 rounded-2xl cursor-pointer hover:bg-grey-2 ${chat._id === currChatId ? 'bg-blue-2' : ""}`} onClick={() => router.push(`/chats/${chat._id}`)}>
            <div className='flex gap-3 items-center'>
                {
                    chat?.isGroup ? (
                        <div className='w-12 h-12'>
                            {
                                chat.groupPhoto ? (
                                    <img src={chat?.groupPhoto} alt='Group Photo' className='w-11 h-11 rounded-full object-cover object-center' />
                                ) : (
                                    <Groups3Outlined sx={{ color: "#737373" }} className='w-11 h-11 rounded-full object-cover object-center outline-2' />
                                )
                            }
                        </div>
                    ) : (
                        <div className='w-12 h-12'>
                            <img className='w-11 h-11 rounded-full object-cover object-center'
                                src={otherMembers[0].profilePicture || `https://api.dicebear.com/5.x/initials/svg?seed=${otherMembers[0].userName}`}
                                alt='profile Photo'
                            />
                        </div>
                    )
                }

                <div className='flex flex-col gap-1'>
                    {
                        chat?.isGroup ? (
                            <p className='text-body-bold'>
                                {chat?.name}
                            </p>
                        ) : (
                            <p className='text-body-bold'>
                                {otherMembers[0].userName}
                            </p>
                        )
                    }

                    {
                        !lastMessage && (<p className='text-small-bold'>Send a message</p>)
                    }

                    {
                        lastMessage?.photo ? (
                            lastMessage?.sender?._id === currUser._id ? (
                                <p className='text-small-medium text-grey-3'>You sent a Photo</p>
                            ) : (
                                <p className={`text-small-bold`}>
                                    Reeceived a Photo
                                </p>
                            )
                        ) : (
                            <p className={`w-[120px] sm:w-[250px] truncate ${seen ? "text-small-bold text-grey-3" : "text-small-bold"}`}>
                                {lastMessage?.text}
                            </p>
                        )
                    }
                </div>
            </div>
            <div>
                <p className='text-base-light text-grey-3'>
                    {
                        !lastMessage ? format(new Date(chat?.createdAt), "p") : format(new Date(chat?.lastMessageAt), 'p')
                    }
                </p>
            </div>
        </div>
    )
}

export default ChatBox