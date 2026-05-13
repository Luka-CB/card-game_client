import styles from "./GameRounds.module.scss";
import { GameInfo, PlayingCard, RoomUser } from "@/utils/interfaces";
import Image from "next/image";
import { motion } from "framer-motion";
import useWindowSize from "@/hooks/useWindowSize";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useSocket from "@/hooks/useSocket";
import JokerPrompt from "./jokerPrompt/JokerPrompt";
import { soundManager } from "@/utils/sounds";
import useTouchDevice from "@/hooks/useTouchDevice";
import { useTranslations } from "next-intl";
import { useDeckContext } from "@/context/DeckContext";

interface GameRoundsProps {
  rotatedPlayers: RoomUser[];
  hand: PlayingCard[];
  gameInfo: GameInfo;
  user: { _id: string };
  roomUsers: RoomUser[];
}

const GameRounds = ({ hand, gameInfo, user }: GameRoundsProps) => {
  const t = useTranslations("GameRoom.GameControls.gameRounds");
  const { getCardUrl } = useDeckContext();

  const [sortedCards, setSortedCards] = useState<PlayingCard[]>([]);
  const [jokerCard, setJokerCard] = useState<PlayingCard | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [legalCardIds, setLegalCardIds] = useState<string[]>([]);

  const isTouch = useTouchDevice();

  const hasPlayedRevealSound = useRef(false);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragOffsetY = useRef(0);
  const dragElement = useRef<HTMLDivElement | null>(null);
  const dragCard = useRef<PlayingCard | null>(null);
  const pointerId = useRef<number | null>(null);

  const windowSize = useWindowSize();
  const socket = useSocket();

  useEffect(() => {
    if (!hand) return;

    const sorted = [...hand].sort((a, b) => {
      if (a.suit === b.suit) {
        if (a.rank === "A") return 1;
        if (b.rank === "A") return -1;
        if (a.rank === "K") return 1;
        if (b.rank === "K") return -1;
        if (a.rank === "Q") return 1;
        if (b.rank === "Q") return -1;
        if (a.rank === "J") return 1;
        if (b.rank === "J") return -1;
        return parseInt(a.rank) - parseInt(b.rank);
      } else {
        const suitOrder = ["hearts", "diamonds", "clubs", "spades"];
        return suitOrder.indexOf(a.suit) - suitOrder.indexOf(b.suit);
      }
    });

    setSortedCards(sorted);
  }, [hand]);

  useEffect(() => {
    if (sortedCards.length > 0 && !hasPlayedRevealSound.current) {
      soundManager.play("revealCards");
      hasPlayedRevealSound.current = true;
    }

    if (sortedCards.length === 0) {
      hasPlayedRevealSound.current = false;
    }
  }, [sortedCards.length]);

  const playedCardHandler = useCallback(
    (card: PlayingCard) => {
      if (!socket || !gameInfo?.roomId || !gameInfo?.currentPlayerId) return;
      if (gameInfo.currentPlayerId !== user._id) return;

      socket.emit("playCard", {
        roomId: gameInfo.roomId,
        playerId: gameInfo.currentPlayerId,
        card,
      });

      setSortedCards((prev) => prev.filter((c) => c.id !== card.id));
    },
    [socket, gameInfo?.roomId, gameInfo?.currentPlayerId, user._id],
  );

  const handlePlayCard = useCallback(
    (card: PlayingCard) => {
      if (!socket || gameInfo?.currentPlayerId !== user._id) return;

      if (gameInfo?.currentPlayerId === user?._id && card.joker) {
        setJokerCard(card);
        return;
      }

      playedCardHandler(card);
    },
    [socket, gameInfo?.currentPlayerId, user._id, playedCardHandler],
  );

  useEffect(() => {
    if (
      !socket ||
      !gameInfo?.roomId ||
      !gameInfo?.currentPlayerId ||
      !gameInfo?.status
    )
      return;
    if (gameInfo.status !== "playing") return;
    if (gameInfo.currentPlayerId !== user._id) return;

    socket.on("botPlayedCard", (card: PlayingCard) => {
      if (card) {
        setSortedCards((prev) => prev.filter((c) => c.id !== card.id));
      }
    });

    setSelectedCardId(null);

    return () => {
      socket.off("botPlayedCard");
    };
  }, [
    socket,
    gameInfo?.roomId,
    gameInfo?.currentPlayerId,
    gameInfo?.status,
    user._id,
  ]);

  const handlePlayCardRef = useRef(handlePlayCard);
  useEffect(() => {
    handlePlayCardRef.current = handlePlayCard;
  }, [handlePlayCard]);

  useEffect(() => {
    if (!isTouch) return;

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current || !dragElement.current) return;

      dragOffsetY.current = e.clientY - dragStartY.current;
      const clampedY = Math.min(0, dragOffsetY.current);
      dragElement.current.style.transform = `translateY(${clampedY}px)`;
    };

    const onPointerUp = () => {
      if (!isDragging.current || !dragElement.current || !dragCard.current)
        return;

      const el = dragElement.current;
      const card = dragCard.current;
      const dragThreshold = -50;

      if (dragOffsetY.current < dragThreshold) {
        el.style.transform = "";
        el.style.zIndex = "";
        el.style.cursor = "";
        handlePlayCardRef.current(card);
      } else {
        el.style.transition = "transform 0.12s ease-out";
        el.style.transform = "translateY(0px)";

        const cleanup = () => {
          el.style.zIndex = "";
          el.style.cursor = "";
          el.style.transition = "";
          el.removeEventListener("transitionend", cleanup);
        };
        el.addEventListener("transitionend", cleanup);
      }

      if (pointerId.current !== null) {
        try {
          el.releasePointerCapture(pointerId.current);
        } catch (err) {
          console.warn("Failed to release pointer capture:", err);
        }
      }

      isDragging.current = false;
      dragElement.current = null;
      dragCard.current = null;
      pointerId.current = null;
      dragStartY.current = 0;
      dragOffsetY.current = 0;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [isTouch]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, card: PlayingCard) => {
      if (isTouch !== true) return;
      if (!gameInfo || gameInfo.currentPlayerId !== user._id) return;

      e.preventDefault();
      const el = e.currentTarget;

      el.setPointerCapture(e.pointerId);
      pointerId.current = e.pointerId;

      isDragging.current = true;
      dragStartY.current = e.clientY;
      dragOffsetY.current = 0;
      dragElement.current = el;
      dragCard.current = card;

      el.style.transition = "none";
      el.style.zIndex = "100";
      el.style.cursor = "grabbing";
    },
    [isTouch, gameInfo, user._id],
  );

  const handleCardClick = useCallback(
    (card: PlayingCard) => {
      if (isTouch !== false) return;
      if (!gameInfo || gameInfo.currentPlayerId !== user._id) return;
      setSelectedCardId((prev) => (prev === card.id ? null : card.id));
    },
    [isTouch, gameInfo, user._id],
  );

  const handleDesktopPlay = useCallback(() => {
    if (!selectedCardId) return;
    const card = sortedCards.find((c) => c.id === selectedCardId);
    if (!card) return;
    setSelectedCardId(null);
    handlePlayCard(card);
  }, [selectedCardId, sortedCards, handlePlayCard]);

  const isPlayerTurn = gameInfo?.currentPlayerId === user._id;
  const isSmallScreen = windowSize.width <= 600;
  const shouldOverlapOnMobile = isSmallScreen && sortedCards.length >= 6;

  // Dynamically size cards so they look good at any viewport size.
  // Around mobile widths, bias slightly larger so cards remain readable.
  const baseCardWidth = Math.round(
    Math.max(
      isSmallScreen ? 42 : 36,
      Math.min(
        isSmallScreen ? 118 : 104,
        Math.min(
          windowSize.width * (isSmallScreen ? 0.125 : 0.102),
          windowSize.height * (isSmallScreen ? 0.135 : 0.112),
        ),
      ),
    ),
  );

  const visibleCardCount = Math.max(sortedCards.length || hand.length, 1);
  const maxHandWidth = Math.round(
    windowSize.width *
      (windowSize.width <= 600
        ? 0.94
        : windowSize.width <= 992
          ? 0.82
          : windowSize.width <= 1300
            ? 0.66
            : 0.88),
  );
  const estimatedGapPx = windowSize.width <= 600 ? 2 : 5;
  const fittedCardWidth = Math.floor(
    (maxHandWidth - Math.max(0, visibleCardCount - 1) * estimatedGapPx) /
      visibleCardCount,
  );

  const cardWidth = Math.max(
    isSmallScreen ? 32 : 26,
    Math.min(baseCardWidth, fittedCardWidth),
  );
  const cardHeight = Math.round(cardWidth * 1.5);

  useEffect(() => {
    if (!socket || !gameInfo?.roomId || !user?._id) return;

    const handleLegalMoves = (payload: {
      roomId: string;
      playerId: string;
      cardIds: string[];
    }) => {
      if (payload.roomId !== gameInfo.roomId) return;
      if (payload.playerId !== user._id) return;
      setLegalCardIds(payload.cardIds || []);
    };

    socket.on("legalMoves", handleLegalMoves);

    return () => {
      socket.off("legalMoves", handleLegalMoves);
    };
  }, [socket, gameInfo?.roomId, user?._id]);

  useEffect(() => {
    if (!socket || !gameInfo?.roomId || !user?._id) return;

    const isMyTurn =
      gameInfo.status === "playing" && gameInfo.currentPlayerId === user._id;

    if (!isMyTurn) {
      setLegalCardIds([]);
      return;
    }

    socket.emit("requestLegalMoves", {
      roomId: gameInfo.roomId,
      playerId: user._id,
    });
  }, [
    socket,
    gameInfo?.roomId,
    gameInfo?.status,
    gameInfo?.currentPlayerId,
    gameInfo?.playedCards,
    hand,
    user?._id,
  ]);

  const playableCardIdSet = useMemo(() => {
    return new Set(legalCardIds);
  }, [legalCardIds]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`${styles.player_hand} ${shouldOverlapOnMobile ? styles.mobile_overlap : ""}`}
    >
      {jokerCard && (
        <JokerPrompt
          jokerCard={jokerCard}
          clearJokerCard={() => setJokerCard(null)}
          playedCardHandler={playedCardHandler}
          isPlayedCardsEmpty={
            gameInfo?.playedCards?.length === 0 || !gameInfo?.playedCards
          }
        />
      )}

      {sortedCards.map((card: PlayingCard) => {
        const cardUrl = getCardUrl(card);
        const isPlayable = playableCardIdSet.has(card.id);
        const isSelected = selectedCardId === card.id;

        return (
          <div
            className={`${
              isPlayerTurn && gameInfo?.playedCards?.length
                ? styles.card_faded
                : styles.card
            } ${isPlayerTurn && isPlayable ? styles.playable : ""} ${isSelected ? styles.selected : ""}`}
            key={card.id}
            onPointerDown={
              isPlayerTurn && isPlayable
                ? (e) => handlePointerDown(e, card as PlayingCard)
                : undefined
            }
            onClick={
              isTouch === false && isPlayerTurn && isPlayable
                ? () => handleCardClick(card as PlayingCard)
                : undefined
            }
            style={{ touchAction: isTouch ? "none" : "auto" }}
          >
            {isTouch === false && isSelected && (
              <button
                className={styles.play_btn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDesktopPlay();
                }}
              >
                {t("playBtn")}
              </button>
            )}

            <Image
              src={cardUrl}
              alt={card.rank || "card"}
              draggable={false}
              width={cardWidth}
              height={cardHeight}
            />
          </div>
        );
      })}
    </motion.div>
  );
};

export default React.memo(GameRounds);
