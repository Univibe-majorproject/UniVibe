import React from 'react'
import { UserAvatar } from '@/components/user-avatar';
import Image from "next/image";
import {FileIcon} from 'lucide-react';

const PostCard = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  socketUrl,
  socketQuery,
}) => {

  const fileType = fileUrl?.split(".").pop();
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  return (
    <div className='p-4 m-4 flex flex-col space-y-4 bg-[rgb(21,20,29)]'>
        <div className='flex space-x-4 p-4'>
            <UserAvatar src={member.profile.imageUrl} className="w-12 h-12 flex"/>
            <div className='flex flex-col text-white font-bold'>
                <h1 className='text-md'>{member.profile.name}</h1>
                <small className='text-zinc-300 font-normal'>{member.profile.heading} Incoming SWE Intern at Amazon</small>
                <small className='text-zinc-400 font-normal'> Posted At : {timestamp}</small>
            </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full">
            <p>
                {content}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam officiis adipisci, doloremque soluta dolores perspiciatis voluptatem. Suscipit, autem doloremque voluptatibus perspiciatis soluta ea sapiente ducimus, eius ex, exercitationem iusto quos.
            </p>
            {isImage && (
            <a 
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-[80%] w-[60%]"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
            {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a 
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}
            
        </div>
        <div className='grid grid-cols-2 border-t-2 border-t-yellow-200/20 pt-4'>
            <button className='hover:shadow-md rounded-lg transition hover:scale-105  text-white font-semibold p-2 m-2 border-x-4 border-x-yellow-200'>
                Like
            </button>
            <button className='hover:shadow-md rounded-lg transition hover:scale-105   text-white font-semibold p-2 m-2 border-x-4 border-x-yellow-200'>
                Comment
            </button>
        </div>
    </div>
  )
}

export default PostCard