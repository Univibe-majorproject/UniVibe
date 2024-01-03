import { Hash } from "lucide-react";
import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";

export const ChatHeader = ({ serverId, name, type, imageUrl }) => {
  return (
    <div className="text-md font-semibold px-4 flex items-center  border-x-neutral-200 dark:border-[#CBFF01] border-b-2 justify-between h-[80px]">
    <div className="flex items-center justify-center">
    <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )}
      <p className="font-semibold text-md text-black dark:dark:bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        {name}
      </p>

    </div>
    
    <div className="flex items-center justify-center">
    <ModeToggle />
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "h-[48px] w-[48px]",
          },
        }}
      />
    </div>
      
    </div>
  );
};
