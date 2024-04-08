"use client";
import { CreateServerModal } from "@/components/modals/create-server-modal";
import { useEffect, useState } from "react";
import { InviteModal } from "@/components/modals/invite-modal";
import { EditServerModal } from "@/components/modals/edit-server-modal";
import { MembersModal } from "@/components/modals/members-modal";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";
import { LeaveServerModal } from "@/components/modals/leave-server-modal";
import { DeleteServerModal } from "@/components/modals/delete-server-modal";
import { DeleteChannelModal } from "@/components/modals/delete-channel-modal";
import { EditChannelModal } from "@/components/modals/edit-channel-modal";
import { MessageFileModal } from "@/components/modals/message-file-modal";
import { DeleteMessageModal } from "@/components/modals/delete-message-modal";
import { CreatePostModal } from "@/components/modals/create-post-modal";
import { EditPostModal } from "@/components/modals/edit-post-modal";
import { DeletePostModal } from "@/components/modals/delete-post-modal";
import { DeleteCommentModal } from "@/components/modals/delete-comment-modal";

export const ModalProvider = () => {
  //handling isMount here
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  } //preventing the modals render on the server side
  //to prevent hydration errors
  
    return ( 
        <>
            <CreateServerModal />
            <InviteModal/>
            <EditServerModal/>
            <MembersModal/>
            <CreateChannelModal/>
            <LeaveServerModal/>
            <DeleteServerModal/>
            <DeleteChannelModal/>
            <EditChannelModal/>
            <MessageFileModal/>
            <DeleteMessageModal/>
            <CreatePostModal/>
            <EditPostModal/>
            <DeletePostModal/>
            <DeleteCommentModal/>
        </>
     );
}
 
