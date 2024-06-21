'use client'
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react'
import Loader from './Loader';
import { AddPhotoAlternate, ArrowDropDownCircleOutlined, Groups3Outlined, SendRounded } from '@mui/icons-material';
import Link from 'next/link';
import { CldUploadButton } from 'next-cloudinary';
import MessageBox from './MessageBox';
import { pusherClient } from '@lib/pusher';
import { ScrollPosition } from '@app/hook/scrollPosition';

const ChatDataComponent = ({ chatId }) => {
  const [loading, setLoading] = useState(true);
  const [chatData, setChatData] = useState([]);
  const [otherMembers, setOtherMembers] = useState([]);
  const [text, setText] = useState('');
  // to scroll to bottom 
  const [scrolled, setScrolled] = useState(0);

  const { data: session } = useSession();
  const currUser = session?.user;

  const getChatDetails = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      console.log("Data : ", data);
      setChatData(data);
      setOtherMembers(data?.members?.filter(member => member._id !== currUser._id));
      console.log("other Members : ", otherMembers)
      setLoading(false);
    } catch (error) {
      console.log("Error in getChatDetails", error)
    }
  }

  useEffect(() => {
    if (currUser && chatId) {
      getChatDetails();
    }
  }, [currUser, chatId])

  const sentText = async () => {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          chatId,
          currUserId: currUser._id,
        }),
      });

      if (res.ok) {
        setText('');
      }
    } catch (error) {
      console.log("Error in sentText", error)
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sentText();
    }
  }
  // to send Photo 
  const sendPhoto = async (result) => {
    try {
      console.log("result", result?.info?.secure_url);

      const res = await fetch('/api/messages', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatId,
          currUserId: currUser._id,
          photo: result?.info?.secure_url,
        }),
      })
      // console.log("SendPhoto res : ", res.json())
    } catch (error) {
      console.log("Error: ", error)
    }
  }

  useEffect(() => {
    pusherClient.subscribe(chatId)

    const handleMessage = async (newMessage) => {
      setChatData((prevChatData) => {
        return {
          ...prevChatData,
          messages: [...prevChatData.messages, newMessage],
        };
      });
    };

    // listen to the new event 
    pusherClient.bind("new-message", handleMessage);

    return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind("new-message", handleMessage);
    }
  }, [chatId]);

  /* scroll to the current chat */
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behaviour: "smooth",
    })
  }, [chatData?.messages])

  const handleOnScroll = () => {
    setScrolled(ScrollPosition);
  }

  const handleToBottom = () => {
    bottomRef.current?.scrollIntoView({
      behaviour: "smooth",
    })
  }

  return loading ? (
    <Loader />
  ) : (
    <div className='h-[100%]'>
      <div className='flex flex-col bg-white rounded-2xl'>
        <div className='flex items-center gap-4 px-8 py-3 text-body-bold '>
          {
            chatData?.isGroup ? (
              <>
                <Link href={`/chats/${chatId}/group-info`}>
                  <div className='w-12 h-12'>
                    {
                      chatData?.groupPhoto ? (
                        <img src={chatData?.groupPhoto} alt="groupPhoto" className='w-11 h-11 rounded-full object-cover object-center' />
                      ) : (
                        <Groups3Outlined sx={{ color: "#737373" }} className='w-11 h-11 rounded-full object-cover object-cente' />
                      )
                    }
                  </div>
                </Link>
                <div className='text'>
                  <p>
                    {chatData?.name} &#160; &#183; &#160; {chatData?.members?.length}{" "}members
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className='w-12 h-12'>
                  <img src={
                    otherMembers[0].profilePicture || `https://api.dicebear.com/5.x/initials/svg?seed=${otherMembers[0]?.userName}`
                  } alt="profile photo" className='w-11 h-11 rounded-full object-cover object-center' />
                </div>
                <div className='text'>
                  <p>
                    {otherMembers[0]?.userName}
                  </p>
                  <p>
                    {otherMembers[0]?.status}
                  </p>
                </div>
              </>
            )
          }
        </div>

        {/* chat body */}
        <div className='h-96 flex flex-col gap-3 bg-grey-2 p-5 overflow-y-scroll custom-scrollbar' id="myDiv" onScroll={handleOnScroll}>
          <div id='content'>
            {
              chatData?.messages?.map((message) => (
                <MessageBox
                  key={message._id}
                  message={message}
                  currUser={currUser}
                />
              ))
            }
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Send Message */}
        <div className='w-full relative flex items-center justify-between px-7 py-3 rounded-3xl cursor-pointer bg-white h-[10%]'>
          <div className='z-10 absolute right-2 -top-9' onClick={handleToBottom}>
            {
              scrolled > 110 &&(
                <ArrowDropDownCircleOutlined sx={{ fontSize: "28px" }} />
              )
            }
          </div>
          <div className='flex items-center gap-4'>
            <CldUploadButton
              options={{ maxFiles: 1 }}
              uploadPreset='kk6phtrz'
              onUpload={sendPhoto}
            >
              <AddPhotoAlternate
                sx={{
                  fontSize: "35px",
                  color: "#737373",
                  cursor: "pointer",
                  "&:hover": { color: "red" }
                }}
              />
            </CldUploadButton>

            <div onKeyDown={handleKeyDown}>
              <input type="text"
                placeholder='Writ a message'
                className='input-field'
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
            </div>
          </div>

          <div onClick={sentText}>
            <SendRounded sx={{ color: "green" }} className='w-10 h-10 rounded-full hover:scale-105 ease-in-out duration-300' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatDataComponent