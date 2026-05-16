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

type DeckCacheEntry = {
  deckImages: CardImage[];
  cardBackUrl: string;
  imageMap: Map<string, string>;
};

const deckCache = new Map<string, DeckCacheEntry>();

const toDeckKey = (rank: string | undefined, suit: string | undefined) =>
  `${rank ?? ""}|${suit ?? ""}`;

const buildImageMap = (images: CardImage[]) => {
  const map = new Map<string, string>();
  for (const img of images) {
    map.set(toDeckKey(img.rank, img.suit), img.url);
  }
  return map;
};

export function useDeckImages(selectedDeckId: string | undefined) {
  const [deckImages, setDeckImages] = useState<CardImage[] | null>(null);
  const [cardBackUrl, setCardBackUrl] = useState(DEFAULT_CARD_BACK_URL);
  const [imageMap, setImageMap] = useState<Map<string, string> | null>(null);

  useEffect(() => {
    if (!selectedDeckId || selectedDeckId === "default") {
      setDeckImages(null);
      setCardBackUrl(DEFAULT_CARD_BACK_URL);
      setImageMap(null);
      return;
    }

    const cached = deckCache.get(selectedDeckId);
    if (cached) {
      setDeckImages(cached.deckImages);
      setCardBackUrl(cached.cardBackUrl);
      setImageMap(cached.imageMap);
      return;
    }

    const controller = new AbortController();

    fetch(`/api/game/card-decks/${selectedDeckId}`, {
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (data: { cardImages: CardImage[]; cardBack: CardBackImage } | null) => {
          if (!data?.cardImages?.length) return;

          const nextCardBackUrl = data.cardBack?.url ?? DEFAULT_CARD_BACK_URL;
          const nextImageMap = buildImageMap(data.cardImages);

          deckCache.set(selectedDeckId, {
            deckImages: data.cardImages,
            cardBackUrl: nextCardBackUrl,
            imageMap: nextImageMap,
          });

          setDeckImages(data.cardImages);
          setCardBackUrl(nextCardBackUrl);
          setImageMap(nextImageMap);

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
      .catch((error: unknown) => {
        if (
          typeof error === "object" &&
          error !== null &&
          "name" in error &&
          (error as { name?: string }).name === "AbortError"
        ) {
          return;
        }
        // silently fall back to default deck on error
      });

    return () => {
      controller.abort();
    };
  }, [selectedDeckId]);

  const getCardUrl = useCallback(
    (card: PlayingCard): string => {
      if (imageMap) {
        // Look up by explicit rank+suit — no positional dependency
        // Jokers in the game deck have rank:null; deck images store them as rank:"JOKER"
        const targetRank = card.joker ? "JOKER" : card.rank;
        const targetSuit = card.joker ? card.color : card.suit;
        const match = imageMap.get(toDeckKey(targetRank, targetSuit));
        if (match) return match;
      }

      // Fall back to local canonical deck
      const canonical = CANONICAL_DECK.find(
        card.joker
          ? (c) => c.rank === "JOKER" && c.suit === card.color
          : (c) => c.suit === card.suit && c.rank === card.rank,
      );
      return canonical?.image ?? DEFAULT_CARD_BACK_URL;
    },
    [imageMap],
  );

  return {
    getCardUrl,
    cardBackUrl,
  };
}
