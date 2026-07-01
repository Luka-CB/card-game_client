"use client";

import { createPortal } from "react-dom";
import styles from "./CreateRoom.module.scss";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaLock,
  FaLockOpen,
  FaTimesCircle,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import useCreateRoomStore from "@/store/gamePage/createRoomStore";
import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import useSocket from "@/hooks/useSocket";
import useUserStore from "@/store/user/userStore";
import useFlashMsgStore from "@/store/flashMsgStore";
import { getRandomBotAvatar, getRandomColor } from "@/utils/misc";
import useRoomStore from "@/store/gamePage/roomStore";
import Image from "next/image";
import useJCoinsStore from "@/store/user/stats/jCoinsStore";
import api from "@/utils/axios";
import { useLocale, useTranslations } from "next-intl";
import useUserStatsStore from "@/store/user/stats/userStatsStore";

const PROGRESSION_LEVELS = [
  "novice",
  "amateur",
  "competent",
  "promising",
  "professional",
  "diabolical",
  "legend",
  "joker",
] as const;

interface DeckOption {
  _id: string;
  name: string;
  description?: string;
  cardBack: { url: string };
  requiredLevel: string;
  isDefault: boolean;
  previewImages?: string[];
}

// [back, numbered, picture, joker] - ordered back-to-front in the fan
const DEFAULT_PREVIEW_CARDS = [
  "/cards/card-back.png",
  "/cards/hearts-9.png",
  "/cards/hearts-k.png",
  "/cards/joker-red.png",
];

const DEFAULT_DECK_SAMPLE_CARDS = [
  "/cards/card-back.png",
  "/cards/joker-red.png",
  "/cards/joker-black.png",
  "/cards/hearts-2.png",
  "/cards/clubs-7.png",
  "/cards/spades-10.png",
  "/cards/hearts-j.png",
  "/cards/diamonds-q.png",
  "/cards/spades-a.png",
];

interface DeckPreviewState {
  name: string;
  cards: string[];
}

const DeckFan = ({ cards }: { cards: string[] }) => (
  <div className={styles.deck_fan}>
    {cards.map((src, i) => (
      <img
        key={i}
        src={src}
        alt=""
        width={36}
        height={50}
        style={{ height: "auto" }}
        className={`${styles.deck_card} ${styles[`deck_c${i + 1}` as keyof typeof styles]}`}
      />
    ))}
  </div>
);

const CreateRoom = () => {
  const t = useTranslations("GamePage.createRoom");
  const locale = useLocale();

  const [currentStatus, setCurrentStatus] = useState("public");
  const [currentTab, setCurrentTab] = useState<"classic" | "nines">("classic");
  const [type, setType] = useState<"classic" | "nines">("classic");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [bet, setBet] = useState("");
  const [betError, setBetError] = useState("");
  const [hisht, setHisht] = useState("200");
  const [toggleChat, setToggleChat] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState("default");
  const [decks, setDecks] = useState<DeckOption[]>([]);
  const [decksLoading, setDecksLoading] = useState(false);
  const [deckPreview, setDeckPreview] = useState<DeckPreviewState | null>(null);
  const [previewCardIndex, setPreviewCardIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const { toggleCreateRoomModal, setToggleCreateRoom } = useCreateRoomStore();
  const { setMsg } = useFlashMsgStore();
  const { setIsCreatingRoom, rooms } = useRoomStore();

  const handleCloseModal = () => setToggleCreateRoom(false, null);

  const socket = useSocket();
  const { user, usersOnline } = useUserStore();
  const { jCoins, toggleGetMoreModal, fetchJCoins } = useJCoinsStore();
  const { stats, fetchStats } = useUserStatsStore();

  const resetModal = () => {
    setToggleCreateRoom(false, null);
    setName("");
    setPassword("");
    setBet("");
    setHisht("200");
    setToggleChat(false);
    setBetError("");
    setSelectedDeckId("default");
    setDecks([]);
    setDeckPreview(null);
  };

  const getDeckPreviewCards = (deck?: DeckOption) => {
    if (!deck) {
      return DEFAULT_DECK_SAMPLE_CARDS;
    }

    return [deck.cardBack.url, ...(deck.previewImages ?? [])]
      .filter((card): card is string => Boolean(card))
      .slice(0, 9);
  };

  const previewCards = deckPreview?.cards ?? [];
  const hasMultiplePreviewCards = previewCards.length > 1;

  const goToNextPreviewCard = () => {
    if (!hasMultiplePreviewCards) return;

    setPreviewCardIndex((prev) => (prev + 1) % previewCards.length);
  };

  const goToPreviousPreviewCard = () => {
    if (!hasMultiplePreviewCards) return;

    setPreviewCardIndex(
      (prev) => (prev - 1 + previewCards.length) % previewCards.length,
    );
  };

  const handlePreviewTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!hasMultiplePreviewCards) return;

    setTouchStartX(e.touches[0].clientX);
  };

  const handlePreviewTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!hasMultiplePreviewCards || touchStartX === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const SWIPE_THRESHOLD = 40;

    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX < 0) {
        goToNextPreviewCard();
      } else {
        goToPreviousPreviewCard();
      }
    }

    setTouchStartX(null);
  };

  useEffect(() => {
    if (deckPreview) {
      setPreviewCardIndex(0);
      setTouchStartX(null);
    }
  }, [deckPreview]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;

    if (user.isGuest) {
      setMsg("Guests cannot create rooms", "error");
      resetModal();
      return;
    }

    await fetchJCoins();
    const latestJCoins = useJCoinsStore.getState().jCoins ?? jCoins;

    const roomUser = rooms.find((room) =>
      room?.users.some((u) => u.id === user._id),
    );
    if (roomUser) {
      setMsg(t("msgs.roomUser"), "error");
      resetModal();
      return;
    }

    if (bet && parseInt(bet) < 50) {
      setBetError(t("msgs.betAmount"));
      return;
    }

    if (bet && latestJCoins && parseInt(bet, 10) > latestJCoins.raw) {
      setBetError(t("msgs.noEnoughCoins"));
      return;
    }

    if (latestJCoins && latestJCoins.raw < 100) {
      toggleGetMoreModal(true);
      setMsg(t("msgs.coinsNeeded"), "error");
      resetModal();
      return;
    }

    const room = {
      id: uuidv4(),
      name: name.trim() !== "" ? name : `Room ${rooms.length + 1}`,
      creatorId: user._id,
      selectedDeckId,
      password: currentStatus === "private" ? password : null,
      bet: bet ? bet : null,
      type: type,
      status: currentStatus,
      hisht,
      hasChat: toggleChat,
      createdAt: new Date(),
      users: [
        {
          id: user._id,
          username: user.originalUsername,
          status: "active",
          isGuest: user.isGuest,
          avatar: user.avatar || "/default-avatar.jpeg",
          botAvatar: getRandomBotAvatar(),
          color: getRandomColor(),
        },
      ],
    };

    setIsCreatingRoom(true);

    try {
      await api.post("/metrics/room-creation-attempt");
    } catch (error) {
      console.error("Failed to track room creation attempt:", error);
    }

    if (socket) {
      socket.emit("addRoom", room, user._id);
      socket.emit("getRooms");
      resetModal();
    }
  };

  useEffect(() => {
    if (toggleCreateRoomModal.toggle) {
      document.body.style.overflow = "hidden";

      if (!stats) fetchStats();

      setDecksLoading(true);
      fetch("/api/game/card-decks")
        .then((r) => (r.ok ? r.json() : { decks: [] }))
        .then((data) => setDecks(data.decks ?? []))
        .catch(() => setDecks([]))
        .finally(() => setDecksLoading(false));
    } else {
      document.body.style.overflow = "auto";
    }
  }, [toggleCreateRoomModal.toggle, stats, fetchStats]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {toggleCreateRoomModal.toggle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={styles.modal_bg}
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.3, type: "spring" }}
            className={styles.modal}
            data-locale={locale}
            onClick={(e) => e.stopPropagation()}
          >
            <FaTimesCircle
              className={styles.close_icon}
              onClick={handleCloseModal}
            />
            <div className={styles.game_type}>
              <div
                className={
                  currentTab === "classic" ? styles.item_active : styles.item
                }
                onClick={() => {
                  setCurrentTab("classic");
                  setType("classic");
                }}
              >
                <span>{t("types.classic")}</span>
              </div>
              <div
                className={
                  currentTab === "nines" ? styles.item_active : styles.item
                }
                onClick={() => {
                  setCurrentTab("nines");
                  setType("nines");
                }}
              >
                <span>{t("types.nines")}</span>
              </div>
            </div>
            <div className={styles.visibility}>
              <div
                className={
                  currentStatus === "public" ? styles.item_active : styles.item
                }
                onClick={() => setCurrentStatus("public")}
                title={t("visibility.publicTitle")}
              >
                <FaLockOpen className={styles.icon} />
                <span>{t("visibility.public")}</span>
              </div>
              <div
                className={
                  currentStatus === "private" ? styles.item_active : styles.item
                }
                onClick={() => setCurrentStatus("private")}
                title={t("visibility.privateTitle")}
              >
                <FaLock className={styles.icon} />
                <span>{t("visibility.private")}</span>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.input_box}>
                <label htmlFor="name">{t("form.name")}</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  placeholder={
                    rooms.length > 0 ? `Room ${rooms.length + 1}` : "Room 1"
                  }
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {currentStatus === "private" ? (
                <div className={styles.input_box}>
                  <label htmlFor="password">{t("form.password")}</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              ) : null}
              <div className={betError ? styles.bet_box_error : styles.bet_box}>
                <label htmlFor="bet">{t("form.bet.label")}</label>
                <input
                  type="number"
                  name="bet"
                  id="bet"
                  value={bet}
                  onChange={(e) => {
                    setBet(e.target.value);
                    setBetError("");
                  }}
                />
                <div className={styles.info}>
                  <small>{t("form.bet.min")}</small>
                  <Image src="/coin1.png" alt="coin" width={20} height={20} />
                  <b>50</b>
                </div>
                {betError && (
                  <span className={styles.error_message}>{betError}</span>
                )}
              </div>
              <div className={styles.radio_box}>
                <b>{t("form.hisht")}</b>
                <div className={styles.inputs}>
                  <input
                    type="radio"
                    name="hisht"
                    id="hisht_200"
                    required
                    value={200}
                    checked={hisht === "200"}
                    onChange={(e) => setHisht(e.target.value)}
                  />
                  <label htmlFor="hisht_200">200</label>
                  <input
                    type="radio"
                    name="hisht"
                    id="hisht_500"
                    required
                    value={500}
                    checked={hisht === "500"}
                    onChange={(e) => setHisht(e.target.value)}
                  />
                  <label htmlFor="hisht_500">500</label>
                  <input
                    type="radio"
                    name="hisht"
                    id="hisht_900"
                    required
                    value={900}
                    checked={hisht === "900"}
                    onChange={(e) => setHisht(e.target.value)}
                  />
                  <label htmlFor="hisht_900">900</label>
                </div>
              </div>
              {/* Deck Picker */}
              {(() => {
                const userLevel = stats?.level ?? "novice";
                const userLevelIdx = PROGRESSION_LEVELS.indexOf(
                  userLevel as (typeof PROGRESSION_LEVELS)[number],
                );
                const nextLevel =
                  userLevelIdx < PROGRESSION_LEVELS.length - 1
                    ? PROGRESSION_LEVELS[userLevelIdx + 1]
                    : null;

                const availableDecks = decks.filter(
                  (d) =>
                    PROGRESSION_LEVELS.indexOf(
                      d.requiredLevel as (typeof PROGRESSION_LEVELS)[number],
                    ) <= userLevelIdx,
                );
                const previewDecks = nextLevel
                  ? decks.filter((d) => d.requiredLevel === nextLevel)
                  : [];

                if (decksLoading || decks.length > 0) {
                  return (
                    <div className={styles.deck_picker}>
                      <b>{t("form.deck.label")}</b>
                      <div className={styles.deck_list}>
                        {/* Built-in default deck */}
                        <button
                          type="button"
                          className={`${styles.deck_item} ${selectedDeckId === "default" ? styles.deck_item_active : ""}`}
                          onClick={() => setSelectedDeckId("default")}
                        >
                          <span
                            role="button"
                            tabIndex={0}
                            className={styles.deck_preview_btn}
                            title={t("form.deck.previewBtn")}
                            aria-label={t("form.deck.previewBtn")}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeckPreview({
                                name: t("form.deck.default"),
                                cards: getDeckPreviewCards(),
                              });
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeckPreview({
                                  name: t("form.deck.default"),
                                  cards: getDeckPreviewCards(),
                                });
                              }
                            }}
                          >
                            <FaExpand />
                          </span>
                          <DeckFan cards={DEFAULT_PREVIEW_CARDS} />
                          <span className={styles.deck_name}>
                            {t("form.deck.default")}
                          </span>
                        </button>

                        {availableDecks.map((deck) => (
                          <button
                            key={deck._id}
                            type="button"
                            className={`${styles.deck_item} ${selectedDeckId === deck._id ? styles.deck_item_active : ""}`}
                            onClick={() => setSelectedDeckId(deck._id)}
                          >
                            <span
                              role="button"
                              tabIndex={0}
                              className={styles.deck_preview_btn}
                              title={t("form.deck.previewBtn")}
                              aria-label={t("form.deck.previewBtn")}
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeckPreview({
                                  name: deck.name,
                                  cards: getDeckPreviewCards(deck),
                                });
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setDeckPreview({
                                    name: deck.name,
                                    cards: getDeckPreviewCards(deck),
                                  });
                                }
                              }}
                            >
                              <FaExpand />
                            </span>
                            <DeckFan
                              cards={[
                                deck.cardBack.url,
                                ...(deck.previewImages ?? []),
                              ]}
                            />
                            <span className={styles.deck_name}>
                              {deck.name}
                            </span>
                          </button>
                        ))}

                        {previewDecks.map((deck) => (
                          <div
                            key={deck._id}
                            className={`${styles.deck_item} ${styles.deck_item_locked}`}
                            title={t("form.deck.lockedInfo", {
                              level: nextLevel ?? "",
                            })}
                          >
                            <span
                              role="button"
                              tabIndex={0}
                              className={styles.deck_preview_btn}
                              title={t("form.deck.previewBtn")}
                              aria-label={t("form.deck.previewBtn")}
                              onClick={() =>
                                setDeckPreview({
                                  name: deck.name,
                                  cards: getDeckPreviewCards(deck),
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  setDeckPreview({
                                    name: deck.name,
                                    cards: getDeckPreviewCards(deck),
                                  });
                                }
                              }}
                            >
                              <FaExpand />
                            </span>
                            <div className={styles.deck_lock_overlay}>
                              <FaLock className={styles.deck_lock_icon} />
                            </div>
                            <DeckFan
                              cards={[
                                deck.cardBack.url,
                                ...(deck.previewImages ?? []),
                              ]}
                            />
                            <span className={styles.deck_name}>
                              {deck.name}
                            </span>
                            <span className={styles.deck_level_hint}>
                              {nextLevel}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {(usersOnline?.length > 100 || currentStatus === "private") && (
                <div className={styles.toggle_box}>
                  <span>{t("form.chat.label")}</span>
                  <label htmlFor="toggleChat" className={styles.toggle_switch}>
                    <input
                      type="checkbox"
                      name="toggleChat"
                      id="toggleChat"
                      checked={toggleChat}
                      onChange={(e) => setToggleChat(e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                  <small>
                    {toggleChat ? t("form.chat.on") : t("form.chat.off")}
                  </small>
                </div>
              )}
              <button type="submit" className={styles.submit_btn}>
                {t("form.btn")}
              </button>
            </form>
          </motion.div>

          <AnimatePresence>
            {deckPreview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={styles.preview_bg}
                onClick={() => setDeckPreview(null)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 18, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className={styles.preview_modal}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.preview_header}>
                    <div>
                      <h3>
                        {t("form.deck.previewTitle", {
                          name: deckPreview.name,
                        })}
                      </h3>
                      <small>{t("form.deck.previewHint")}</small>
                    </div>
                    <button
                      type="button"
                      className={styles.preview_close_btn}
                      onClick={() => setDeckPreview(null)}
                    >
                      {t("form.deck.closePreview")}
                    </button>
                  </div>

                  <div
                    className={styles.preview_carousel}
                    onTouchStart={handlePreviewTouchStart}
                    onTouchEnd={handlePreviewTouchEnd}
                  >
                    <button
                      type="button"
                      className={styles.preview_nav_btn}
                      aria-label={t("form.deck.prevCard")}
                      onClick={goToPreviousPreviewCard}
                      disabled={!hasMultiplePreviewCards}
                    >
                      <FaChevronLeft />
                    </button>

                    <div className={styles.preview_card_frame}>
                      <img
                        src={previewCards[previewCardIndex]}
                        alt={`${deckPreview.name} card ${previewCardIndex + 1}`}
                        width={180}
                        height={252}
                        style={{ height: "auto" }}
                        className={styles.preview_card_main}
                      />
                    </div>

                    <button
                      type="button"
                      className={styles.preview_nav_btn}
                      aria-label={t("form.deck.nextCard")}
                      onClick={goToNextPreviewCard}
                      disabled={!hasMultiplePreviewCards}
                    >
                      <FaChevronRight />
                    </button>
                  </div>

                  <div className={styles.preview_meta}>
                    <small>
                      {t("form.deck.cardPosition", {
                        current: previewCardIndex + 1,
                        total: previewCards.length,
                      })}
                    </small>
                    {hasMultiplePreviewCards && (
                      <small>{t("form.deck.previewSwipeHint")}</small>
                    )}
                  </div>

                  <div className={styles.preview_thumbs}>
                    {previewCards.map((src, idx) => (
                      <button
                        key={`${src}-${idx}`}
                        type="button"
                        className={`${styles.preview_thumb_btn} ${idx === previewCardIndex ? styles.preview_thumb_btn_active : ""}`}
                        onClick={() => setPreviewCardIndex(idx)}
                      >
                        <img
                          src={src}
                          alt={`${deckPreview.name} thumb ${idx + 1}`}
                          width={56}
                          height={78}
                          style={{ height: "auto" }}
                          className={styles.preview_thumb}
                        />
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default CreateRoom;
