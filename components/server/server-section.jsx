"use client";
import { MemberRole } from "@prisma/client";
import { ActionTooltip } from "@/components/action-tooltip";
import { Plus, Settings } from "lucide-react"; 
import { useModal } from "@/hooks/use-modal-store";

export const ServerSection = ({
    label, 
    role, 
    sectionType,
    channelType,
    server,
}) =>{

    const { onOpen } = useModal();

    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500
            dark:text-[#38a4f1]/70">
                {label}
            </p>
            {role !== MemberRole.GUEST && sectionType === "channels" && (
                <ActionTooltip label="Create Channel" side="top">
                    <button
                    onClick={()=> onOpen("createChannel", {channelType})}
                        className="text-zinc-500 hover:text-zinc-600
                        dark:text-zinc-400 dark:hover:text-zinc-300
                        transition z-20"
                    >
                        <Plus className="h-4 w-4 text-[#38a4f1]/70"/>
                    </button>
                </ActionTooltip>
            )}

            {role === MemberRole.ADMIN && sectionType === "members" && (
                <ActionTooltip label="Manage Members" side="top">
                    <button
                    onClick={()=> onOpen("members", {server})}
                        className="text-zinc-500 hover:text-zinc-600
                        dark:text-zinc-400 dark:hover:text-zinc-300
                        transition z-20"
                    >
                        <Settings className="h-4 w-4 text-[#38a4f1]/70"/>
                    </button>
            </ActionTooltip>
            )}
        </div>
    )
}