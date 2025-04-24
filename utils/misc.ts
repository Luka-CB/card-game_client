export const substringText = (text: string, length: number) => {
  if (text.length > length) {
    return text.substring(0, length) + "...";
  }
  return text;
};

export const getRandomAvatar = () => {
  if (typeof window === "undefined") return null;

  const avatarNumber = Math.floor(Math.random() * 31) + 1;
  return `/avatars/avatar-${avatarNumber}.jpeg`;
};

export const getStoredRandomAvatar = (userId?: string) => {
  if (typeof window === "undefined") return null;

  if (!userId) {
    // For current user
    const storedAvatar = localStorage.getItem("randomAvatar");
    if (!storedAvatar) {
      const newAvatar = getRandomAvatar();
      if (newAvatar) {
        localStorage.setItem("randomAvatar", newAvatar);
      }
      return newAvatar;
    }
    return storedAvatar;
  } else {
    // For other users
    const storedAvatars = JSON.parse(
      localStorage.getItem("userAvatars") || "{}"
    );
    if (!storedAvatars[userId]) {
      storedAvatars[userId] = getRandomAvatar();
      localStorage.setItem("userAvatars", JSON.stringify(storedAvatars));
    }
    return storedAvatars[userId];
  }
};

export const clearStoredRandomAvatar = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("randomAvatar");
  localStorage.removeItem("userAvatars");
};
