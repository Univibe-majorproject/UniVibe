import {
    Hash,
    Menu,
} from "lucide-react";

export const ChatHeader = ({
    serverId,
    name,
    type,
    imageUrl
}) => {
    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-x-neutral-200 dark:border-neutral-800 border-b-2">
            <Menu/>
            {type === "channel" && (
                <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2"/>
            )}
            
        </div>
    )
}