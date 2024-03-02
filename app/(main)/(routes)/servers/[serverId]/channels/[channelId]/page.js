import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {ChannelType} from "@prisma/client";
import { MediaRoom } from "@/components/media-room";
import CreatePostBtn from "@/components/feed/create-post-btn";
import FeedPosts from "@/components/feed/feed-posts";

const ChannelIdPage = async ({ params }) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if(!channel || !member){
    redirect("/user-setup");
  }

  return (
    <div className="bg-[#FFECD6] dark:bg-black flex flex-col top-0 relative w-full left-2 h-full">   
        <ChatHeader 
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
        />
        {channel.type === ChannelType.TEXT && (
          <>
          <ChatMessages
        member={member}
        name={channel.name}
        chatId={channel.id}
        type="channel"
        apiUrl="/api/messages"
        socketUrl="/api/socket/messages"
        socketQuery={{
          channelId:channel.id,
          serverId:channel.serverId,
        }}
        paramKey="channelId"
        paramValue={channel.id} />
        
        <ChatInput 
        name = {channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          channelId: channel.id,
          serverId: channel.serverId
        }} />
          
          </>
        )} 
        {channel.type === ChannelType.AUDIO && (
          <MediaRoom
           chatId={channel.id}
           video={false}
           audio={true}
          />
        )}

        {channel.type === ChannelType.VIDEO && (
          <MediaRoom
           chatId={channel.id}
           video={true}
           audio={true}
          />
        )}

        {channel.type === ChannelType.FEED && (
          <div className="flex-1 flex flex-col py-4 overflow-y-auto relative left-8">
            <CreatePostBtn />
            <FeedPosts />
          </div>
        )}
    </div>
  )
};

export default ChannelIdPage;
