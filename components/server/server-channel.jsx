"use client";

import { useParams, useRouter } from "next/navigation";
import { ChannelType, MemberRole } from "@prisma/client";

import { Hash, Mic, Video, Edit, Trash, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export const ServerChannel = ({ channel, server, role }) => {
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  //to create dynamic icons
  const Icon = iconMap[channel.type];

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
  };

  const onAction = (e, action) => {
    e.stopPropagation();
    onOpen(action, { channel, server });
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-gradient-to-r from-purple-600 to-black dark:hover:border-b-2 transition mb-1",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-gradient-to-r from-purple-600 to-black"
      )}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-[#CBFF01]/80" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:bg-gradient-to-r from-[#CBFF01] to-[#00FFA3] bg-clip-text text-transparent dark:group-hover:text-[#CBFF01] transition",
          params?.channelId === channel.id &&
            "dark:bg-gradient-to-r from-[#CBFF01] to-[#00FFA3] bg-clip-text text-transparent dark:group-hover:text-[#CBFF01]"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={(e) => onAction(e, "editChannel")}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-blue-500 dark:hover:text-pink-400 transition"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={(e) => onAction(e, "deleteChannel")}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-rose-500 dark:text-[#F19E38] transition"
            />
          </ActionTooltip>
        </div>
      )}

      {channel.name === "general" && (
        <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-rose-600/50" />
      )}
    </button>
  );
};
