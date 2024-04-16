import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { InititalModal } from "@/components/modals/initial-modal";

const SetupPage = async () => {
  const profile = await initialProfile();

  let userEmailDomain = profile.email.split("@")[1]; //Extract user email domain.

  let normalizedUserEmailDomain = userEmailDomain.toLowerCase();

  /* 
    Checking in the db if there is a server with the college-email-domain equal to the user-email-domain of the user who signed in. 
  */

  const server = await db.server.findFirst({
    where: {
      collegeDomain: normalizedUserEmailDomain,
    },
  });

  /*
    If a server with that domain exists then we check if this user is a member, if yes then we redirect to the server page directly, if not then we add this user as a member in the college server and then redirect to the server page. 
  */

  if (server) {
    //to check if the user is already a part of this server
    const isMember = await db.server.findFirst({
      where: {
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
      return redirect(`/servers/${server.id}`);
    }
    else{
      // Create a new member in the college server
      const updatedServer = await db.server.update({
        where: {
          id: server.id,
          collegeDomain: normalizedUserEmailDomain,
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

  /*
    If a server with that domain does not exist then we allow this user to create a new server for their college.  
  */

  if (!server) {
    return (
      <div className="flex items-center justify-center mt-8 text-center">
        <h4 className="font-bold text-xl text-red-500">
          Your email domain does not match any existing college network.
        </h4>
        <InititalModal />
      </div>
    );
  }

  return <InititalModal />;
};

export default SetupPage;
