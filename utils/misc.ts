export const substringText = (text: string, length: number) => {
  if (text.length > length) {
    return text.substring(0, length) + "...";
  }
  return text;
};

export const getRandomAvatar = () => {
  const avatarNumber = Math.floor(Math.random() * 31) + 1;
  return `/avatars/avatar-${avatarNumber}.jpeg`;
};

export const getStoredRandomAvatar = () => {
  const storedAvatar = localStorage.getItem("randomAvatar");
  if (!storedAvatar) {
    const newAvatar = getRandomAvatar();
    localStorage.setItem("randomAvatar", newAvatar);
    return newAvatar;
  }
  return storedAvatar;
};

export const clearStoredRandomAvatar = () => {
  localStorage.removeItem("randomAvatar");
};
