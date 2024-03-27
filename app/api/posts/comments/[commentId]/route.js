import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function DELETE(req) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");
    const channelId = searchParams.get("channelId");
    const postId = searchParams.get("postId");
    const commentId = searchParams.get("commentId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }
    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }
    if (!postId) {
      return new NextResponse("Post ID missing", { status: 400 });
    }
    if (!commentId) {
      return new NextResponse("Comment ID missing", { status: 400 });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          }
        }
      },
      include: {
        members: true,
      }
    })

    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId ,
        serverId: serverId ,
      },
    });
  
    if (!channel) {
      return new NextResponse("Channel not found", { status: 404 });
    }

    const member = server.members.find((member) => member.profileId === profile.id);

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    let post = await db.post.findFirst({
      where: {
        id: postId ,
        channelId: channelId ,
      },
      include: {
        member: {
          include: {
            profile: true,
          }
        }
      }
    })

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    let comment = await db.comment.findFirst({
      where: {
        id: commentId ,
        postId: postId ,
      },
      include: {
        member: {
          include: {
            profile: true,
          }
        }
      }
    })

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }


    const isPostOwner = post.memberId === member.id;
    const isCommentOwner = comment.memberId == member.id;
    const canModify = isPostOwner || isCommentOwner;

    if (!canModify) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedComment = await db.comment.update({
        where: {
          id: commentId,
          postId:postId
        },
        data: {
          content: "This comment has been deleted.",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        }
      });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.log("[COMMENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");
    const channelId = searchParams.get("channelId");
    const postId = searchParams.get("postId");
    const commentId = searchParams.get("commentId");
    const { content } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }
    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }
    if (!postId) {
      return new NextResponse("Post ID missing", { status: 400 });
    }
    if (!commentId) {
      return new NextResponse("Comment ID missing", { status: 400 });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
          }
        }
      },
      include: {
        members: true,
      }
    })

    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId ,
        serverId: serverId ,
      },
    });
  
    if (!channel) {
      return new NextResponse("Channel not found", { status: 404 });
    }

    const member = server.members.find((member) => member.profileId === profile.id);

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    let post = await db.post.findFirst({
      where: {
        id: postId ,
        channelId: channelId ,
      },
      include: {
        member: {
          include: {
            profile: true,
          }
        }
      }
    })

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    let comment = await db.comment.findFirst({
      where: {
        id: commentId ,
        postId: postId ,
      },
      include: {
        member: {
          include: {
            profile: true,
          }
        }
      }
    })

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }


    const isCommentOwner = comment.memberId == member.id;

    if (!isCommentOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedComment = await db.comment.update({
        where: {
          id: commentId,
          postId:postId
        },
        data: {
          content: content,
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        }
      });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.log("[COMMENT_EDIT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
