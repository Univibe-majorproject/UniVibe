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

const formSchema = z.object({
  comment: z.string().min(1, {
    message: "Cannot add empty comment",
  }),
});

const CommentInput = ({currentMember, serverId, channelId, postId}) => {
    
    const router = useRouter();

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

        await axios.post(url,values);
        form.reset();
        router.refresh();
    } catch (error) {
        console.error("Error posting comment",error);
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <div>
    <UserAvatar src={currentMember.profile.imageUrl} className="h-12 w-12 absolute left-10 bottom-[46%]"/>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-8 px-6 z-20">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={`${isLoading}`}
                      placeholder="Add a comment to this post..."
                      className="px-24 pt-7 border-yellow-400 rounded-3xl outline-4 outline outline-[rgb(168,154,251)] border-2 h-full w-full transition"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="ml-6"/>
                </FormItem>
              )}
            />
            <Button
              disable={`${isLoading}`}
              className="bg-purple-800 text-zinc-300 absolute right-10 bottom-[46%] hover:bg-purple-900 rounded-full p-6"
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
