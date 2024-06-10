'use client'
import Loader from '@components/Loader'
import { Groups3Outlined } from '@mui/icons-material'
import { CldUploadButton } from 'next-cloudinary'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const GroupInfo = () => {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm();

  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState({});

  const { chatId } = useParams();

  const getChatDetails = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}`);
      const data = await res.json();
      setChat(data);
      setLoading(false);
      reset({
        name: data?.name,
        groupPhoto: data?.groupPhoto,
      });
    } catch (error) {
      console.log("Error in fetchin the chat details", error);
    }
  }

  useEffect(() => {
    if (chatId) {
      getChatDetails();
    }
  }, [chatId]);

  const uploadPhoto = (result) => {
    console.log("the iamge url is :", result?.info?.secure_url);
    setValue("groupPhoto", result?.info?.secure_url)
  }

  const router = useRouter();

  const updateGroupInfo = async (data) => {
    setLoading(true);
    const res = await fetch(`/api/chats/${chatId}/update`, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      toast.success("GroupInfo updated successfully");
      router.push(`/chats/${chatId}`);
    };
  };

  return loading ? (
    <Loader />
  ) : (
    <div className='mt-16 flex flex-col gap-11 items-center justify-center overflow-y-auto'>
      <h1 className='text-heading1-bold'>Edit Group Profile</h1 >
      <form className='flex flex-col gap-9' onSubmit={handleSubmit(updateGroupInfo)}>
        <div className='input'>
          <input
            {...register("name", {
              required: "Name is required",
              validate: (value) => {
                if (value.length < 3) {
                  return "User Name must be at least 3 characters"
                }
              }
            })}
            type='text'
            placeholder='group Name'
            className='input-field'
          />
          <Groups3Outlined sx={{ color: "#737373" }} />
        </div>
        {errors?.name && (
          <p className="text-red-500">{errors.name.message}</p>
        )}

        <div className='flex items-center justify-center gap-6'>
          <img src={
            watch("groupPhoto") || chat?.groupPhoto || `https://api.dicebear.com/5.x/initials/svg?seed=${chat?.name}`
          }
            alt='profile' className='w-40 h-40 rounded-full' />
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onUpload={uploadPhoto}
            uploadPreset='kk6phtrz'
          >
            <p className='text-body-bold border hover:scale-105 px-4 py-2 bg-blue-3 rounded-full'>Upload Group photo</p>
          </CldUploadButton>
        </div>
        <div className='flex flex-wrap gap-3'>
          {
            chat?.members?.map((member, index) => {
              return (
                <p className='text-base-bold p-2 bg-pink-1 rounded-lg' key={index}>{member.userName}</p>
              )
            })
          }
        </div>
        <button className='flex items-center justify-center rounded-xl p-3 bg-gradient-to-l from-blue-1 to-blue-3 text-body-bold text-white hover:scale-105 hover:duration-700' type='submit'>
          Save Changes
        </button>
      </form>
    </div >
  );
};

export default GroupInfo;