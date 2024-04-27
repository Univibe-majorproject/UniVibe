import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
    try {
        
        const profile = await currentProfile();

        if(!profile){
            return new NextResponse("Unauthorized", { status: 401});
        }

        const server = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVER_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        
        const profile = await currentProfile();
        const { name, imageUrl, collegeCode, collegeDomain } = await req.json();

        if(!profile){
            return new NextResponse("Unauthorized", { status: 401});
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                name, 
                imageUrl,
                collegeCode,
                collegeDomain
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVER_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}