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
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
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
import { soundManager } from "@/utils/sounds";
import SoundControl from "@/components/gameRoom/SoundControl";
import useSoundStore from "@/store/soundStore";
import useUserMetaStore from "@/store/user/userMetaStore";
import { useTranslations } from "next-intl";
import { useDeckImages } from "@/hooks/useDeckImages";
import { DeckProvider } from "@/context/DeckContext";

const GameRoom: React.FC = () => {
  const t = useTranslations("RoomPage");

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

  const [timerData, setTimerData] = useState<{
    duration: number;
    startedAt: number;
    sourceStartedAt: number;
    playerId: string;
    type: string;
  } | null>(null);
  const [timerProgress, setTimerProgress] = useState(0);
  const timerAnimRef = useRef<number | null>(null);

  const [revealInProgress, setRevealInProgress] = useState(false);
  const [currentDealingRound, setCurrentDealingRound] = useState(0);

  const visibleRef = useRef<Record<string, PlayingCard[]>>({});
  const dealingLockRef = useRef(false);

  const windowSize = useWindowSize();
  const { toggleSlider } = useSoundStore();
  const { toggleMetaVisibility } = useUserMetaStore();

  const stateChangeRef = useRef<{
    lastGameInfo: string | null;
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
    router.push("/rooms");

    setShowLeaveModal(false);
  };

  const createClientTimerData = ({
    duration,
    sourceStartedAt,
    playerId,
    type,
  }: {
    duration: number;
    sourceStartedAt?: number;
    playerId?: string;
    type?: string;
  }) => ({
    duration,
    startedAt: Date.now(),
    sourceStartedAt: sourceStartedAt ?? Date.now(),
    playerId: playerId ?? "",
    type: type ?? "playing",
  });

  const handleCancelLeave = () => {
    setShowLeaveModal(false);
  };

  const rotatedPlayers = useMemo(() => {
    if (!user || !room) return [];

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

  const deck = useDeckImages(room?.selectedDeckId);

  const handleEmojiSelect = (emoji: string) => {
    if (!socket || !roomId) return;

    socket.emit("sendEmoji", roomId, {
      playerId: user?._id,
      emoji,
    });
  };

  // Effect to handle incoming emoji popups
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

  // Re-request all game state on socket reconnection (e.g. after idle disconnect)
  useEffect(() => {
    if (!socket || !roomId) return;

    const handleReconnect = () => {
      socket.emit("getRoom", roomId);
      socket.emit("getGameInfo", roomId);
    };

    socket.io.on("reconnect", handleReconnect);

    return () => {
      socket.io.off("reconnect", handleReconnect);
    };
  }, [socket, roomId]);

  // Effect to get room data and listen for updates
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
        router.push("/rooms");
      }
    });

    return () => {
      socket.off("getRoom");
      socket.off("roomDestroyed");
    };
  }, [socket, roomId, user, router]);

  // Effect to get game info and listen for updates
  useEffect(() => {
    if (!socket || !roomId) return;

    const handleGameInfo = (data: GameInfo) => {
      if (!data || data.roomId !== roomId) return;

      const serialized = JSON.stringify(data);
      if (stateChangeRef.current.lastGameInfo === serialized) return;

      stateChangeRef.current.lastGameInfo = serialized;
      setGameInfo(data);
    };

    socket.on("getGameInfo", handleGameInfo);
    socket.emit("getGameInfo", roomId);

    return () => {
      socket.off("getGameInfo", handleGameInfo);
    };
  }, [socket, roomId]);

  // Effect to Create Chat if enabled for the room
  useEffect(() => {
    if (!socket || !room || !roomId) return;

    if (!room.hasChat) return;

    socket.emit("createChat", roomId);
  }, [socket, room, roomId]);

  // Effect to get chat messages and Set Chat data
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

  // Effect to handle incoming chat message popups
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

  // Effect to handle dealer reveal socket events
  useEffect(() => {
    if (!socket || !roomId || !user?._id) return;

    const handlePrepare = () => {
      setVisibleCards({});
      setRevealInProgress(true);
    };

    const handleStep = (step: {
      targetPlayerId: string;
      card: PlayingCard;
    }) => {
      if (!revealInProgressRef.current) return;

      soundManager.play("dealerReveal");

      const { targetPlayerId, card } = step;
      setVisibleCards((prev) => ({
        ...prev,
        [targetPlayerId]: [...(prev[targetPlayerId] || []), card],
      }));
    };

    const handleDone = () => {
      setRevealInProgress(false);
    };

    socket.on("dealerRevealPrepare", handlePrepare);
    socket.on("dealerRevealStep", handleStep);
    socket.on("dealerRevealDone", handleDone);

    socket.emit("roomReady", roomId, user._id);

    return () => {
      socket.off("dealerRevealPrepare", handlePrepare);
      socket.off("dealerRevealStep", handleStep);
      socket.off("dealerRevealDone", handleDone);
    };
  }, [socket, roomId, user?._id]);

  // Effect to handle timer start and expiration events
  useEffect(() => {
    if (!socket) return;

    const stopAnim = () => {
      if (timerAnimRef.current) {
        cancelAnimationFrame(timerAnimRef.current);
        timerAnimRef.current = null;
      }
    };

    const onTimerStarted = (data: {
      remainingTime?: number;
      timer?: {
        duration?: number;
        startTime?: number;
        playerId?: string;
        type?: string;
      };
    }) => {
      stopAnim();
      setTimerProgress(0);
      setTimerData(
        createClientTimerData({
          duration: data.remainingTime ?? data.timer?.duration ?? 20,
          sourceStartedAt: data.timer?.startTime,
          playerId: data.timer?.playerId,
          type: data.timer?.type,
        }),
      );
    };

    const onTimerExpired = () => {
      stopAnim();
      setTimerData(null);
      setTimerProgress(0);
    };

    socket.on("timerStarted", onTimerStarted);
    socket.on("timerExpired", onTimerExpired);

    return () => {
      stopAnim();
      socket.off("timerStarted", onTimerStarted);
      socket.off("timerExpired", onTimerExpired);
    };
  }, [socket]);

  // Effect to handle timer animation
  useEffect(() => {
    if (!timerData) {
      setTimerProgress(0);
      return;
    }

    const { duration, startedAt } = timerData;
    const durationMs = duration * 1000;

    const animate = () => {
      const elapsed = Math.max(0, Date.now() - new Date(startedAt).getTime());
      const progress = Math.min(1, elapsed / durationMs);
      setTimerProgress(progress);

      if (progress < 1) {
        timerAnimRef.current = requestAnimationFrame(animate);
      }
    };

    if (timerAnimRef.current) {
      cancelAnimationFrame(timerAnimRef.current);
      timerAnimRef.current = null;
    }

    timerAnimRef.current = requestAnimationFrame(animate);

    return () => {
      if (timerAnimRef.current) {
        cancelAnimationFrame(timerAnimRef.current);
        timerAnimRef.current = null;
      }
    };
  }, [timerData]);

  // Timer data listener - separate from animation
  useEffect(() => {
    if (!socket) return;

    const handleTimer = (data: {
      duration: number;
      startedAt: number;
      playerId: string;
      type: string;
    }) => {
      if (!data) return;

      setTimerData((prev) => {
        if (
          prev &&
          prev.playerId === data.playerId &&
          prev.type === data.type &&
          prev.sourceStartedAt === data.startedAt &&
          prev.duration === data.duration
        ) {
          return prev;
        }

        const elapsedSeconds = Math.max(
          0,
          (Date.now() - data.startedAt) / 1000,
        );
        const remainingDuration = Math.max(0, data.duration - elapsedSeconds);

        return createClientTimerData({
          duration: remainingDuration,
          sourceStartedAt: data.startedAt,
          playerId: data.playerId,
          type: data.type,
        });
      });
    };

    socket.on("timer", handleTimer);

    return () => {
      socket.off("timer", handleTimer);
    };
  }, [socket]);

  // Effect to clean up timer animation on certain game state changes
  useEffect(() => {
    const status = gameInfo?.status;

    if (status === "dealing" || status === "waiting" || status === "finished") {
      setTimerData(null);
    }
  }, [gameInfo?.status]);

  const gameInfoRef = useRef(gameInfo);
  useEffect(() => {
    gameInfoRef.current = gameInfo;
  }, [gameInfo]);

  const rotatedPlayersRef = useRef(rotatedPlayers);
  useEffect(() => {
    rotatedPlayersRef.current = rotatedPlayers;
  }, [rotatedPlayers]);

  // Effect to handle dealing card socket events
  useEffect(() => {
    if (!socket) return;

    // Function to Animate dealing cards to players
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
          soundManager.play("dealCard");

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

    const onDealCards = (data: {
      hand: PlayingCard[];
      playerId: string;
      round: number;
    }) => {
      const gi = gameInfoRef.current;
      const players = rotatedPlayersRef.current;
      const dealerId = gi?.dealerId as string | null;
      if (!dealerId || players.length === 0) return;

      const dealerIndex = players.findIndex((p) => p.id === dealerId);
      if (dealerIndex === -1) return;
      const starterId = players[(dealerIndex + 1) % players.length]?.id;

      const isMyCard = data.playerId === user?._id;
      const isAnimationTrigger = data.playerId === starterId;

      // Set the hand immediately only when we are NOT the one triggering the
      // animation (if we are, hand is revealed after animation to avoid
      // showing all cards before the dealing animation reaches us).
      if (isMyCard && !isAnimationTrigger) {
        setHand(data.hand);
      }

      if (!isAnimationTrigger) return;
      if (dealingLockRef.current) return;

      // Capture our hand now so we can reveal it after the animation.
      const pendingHand: PlayingCard[] | null = isMyCard ? data.hand : null;

      dealingLockRef.current = true;
      setCurrentDealingRound(0);
      setDealingCards({});

      animateDealing(players, data.round, dealerId)
        .then(() => {
          if (pendingHand) {
            // Trump chooser: reveal their cards after animation completes.
            setHand(pendingHand);
          } else if (user?._id) {
            // We're not the trump chooser: sync from latest game state.
            const latestHand = gameInfoRef.current?.hands?.find(
              (h: { playerId: string }) => h.playerId === user._id,
            );
            if (latestHand) setHand(latestHand.hand as PlayingCard[]);
          }
        })
        .catch(() => {})
        .finally(() => {
          dealingLockRef.current = false;
        });
    };

    socket.on("dealCards", onDealCards);
    return () => {
      socket.off("dealCards", onDealCards);
    };
  }, [socket, user?._id, roomId]);

  // Effect to handle setting newHand after dealing is done
  useEffect(() => {
    if (!gameInfo?.hands || !user?._id) return;
    // Don't update hand mid-animation — animateDealing's .then() callback
    // handles the reveal for the trump chooser once animation completes.
    if (dealingLockRef.current) return;
    const playerHand = gameInfo.hands?.find((h) => h.playerId === user._id);
    if (!playerHand) return;

    const newHand = playerHand.hand as PlayingCard[];

    setHand((prev) => {
      if (prev.length !== newHand.length) return newHand;
      const changed = prev.some((c, i) => c.id !== newHand[i]?.id);
      return changed ? newHand : prev;
    });
  }, [gameInfo?.hands, user?._id]);

  // Effect to handle leaving room if no room
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!room) {
        router.push("/rooms");
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [room, router]);

  // Effect to clean up visible cards on unmount
  useEffect(() => {
    return () => {
      setVisibleCards({});
      visibleRef.current = {};
    };
  }, []);

  if (loading) {
    return <Loader fullPage />;
  }

  if (!room) {
    return (
      <div className={styles.error}>
        <h2>{t("error")}</h2>
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

  const handleOpenChat = () => {
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

  console.log("gameInfo", gameInfo);

  return (
    <div
      className={styles.game_room}
      onClick={() => {
        setShowEmojiPicker(false);
        toggleSlider(false);
        toggleMetaVisibility(false);
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
          disabled={
            gameInfo?.status === "dealing" ||
            gameInfo?.status === "trump" ||
            gameInfo?.status === "bid" ||
            gameInfo?.status === "choosingTrump"
          }
        >
          <FaTimesCircle className={styles.close_icon} />
          {windowSize.width >= 1200 && windowSize.height >= 700 && (
            <span>{t("leave")}</span>
          )}
        </button>
      )}

      <button
        className={
          gameInfo?.status === "finished"
            ? styles.scoreBoard_btn_finished
            : styles.scoreBoard_btn
        }
        onClick={() => setIsScoreBoardOpen(!isScoreBoardOpen)}
      >
        <PiKeyboard className={styles.scoreBoard_icon} />
        <span>{t("scoreboard")}</span>
      </button>

      <div className={styles.sound_control_container}>
        <SoundControl />
      </div>

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
          onClick={handleOpenChat}
          title={t("chat")}
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
          bet={room?.bet as string}
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
        <DeckProvider value={deck}>
          <Table
            gameInfo={gameInfo}
            user={user}
            room={room}
            visibleCards={visibleCards}
            rotatedPlayers={rotatedPlayers as RoomUser[]}
            dealingCards={dealingCards}
            socket={socket}
          >
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
              timerData={timerData}
              timerProgress={timerProgress}
            />
          </Table>
        </DeckProvider>
      )}
    </div>
  );
};

export default GameRoom;
