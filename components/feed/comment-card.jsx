"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/db";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";

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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";

const formSchema = z.object({
  content: z.string().min(1,{
    message:"Cannot leave a comment empty."
  }),
});


const CommentCard = ({
  id,
  comment,
  postOwner,
  commentOwner,
  timestamp,
  currentMember,
  isdeleted,
  isUpdated,
  serverId,
  channelId,
  postId,
}) => {
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isCommentOwner = currentMember.id === commentOwner.id;
  const isPostOwner = currentMember.id === postOwner.id;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keyDown", handleKeyDown);
  }, []);


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: comment
    }
  });

  const onSubmit = async (values) => {
    try {
        const url = qs.stringifyUrl({
          url: `/api/posts/comments/${id}`,
          query: {
            serverId,
            channelId,
            postId,
            commentId: id,
            content:comment,
          },
        });
  
        await axios.patch(url, values);
  
        form.reset();
        setIsEditing(false);
      } catch (error) {
        console.error(error);
      }
  }

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    form.reset({
      content: comment,
    })
  }, [comment]);

  return (
    <div className="p-4 m-4 flex flex-col space-y-4 bg-[rgb(38,36,54)] rounded-3xl">
      <div className="flex justify-between">
        <div className="flex space-x-4 p-4 w-full">
          <UserAvatar
            src={commentOwner.profile.imageUrl}
            className="w-12 h-12 flex"
          />
          <div className="flex flex-col text-white font-bold w-full">
            <h1 className="text-md text-purple-600">
              {commentOwner.profile.name}
            </h1>
            <small className="text-zinc-300 font-normal">
              {commentOwner.profile.heading} Incoming SWE Intern at Amazon
            </small>
            <small className="text-zinc-400 font-normal">
              {" "}
              Posted At : {timestamp}
            </small>

            {!isEditing && (
               <p className={cn(
                "font-normal mt-4 w-full flex flex-wrap",
                isdeleted && "italic text-zinc-300 font-light"
              )}>
                {comment}
                {isUpdated && !isdeleted && (
                  <span className="text-[12px] mx-2 mt-1 text-zinc-500 dark:text-zinc-400">
                    (edited)
                  </span>
                )}
              </p>
            )}

          {isEditing && (
            <Form {...form}>
              <form 
                className="w-full pt-2"
                onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="w-full">
                            <Textarea
                              disabled={isLoading}
                              className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                              placeholder="Edit the comment..."
                              {...field}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save <br/>
              </span>
              <Button disabled={isLoading} size="sm" className="bg-purple-700 my-4">
                    Save
              </Button>
              </form>
            </Form>
          )}
            
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
                    onClick={() => setIsEditing(true)}
                  className="text-indigo-600 dark:text-indigo-400 px-3
                         text-sm cursor-pointer"
                >
                  Edit Comment
                  <Edit className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() =>
                  onOpen("deleteComment", {
                    apiUrl: `/api/posts/comments/${id}`,
                    query: {
                      serverId,
                      channelId,
                      postId,
                      commentId: id,
                    },
                  })
                }
                className="px-3 text-sm cursor-pointer dark:text-rose-400"
              >
                Delete Comment
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
