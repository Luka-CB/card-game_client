import { useEffect, useState, useCallback } from "react";
import { CardDeck as CANONICAL_DECK } from "@/components/gameRoom/cardDeck";
import type { PlayingCard } from "@/utils/interfaces";

interface CardImage {
  url: string;
  publicId: string;
  rank: string;
  suit: string;
}

interface CardBackImage {
  url: string;
  publicId: string;
}

const DEFAULT_CARD_BACK_URL = "/cards/card-back.png";

export function useDeckImages(selectedDeckId: string | undefined) {
  const [deckImages, setDeckImages] = useState<CardImage[] | null>(null);
  const [cardBackUrl, setCardBackUrl] = useState(DEFAULT_CARD_BACK_URL);

  useEffect(() => {
    if (!selectedDeckId || selectedDeckId === "default") {
      setDeckImages(null);
      setCardBackUrl(DEFAULT_CARD_BACK_URL);
      return;
    }

    let cancelled = false;

    fetch(`/api/game/card-decks/${selectedDeckId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (data: { cardImages: CardImage[]; cardBack: CardBackImage } | null) => {
          if (cancelled || !data?.cardImages?.length) return;

          setDeckImages(data.cardImages);
          setCardBackUrl(data.cardBack?.url ?? DEFAULT_CARD_BACK_URL);

          // Preload all card images (faces + back) to avoid flash on reveal
          data.cardImages.forEach((img) => {
            const el = new window.Image();
            el.src = img.url;
          });
          if (data.cardBack?.url) {
            const el = new window.Image();
            el.src = data.cardBack.url;
          }
        },
      )
      .catch(() => {
        // silently fall back to default deck on error
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDeckId]);

  const getCardUrl = useCallback(
    (card: PlayingCard): string => {
      if (deckImages) {
        // Look up by explicit rank+suit — no positional dependency
        // Jokers in the game deck have rank:null; deck images store them as rank:"JOKER"
        const targetRank = card.joker ? "JOKER" : card.rank;
        const targetSuit = card.joker ? card.color : card.suit;
        const match = deckImages.find(
          (img) => img.rank === targetRank && img.suit === targetSuit,
        );
        if (match) return match.url;
      }

      // Fall back to local canonical deck
      const canonical = CANONICAL_DECK.find(
        card.joker
          ? (c) => c.rank === "JOKER" && c.suit === card.color
          : (c) => c.suit === card.suit && c.rank === card.rank,
      );
      return canonical?.image ?? DEFAULT_CARD_BACK_URL;
    },
    [deckImages],
  );

  return {
    getCardUrl,
    cardBackUrl,
  };
}
