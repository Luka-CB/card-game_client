import styles from "./GameRounds.module.scss";
import { CardDeck } from "@/components/gameRoom/cardDeck";
import { GameInfo, PlayingCard, RoomUser } from "@/utils/interfaces";
import Image from "next/image";
import { motion } from "framer-motion";
import useWindowSize from "@/hooks/useWindowSize";
import { useEffect, useState } from "react";
import ActionBtn from "./ActionBtn";
import useSocket from "@/hooks/useSocket";
import JokerPrompt from "./jokerPrompt/JokerPrompt";

interface GameRoundsProps {
  rotatedPlayers: RoomUser[];
  hand: PlayingCard[];
  gameInfo: GameInfo;
  user: { _id: string };
}

const GameRounds = ({
  hand,
  gameInfo,
  user,
  rotatedPlayers,
}: GameRoundsProps) => {
  const [cardId, setCardId] = useState("");
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sortedCards, setSortedCards] = useState<PlayingCard[]>([]);
  const [dragY, setDragY] = useState(0);
  const [jokerCard, setJokerCard] = useState<PlayingCard | null>(null);

  const windowSize = useWindowSize();
  const socket = useSocket();

  useEffect(() => {
    if (!hand) return;

    const sorted = hand.sort((a, b) => {
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

  const playedCardHandler = (card: PlayingCard) => {
    if (!socket || !gameInfo || gameInfo.currentPlayerId !== user._id) return;

    const playerIndex = rotatedPlayers.findIndex(
      (p) => p.id === gameInfo?.currentPlayerId
    );
    const nextPlayerId =
      rotatedPlayers[(playerIndex + 1) % rotatedPlayers.length].id;

    socket.emit("removeCardFromHand", {
      roomId: gameInfo?.roomId,
      playerId: gameInfo?.currentPlayerId,
      card: card,
    });

    const newSortedCards = sortedCards?.filter((c) => c.id !== card.id);
    setSortedCards(newSortedCards);

    setTimeout(() => {
      socket.emit("setPlayedCards", {
        roomId: gameInfo?.roomId,
        playerId: gameInfo?.currentPlayerId,
        playedCard: card,
      });
    }, 500);

    setTimeout(() => {
      socket.emit("updateGameInfo", gameInfo?.roomId, {
        currentPlayerId: nextPlayerId,
      });
    }, 1000);
  };

  const handlePlayCard = (card: PlayingCard) => {
    if (!socket || !gameInfo || gameInfo.currentPlayerId !== user._id) return;

    if (gameInfo?.currentPlayerId === user?._id && card.joker) {
      setJokerCard(card);
      return;
    }

    playedCardHandler(card);
  };

  const handleDragStart = (card: PlayingCard) => {
    if (!gameInfo || gameInfo.currentPlayerId !== user._id) return;

    setDraggedCardId(card.id);
    setIsDragging(true);
  };

  const handleDrag = (
    _: any,
    info: { point: { x: number }; offset: { y: number } }
  ) => {
    if (!gameInfo || gameInfo.currentPlayerId !== user._id) return;

    setDragY(info.offset.y < 0 ? info.offset.y : 0);
  };

  const handleDragEnd = (card: PlayingCard) => {
    if (!gameInfo || gameInfo.currentPlayerId !== user._id) return;

    const cardHeight =
      windowSize.height <= 350
        ? 60
        : windowSize.height <= 600
        ? 70
        : windowSize.height <= 800 && windowSize.width > 600
        ? 100
        : windowSize.width <= 600
        ? 55
        : windowSize.width <= 990
        ? 70
        : windowSize.width <= 1150
        ? 100
        : windowSize.width < 1300
        ? 130
        : 150;

    if (isDragging && Math.abs(dragY) >= cardHeight / 2) {
      handlePlayCard(card);
    }

    setDraggedCardId(null);
    setIsDragging(false);
    setDragY(0);
  };

  const isPlayerTurn = gameInfo?.currentPlayerId === user._id;

  const findPlayableCards = () => {
    if (!sortedCards.length || !gameInfo) return;

    const card = gameInfo?.playedCards?.map(
      (playedCard) => playedCard.card
    )[0] as PlayingCard;

    const requestedSuit = card?.requestedSuit;
    const currentPlayingCardExists = sortedCards?.some(
      (sortedCard) => sortedCard?.suit === card?.suit
    );
    const trumpExists = sortedCards.some(
      (sortedCard) => sortedCard?.suit === gameInfo?.trumpCard?.suit
    );

    let playableCards = [];

    if (requestedSuit) {
      const joker = sortedCards.find((sortedCard) => sortedCard?.joker);
      const requestedCards = sortedCards.filter(
        (sortedCard) => sortedCard?.suit === requestedSuit
      );

      if (requestedCards.length === 0) {
        return (playableCards = sortedCards);
      }

      if (requestedCards.length > 1) {
        const strongestCard = requestedCards.reduce((max, c) =>
          c.strength > max.strength ? c : max
        );
        playableCards.push(strongestCard);
        if (joker) playableCards.push(joker);
      } else {
        playableCards = requestedCards;
        if (joker) playableCards.push(joker);
      }
    } else if (
      currentPlayingCardExists &&
      gameInfo?.playedCards &&
      gameInfo?.playedCards?.length > 0
    ) {
      playableCards = sortedCards.filter(
        (sortedCard) => sortedCard?.suit === card?.suit || sortedCard?.joker
      );
    } else if (
      !currentPlayingCardExists &&
      trumpExists &&
      gameInfo?.playedCards &&
      gameInfo?.playedCards?.length > 0
    ) {
      playableCards = sortedCards?.filter(
        (sortedCard) =>
          sortedCard?.suit === gameInfo?.trumpCard?.suit || sortedCard?.joker
      );
    } else {
      playableCards = sortedCards;
    }

    return playableCards;
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 0,
        translateY: 100,
      }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.4, damping: 15, type: "spring" }}
      className={styles.player_hand}
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
        const cardImage = CardDeck.find(
          (c: { suit: string; rank: string; image: string; color?: string }) =>
            c.suit === card.suit && c.rank === card.rank
        )?.image;

        const jokerImageBlack = CardDeck.find(
          (c: { suit: string; rank: string; image: string; color?: string }) =>
            c.rank === "JOKER" && c.color === "black"
        )?.image;

        const jokerImageRed = CardDeck.find(
          (c: { suit: string; rank: string; image: string; color?: string }) =>
            c.rank === "JOKER" && c.color === "red"
        )?.image;

        const isPlayable = findPlayableCards()?.some((c) => c.id === card.id);

        return (
          <motion.div
            className={`${
              isPlayerTurn && gameInfo?.playedCards?.length
                ? styles.card_faded
                : styles.card
            } ${isPlayerTurn && isPlayable ? styles.playable : ""} ${
              isDragging && draggedCardId === card.id ? styles.dragging : ""
            }`}
            key={card.id}
            onMouseEnter={() =>
              windowSize.width > 1200 &&
              isPlayable &&
              isPlayerTurn &&
              setCardId(card.id)
            }
            onMouseLeave={() => windowSize.width > 1200 && setCardId("")}
            drag={
              windowSize.width <= 1200 && isPlayerTurn && isPlayable
                ? "y"
                : false
            }
            dragConstraints={{ top: -200, bottom: 0 }}
            dragElastic={0.2}
            onDragStart={() =>
              windowSize.width <= 1200 && handleDragStart(card as PlayingCard)
            }
            onDrag={(e, info) =>
              windowSize.width <= 1200 && handleDrag(e, info)
            }
            onDragEnd={() =>
              windowSize.width <= 1200 && handleDragEnd(card as PlayingCard)
            }
            animate={{
              y: draggedCardId === card.id ? -20 : 0,
              scale: draggedCardId === card.id ? 1.05 : 1,
            }}
          >
            {isPlayerTurn && !jokerCard && (
              <ActionBtn
                cardId={cardId}
                card={card as PlayingCard}
                onPlay={handlePlayCard}
                isDragging={isDragging && draggedCardId === card.id}
              />
            )}
            {cardImage ? (
              <Image
                src={cardImage}
                alt={card.rank}
                width={
                  windowSize.height <= 450
                    ? 30
                    : windowSize.height <= 600 && windowSize.height > 450
                    ? 40
                    : windowSize.height <= 900 &&
                      windowSize.height > 600 &&
                      windowSize.width > 600
                    ? 50
                    : windowSize.width <= 600
                    ? 40
                    : windowSize.width <= 990 && windowSize.width > 600
                    ? 50
                    : windowSize.width <= 1150 && windowSize.width > 990
                    ? 70
                    : windowSize.width < 1300 && windowSize.width > 1150
                    ? 90
                    : 100
                }
                height={
                  windowSize.height <= 450
                    ? 45
                    : windowSize.height <= 600 && windowSize.height > 450
                    ? 60
                    : windowSize.height <= 900 &&
                      windowSize.height > 600 &&
                      windowSize.width > 600
                    ? 80
                    : windowSize.width <= 600
                    ? 55
                    : windowSize.width <= 990 && windowSize.width > 600
                    ? 70
                    : windowSize.width <= 1150 && windowSize.width > 990
                    ? 100
                    : windowSize.width < 1300 && windowSize.width > 1150
                    ? 130
                    : 150
                }
              />
            ) : (
              <Image
                src={
                  card.color === "black"
                    ? jokerImageBlack || "/cards/joker-black.png"
                    : jokerImageRed || "/cards/joker-red.png"
                }
                alt="Joker"
                width={
                  windowSize.height <= 450
                    ? 30
                    : windowSize.height <= 550 && windowSize.height > 450
                    ? 40
                    : windowSize.height <= 600 && windowSize.height > 350
                    ? 50
                    : windowSize.height <= 800 &&
                      windowSize.height > 600 &&
                      windowSize.width > 600
                    ? 70
                    : windowSize.width <= 600
                    ? 40
                    : windowSize.width <= 990 && windowSize.width > 600
                    ? 50
                    : windowSize.width <= 1150 && windowSize.width > 990
                    ? 70
                    : windowSize.width < 1300 && windowSize.width > 1150
                    ? 90
                    : 100
                }
                height={
                  windowSize.height <= 450
                    ? 45
                    : windowSize.height <= 550 && windowSize.height > 450
                    ? 60
                    : windowSize.height <= 600 && windowSize.height > 350
                    ? 70
                    : windowSize.height <= 800 &&
                      windowSize.height > 600 &&
                      windowSize.width > 600
                    ? 100
                    : windowSize.width <= 600
                    ? 55
                    : windowSize.width <= 990 && windowSize.width > 600
                    ? 70
                    : windowSize.width <= 1150 && windowSize.width > 990
                    ? 100
                    : windowSize.width < 1300 && windowSize.width > 1150
                    ? 130
                    : 150
                }
              />
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default GameRounds;
