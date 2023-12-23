"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";


export const NavigationItem = ({
    id,
    imageUrl,
    name
}) => {

    const  params = useParams();
    const router = useRouter();

    return ( 
        <ActionTooltip
         side="right"
         align="center"
         label={name}
        >
            <button
             onClick={()=>{}}
             className="group relative flex items-center"
             >
                <div className={cn(
                    "absolute left-0 bg-primary rounded-full transition-all w-[4px]",
                    params?.serverId !== id && "group-hover:h-[20px]",
                    params?.serverId === id ? "h-[36px]" : "h-[8px]"
                )}/>
            </button>
        </ActionTooltip>
     );
}
