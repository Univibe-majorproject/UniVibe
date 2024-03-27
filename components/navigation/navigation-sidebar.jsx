import { currentProfile } from "@/lib/current-profile";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";

import NavigationAction from "@/components/navigation/navigation-action";
import { NavigationItem } from "./navigation-item";

export const NavigationSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/user-setup");
  }

  //to find all the server this user is a part of
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  const userServer = servers[0];
  return (
    <div
      className="space-y-4 flex flex-row items-center
       text-primary w-full h-[72px] dark:bg-black bg-[#E3E5E8]
        px-3"
    >
      <div className="pb-3 mt-auto flex items-center flex-row gap-y-4">
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
