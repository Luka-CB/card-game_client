import { useEffect, useState } from "react";
import styles from "./Search.module.scss";
import { IoSearch } from "react-icons/io5";
import useSocket from "@/hooks/useSocket";

const Search = ({ roomsLength }: { roomsLength: number }) => {
  const [searchQ, setSearchQ] = useState("");

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const q = searchQ.trim();
    const timeout = setTimeout(() => {
      socket.emit("searchRooms", q);
    }, 500);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchQ, socket]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQ = e.target.value;
    setSearchQ(newSearchQ);
  };

  return (
    <div
      className={roomsLength <= 5 ? styles.disabled : styles.search_bar}
      title={
        roomsLength <= 5
          ? "Search disabled when there are 5 or fewer rooms"
          : ""
      }
    >
      <input
        type="search"
        placeholder="Search rooms by name..."
        value={searchQ}
        onChange={handleSearchChange}
        disabled={roomsLength <= 5}
      />
      <div className={styles.search_icon}>
        <IoSearch />
      </div>
    </div>
  );
};

export default Search;
