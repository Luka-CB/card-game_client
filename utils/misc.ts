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

const colors = [
  { value: "#995D81", textColor: "light" },
  { value: "#EB8258", textColor: "light" },
  { value: "#F6F740", textColor: "dark" },
  { value: "#6689A1", textColor: "light" },
  { value: "#B7B5E4", textColor: "dark" },
  { value: "#322E18", textColor: "light" },
  { value: "#004F2D", textColor: "light" },
  { value: "#D87CAC", textColor: "light" },
  { value: "#FFDA22", textColor: "dark" },
  { value: "#41D3BD", textColor: "dark" },
  { value: "#791E94", textColor: "light" },
  { value: "#DE6449", textColor: "light" },
  { value: "#461220", textColor: "light" },
  { value: "#FCB9B2", textColor: "dark" },
  { value: "#20063B", textColor: "light" },
  { value: "#62C370", textColor: "dark" },
  { value: "#00A7E1", textColor: "light" },
  { value: "#FF9B42", textColor: "dark" },
  { value: "#52154E", textColor: "light" },
  { value: "#CA9CE1", textColor: "dark" },
  { value: "#BFAB25", textColor: "dark" },
  { value: "#B81365", textColor: "dark" },
  { value: "#026C7C", textColor: "light" },
  { value: "#390099", textColor: "light" },
  { value: "#9E0059", textColor: "light" },
  { value: "#A5AA52", textColor: "light" },
  { value: "#FF2ECC", textColor: "light" },
  { value: "#E0FF4F", textColor: "dark" },
  { value: "#774E24", textColor: "light" },
  { value: "#5CF64A", textColor: "dark" },
  { value: "#FF37A6", textColor: "light" },
  { value: "#907AD6", textColor: "light" },
  { value: "#062726", textColor: "light" },
  { value: "#EDF2F4", textColor: "dark" },
  { value: "#D78A76", textColor: "light" },
  { value: "#79B473", textColor: "light" },
  { value: "#F3B700", textColor: "dark" },
  { value: "#5C8001", textColor: "light" },
  { value: "#422040", textColor: "light" },
  { value: "#E87EA1", textColor: "light" },
  { value: "#E86252", textColor: "light" },
  { value: "#0B4F6C", textColor: "light" },
  { value: "#90FFDC", textColor: "dark" },
];

export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};
