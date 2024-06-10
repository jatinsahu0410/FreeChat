'use client'
import Loader from '@components/Loader'
import { Person2Outlined } from '@mui/icons-material'
import { useSession } from 'next-auth/react'
import { CldUploadButton } from 'next-cloudinary'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const ProfilePage = () => {
    const {
        register,
        watch,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm();

    const { data: session } = useSession();
    const user = session?.user;

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (user) {
            reset({
                userName: user?.userName,
                profilePicture: user?.profilePicture
            })
        }
        setLoading(false);
    }, [user])

    const uploadPhoto = (result) => {
        console.log("the iamge url is :", result?.info?.secure_url);
        setValue("profilePicture", result?.info?.secure_url)
    }

    const updateUser = async (data) =>{
        setLoading(true);
        try {
            console.log("update Profile data : ", data);
            const res = fetch(`api/users/${user._id}/update`, {
                method: "POST", 
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(data),
            });

            setLoading(false);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }
    return loading ? (
        <Loader />
    ) : (
        <div className='mt-16 flex flex-col gap-11 items-center justify-center'>
            <h1 className='text-heading1-bold'>Edit Your Profile</h1 >
            <form className='flex flex-col gap-9' onSubmit={handleSubmit(updateUser)}>
                <div className='input'>
                    <input
                        {...register("userName", {
                            required: "User Name is required",
                            validate: (value) => {
                                if (value.length < 3) {
                                    return "User Name must be at least 3 characters"
                                }
                            }
                        })}
                        type='text'
                        placeholder='UserName'
                        className='input-field'
                    />
                    <Person2Outlined sx={{ color: "#737373" }} />
                </div>
                {errors?.userName && (
                    <p className="text-red-500">{errors.userName.message}</p>
                )}

                <div className='flex items-center justify-center gap-6'>
                    <img src={
                        watch("profilePicture") || user?.profilePicture || `https://api.dicebear.com/5.x/initials/svg?seed=${user?.userName}`
                    }
                        alt='profile' className='w-40 h-40 rounded-full' />
                    <CldUploadButton
                        options={{ maxFiles: 1 }}
                        onUpload={uploadPhoto}
                        uploadPreset='kk6phtrz'
                    >
                        <p className='text-body-bold border hover:scale-105 px-4 py-2 bg-blue-3 rounded-full'>Upload Your photo</p>
                    </CldUploadButton>
                </div>
                <button className='flex items-center justify-center rounded-xl p-3 bg-gradient-to-l from-blue-1 to-blue-3 text-body-bold text-white hover:scale-105 hover:duration-700' type='submit'>
                    Save Changes
                </button>
            </form>
        </div >
    );
};

export default ProfilePage