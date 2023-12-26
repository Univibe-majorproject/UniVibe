"use client";
import { CreateServerModal } from "@/components/modals/create-server-modal";
import { useEffect, useState } from "react";
import { InviteModal } from "@/components/modals/invite-modal";
import { EditServerModal } from "@/components/modals/edit-server-modal";

export const ModalProvider = () => {

    //handling isMount here 
    const [isMounted, setIsMounted] = useState(false);

    useEffect(()=>{
        setIsMounted(true);
    },[]);

    if(!isMounted){
        return null;
    }//preventing the modals render on the server side
    //to prevent hydration errors 

    return ( 
        <>
            <CreateServerModal />
            <InviteModal/>
            <EditServerModal/>
        </>
     );
}
 
