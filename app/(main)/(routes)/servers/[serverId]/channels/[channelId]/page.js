import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

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
    redirect("/");
  }

  return (
    <div className="bg-[#FFECD6] dark:bg-black flex flex-col top-0 relative w-full left-2 h-full">   
        <ChatHeader 
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
        />
        <div className="flex-1 relative left-2">
          Future messages
        </div>
        <ChatInput 
        name = {channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          channelId: channel.id,
          serverId: channel.serverId
        }} />
    </div>
  )
};

export default ChannelIdPage;
