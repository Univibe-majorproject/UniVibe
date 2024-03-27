"use client";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { useRouter, useParams } from "next/navigation";
import { SendHorizontal } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import qs from "query-string";
import { UserAvatar } from "@/components/user-avatar";
import { useDispatch } from 'react-redux'
import { setComments } from "@/lib/features/posts/postSlice";

const formSchema = z.object({
  comment: z.string().min(1, {
    message: "Cannot add empty comment",
  }).max(1000, {
    message:"Exceeded the 1000 character limit."
  }),
});

const CommentInput = ({currentMember, serverId, channelId, postId}) => {
    
    const router = useRouter();
    const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit = async (values) => {
    try {
        const url = qs.stringifyUrl({
            url:'/api/posts/comments',
            query:{
                serverId,
                channelId,
                postId
            },
        });

        const {data} = await axios.post(url,values);
        dispatch(setComments(data.allComments));
        form.reset();
        router.refresh();
    } catch (error) {
        console.error("Error posting comment",error);
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="max-w-5xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex w-full">
          <div className="space-y-8 px-6 z-20 w-full flex justify-start items-center">
          <UserAvatar src={currentMember.profile.imageUrl} className="h-12 w-12 scale-150 relative -right-4 top-2"/>
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea
                      disabled={`${isLoading}`}
                      placeholder="Add a comment to this post..."
                      className="pr-28 pl-12 pt-4 border-yellow-400 rounded-3xl outline-1 outline outline-[rgb(168,154,251)] border-2 h-full w-full transition ml-16"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="ml-6"/>
                </FormItem>
              )}
            />
            <Button
              disable={`${isLoading}`}
              className="bg-purple-800 text-zinc-300 hover:bg-purple-900 rounded-full p-6 w-fit relative -left-8"
            >
              <SendHorizontal/>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CommentInput;
