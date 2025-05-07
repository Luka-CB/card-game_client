"use client";

import styles from "./page.module.scss";
import { FaTimesCircle } from "react-icons/fa";
import {
  GameInfo,
  PlayingCard,
  Room,
  RoomUser,
  ScoreBoard,
} from "@/utils/interfaces";
import useUserStore from "@/store/user/userStore";
import useSocket from "@/hooks/useSocket";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/loaders/Loader";
import LeaveRoomModal from "@/components/gameRoom/leaveRoomModal/LeaveRoomModal";
import Popup from "@/components/popup/Popup";
import useWindowSize from "@/hooks/useWindowSize";
import Players from "@/components/gameRoom/gameBoard/players/Players";
import Table from "@/components/gameRoom/gameBoard/table/Table";
import BusyBg from "@/components/gameRoom/busyMode/BusyBg";

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

  const router = useRouter();

  const handleLeaveRoom = () => {
    if (socket && room && roomId) {
      animationStarted.current = false;

      const activeUsers = room.users.filter(
        (user) => user.status === "active" || user.status === "busy"
      );

      if (activeUsers?.length === 1) {
        socket.emit("destroyRoom", roomId);
      } else {
        socket.emit("updateUserStatus", roomId, user?._id, "inactive");
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
    if (!socket || !roomId || !room) return;

    if (gameInfo?.scoreBoard) return;

    const players =
      room?.users.map((user) => ({
        playerId: user.id,
        playerName: user.username,
      })) || [];

    if (players.length) {
      socket.emit("updateGameScoreBoard", roomId, players);
    }

    return () => {
      socket.off("updateGameScoreBoard");
    };
  }, [socket, roomId, room, gameInfo]);

  useEffect(() => {
    if (!socket || !roomId) return;

    const handleGameInfo = (data: GameInfo) => {
      if (data.roomId !== roomId) return;

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

    return () => {
      clearTimeout(timeout);
      socket.off("determineDealer");
      socket.off("startRound");
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
      }, 1000);
    }

    return () => {
      clearTimeout(timeout);
      socket.off("updateGameInfo");
    };
  }, [socket, gameInfo, roomId]);

  useEffect(() => {
    if (!socket || !gameInfo || !roomId) return;

    let timeout: NodeJS.Timeout;

    if (
      gameInfo.status === "trump" &&
      !gameInfo.trumpCard &&
      !stateChangeRef.current.isProcessing
    ) {
      stateChangeRef.current.isProcessing = true;

      timeout = setTimeout(() => {
        socket?.emit("getTrumpCard", roomId);
      }, 1500);
    }

    return () => {
      clearTimeout(timeout);
      stateChangeRef.current.isProcessing = false;
      socket.off("updateGameInfo");
    };
  }, [socket, gameInfo, roomId]);

  useEffect(() => {
    if (!socket || !gameInfo) return;

    let timeout: NodeJS.Timeout;

    if (
      gameInfo?.trumpCard &&
      gameInfo.status === "trump" &&
      !stateChangeRef.current.isProcessing
    ) {
      stateChangeRef.current.isProcessing = true;

      timeout = setTimeout(() => {
        socket?.emit("updateGameInfo", roomId, {
          status: "bid",
        });
      }, 1500);
    }

    return () => {
      clearTimeout(timeout);
      socket.off("updateGameInfo");
      stateChangeRef.current.isProcessing = false;
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

  const animateDealing = async (
    players: typeof rotatedPlayers,
    cardsPerPlayer: number,
    dealerId: string | null
  ) => {
    if (!dealerId || !socket || !roomId || !gameInfo) return;

    const dealingState: Record<string, number> = {};
    const dealerIndex = players.findIndex((p) => p.id === dealerId);

    const nextPlayerIndex = (dealerIndex + 1) % players.length;
    const nextPlayerId = players[nextPlayerIndex].id;

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
        activePlayerIndex: nextPlayerIndex,
        activePlayerId: nextPlayerId,
        players: players.map((player) => player.id),
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

  const getBids = (playerId: string) => {
    if (!gameInfo?.scoreBoard) return null;

    const playerScore = gameInfo.scoreBoard.find(
      (score) => score.playerId === playerId
    );

    if (!playerScore || !playerScore.scores) return null;

    const currentHand = gameInfo.currentHand || 0;
    const currentBid =
      playerScore.scores.find((score) => score.gameHand === currentHand)?.bid ||
      0;

    return currentBid === 0 ? "-" : currentBid;
  };

  return (
    <div className={styles.game_room}>
      {windowSize.width < 1200 && windowSize.height < 700 ? (
        <button
          className={styles.close_btn_sm}
          onClick={() => setShowLeaveModal(true)}
          disabled={
            gameInfo?.status === "dealing" ||
            gameInfo?.status === "trump" ||
            gameInfo?.status === "bid"
          }
        >
          <FaTimesCircle className={styles.close_icon} />
        </button>
      ) : (
        <button
          className={styles.close_btn}
          onClick={() => setShowLeaveModal(true)}
          disabled={
            gameInfo?.status === "dealing" ||
            gameInfo?.status === "trump" ||
            gameInfo?.status === "bid"
          }
        >
          <FaTimesCircle className={styles.close_icon} />
          <span>Leave Room</span>
        </button>
      )}

      {room?.users?.find((roomUser) => roomUser.id === user?._id)?.status ===
      "busy" ? (
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

      {gameInfo?.status === "bid" && gameInfo?.activePlayerId === user?._id && (
        <Popup primaryText="It's your turn" secondaryText={user?.username} />
      )}

      <Table
        gameInfo={gameInfo}
        user={user}
        room={room}
        visibleCards={visibleCards}
        rotatedPlayers={rotatedPlayers as RoomUser[]}
        dealingCards={dealingCards}
      />

      <Players
        rotatedPlayers={rotatedPlayers as RoomUser[]}
        user={user as { _id: string }}
        gameInfo={
          gameInfo as {
            status: string;
            activePlayerId: string;
            activePlayerIndex: number;
            dealerId: string;
            scoreBoard: ScoreBoard[];
            players: string[];
            currentHand: number | null;
            hands: { hand: PlayingCard[]; playerId: string }[] | null;
            trumpCard: PlayingCard | null;
          } | null
        }
        room={room}
        hand={hand}
        getBids={getBids as (playerId: string) => number | undefined}
      />
    </div>
  );
};

export default GameRoom;
