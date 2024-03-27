"use client";
import React, { useEffect, useState } from 'react'
import CommentCard from './comment-card';
import { format } from "date-fns";
import qs from "query-string";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux'
import { setComments } from "@/lib/features/posts/postSlice";


const DATE_FORMAT = "d MMM yyyy, HH:mm";

const DisplayComments = ({serverId, channelId, postId, member, currentMember}) => {

    const {comments} = useSelector((state)=> state.post);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchComments = async()=>{
          try {
            const url = qs.stringifyUrl({
              url: `/api/posts/comments`,
              query: {
                channelId,
                serverId,
                postId,
              },
            });
      
            const {data} = await axios.get(url);
            dispatch(setComments(data.comments));
          } catch (error) {
            console.error(error);
          }
        }
        fetchComments();
      }, []);
      
  return (
    <div className='max-w-5xl'>
        {comments.length === 0 && 
        <p className='ml-8 text-zinc-400'>No comments on this post...</p>}
        {comments?.map((comment)=>{
            return(
                <CommentCard
                key={comment.id}
                id={comment.id}
                comment={comment.content}
                commentOwner={comment.member}
                timestamp={format(new Date(comment.createdAt), DATE_FORMAT)}
                currentMember={currentMember}
                isUpdated={comment.updatedAt !== comment.createdAt}
                isdeleted={comment.deleted}
                postOwner={member}
                serverId={serverId}
                channelId={channelId}
                postId={postId}
                />
            )
        })}
    </div>
  )
}

export default DisplayComments