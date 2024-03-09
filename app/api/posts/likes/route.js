import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req, res) {
  try {
    const profile = await currentProfilePages(req);
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");
    const channelId = searchParams.get("channelId");
    const postId = searchParams.get("postId");
    let isLiked = false;
    let like;
    
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    //trying to confirm user trying to like the post is a part of this server
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

    // Check if user is already liked the post
    const existingLike = await db.like.findFirst({
      where: {
        memberId: member.id,
        postId,
      },
    });

    if (existingLike) {
      // Unlike the post
      isLiked = false;
      like = await db.like.delete({
        where: {
          id: existingLike.id,
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        }
      });

    } else {
      // Like the post
      isLiked = true;
      like = await db.like.create({
        data: {
          memberId: member.id,
          postId,
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        }
      });
    }

    return NextResponse.json({
      like,
      isLiked
    });
  } catch (error) {
    console.error("[LIKING_DISLIKING_POST]", error);
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
    let isLiked = false;
    let like;
    
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    //trying to confirm user trying to like the post is a part of this server
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

    //counting total likes on a post
    const totalLikes = await db.like.count({
      where:{
        postId,
      }
    });

    // Check if user is already liked the post
    const existingLike = await db.like.findFirst({
      where: {
        memberId: member.id,
        postId,
      },
    });

    if (existingLike) {
      isLiked = true;

    } else {
      isLiked = false;
    }

    return NextResponse.json({
      isLiked,
      totalLikes
    });
  } catch (error) {
    console.error("[GETTING_POST_LIKE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}