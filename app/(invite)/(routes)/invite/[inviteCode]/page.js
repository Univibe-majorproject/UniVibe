import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";

const InviteCodePage = async ({ params }) => {
  //for fetching the current profile
  const profile = await initialProfile();

  //check if we have the invite code or not
  if (!params.inviteCode) {
    return redirect("/");
  }

  //checking if any server exists with the invite code
  const serverWithInviteCode = await db.server.findFirst({
    where:{
      inviteCode: params.inviteCode,
    }
  })

  if(!serverWithInviteCode){
    return (
      <p className="font-bold text-2xl text-red-500 flex items-center justify-center mt-8">
        Error! Invalid or old invite url.
      </p>
    )
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
