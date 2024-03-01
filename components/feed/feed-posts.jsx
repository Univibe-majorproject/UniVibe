import React from 'react'
import { db } from "@/lib/db";

const FeedPosts = async () => {

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
                <div className='bg-zinc-400/20 p-4 m-2 space-y-2' key={post.id}>
                   <h1> {post.content} </h1>
                    <img src={post.fileUrl} alt="Img here" className='w-12 h-12'/>
                </div>
            )
        })}
    </div>
  )
}

export default FeedPosts