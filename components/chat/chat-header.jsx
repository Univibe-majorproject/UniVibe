import { Hash } from "lucide-react";
import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";

export const ChatHeader = ({
    serverId,
    name,
    type,
    imageUrl
}) => {
    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-x-neutral-200 dark:border-neutral-800 border-b-2">
            <MobileToggle serverId={serverId}/>
            {type === "channel" && (
                <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2"/>
            )}
            {type === "conversation" && (
                <UserAvatar 
                src={imageUrl}
                className="h-8 w-8 md:h-8 md:w-8 mr-2" />
            )}
            <p className="font-semibold text-md text-black dark:text-white">
                {name}
            </p>
        </div>
    )
}