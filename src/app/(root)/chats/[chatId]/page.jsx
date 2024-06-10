'use client'
import ChatDataComponent from '@components/ChatDataComponent';
import ChatList from '@components/ChatList';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

const ChatDetails = () => {
    const { chatId }= useParams();
    const {data : session} = useSession();
    const currUser = session?.user;

    const seenMessage = async () =>{
      try {
        const res = await fetch(`/api/chats/${chatId}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            currUserId: currUser._id,
          }),
        })
      } catch (error) {
        console.log("Error in seen Message : ", error);
      }
    }

    useEffect(() => {
      if(chatId  && currUser){
        seenMessage();
      }
    }, [currUser, chatId]);

  return (
    <div className='h-[88%] flex justify-between gap-5 px-10 py-3 max-lg:gap-8'>
        <div className='w-1/3 max-lg:hidden'>
            <ChatList currChatId={chatId}/>
        </div>
        <div className='w-2/3 max-lg:full'>
            <ChatDataComponent chatId={chatId}/>
        </div>
    </div>
  )
}

export default ChatDetails