import { useEffect, useState } from "react";

const useTouchDevice = () => {
  const [isTouch, setIsTouch] = useState<boolean | null>(null);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouch;
};

export default useTouchDevice;
