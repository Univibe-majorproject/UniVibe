"use client";
import React from 'react'
import { db } from "@/lib/db";
import PostCard from './post-card';
import { format } from "date-fns";
import { Fragment, useRef } from "react";
import { Loader2, ServerCrash } from "lucide-react";
import { useChatQuery } from "@/hooks/use-chat-query";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";
const DATE_FORMAT = "d MMM yyyy, HH:mm";

const FeedPosts = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:posts`;
  const updateKey = `chat:${chatId}:posts:update`;
  const deleteKey = `chat:${chatId}:posts:delete`;

  const chatRef = useRef(null);
  const bottomRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  useChatSocket({ queryKey, addKey, updateKey , deleteKey});
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  })

  if (status === "loading") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading posts...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 m-4 flex flex-col max-w-5xl" ref={bottomRef}>
      <div className="flex flex-col mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group?.items?.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                currentMember={member}
                member={post.member}
                content={post.content}
                fileUrl={post.fileUrl}
                timestamp={format(new Date(post.createdAt), DATE_FORMAT)}
                isUpdated={post.updatedAt !== post.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4"/>
          ): (
            <button
            onClick={()=> fetchNextPage()}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition" >
              Load more posts ...
            </button>
          )}
        </div>
      )}
      <div ref={chatRef} />
      {!hasNextPage && <div className="flex-1" />}
    </div>
  )
}

export default FeedPosts