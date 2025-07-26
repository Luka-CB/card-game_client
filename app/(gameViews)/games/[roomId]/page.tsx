"use client";

import styles from "./page.module.scss";
import { FaTimesCircle } from "react-icons/fa";
import { PiKeyboard } from "react-icons/pi";
import {
  HandBid,
  GameInfo,
  PlayingCard,
  Room,
  RoomUser,
  ScoreBoard,
  HandWin,
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
import { wait } from "@/utils/misc";
import ScoreBoardModal from "@/components/gameRoom/scoreBoard/ScoreBoard";

const GameRoom: React.FC = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const { roomId } = useParams();
  const socket = useSocket();
  const { user } = useUserStore();
  const [hand, setHand] = useState<PlayingCard[]>([]);
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [isChoosingTrump, setIsChoosingTrump] = useState(false);
  const [isScoreBoardOpen, setIsScoreBoardOpen] = useState(false);

  const [revealInProgress, setRevealInProgress] = useState(false);
  const [initialLiadComplete, setInitialLiadComplete] = useState(false);
  const [currentDealingRound, setCurrentDealingRound] = useState(0);
  const [trumpSelectionActive, setTrumpSelectionActive] = useState(false);
  const [nextPlayerId, setNextPlayerId] = useState<string | null>(null);

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

  const processingRef = useRef<{ [key: string]: boolean }>({});

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
    if (!socket || !roomId || !gameInfo || !user || !room) return;

    const handleGameStatus = async () => {
      const { status, dealerId, currentHand, trumpCard, handCount } = gameInfo;

      const sortedPlayers = [...room.users].sort((a, b) =>
        a.id.localeCompare(b.id)
      );
      const isInitiator = sortedPlayers[0]?.id === user._id;

      if (processingRef.current[status]) return;
      processingRef.current[status] = true;

      switch (status) {
        case "waiting":
          setCurrentDealingRound(0);
          setDealingCards({});
          setTrumpSelectionActive(false);
          setIsChoosingTrump(false);
          setHand([]);

          if (isInitiator) {
            await wait(1000);

            let handNum;

            if (handCount && currentHand) {
              if (handCount >= 1 && handCount <= 8) {
                handNum = currentHand + 1;
              } else if (handCount > 8 && handCount <= 12) {
                handNum = 9;
              } else if (handCount > 12 && handCount <= 20) {
                handNum = currentHand - 1;
              } else {
                handNum = 9;
              }
            } else {
              handNum = 5;
            }

            socket.emit("updateGameInfo", roomId, {
              status: "dealing",
              currentHand: handNum,
            });
          }
          break;
        case "dealing":
          if (!dealerId && isInitiator) {
            await wait(1500);
            socket.emit("determineDealer", roomId);
          }

          if (dealerId && currentHand && isInitiator) {
            await wait(1500);
            socket.emit("startRound", roomId, currentHand);
          }
          break;
        case "trump":
          if (!trumpCard && isInitiator) {
            await wait(1500);
            socket.emit("getTrumpCard", roomId);
          }

          if (trumpCard && isInitiator) {
            await wait(1500);
            socket.emit("updateGameInfo", roomId, {
              status: "bid",
            });
          }
          break;

        default:
          break;
      }

      processingRef.current[status] = false;
    };

    handleGameStatus();
  }, [socket, roomId, gameInfo, room, user]);

  useEffect(() => {
    if (!socket || !gameInfo) return;

    socket?.on(
      "dealCards",
      (data: { hand: PlayingCard[]; playerId: string; round: number }) => {
        if (data.playerId === user?._id) {
          if (!hand.length) {
            setHand(data.hand);
          }
        }

        animateDealing(rotatedPlayers, data.round, gameInfo?.dealerId);
      }
    );

    return () => {
      socket.off("dealCards");
    };
  }, [socket, user, rotatedPlayers, gameInfo]);

  useEffect(() => {
    if (!gameInfo || !user) return;

    if (
      !hand.length &&
      gameInfo.hands?.length &&
      gameInfo.status !== "dealing"
    ) {
      const playerHand = gameInfo.hands.find(
        (hand) => hand.playerId === user?._id
      );
      if (playerHand) {
        setHand(playerHand.hand as PlayingCard[]);
      }
    }
  }, [gameInfo, user, hand.length]);

  useEffect(() => {
    if (!gameInfo || !socket) return;

    if (gameInfo.status === "bid" && !gameInfo.scoreBoard) {
      socket.emit("createScoreBoard", roomId);
    }
  }, [gameInfo, socket]);

  useEffect(() => {
    return () => {
      setVisibleCards({});
      visibleRef.current = {};
    };
  }, []);

  const animateDealing = async (
    players: typeof rotatedPlayers,
    totalCardsPerPlayer: number,
    dealerId: string | null
  ) => {
    if (!dealerId || !socket || !roomId || !gameInfo) return;

    // const dealingState: Record<string, number> = {};
    const dealerIndex = players.findIndex((p) => p.id === dealerId);
    const nextPlayerIndex = (dealerIndex + 1) % players.length;
    const nextPlayerId = players[nextPlayerIndex].id;

    const dealingOrder = [
      ...players.slice(dealerIndex + 1),
      ...players.slice(0, dealerIndex + 1),
    ];

    const isSpecialHand = gameInfo.currentHand === 9;

    const currentDealingState = { ...dealingCards };

    const deal = async (startFrom: number, endAt: number) => {
      for (let i = startFrom; i < endAt; i++) {
        for (let player of dealingOrder) {
          currentDealingState[player.id] =
            (currentDealingState[player.id] || 0) + 1;
          setDealingCards({ ...currentDealingState });
          await new Promise((res) => setTimeout(res, 600));
        }
        setCurrentDealingRound(i + 1);
      }
    };

    if (isSpecialHand) {
      setNextPlayerId(nextPlayerId);

      if (currentDealingRound < 3) {
        await deal(currentDealingRound, 3);

        if (!gameInfo.trumpCard) {
          setTrumpSelectionActive(true);
          setIsChoosingTrump(true);

          await new Promise<void>((resolve) => {
            const checkTrump = () => {
              if (gameInfo.trumpCard) {
                setTrumpSelectionActive(false);
                setIsChoosingTrump(false);
                resolve();
              } else {
                setTimeout(checkTrump, 100);
              }
            };
            checkTrump();
          });
        }
      }

      if (currentDealingRound >= 3) {
        await deal(Math.max(currentDealingRound, 3), totalCardsPerPlayer);
      }
    } else {
      await deal(currentDealingRound, totalCardsPerPlayer);
    }

    setTimeout(() => {
      socket.emit("updateGameInfo", roomId, {
        status: isSpecialHand ? "bid" : "trump",
        currentPlayerId: nextPlayerId,
        players: players.map((p) => p.id),
      });
      setDealingCards({});
      setCurrentDealingRound(0);
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

  console.log(room);

  return (
    <div className={styles.game_room}>
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

      {isScoreBoardOpen && (
        <ScoreBoardModal
          roomId={roomId as string}
          hisht={room?.hisht as string}
          scoreBoard={gameInfo?.scoreBoard as ScoreBoard[]}
          roomUsers={room?.users as RoomUser[]}
          handWins={gameInfo?.handWins as HandWin[]}
          closeModal={() => setIsScoreBoardOpen(false)}
        />
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

      {trumpSelectionActive &&
        nextPlayerId === user?._id &&
        !gameInfo?.trumpCard && (
          <TrumpModal
            roomId={roomId as string}
            onClose={() => {
              setIsChoosingTrump(false);
              setTrumpSelectionActive(false);
            }}
          />
        )}

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
            sute={
              gameInfo?.playedCards[0].card?.requestedSuit ===
              gameInfo?.trumpCard?.suit
                ? "trump"
                : (gameInfo?.playedCards[0].card?.requestedSuit as string)
            }
            type={gameInfo?.playedCards[0].card?.type as string}
          />
        )}

      <Table
        gameInfo={gameInfo}
        user={user}
        room={room}
        visibleCards={visibleCards}
        rotatedPlayers={rotatedPlayers as RoomUser[]}
        dealingCards={dealingCards}
        isChoosingTrump={isChoosingTrump}
        nextPlayerId={nextPlayerId as string}
      />

      <Players
        rotatedPlayers={rotatedPlayers as RoomUser[]}
        user={user as { _id: string }}
        isChoosingTrump={isChoosingTrump as boolean}
        nextPlayerId={nextPlayerId as string}
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
      />
    </div>
  );
};

export default GameRoom;
