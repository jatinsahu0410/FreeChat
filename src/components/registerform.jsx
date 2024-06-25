'use client'

import { EmailOutlined, LockOutlined, Person2Outlined } from '@mui/icons-material'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'

const RisFrom = ({ type }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const router = useRouter();

    const submitHandler = async (data) => {
        console.log(data)
        if (type == 'register') {
            const res = await fetch(`/api/auth/register`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (res.status === 200) {
                toast.success("Registered Successfully")
                router.push('/');
            }
            if (res.status === 400) {
                toast.error("User Already Registered");
                router.push('/');
            }else{
                toast.error("Unable to register user", res.status);
            }
        }
        if (type == 'login') {
            const res = await signIn("credentials", { ...data, redirect: false })
            if (res.status === 200) {
                toast.success("Logged in Successfully")
                router.push('/chats');
            } else if(res.status === 401){
                toast.error("Invalid Password");
                router.push('/');
            }else{
                toast.error("Unable to login user", res.status);
            }
        }
    }
    return (
        <div className='w-1/3 py-7 px-4 max-sm:w-5/6 max-lg:w-2/3 max-xl:w-1/2 fromreg'>
            <div className='flex items-center justify-center '>
                <p className='font-extrabold text-pink-400 ml-0'>Free Chat App</p>
            </div>
            <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col items-center gap-5'>
                {
                    type == 'register' && (
                        <div className=''>
                            <div className='input'>
                                <input
                                    defaultValue=""
                                    type='text'
                                    placeholder='UserName'
                                    className='input-field'
                                    {...register('userName', {
                                        required: true,
                                        validate: (value) => {
                                            if (value.length < 4) {
                                                return "User Name must be at least 4 characters"
                                            }
                                        },
                                    })}
                                />
                                <Person2Outlined sx={{ color: "#737373" }} />
                            </div>
                            {
                                errors.username && <p className='text-red-500'>{errors.username.message}</p>
                            }
                        </div>
                    )
                }
                <div>
                    <div className='input'>
                        <input
                            defaultValue=""
                            {...register("email", { required: "Enail is required" })}
                            type='email'
                            placeholder='Enter email address'
                            className='input-field'
                        />
                        <EmailOutlined sx={{ color: "@737373" }} />
                    </div>
                    {
                        errors.eamil && <p className='text-red-500'>{errors.eamil.message}</p>
                    }
                </div>
                <div>
                    <div className='input'>
                        <input
                            defaultValue=""
                            {...register("password", {
                                required: "Password is required",
                                validate: (value) => {
                                    if (value.length < 6 || !value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)) {
                                        return "Password must be at least 6 characters and contain atleas one special characters"
                                    }
                                },
                            })}
                            type='password'
                            placeholder='Enter password'
                            className='input-field'
                        />
                        <LockOutlined sx={{ color: "#737373" }} />
                    </div>
                    {
                        errors.password && <p className='text-red-500'>{errors.password.message}</p>
                    }
                </div>
                <button className="button" type="submit">
                    {type === "register" ? "Join Free" : "Let's Chat"}
                </button>
                {type === "register" ? (
                    <Link href="/" className="link">
                        <p className="text-center">Already have an account? Sign In Here</p>
                    </Link>
                ) : (
                    <Link href="/register" className="link">
                        <p className="text-center">Don't have an account? Register Here</p>
                    </Link>
                )}
            </form>
        </div>
    )
}

export default RisFrom
