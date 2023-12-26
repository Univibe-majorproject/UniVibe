import { Server, Member, Profile } from "@prisma/client"

export const ServerWithMembersWithProfiles = Server & {
    members:[ Member,
        {
            profile:{
                Profile,
            },
        },
    ],
};

