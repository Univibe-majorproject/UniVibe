import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";

const InviteCodePage = async ({ params }) => {
  //for fetching the current profile
  const profile = await initialProfile();

  let userEmailDomain = profile.email.split("@")[1]; //Extract user email domain.

  let normalizedUserEmailDomain = userEmailDomain.toLowerCase();

  //check if we have the invite code or not
  if (!params.inviteCode) {
    return redirect("/");
  }

  //checking if any server exists with the invite code
  const serverWithInviteCode = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
    },
  });

  if (!serverWithInviteCode) {
    return (
      <p className="font-bold text-2xl text-red-500 flex items-center justify-center mt-8">
        Error! Invalid or old invite url.
      </p>
    );
  }

  /* 
    Checking in the db if the invited college server's domain is the same as the user-email-domain of the user who signed in. 
  */

  const invitedServerSameAsUserEmailDomain = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      collegeDomain: normalizedUserEmailDomain,
    },
  });

  if (invitedServerSameAsUserEmailDomain) {
    const isMember = await db.server.findFirst({
      where: {
        inviteCode: params.inviteCode,
        collegeDomain: normalizedUserEmailDomain,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
    });

    //if member , redirect to college server
    if (isMember) {
      return redirect(`/servers/${invitedServerSameAsUserEmailDomain.id}`);
    } else {
      // Create a new member in the college server
      const updatedServer = await db.server.update({
        where: {
          id: invitedServerSameAsUserEmailDomain.id,
          collegeDomain: normalizedUserEmailDomain,
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

      if (updatedServer) {
        return redirect(`/servers/${updatedServer.id}`);
      }
    }
  }

  if(!invitedServerSameAsUserEmailDomain)
  {
    return (
      <p className="font-bold text-2xl text-red-500 flex items-center justify-center mt-8">
       {`You are not authorized to join this college network. This network belongs to ${serverWithInviteCode?.name}.`}
      </p>
    );
  }

  return null;
};

export default InviteCodePage;
