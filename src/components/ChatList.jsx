'use client'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import Loader from './Loader';
import ChatBox from './ChatBox';
import { pusherClient } from '@lib/pusher';

const ChatList = ({currChatId}) => {
    const { data: session } = useSession();
    const currUser = session?.user;
    console.log(currUser)
    const [loading, setLoading] = useState(true);
    const [chats, setChats] = useState([]);
    const [search, setSearch] = useState('');


    const getContacts = async () => {
        try {
            const res = await fetch(
                search !== '' ? 
                `/api/users/${currUser._id}/searchChat/${search}` :
                `/api/users/${currUser._id}`
            );
            const data = await res.json();
            setChats(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (currUser) {
            getContacts();
            // console.log("Chats : ", chats);
        }
    }, [currUser, search]);

    useEffect(() => {
        if(currUser){
            pusherClient.subscribe(currUser._id)

            const chatPusherUpdate = (data) =>{
                setChats((allChats) => allChats.map((chat) => {
                    if(chat._id === data.id){
                        return {...chat, messages: data.messages};
                    }else{
                        return chat;
                    }
                }));
            };

            const handleGroupChaPusher = (newChat) =>{
                setChats((allChats) => [...allChats, newChat]);
            }

            // client pushers
            pusherClient.bind("last-message", chatPusherUpdate);
            // group chat
            pusherClient.bind("new-chat", handleGroupChaPusher);

            return () => {
                pusherClient.unsubscribe(currUser._id);
                pusherClient.unbind("last-message", chatPusherUpdate);
                pusherClient.unbind("new-chat", handleGroupChaPusher);
            }
        }
    }, [currUser])
    return loading ? (
        <Loader />
    ) : (
        <div className='flex flex-col gap-5 h-[100%]'>
            <input type='text'
                className='px-5 py-3 rounded-2xl bg-white outline-none'
                placeholder='search groups ...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className=' flex flex-col bg-white rounded-3xl py-4 px-3 overflow-y-scroll custom-scrollbar mb-2'>
                {
                    chats?.map((chat, index) => (
                        <ChatBox 
                        chat={chat}
                        key={index}
                        currUser={currUser}
                        currChatId={currChatId}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default ChatList