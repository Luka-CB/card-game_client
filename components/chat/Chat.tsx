import { FaTimesCircle, FaSmile } from "react-icons/fa";
import { BsFillSendFill } from "react-icons/bs";
import styles from "./Chat.module.scss";
import useUserStore from "@/store/user/userStore";
import Emojis from "../emojis/Emojis";
import { useEffect, useRef, useState } from "react";
import useSocket from "@/hooks/useSocket";
import { ChatMessage, RoomUser } from "@/utils/interfaces";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

interface ChatProps {
  roomId: string;
  closeChat: () => void;
  player: RoomUser;
  messages: ChatMessage[];
}

const Chat: React.FC<ChatProps> = ({ roomId, closeChat, player, messages }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useUserStore();
  const socket = useSocket();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const container = messagesContainerRef.current;
      const lastMessage = messages[messages.length - 1];
      const userSentMessage = lastMessage.sender.id === user?._id;

      if (userSentMessage) {
        scrollToBottom();
        return;
      }

      if (container) {
        const threshold = 150;
        const position =
          container.scrollHeight - container.scrollTop - container.clientHeight;
        const isNearBottom = position < threshold;

        if (isNearBottom) {
          setTimeout(() => scrollToBottom(), 150);
        }
      }
    }
  }, [messages, user?._id]);

  const handleEmojiSelect = (emoji: string) => {
    const cursorPos = inputRef.current?.selectionStart || message.length;
    const newMessage =
      message.slice(0, cursorPos) + emoji + message.slice(cursorPos);
    setMessage(newMessage);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const newPos = cursorPos + emoji.length;
        inputRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    if (!socket || !roomId || !player) return;

    socket.emit("addChatMessage", roomId, {
      id: uuidv4(),
      sender: {
        id: player.id,
        username: player.username,
        avatar: player.avatar,
        color: player.color,
      },
      content: message,
      timestamp: new Date(),
    });

    setMessage("");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className={styles.chat} onClick={() => setShowPicker(false)}>
      <div className={styles.header}>
        <h3>Chat</h3>
        <button className={styles.close_btn} onClick={closeChat}>
          <FaTimesCircle />
        </button>
      </div>
      <div className={styles.messages} ref={messagesContainerRef}>
        {!messages || messages.length === 0 ? (
          <div className={styles.no_messages}>
            No messages yet. Start the conversation!
          </div>
        ) : null}
        {messages?.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${msg.sender.id === user?._id ? styles.own : ""}`}
          >
            <div className={styles.player}>
              <Image
                src={msg.sender.avatar || "/default-avatar.jpeg"}
                alt={msg.sender.username}
                width={30}
                height={30}
                style={{
                  border: `2px solid ${msg.sender.color?.value || "#000"}`,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <strong
                className={styles.username}
                style={{
                  border: `2px solid ${msg.sender?.color?.value}`,
                }}
              >
                {msg.sender.username}:
              </strong>
            </div>
            <div
              className={styles.text}
              style={{
                backgroundColor: msg.sender?.color?.value,
                color:
                  msg.sender?.color?.textColor === "dark" ? "#000" : "#fff",
                boxShadow: `2px 2px 5px ${msg.sender?.color?.value}`,
              }}
            >
              <span>{msg.content}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.input_container}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          className={styles.emoji_button}
          onClick={(e) => {
            e.stopPropagation();
            setShowPicker(!showPicker);
          }}
        >
          <FaSmile />
        </button>
        <button className={styles.send_button} onClick={handleSend}>
          <span>Send</span>
          <BsFillSendFill className={styles.send_icon} />
        </button>
      </div>

      {showPicker && (
        <div
          className={styles.emoji_container}
          onClick={(e) => e.stopPropagation()}
        >
          <Emojis
            onEmojiSelect={handleEmojiSelect}
            setShowPicker={setShowPicker}
          />
        </div>
      )}
    </div>
  );
};

export default Chat;
