import ChatList from '@components/ChatList'
import ContactPart from '@components/Contacts'
import React from 'react'

const Chat = () => {
  return (
    <div className='h-[88%] flex justify-between gap-5 px-10 py-3 max-lg:gap-8'>
      <div className='w-1/3 max-lg:w-1/2 max-md:w-full h-full'>
        <ChatList />
      </div>
      <div className='w-2/3 max-lg:w-1/2 max-md:hidden'>
        <ContactPart />
      </div>
    </div>
  )
}

export default Chat