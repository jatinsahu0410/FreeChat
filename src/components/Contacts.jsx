'use client'
import React, { useEffect, useState } from 'react'
import Loader from './Loader';
import { useSession } from 'next-auth/react';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const ContactPart = () => {

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState([]);
    const [name, setName] = useState('');


    const router = useRouter();

    const { data: session } = useSession();
    const currUser = session?.user;

    const getContacts = async () => {
        try {
            const res = await fetch(
                search !== "" ? `/api/users/searchContact/${search}` : "/api/users"
            );
            const data = await res.json();
            // console.log("Data : ", data);
            setContacts(data.filter((contact) => contact._id !== currUser._id));
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (currUser) {
            getContacts();
            // console.log("Contacts : ", contacts);
        }
    }, [currUser, search])

    // Selected Users
    const isGroup = selectedContact.length > 1;

    const handleSelect = (contact) => {
        if (selectedContact.includes(contact)) {
            setSelectedContact((prev) => prev.filter((item) => item !== contact));
        } else {
            setSelectedContact((prev) => [...prev, contact]);
        }
    }

    const createChat = async () => {
        const res = await fetch("api/chats", {
            method: "POST",
            body: JSON.stringify({
                currUserId: currUser._id,
                members: selectedContact.map((contact) => contact._id),
                isGroup,
                name,
            }),
        });

        const chat = await res.json();

        if (res.ok) {
            router.push(`/chats/${chat._id}`);
        }
    }

    return loading ? (
        <Loader />
    ) : (
        <div className='flex flex-col gap-5'>
            <input
                className='px-5 py-3 rounded-2xl bg-white outline-none'
                placeholder='search...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className=' contact-bar'>
                <div className='contact-list'>
                    <p className='text-body-bold'>Select or Deselect</p>
                    <div className='flex flex-col flex-1 gap-5 overflow-y-scroll custom-scrollbar'>
                        {
                            contacts.map((user, index) => {
                                return (
                                    <div key={index} className='flex gap-3 items-center cursor-pointer'
                                        onClick={() => (handleSelect(user))}
                                    >
                                        {
                                            selectedContact.find((item) => item === user) ? (
                                                <CheckCircle sx={{ color: "red" }} />
                                            ) : (
                                                <RadioButtonUnchecked />
                                            )
                                        }
                                        <img
                                            src={user.profilePicture || `https://api.dicebear.com/5.x/initials/svg?seed=${user.userName}`}
                                            alt='profile'
                                            className='w-11 h-11 rounded-full object-cover object-center'
                                        />
                                        <p className='text-body-bold'>{user.userName}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='w-1/2 lg:w-full flex flex-col gap-7'>
                    {
                        isGroup && (
                            <>
                                <div className='flex flex-col gap-3'>
                                    <p className='text-body-bold'>Group Chat Name</p>
                                    <input type="text"
                                        placeholder='Enter your group name'
                                        className='bg-white rounded-2xl px-5 py-3 outline-none'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <p className='text-body-bold'>Members</p>
                                    <div className='flex flex-wrap gap-3'>
                                        {
                                            selectedContact.map((contact, index) => (
                                                <p className='text-base-bold p-2 bg-pink-1 rounded-lg' key={index}>
                                                    {contact.userName}
                                                </p>
                                            ))
                                        }
                                    </div>
                                </div>
                            </>
                        )
                    }
                    <button className='flex items-center justify-center rounded-xl p-3 bg-gradient-to-l from-blue-1 to-blue-3 cursor-pointer text-body-bold text-white'
                        onClick={createChat}
                        disabled={selectedContact.length === 0}
                    >
                        Start a new Chat
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ContactPart