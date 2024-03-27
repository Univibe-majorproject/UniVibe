import { MemberRole } from "@prisma/client";

import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";

export default async function handler(
  req,
  res
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { postId, serverId, channelId } = req.query;
    const { content, fileUrl } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID missing" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID missing" });
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
      return res.status(404).json({ error: "Server not found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId ,
        serverId: serverId ,
      },
    });
  
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const member = server.members.find((member) => member.profileId === profile.id);

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
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
      return res.status(404).json({ error: "Post not found" });
    }

    const isMessageOwner = post.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;
    const updateKey = `chat:${channelId}:posts:update`;
    const deleteKey = `chat:${channelId}:posts:delete`;
    
    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      post = await db.post.delete({
        where: {
          id: postId,
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        }
      })

      try {
        res?.socket?.server?.io?.emit(deleteKey, post);
      } catch (error) {
        console.error("Error emitting deletion event:", error);
      }
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      post = await db.post.update({
        where: {
          id: postId ,
          channelId
        },
        data: {
          content,
          fileUrl
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        }
      })

      try {
        res?.socket?.server?.io?.emit(updateKey, post);
      } catch (error) {
        console.error("Error emitting editing of post event:", error);
      }
    }
    

    return res.status(200).json(post);
  } catch (error) {
    console.log("[POST_ID]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}