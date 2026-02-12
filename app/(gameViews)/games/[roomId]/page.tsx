"use client";

import styles from "./page.module.scss";
import { FaTimesCircle } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { PiKeyboard } from "react-icons/pi";
import {
  HandBid,
  GameInfo,
  PlayingCard,
  Room,
  RoomUser,
  ScoreBoard,
  ChatRoom,
  ChatMessage,
} from "@/utils/interfaces";
import useUserStore from "@/store/user/userStore";
import useSocket from "@/hooks/useSocket";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/loaders/Loader";
import LeaveRoomModal from "@/components/gameRoom/gameControls/leaveRoomModal/LeaveRoomModal";
import { JokerPopup, UserTurnPopup } from "@/components/popup/Popup";
import useWindowSize from "@/hooks/useWindowSize";
import Players from "@/components/gameRoom/gameBoard/players/Players";
import Table from "@/components/gameRoom/gameBoard/table/Table";
import BusyBg from "@/components/gameRoom/busyMode/BusyBg";
import TrumpModal from "@/components/gameRoom/gameControls/trumpModal/TrumpModal";
import ScoreBoardModal from "@/components/gameRoom/scoreBoard/ScoreBoard";
import FinishedMode from "@/components/gameRoom/finishedMode/FinishedMode";
import { BsFillEmojiSunglassesFill } from "react-icons/bs";
import Emojis from "@/components/emojis/Emojis";
import Chat from "@/components/chat/Chat";

const GameRoom: React.FC = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const { roomId } = useParams();
  const socket = useSocket();
  const { user } = useUserStore();
  const [hand, setHand] = useState<PlayingCard[]>([]);
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [isScoreBoardOpen, setIsScoreBoardOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiPopup, setEmojiPopup] = useState<{
    playerId: string;
    emoji: string;
    timestamp: Date;
  } | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chat, setChat] = useState<ChatRoom | null>(null);
  const [messagePopups, setMessagePopups] = useState<
    Record<string, { message: string; timestamp: Date } | null>
  >({});

  const [revealInProgress, setRevealInProgress] = useState(false);
  const [currentDealingRound, setCurrentDealingRound] = useState(0);

  const visibleRef = useRef<Record<string, PlayingCard[]>>({});
  const dealingLockRef = useRef(false);

  const windowSize = useWindowSize();

  const stateChangeRef = useRef<{
    lastGameInfo: GameInfo | null;
    isProcessing: boolean;
  }>({
    lastGameInfo: null,
    isProcessing: false,
  });

  const [dealingCards, setDealingCards] = useState<Record<string, number>>({});

  const [visibleCards, setVisibleCards] = useState<
    Record<string, PlayingCard[]>
  >({});

  const revealInProgressRef = useRef(revealInProgress);
  useEffect(() => {
    revealInProgressRef.current = revealInProgress;
  }, [revealInProgress]);

  const currentDealingRoundRef = useRef(0);
  useEffect(() => {
    currentDealingRoundRef.current = currentDealingRound;
  }, [currentDealingRound]);

  const router = useRouter();

  const handleLeaveRoom = () => {
    if (!socket || !roomId) return;

    socket.emit("updateUserStatus", roomId, user?._id, "inactive");
    router.push("/games");

    setShowLeaveModal(false);
  };

  const handleCancelLeave = () => {
    setShowLeaveModal(false);
  };

  const rotatedPlayers = useMemo(() => {
    if (!user || !room) return [];

    // Sort players by ID to ensure consistent order
    const sortedPlayers = [...room.users].sort((a, b) =>
      a.id.localeCompare(b.id),
    );

    const currentUserIndex = sortedPlayers.findIndex(
      (player) => player.id === user._id,
    );

    return [
      ...sortedPlayers.slice(currentUserIndex),
      ...sortedPlayers.slice(0, currentUserIndex),
    ];
  }, [user, room]);

  const handleEmojiSelect = (emoji: string) => {
    if (!socket || !roomId) return;

    console.log("Selected emoji:", emoji);

    socket.emit("sendEmoji", roomId, {
      playerId: user?._id,
      emoji,
    });
  };

  useEffect(() => {
    if (!socket || !roomId) return;

    const handleEmojiPopup = (data: {
      playerId: string;
      emoji: string;
      timestamp: Date;
    }) => {
      setEmojiPopup(data);
      setTimeout(() => {
        setEmojiPopup(null);
      }, 3000);
    };

    socket.on("emojiPopup", handleEmojiPopup);

    return () => {
      socket.off("emojiPopup", handleEmojiPopup);
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("getRoom", roomId);
    socket.on("getRoom", (roomData: Room) => {
      if (roomData.id === roomId) {
        setRoom(roomData);
        setLoading(false);
      }
    });

    socket.on("roomDestroyed", (data: { roomId: string }) => {
      if (data.roomId === roomId) {
        router.push("/games");
      }
    });

    return () => {
      socket.off("getRoom");
      socket.off("roomDestroyed");
    };
  }, [socket, roomId, user, router]);

  useEffect(() => {
    if (!socket || !roomId) return;

    const handleGameInfo = (data: GameInfo) => {
      if (!data || data.roomId !== roomId) return;

      if (
        stateChangeRef.current.lastGameInfo &&
        JSON.stringify(stateChangeRef.current.lastGameInfo) ===
          JSON.stringify(data)
      )
        return;

      stateChangeRef.current.lastGameInfo = data;
      setGameInfo(data);
    };

    socket.emit("getGameInfo", roomId);
    socket.on("getGameInfo", handleGameInfo);

    return () => {
      socket.off("getGameInfo", handleGameInfo);
      stateChangeRef.current.lastGameInfo = null;
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket || !room || !roomId) return;

    if (!room.hasChat) return;

    socket.emit("createChat", roomId);
  }, [socket, room, roomId]);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("getChat", roomId);

    const handleChatUpdate = (data: ChatRoom) => {
      if (data && data.messages) {
        setMessages(data.messages);
        setChat(data);
      }
    };

    socket.on("getChat", handleChatUpdate);

    return () => {
      socket.off("getChat", handleChatUpdate);
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket || !roomId || !user) return;

    const handleMessagePopup = (data: {
      playerId: string;
      message: string;
      timestamp: Date;
    }) => {
      if (data.playerId === user._id) return;

      if (showChat) return;

      setMessagePopups((prev) => {
        const updated = {
          ...prev,
          [data.playerId]: { message: data.message, timestamp: data.timestamp },
        };
        return updated;
      });

      setTimeout(() => {
        setMessagePopups((prev) => ({
          ...prev,
          [data.playerId]: null,
        }));
      }, 5000);
    };

    socket.on("chatMessagePopup", handleMessagePopup);

    return () => {
      socket.off("chatMessagePopup", handleMessagePopup);
    };
  }, [socket, roomId, user, showChat]);

  // useEffect(() => {
  //   if (!socket) return;

  //   const handlePrepare = () => {
  //     setVisibleCards({});
  //     setRevealInProgress(true);
  //   };

  //   const handleStep = (step: {
  //     targetPlayerId: string;
  //     card: PlayingCard;
  //   }) => {
  //     if (!revealInProgressRef.current) return;

  //     const { targetPlayerId, card } = step;
  //     setVisibleCards((prev) => ({
  //       ...prev,
  //       [targetPlayerId]: [...(prev[targetPlayerId] || []), card],
  //     }));
  //   };

  //   const handleDone = () => {
  //     setRevealInProgress(false);
  //   };

  //   socket.on("dealerRevealPrepare", handlePrepare);
  //   socket.on("dealerRevealStep", handleStep);
  //   socket.on("dealerRevealDone", handleDone);

  //   return () => {
  //     socket.off("dealerRevealPrepare", handlePrepare);
  //     socket.off("dealerRevealStep", handleStep);
  //     socket.off("dealerRevealDone", handleDone);
  //   };
  // }, [socket]);

  useEffect(() => {
    if (!socket || !gameInfo) return;

    const onDealCards = (data: {
      hand: PlayingCard[];
      playerId: string;
      round: number;
    }) => {
      if (data.playerId === user?._id) {
        setHand(data.hand);
      }

      const dealerId = gameInfo.dealerId as string | null;
      if (!dealerId || rotatedPlayers.length === 0) return;

      const dealerIndex = rotatedPlayers.findIndex((p) => p.id === dealerId);
      if (dealerIndex === -1) return;
      const starterId =
        rotatedPlayers[(dealerIndex + 1) % rotatedPlayers.length]?.id;

      if (data.playerId !== starterId) return;
      if (dealingLockRef.current) return;

      dealingLockRef.current = true;
      setCurrentDealingRound(0);

      setDealingCards({});

      animateDealing(rotatedPlayers, data.round, dealerId)
        .catch(() => {})
        .finally(() => {
          dealingLockRef.current = false;
        });
    };

    socket.on("dealCards", onDealCards);
    return () => {
      socket.off("dealCards", onDealCards);
    };
  }, [socket, user?._id, rotatedPlayers, gameInfo?.dealerId, gameInfo]);

  useEffect(() => {
    if (!gameInfo || !user) return;
    const playerHand = gameInfo.hands?.find((h) => h.playerId === user._id);
    if (playerHand) {
      if (
        hand.length !== playerHand.hand.length ||
        hand.some((c, i) => c.id !== playerHand.hand[i].id)
      ) {
        setHand(playerHand.hand as PlayingCard[]);
      }
    }
  }, [gameInfo?.hands, user?._id]);

  useEffect(() => {
    if (!gameInfo || !socket) return;

    if (gameInfo.status === "bid" && !gameInfo.scoreBoard) {
      socket.emit("createScoreBoard", roomId);
    }
  }, [gameInfo, socket]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!room) {
        router.push("/games");
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [room, router]);

  useEffect(() => {
    return () => {
      setVisibleCards({});
      visibleRef.current = {};
    };
  }, []);

  const animateDealing = async (
    players: typeof rotatedPlayers,
    targetPerPlayer: number,
    dealerId: string | null,
  ) => {
    if (!dealerId || !socket || !roomId) return;

    const dealerIndex = players.findIndex((p) => p.id === dealerId);

    const dealingOrder = [
      ...players.slice(dealerIndex + 1),
      ...players.slice(0, dealerIndex + 1),
    ];

    for (let round = 1; round <= targetPerPlayer; round++) {
      for (const player of dealingOrder) {
        setDealingCards((prev) => ({
          ...prev,
          [player.id]: round,
        }));

        await new Promise((res) => setTimeout(res, 400));
      }
      setCurrentDealingRound(round);
    }

    socket.emit("dealingAnimationDone", roomId);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader />
      </div>
    );
  }

  if (!room) {
    return (
      <div className={styles.error}>
        <h2>Room not found</h2>
      </div>
    );
  }

  const getBids = (playerId: string) => {
    if (!gameInfo?.handBids) return null;

    const playerBid =
      gameInfo.handBids
        .find((bid) => bid.playerId === playerId)
        ?.bids.find((b) => b.handNumber === gameInfo.handCount)?.bid || 0;

    return playerBid === 0 ? "-" : playerBid;
  };

  const getWins = (playerId: string) => {
    if (!gameInfo?.handWins) return null;

    const playerWin =
      gameInfo.handWins
        .find((win) => win.playerId === playerId)
        ?.wins.find((w) => w.handNumber === gameInfo.handCount)?.win || 0;

    return playerWin === 0 ? "-" : playerWin;
  };

  const findRequestedJokerUser = (playerId: string) => {
    if (!gameInfo || !room) return null;

    const foundUser = room.users.find((user) => user.id === playerId);
    return foundUser;
  };

  const handleOpenChat = (e: React.MouseEvent) => {
    if (!socket || !roomId || !user) return;

    if (!showChat) {
      setShowChat(!showChat);
      socket.emit("toggleChatOpen", roomId, user._id);
    }
  };

  const handleCloseChat = () => {
    if (!socket || !roomId || !user) return;

    if (showChat) {
      socket.emit("toggleChatOpen", roomId, user._id);
      setShowChat(false);
    }
  };

  return (
    <div
      className={styles.game_room}
      onClick={() => {
        setShowEmojiPicker(false);
      }}
    >
      {!isScoreBoardOpen && (
        <button
          className={
            windowSize.width < 1200 || windowSize.height < 700
              ? styles.close_btn_sm
              : styles.close_btn
          }
          onClick={() => setShowLeaveModal(true)}
          // disabled={
          //   gameInfo?.status === "dealing" ||
          //   gameInfo?.status === "trump" ||
          //   gameInfo?.status === "bid"
          // }
        >
          <FaTimesCircle className={styles.close_icon} />
          {windowSize.width >= 1200 && windowSize.height >= 700 && (
            <span>Leave Room</span>
          )}
        </button>
      )}

      <button
        className={styles.scoreBoard_btn}
        onClick={() => setIsScoreBoardOpen(!isScoreBoardOpen)}
      >
        <PiKeyboard className={styles.scoreBoard_icon} />
        <span>Score board</span>
      </button>

      {!room.hasChat && (
        <button
          className={styles.emoji_picker}
          onClick={(e) => {
            e.stopPropagation();
            setShowEmojiPicker(!showEmojiPicker);
          }}
        >
          <BsFillEmojiSunglassesFill className={styles.emoji_icon} />
        </button>
      )}

      {showEmojiPicker && (
        <div
          className={styles.emoji_container}
          onClick={(e) => e.stopPropagation()}
        >
          <Emojis
            onEmojiSelect={handleEmojiSelect}
            setShowPicker={setShowEmojiPicker}
          />
        </div>
      )}

      {room.hasChat && (
        <button
          className={styles.chat_button}
          onClick={(e) => handleOpenChat(e)}
          title="Open Chat"
        >
          <IoChatbubbleEllipsesOutline className={styles.chat_icon} />
          {chat?.unreadMessages &&
            user?._id &&
            chat.unreadMessages[user._id] > 0 && (
              <div className={styles.chat_notification}>
                <span>{chat.unreadMessages[user._id]}</span>
              </div>
            )}
        </button>
      )}

      {showChat && (
        <div
          className={styles.chat_container}
          onClick={(e) => e.stopPropagation()}
        >
          <Chat
            roomId={roomId as string}
            closeChat={handleCloseChat}
            player={
              room?.users?.find(
                (roomUser) => roomUser.id === user?._id,
              ) as RoomUser
            }
            messages={messages}
          />
        </div>
      )}

      {isScoreBoardOpen && (
        <ScoreBoardModal
          roomId={roomId as string}
          hisht={room?.hisht as string}
          scoreBoard={gameInfo?.scoreBoard as ScoreBoard[]}
          roomUsers={room?.users as RoomUser[]}
          closeModal={() => setIsScoreBoardOpen(false)}
        />
      )}

      {gameInfo?.status === "finished" && (
        <FinishedMode
          users={room?.users as RoomUser[]}
          roomId={roomId as string}
          scoreBoard={gameInfo?.scoreBoard as ScoreBoard[]}
          user={user as { _id: string }}
        />
      )}

      {room?.users?.find((roomUser) => roomUser.id === user?._id)?.status ===
        "busy" && gameInfo?.status !== "finished" ? (
        <BusyBg
          roomId={room?.id}
          userId={user?._id as string}
          setShowLeaveModal={setShowLeaveModal}
        />
      ) : null}

      {showLeaveModal && (
        <LeaveRoomModal
          onConfirm={handleLeaveRoom}
          onCancel={handleCancelLeave}
        />
      )}

      {gameInfo?.status === "choosingTrump" &&
        gameInfo?.currentPlayerId === user?._id &&
        !gameInfo?.trumpCard && <TrumpModal roomId={roomId as string} />}

      {gameInfo?.status === "playing" &&
        gameInfo?.currentPlayerId === user?._id &&
        gameInfo?.playedCards?.length !== 4 && (
          <UserTurnPopup username={user?.username as string} />
        )}

      {gameInfo?.playedCards &&
        gameInfo?.playedCards.length > 0 &&
        gameInfo?.playedCards[0].card?.joker &&
        gameInfo?.playedCards[0].playerId !== user?._id && (
          <JokerPopup
            username={
              findRequestedJokerUser(gameInfo?.playedCards[0].playerId)
                ?.username as string
            }
            sute={(() => {
              const requested = gameInfo?.playedCards?.[0].card?.requestedSuit;
              const trump = gameInfo?.trumpCard?.suit;

              const isRealSuit = (s?: string) =>
                s === "hearts" ||
                s === "diamonds" ||
                s === "clubs" ||
                s === "spades";

              if (isRealSuit(trump) && requested === trump) return "trump";
              if (requested === "pass") return "no trump";
              return requested || "";
            })()}
            type={gameInfo?.playedCards[0].card?.type as string}
          />
        )}

      {gameInfo && (
        <>
          <Table
            gameInfo={gameInfo}
            user={user}
            room={room}
            visibleCards={visibleCards}
            rotatedPlayers={rotatedPlayers as RoomUser[]}
            dealingCards={dealingCards}
            socket={socket}
          />

          <Players
            rotatedPlayers={rotatedPlayers as RoomUser[]}
            user={user as { _id: string }}
            gameInfo={
              gameInfo as {
                status: string;
                currentPlayerId: string;
                dealerId: string;
                players: string[];
                handBids: HandBid[];
                currentHand: number | null;
                hands: { hand: PlayingCard[]; playerId: string }[] | null;
                trumpCard: PlayingCard | null;
              } | null
            }
            room={room}
            hand={hand}
            getBids={getBids as (playerId: string) => number | undefined}
            getWins={getWins as (playerId: string) => number | undefined}
            messagePopups={messagePopups}
            showChat={showChat}
            emojiPopup={
              emojiPopup as {
                playerId: string;
                emoji: string;
                timestamp: Date;
              } | null
            }
          />
        </>
      )}
    </div>
  );
};

export default GameRoom;
