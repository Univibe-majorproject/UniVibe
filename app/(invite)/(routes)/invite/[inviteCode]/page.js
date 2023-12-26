import { currentProfile } from "@/lib/current-profile";

import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

const InviteCodePage = async ({ params }) => {
  //for fetching the current profile
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  //check if we have the invite code or not
  if (!params.inviteCode) {
    return redirect("/");
  }

  //to check if the user is already a part of this server
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  //if user is the part of the server then redirect them to that server
  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  //update the server using the unique invite code and create a new member
  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
};

export default InviteCodePage;
