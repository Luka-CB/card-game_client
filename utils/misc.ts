export const substringText = (text: string, length: number) => {
  if (text.length > length) {
    return text.substring(0, length) + "...";
  }
  return text;
};

export const getRandomBotAvatar = () => {
  if (typeof window === "undefined") return null;

  const avatarNumber = Math.floor(Math.random() * 21) + 1;
  return `/bots/bot-${avatarNumber}.jpeg`;
};

export const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
