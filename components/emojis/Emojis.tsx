import useWindowSize from "@/hooks/useWindowSize";
import styles from "./Emojis.module.scss";
import EmojiPicker, {
  EmojiClickData,
  SuggestionMode,
} from "emoji-picker-react";
import { useEffect, useState } from "react";
import { BsPlusCircleFill } from "react-icons/bs";

interface EmojisProps {
  onEmojiSelect?: (emoji: string) => void;
  setShowPicker: (show: boolean) => void;
}

const MAX_RECENT_EMOJIS = 5;

const Emojis: React.FC<EmojisProps> = ({ onEmojiSelect, setShowPicker }) => {
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const [showFullPicker, setShowFullPicker] = useState(false);

  const windowSize = useWindowSize();

  useEffect(() => {
    const stored = localStorage.getItem("recentEmojis");
    if (stored) {
      try {
        setRecentEmojis(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load recent emojis:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (recentEmojis.length === 0) {
      setShowFullPicker(true);
    } else {
      setShowFullPicker(false);
    }
  }, [recentEmojis.length]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;

    setRecentEmojis((prev) => {
      const filtered = prev.filter((e) => e !== emoji);
      const updated = [emoji, ...filtered].slice(0, MAX_RECENT_EMOJIS);
      localStorage.setItem("recentEmojis", JSON.stringify(updated));
      return updated;
    });

    if (onEmojiSelect) {
      onEmojiSelect(emoji);
    }

    setShowFullPicker(false);
    setShowPicker(false);
  };

  const handleRecentEmojiClick = (emoji: string) => {
    if (onEmojiSelect) {
      onEmojiSelect(emoji);
    }
    setShowPicker(false);
  };

  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFullPicker(!showFullPicker);
  };

  return (
    <div className={styles.emojis_wrapper}>
      {recentEmojis.length > 0 && (
        <div className={styles.recent_emojis}>
          {recentEmojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleRecentEmojiClick(emoji)}
              className={styles.recent_emoji}
            >
              {emoji}
            </button>
          ))}
          <button className={styles.plus_button} onClick={handlePlusClick}>
            <BsPlusCircleFill />
          </button>
        </div>
      )}

      {showFullPicker && (
        <div className={styles.emoji_picker_container}>
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width={windowSize.width <= 500 ? 300 : 400}
            height={
              windowSize.height <= 450
                ? 200
                : windowSize.height <= 500
                  ? 300
                  : windowSize.height <= 600
                    ? 350
                    : 450
            }
            searchDisabled={windowSize.height <= 450}
            skinTonesDisabled={windowSize.height <= 450}
            previewConfig={
              windowSize.height <= 450
                ? { showPreview: false }
                : { showPreview: true }
            }
          />
        </div>
      )}
    </div>
  );
};

export default Emojis;
