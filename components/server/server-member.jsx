"use client";
import { useParams, useRouter } from "next/navigation";

import {
    Member,
    MemberRole, 
    Profile, 
    Server,
} from "@prisma/client";

import {
    ShieldCheck, 
    ShieldAlert,

} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-1 text-indigo-500"/>,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-1 text-rose-500"/>,

}

export const ServerMember = ({
    member,
    server,
}) => {

    const params = useParams();
    const router = useRouter();

    const icon = roleIconMap[member.role];

    const onClick = () => {
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-gradient-to-r from-purple-600 to-black  transition mb-1",
                params?.memberId === member.id && "bg-gradient-to-r from-purple-600 to-black text-white"
            )}
        >
           <UserAvatar 
            src={member.profile.imageUrl}
            className="h-8 w-8 md:h-8 md:w-8"
            /> 
            <p
                className={cn(
                    "truncate font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-[rgb(205,205,223)] dark:group-hover:text-white transition w-32",
                    params?.memberId === member.id && "text-primary dark:text-white dark:group-hover:text-white"
                )}
            >
                {member.profile.name}
            </p>
          {icon}
        </button>
    )
}