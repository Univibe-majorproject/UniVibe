"use client";
import { MessageSquareText, Pen , ListPlus} from "lucide-react";
import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { SocketIndicator } from "@/components/socket-indicator";
import { ChatVideoButton } from "@/components/chat/chat-video-button";
import {useUser} from "@clerk/nextjs";
import { useState } from "react";

const MoreDetailsForm = ()=>{

  const { user } = useUser();
  const [heading, setHeading] = useState("");

  const handleClick = (e)=>{
    e.preventDefault();
    user.update({
      unsafeMetadata: {
        heading
      }
    })
  }
  return (
    <div className="bg-white text-black">
      <label for="heading">Heading</label>
      <input type="text" name="heading" id="heading" value={heading} 
      onChange={(event)=> setHeading(event.target.value)} 
      className="bg-white border-gray-700 border-4"/>
      <button type="button" onClick={handleClick}>Update Heading</button>

      <h2>{heading}</h2>
      <h4>Unsafe Metadata : {user?.unsafeMetadata?.heading}</h4>
    </div>
  )
}

export const ChatHeader = ({ serverId, name, type, imageUrl }) => {

  return (
    <div className="text-md font-semibold px-4 flex items-center  border-x-neutral-200 dark:border-[#CBFF01] border-b-2 justify-between h-[80px] dark:bg-[rgb(21,20,29)]">
    <div className="flex items-center justify-center">
    <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <MessageSquareText className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )}

      {type === "post" && (
        <Pen className="h-7 w-7 md:h-7 md:w-7 mr-2" />
      )}

      <p className="font-semibold text-md text-black dark:dark:bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent w-56 truncate">
        {name}
      </p>
        <div className="ml-auto flex items-center pl-4">
          <SocketIndicator/>
        </div>

    </div>
    
    {type === "conversation" && (
      <ChatVideoButton/>
    )}

    <div className="flex items-center justify-center">
    <ModeToggle />
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "h-[48px] w-[48px]",
          },
        }}
      >
        <UserButton.UserProfilePage
        label="More Details"
        labelIcon={<ListPlus className="w-5 h-5" />}
        url="terms"
      >
        <MoreDetailsForm/>
      </UserButton.UserProfilePage>
      </UserButton>
    </div>
    </div>
  );
};
