import React from 'react'
import { db } from "@/lib/db";
import PostCard from './post-card';
import { format } from "date-fns";

const FeedPosts = async () => {
  const DATE_FORMAT = "d MMM yyyy, HH:mm";

   const posts = await db.post.findMany({
    include: {
        member: {
          include: {
            profile: true,
            posts:true,
          }
        }
      },
   });

   console.log(posts);
  return (
    <div className="space-y-4 p-4 m-4">
        {posts?.map((post)=>{
            return (
              <PostCard
              key={post.id}
              member={post.member}
              content={post.content}
              fileUrl={post.fileUrl}
              timestamp={format(new Date(post.createdAt), DATE_FORMAT)}
              />
            )
        })}
    </div>
  )
}

export default FeedPosts