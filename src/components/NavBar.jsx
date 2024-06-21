'use client'
import { Logout } from '@mui/icons-material'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const NavBar = () => {
    const pathName = usePathname();
    const {data : session} = useSession();
    // console.log("Session", session)
    const user = session?.user;
    // console.log("USer data : " ,user);

    const handleLogout = async () =>{
        // Notify server that user is offline
        await fetch(`/api/users/${user._id}/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id, status: 'offline' })
        });
        // by next Auth function
        signOut({ callbackUrl: "/"});
    };

    return (
        <div className='top-0 sticky px-10 py-5 flex items-center justify-between bg-blue-2 h-[12%]'>
            <Link href={"/"}>
                <img src='/images/logo.png' alt='logo' />
            </Link>

            <div className='flex items-center gap-8 max-sm:hidden'>
                <Link
                    href={"/chats"}
                    className={`${pathName == "/chats" ? "text-red-1" : ""} text-heading4-bold`}
                >
                    Chats
                </Link>
                <Link href={"/contacts"} className={`${pathName == "/contacts" ? "text-red-1" : ""} text-heading4-bold`}>
                Contacts
                </Link>
                <Logout sx={{color: "#737373", cursor: "pointer"}} onClick = {handleLogout}/>
                <Link href={"/profile"}>
                    <img src={`${user?.profilePicture != "" ? user?.profilePicture : `https://api.dicebear.com/5.x/initials/svg?seed=${user?.userName}`}`} alt={user?.name} className=' w-11 h-11 rounded-full object-cover object-center' width={28}/>
                </Link>
            </div>
        </div>
    )
}

export default NavBar