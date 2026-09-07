import { userIFace } from "@/store/user/userStore";
import { getRandomColor } from "@/utils/misc";

export interface JoinRoomAccessPayload {
  password?: string | null;
  inviteToken?: string | null;
}

export const buildJoinRoomUserPayload = (user: userIFace) => ({
  id: user._id,
  username: user.username,
  status: "active" as const,
  isGuest: user.isGuest,
  avatar: user.avatar || "/default-avatar.jpeg",
  botAvatar: null,
  color: getRandomColor(),
});
