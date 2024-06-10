import { format } from 'date-fns'
import React from 'react'

const MessageBox = ({ message, currUser }) => {
    return message?.sender?._id !== currUser._id ? (
        <div className='flex gap-3 items-start'>
            <img src={message?.sender?.profilePicture || `https://api.dicebear.com/5.x/initials/svg?seed=${message?.sender?.userName}`} alt="profile Picture" className='w-8 h-8 rounded-full' />
            <div className='flex flex-col gap-2'>
                <p className='text-small-bold'>
                    {message?.sender?.userName} &#160; &#183; &#160; {format(new Date(message?.createdAt), "p")}
                </p>
                {
                    message?.text ? (
                        <p className='w-fit bg-white p-3 rounded-lg text-base-medium'>{message?.text}</p>
                    ) : (
                        <img src={message?.photo} alt="message photo" className='w-40 h-auto rounded-lg' />
                    )
                }
            </div>
        </div>
    ) : (
        <div className='flex gap-3 items-start justify-end'>
            <div className='flex flex-col gap-2 items-end'>
                <p>
                    {format(new Date(message?.createdAt), "p")}
                </p>
                {
                    message?.text ? (
                        <p className='w-fit bg-purple-2 text-white p-3 rounded-lg text-base-medium'>{message?.text}</p>
                    ) : (
                        <img src={message?.photo} alt="message photo" className='w-40 h-auto rounded-lg' />
                    )
                }
            </div>
        </div>
    )
}

export default MessageBox