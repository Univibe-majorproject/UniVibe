"use client";

import { Fragment} from "react";
import { Loader2, ServerCrash } from "lucide-react";
import {Member, Message, Profile} from "@prisma/client";
import { useChatQuery } from "@/hooks/use-chat-query";
import { ChatWelcome } from "./chat-welcome";


export const ChatMessages = ({
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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  });

  if (status === "loading") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    )
  }

  return (
        <div className="flex-1 flex flex-col py-4 overflow-y-auto relative left-8">
            <div className="flex-1">
                <ChatWelcome
                type={type}
                name={name} 
                />
            </div>
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, i) => (
                <Fragment key={i}>
                    {group.items.map((message) => (
                    <div key={message.id}>
                        {message.content}
                    </div>
                ))}
                </Fragment>
            ))}
      </div>
        </div>
  )
}