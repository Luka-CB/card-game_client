import { useState } from "react";
import { FaTimesCircle } from "react-icons/fa";
import styles from "../Cards.module.scss";
import useSocket from "@/hooks/useSocket";
import useFlashMsgStore from "@/store/flashMsgStore";
import { Room } from "@/utils/interfaces";
import useRoomStore from "@/store/gamePage/roomStore";
interface PasswordPromptProps {
  room: Room;
  clickedRoomId: string | null;
  user: { id: string; username: string; avatar: string | null } | null;
}

const PasswordPrompt: React.FC<PasswordPromptProps> = ({
  room,
  clickedRoomId,
  user,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const socket = useSocket();
  const { setMsg } = useFlashMsgStore();
  const { togglePasswordPrompt, setTogglePasswordPrompt } = useRoomStore();

  const handleJoin = () => {
    if (!room || !socket || !user) return;

    if (!password.trim()) {
      setError("Password is required");
      setMsg("Please enter a password", "error");
      return;
    }

    if (password !== room.password) {
      setError("Incorrect password");
      setMsg("Incorrect password", "error");
      return;
    }

    socket.emit("joinRoom", room.id, user.id, {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
    });

    setTogglePasswordPrompt(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword.trim()) {
      setError("");
    }
  };

  if (!togglePasswordPrompt || clickedRoomId !== room.id) return null;

  return (
    <div className={styles.password_prompt}>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={handlePasswordChange}
        className={error ? styles.error : ""}
      />
      {error && <span className={styles.error_message}>{error}</span>}
      <button onClick={handleJoin}>Join</button>
      <FaTimesCircle
        className={styles.close_btn}
        onClick={() => setTogglePasswordPrompt(false)}
      />
    </div>
  );
};

export default PasswordPrompt;
