import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const profile = await currentProfilePages(req);
    const { searchParams } = new URL(req.url);
    const { comment } = await req.json();
    const serverId = searchParams.get("serverId");
    const channelId = searchParams.get("channelId");
    const postId = searchParams.get("postId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    //trying to confirm user trying to comment on the post is a part of this server
    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId,
        serverId: serverId,
      },
    });

    if (!channel) {
      return new NextResponse("Channel not found", { status: 404 });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    //if member not a part of the server
    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }
    let NewComment;

    try {
      NewComment = await db.comment.create({
        data: {
          memberId: member.id,
          postId,
          content:comment,
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        }
      });

    } catch (error) {
      console.error("Error creating comment in db" , error);
    }
    
    return NextResponse.json({
      NewComment
    });
  } catch (error) {
    console.error("[COMMENT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req) {

  try {
    const profile = await currentProfilePages(req);
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");
    const channelId = searchParams.get("channelId");
    const postId = searchParams.get("postId");
    
    let comments =[];

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    //trying to confirm user trying to comment on the post is a part of this server.
    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId,
        serverId: serverId,
      },
    });

    if (!channel) {
      return new NextResponse("Channel not found", { status: 404 });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    //if member not a part of the server
    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    //counting total comments on a post
    const totalComments = await db.comment.count({
      where:{
        postId,
      }
    });

    // getting all comments
    comments = await db.comment.findMany({
      where:{
        postId,
      },
      include:{
        member:{
          include:{
            profile:true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    return NextResponse.json({
      comments,
      totalComments
    });
  } catch (error) {
    console.error("[GETTING_COMMENTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}