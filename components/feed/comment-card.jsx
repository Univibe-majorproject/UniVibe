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
  MoreHorizontal,
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

const CommentCard = ({
    id,
    comment,
    postOwner,
    commentOwner,
    timestamp,
    currentMember,
    isUpdated
}) => {
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isCommentOwner = currentMember.id === commentOwner.id;
  const isPostOwner = currentMember.id === postOwner.id;

  return (
    <div className="p-4 m-4 flex flex-col space-y-4 bg-[rgb(38,36,54)] rounded-3xl">
      <div className="flex justify-between">
        <div className="flex space-x-4 p-4">
          <UserAvatar
            src={commentOwner.profile.imageUrl}
            className="w-12 h-12 flex"
          />
          <div className="flex flex-col text-white font-bold ">
            <h1 className="text-md text-purple-600">{commentOwner.profile.name}</h1>
            <small className="text-zinc-300 font-normal">
              {commentOwner.profile.heading} Incoming SWE Intern at Amazon
            </small>
            <small className="text-zinc-400 font-normal">
              {" "}
              Posted At : {timestamp}
            </small>
            <p className="flex flex-wrap w-full mt-4 font-normal">
                {comment}
            </p>
          </div>
        </div>
        {(isPostOwner || isCommentOwner) && (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
              <button
                className="truncate text-md font-semibold
             border-neutral-200 transition mr-6 -mt-6"
              >
                <MoreHorizontal className="transition hover:scale-110" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56 text-xs font-medium text-black 
                    dark:text-neutral-400 relative -top-8 -left-12"
            >
              {isCommentOwner && (
                <DropdownMenuItem
                //   onClick={() =>
                //     onOpen("editPost", {
                //       postId: id,
                //       content,
                //       fileUrl,
                //       apiUrl: `${socketUrl}/${id}`,
                //       query: socketQuery,
                //     })
                //   }
                  className="text-indigo-600 dark:text-indigo-400 px-3
                         text-sm cursor-pointer"
                >
                  Edit Post
                  <Edit className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                // onClick={() =>
                //   onOpen("deletePost", {
                //     apiUrl: `${socketUrl}/${id}`,
                //     query: socketQuery,
                //   })
                // }
                className="px-3 text-sm cursor-pointer dark:text-rose-400"
              >
                Delete Post
                <Trash className="h-4 w-4 ml-auto" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default CommentCard;