"use client";

import styles from "./page.module.scss";
import { FaCrown, FaTimesCircle } from "react-icons/fa";
import Image from "next/image";
import { GameInfo, PlayingCard, Room } from "@/utils/interfaces";
import useUserStore from "@/store/user/userStore";
import useSocket from "@/hooks/useSocket";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/loaders/Loader";
import { substringText } from "@/utils/misc";
import LeaveRoomModal from "@/components/gameRoom/leaveRoomModal/LeaveRoomModal";
import GameRounds from "@/components/gameRoom/gameControls/gameRounds/GameRounds";
import DrawnCards from "@/components/gameRoom/gameControls/drawnCards/DrawnCards";
import { motion } from "framer-motion";
import DealtCards from "@/components/gameRoom/gameControls/dealtCards/DealtCards";
import CardDeck from "@/components/gameRoom/gameControls/cardDeck/CardDeck";

const GameRoom: React.FC = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const { roomId } = useParams();
  const socket = useSocket();
  const { user } = useUserStore();
  const [hand, setHand] = useState<PlayingCard[]>([]);
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);

  const [revealInProgress, setRevealInProgress] = useState(false);
  const [initialLiadComplete, setInitialLiadComplete] = useState(false);

  const visibleRef = useRef<Record<string, PlayingCard[]>>({});
  const animationStarted = useRef(false);

  const [dealingCards, setDealingCards] = useState<Record<string, number>>({});

  const [visibleCards, setVisibleCards] = useState<
    Record<string, PlayingCard[]>
  >({});
  const [dealerId, setDealerId] = useState<string | null>(null);

  const router = useRouter();

  const handleLeaveRoom = () => {
    if (socket && room && roomId) {
      animationStarted.current = false;

      if (room.users.length === 1) {
        socket.emit("destroyRoom", roomId);
      } else {
        socket.emit("leaveRoom", roomId, user?._id);
      }

      router.push("/games");
    }
    setShowLeaveModal(false);
  };

  const handleCancelLeave = () => {
    setShowLeaveModal(false);
  };

  const rotatedPlayers = useMemo(() => {
    if (!user || !room) return [];

    // Sort players by ID to ensure consistent order
    const sortedPlayers = [...room.users].sort((a, b) =>
      a.id.localeCompare(b.id)
    );

    const currentUserIndex = sortedPlayers.findIndex(
      (player) => player.id === user._id
    );

    return [
      ...sortedPlayers.slice(currentUserIndex),
      ...sortedPlayers.slice(0, currentUserIndex),
    ];
  }, [user, room]);

  useEffect(() => {
    if (!socket || !roomId) return;

    const handleGameInfo = (data: GameInfo) => {
      if (data.roomId !== roomId) return;
      setGameInfo(data);
    };

    socket.emit("getGameInfo", roomId);
    socket.on("getGameInfo", handleGameInfo);

    return () => {
      socket.off("getGameInfo", handleGameInfo);
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket) return;

    const handlePrepare = () => {
      setRevealInProgress(true);
      setVisibleCards({});
      visibleRef.current = {};
      setInitialLiadComplete(false);
    };

    const handleStep = (step: {
      targetPlayerId: string;
      card: PlayingCard;
    }) => {
      if (!revealInProgress) return;

      const { targetPlayerId, card } = step;

      setVisibleCards((prev) => {
        const currentCards = prev[targetPlayerId] || [];
        return {
          ...prev,
          [targetPlayerId]: [...currentCards, card],
        };
      });

      if (!initialLiadComplete) {
        setTimeout(() => setInitialLiadComplete(true), 300);
      }
    };

    const handleDone = ({ dealerId }: { dealerId: string }) => {
      setDealerId(dealerId);
      setRevealInProgress(false);
      animationStarted.current = false;
      setInitialLiadComplete(true);
      socket.emit("updateGameInfo", roomId, {
        dealerId,
        status: "waiting",
      });
    };

    socket.on("dealerRevealPrepare", handlePrepare);
    socket.on("dealerRevealStep", handleStep);
    socket.on("dealerRevealDone", handleDone);

    return () => {
      socket.off("dealerRevealPrepare", handlePrepare);
      socket.off("dealerRevealStep", handleStep);
      socket.off("dealerRevealDone", handleDone);
    };
  }, [socket, revealInProgress, initialLiadComplete]);

  useEffect(() => {
    if (!socket || !roomId || !gameInfo || !room || !user) return;

    const sortedPlayers = [...room.users].sort((a, b) =>
      a.id.localeCompare(b.id)
    );
    const isInitiator = sortedPlayers[0]?.id === user._id;

    let timeout: NodeJS.Timeout;

    if (gameInfo.status === "dealing" && !gameInfo.dealerId && isInitiator) {
      timeout = setTimeout(() => {
        socket?.emit("determineDealer", roomId);
      }, 1500);
    }

    if (
      gameInfo.status === "dealing" &&
      gameInfo.dealerId &&
      gameInfo.currentHand &&
      isInitiator
    ) {
      timeout = setTimeout(() => {
        socket?.emit("startRound", roomId, gameInfo.currentHand);
      }, 1500);
    }

    if (
      gameInfo.status === "trump" &&
      gameInfo.dealerId &&
      gameInfo.currentHand
    ) {
      timeout = setTimeout(() => {
        socket?.emit("getTrumpCard", roomId);
      }, 2000);
    }

    return () => {
      clearTimeout(timeout);
      socket.off("determineDealer");
      socket.off("startRound");
      socket.off("getTrumpCard");
    };
  }, [gameInfo, socket, roomId, room, user]);

  useEffect(() => {
    if (!socket || !gameInfo) return;

    socket?.on(
      "dealCards",
      (data: { hand: PlayingCard[]; playerId: string; round: number }) => {
        if (data.playerId === user?._id) {
          setHand(data.hand);
        }

        animateDealing(rotatedPlayers, data.round, gameInfo?.dealerId);
      }
    );

    return () => {
      socket.off("dealCards");
    };
  }, [socket, user, rotatedPlayers, gameInfo]);

  useEffect(() => {
    if (!socket || !gameInfo || !user) return;

    if (!hand.length && gameInfo.hands?.length) {
      const playerHand = gameInfo.hands.find(
        (hand) => hand.playerId === user?._id
      );
      if (playerHand) {
        setHand(playerHand.hand as PlayingCard[]);
      }
    }
  }, [socket, gameInfo, user]);

  useEffect(() => {
    if (!socket || !gameInfo) return;

    let timeout: NodeJS.Timeout;

    if (gameInfo?.status === "waiting") {
      timeout = setTimeout(() => {
        socket.emit("updateGameInfo", roomId, {
          status: "dealing",
          currentHand:
            gameInfo.currentHand === null ? 1 : gameInfo.currentHand + 1,
        });
      }, 2000);
    }

    return () => {
      clearTimeout(timeout);
      socket.off("updateGameInfo");
    };
  }, [socket, gameInfo, roomId]);

  useEffect(() => {
    if (!socket || !gameInfo) return;

    let timeout: NodeJS.Timeout;

    if (gameInfo?.trumpCard && gameInfo.status === "trump") {
      timeout = setTimeout(() => {
        socket?.emit("updateGameInfo", roomId, {
          status: "playing",
        });
      }, 1000);
    }

    return () => {
      clearTimeout(timeout);
      socket.off("updateGameInfo");
    };
  }, [socket, gameInfo, roomId]);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("getRoom", roomId);
    socket.on("getRoom", (roomData: Room) => {
      if (roomData.id === roomId) {
        setRoom(roomData);
        setLoading(false);
      }
    });

    return () => {
      socket.off("getRoom");
    };
  }, [socket, roomId, user]);

  useEffect(() => {
    return () => {
      setVisibleCards({});
      visibleRef.current = {};
    };
  }, []);

  const handleStartRound = () => {
    if (!socket || !room) return;
    // socket?.emit("startRound", room?.id, 9);
    socket?.emit("determineDealer", room?.id);
  };

  const animateDealing = async (
    players: typeof rotatedPlayers,
    cardsPerPlayer: number,
    dealerId: string | null
  ) => {
    if (!dealerId || !socket || !roomId || !gameInfo) return;

    const dealingState: Record<string, number> = {};
    const dealerIndex = players.findIndex((p) => p.id === dealerId);

    const nextDealerIndex = (dealerIndex + 1) % players.length;
    const nextDealerId = players[nextDealerIndex]?.id || dealerId;

    const dealingOrder = [
      ...players.slice(dealerIndex + 1),
      ...players.slice(0, dealerIndex + 1),
    ];

    for (let i = 0; i < cardsPerPlayer; i++) {
      for (let player of dealingOrder) {
        dealingState[player.id] = (dealingState[player.id] || 0) + 1;
        setDealingCards({ ...dealingState });
        await new Promise((res) => setTimeout(res, 600));
      }
    }

    setTimeout(() => {
      socket.emit("updateGameInfo", roomId, {
        status: "trump",
      });
    }, 1000);
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

  const getPlayerPosition = (index: number) => {
    switch (index) {
      case 0:
        return styles.bottom;
      case 1:
        return styles.left;
      case 2:
        return styles.top;
      case 3:
        return styles.right;
      default:
        return "";
    }
  };

  console.log(gameInfo);

  return (
    <div className={styles.game_room}>
      <button
        className={styles.close_btn}
        onClick={() => setShowLeaveModal(true)}
        disabled={revealInProgress}
      >
        <FaTimesCircle className={styles.close_icon} />
        <span>Leave Room</span>
      </button>

      {showLeaveModal && (
        <LeaveRoomModal
          onConfirm={handleLeaveRoom}
          onCancel={handleCancelLeave}
        />
      )}

      <div className={styles.table}>
        <button className={styles.start_btn} onClick={handleStartRound}>
          Start Round
        </button>
        <span className={styles.hisht}>Hisht: {room?.hisht}</span>
        <div className={styles.table_surface}>
          <div className={styles.game_wrapper}>
            <CardDeck gameInfo={gameInfo} />
            {rotatedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`${styles.drawn_card} ${getPlayerPosition(
                  index
                )}_drawn_card`}
              >
                {!gameInfo?.dealerId && (
                  <DrawnCards
                    drawnCards={visibleCards[player.id] || []}
                    playerPositionIndex={index}
                  />
                )}

                {gameInfo?.dealerId && gameInfo?.status === "dealing" && (
                  <DealtCards
                    dealingCards={dealingCards}
                    playerPositionIndex={index}
                    playerId={player.id}
                  />
                )}
              </div>
            ))}
          </div>
          <div className={styles.game_info}>
            <span className={styles.game_type}>{room?.type}</span>
          </div>
        </div>
      </div>

      {rotatedPlayers.map((player, index) => (
        <div
          key={player.id}
          className={`${styles.player} ${getPlayerPosition(index)}`}
        >
          {player.id === user?._id && gameInfo?.status === "playing" && (
            <GameRounds hand={hand} />
          )}
          <div
            className={styles.player_info}
            title={player.username.length > 10 ? player.username : undefined}
          >
            <div className={styles.avatar_container}>
              <Image
                src={player.avatar || "/avatars/avatar-1.jpeg"}
                alt={player.username}
                width={80}
                height={80}
                className={styles.avatar}
              />
              {index === 0 && <FaCrown className={styles.crown} />}
            </div>
            <div className={styles.name}>
              <span className={styles.username}>
                {substringText(player.username, 8)}
              </span>
              {player.id === user?._id && (
                <span className={styles.you}>You</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameRoom;
