import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {ChannelType} from "@prisma/client";
import FeedPosts from "@/components/feed/feed-posts";
import PostCard from "@/components/feed/post-card";
import { format } from "date-fns";
import CommentInput from "@/components/feed/comment-input";

const DATE_FORMAT = "d MMM yyyy, HH:mm";


const PostIdPage = async ({ params }) => {
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

  const post = await db.post.findFirst({
    where:{
        channelId:channel.id,
        id:params.postId,
    },
    include: {
        member: {
          include: {
            profile: true,
          }
        }
      },
  })

  if(!channel || !member || !post){
    redirect("/user-setup");
  }

  return (
    <div className="bg-[#FFECD6] dark:bg-black flex flex-col top-0 relative w-full left-2 h-full">   
        <ChatHeader 
        name={"Post Page"}
        serverId={channel.serverId}
        type="post"
        />

        {channel.type === ChannelType.FEED && (
          <div className="flex-1 flex flex-col py-4 overflow-y-auto relative left-8">
            <PostCard
                key={post.id}
                id={post.id}
                currentMember={member}
                member={post.member}
                content={post.content}
                fileUrl={post.fileUrl}
                timestamp={format(new Date(post.createdAt), DATE_FORMAT)}
                isUpdated={post.updatedAt !== post.createdAt}
                socketUrl="/api/socket/posts"
                socketQuery={{
                    serverId:channel.serverId,
                    channelId:channel.id,
                }}
              />
              <CommentInput/>
          </div>
        )}
    </div>
  )
};

export default PostIdPage;
