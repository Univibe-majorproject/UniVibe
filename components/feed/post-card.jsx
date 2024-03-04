"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/db";
import axios from "axios";
import {useRouter, useParams} from "next/navigation";
import qs from "query-string";
import { UserAvatar } from "@/components/user-avatar";
import Image from "next/image";
import {
  FileIcon,
  Menu,
  Edit,
  Trash,
  Heart,
  MessageCircle,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { MemberRole } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PostCard = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}) => {
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  const fileType = fileUrl?.split(".").pop();
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;

  const [postLiked, setPostLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalComments, setTotalComments] = useState(0);

  useEffect(() => {
    const fetchPostLike = async()=>{
      try {
        const url = qs.stringifyUrl({
          url: `/api/posts/likes`,
          query: {
            channelId:socketQuery.channelId,
            serverId:socketQuery.serverId,
            postId:id,
          },
        });
  
        const {data} = await axios.get(url);
        setPostLiked(data.isLiked);
        setTotalLikes(data.totalLikes);
      } catch (error) {
        console.error(error);
      }
    }

    const fetchComments = async()=>{
      try {
        const url = qs.stringifyUrl({
          url: `/api/posts/comments`,
          query: {
            channelId:socketQuery.channelId,
            serverId:socketQuery.serverId,
            postId:id,
          },
        });
  
        const {data} = await axios.get(url);
        setTotalComments(data.totalComments);
      } catch (error) {
        console.error(error);
      }
    }
    fetchComments();
    fetchPostLike();
    
  });
  
  const handleLikeClick = async()=> {
    try {
      const url = qs.stringifyUrl({
        url: `/api/posts/likes`,
        query: {
          channelId:socketQuery.channelId,
          serverId:socketQuery.serverId,
          postId:id,
        },
      });

      const {data} = await axios.put(url);
      setPostLiked(data.isLiked);
    } catch (error) {
      console.error(error);
    }
  }

  const onCommentClick = () => {
    
    router.push(`/servers/${params?.serverId}/channels/${params?.channelId}/posts/${id}`);
  }
  
  return (
    <div className="p-4 m-4 flex flex-col space-y-4 bg-[rgb(21,20,29)]">
      <div className="flex justify-between">
        <div className="flex space-x-4 p-4">
          <UserAvatar
            src={member.profile.imageUrl}
            className="w-12 h-12 flex"
          />
          <div className="flex flex-col text-white font-bold">
            <h1 className="text-md">{member.profile.name}</h1>
            <small className="text-zinc-300 font-normal">
              {member.profile.heading} Incoming SWE Intern at Amazon
            </small>
            <small className="text-zinc-400 font-normal">
              {" "}
              Posted At : {timestamp}
            </small>
          </div>
        </div>
        {(isAdmin || isModerator || isOwner) && (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
              <button
                className="truncate text-md font-semibold
             border-neutral-200 transition mr-6 -mt-6"
              >
                <Menu className="transition hover:scale-110" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56 text-xs font-medium text-black 
                    dark:text-neutral-400 relative -top-8 -left-12"
            >
              {isOwner && (
                <DropdownMenuItem
                  onClick={() =>
                    onOpen("editPost", {
                      postId: id,
                      content,
                      fileUrl,
                      apiUrl: `${socketUrl}/${id}`,
                      query: socketQuery,
                    })
                  }
                  className="text-indigo-600 dark:text-indigo-400 px-3
                         text-sm cursor-pointer"
                >
                  Edit Post
                  <Edit className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() =>
                  onOpen("deletePost", {
                    apiUrl: `${socketUrl}/${id}`,
                    query: socketQuery,
                  })
                }
                className="px-3 text-sm cursor-pointer dark:text-rose-400"
              >
                Delete Post
                <Trash className="h-4 w-4 ml-auto" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <p className="flex flex-wrap w-full">
          {content}
        </p>
        {isImage && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-[80%] w-[60%]"
          >
            <Image src={fileUrl} alt={content} fill className="object-cover" />
          </a>
        )}
        {isPDF && (
          <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline object-contain"
            >
              PDF File
            </a>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 border-t-2 border-t-yellow-200/20 pt-4">
        <button
          className="hover:shadow-md rounded-lg transition hover:scale-105  text-white font-semibold p-2 m-2 border-x-4 border-x-yellow-200 flex justify-center group items-center"
          onClick={handleLikeClick}
        >
          {postLiked ? (
            <Heart className="h-6 w-6 group-hover:scale-105 fill-rose-600 text-rose-600" />
          ) : (
            <Heart className="h-6 w-6 group-hover:scale-105" />
          )}
          <p className="text-xl ml-3">{totalLikes}</p>
        </button>
        <button className="hover:shadow-md rounded-lg transition hover:scale-105  text-white font-semibold p-2 m-2 border-x-4 border-x-yellow-200 flex justify-center group" 
        onClick={onCommentClick}>
          <MessageCircle className="h-6 w-6 group-hover:scale-105" />
          <p className="text-xl ml-3">{totalComments}</p>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
