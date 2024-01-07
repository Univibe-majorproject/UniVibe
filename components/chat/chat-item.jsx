"use client";

import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "@/components/action-tooltip";
import {ShieldAlert, ShieldCheck } from "lucide-react";

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
  }

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery
}) => { 
    return (
        <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
        <div className="group flex gap-x-2 items-start w-full">
            <div className="cursor-pointer hover:drop-shadow-md transition">
                <UserAvatar src={member.profile.imageUrl}/>
            </div>
            <div className="flex flex-col w-full">
                <div className="flex items-center gap-x-2">
                    <div className="flex items-center">
                        <p className="font-semibold text-sm hover:underline cursor-pointer">
                            {member.profile.name}
                        </p>
                        <ActionTooltip label={member.role}>
                            {roleIconMap[member.role]}
                        </ActionTooltip>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}