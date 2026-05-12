"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import api from "@/utils/axios";
import useSocket from "@/hooks/useSocket";
import useUserStore from "@/store/user/userStore";
import { Room } from "@/utils/interfaces";
import { buildJoinRoomUserPayload } from "@/utils/roomJoin";
import styles from "./page.module.scss";

interface InviteDetails {
  token: string;
  expiresAt: string;
  canJoin: boolean;
  reason: string | null;
  room: Room;
}

const resolveInviteError = (
  value: string | null | undefined,
  t: ReturnType<typeof useTranslations>,
) => {
  switch (value) {
    case "Room is full":
      return t("errors.full");
    case "Game already started":
      return t("errors.started");
    case "Private room access denied":
      return t("errors.denied");
    default:
      return t("errors.invalid");
  }
};

export default function InvitePage() {
  const t = useTranslations("InvitePage");
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const socket = useSocket();
  const { user, getUser } = useUserStore();

  const token = useMemo(
    () => (typeof params?.token === "string" ? params.token : ""),
    [params],
  );

  const [invite, setInvite] = useState<InviteDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingInvite, setLoadingInvite] = useState(true);
  const [joining, setJoining] = useState(false);
  const joinAttemptedRef = useRef(false);

  useEffect(() => {
    if (user) return;

    getUser().catch(() => {
      setError(t("errors.session"));
    });
  }, [getUser, t, user]);

  useEffect(() => {
    if (!token) {
      setLoadingInvite(false);
      setError(t("errors.invalid"));
      return;
    }

    let cancelled = false;

    const loadInvite = async () => {
      setLoadingInvite(true);

      try {
        const { data } = await api.get(`/room-invites/${token}`);
        if (cancelled) return;

        const nextInvite = data?.invite as InviteDetails | undefined;
        if (!nextInvite) {
          setError(t("errors.invalid"));
          return;
        }

        setInvite(nextInvite);

        if (!nextInvite.canJoin) {
          setError(resolveInviteError(nextInvite.reason, t));
        }
      } catch (error: unknown) {
        if (cancelled) return;

        const message =
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (
            error as { response?: { data?: { error?: { message?: string } } } }
          ).response?.data?.error?.message === "string"
            ? (
                error as {
                  response?: { data?: { error?: { message?: string } } };
                }
              ).response?.data?.error?.message
            : null;

        setError(resolveInviteError(message, t));
      } finally {
        if (!cancelled) {
          setLoadingInvite(false);
        }
      }
    };

    loadInvite();

    return () => {
      cancelled = true;
    };
  }, [t, token]);

  useEffect(() => {
    if (!socket || !invite || !user || error || joinAttemptedRef.current) {
      return;
    }

    joinAttemptedRef.current = true;
    setJoining(true);

    socket.emit(
      "joinRoom",
      invite.room.id,
      user._id,
      buildJoinRoomUserPayload(user),
      { inviteToken: token },
    );
  }, [error, invite, socket, token, user]);

  useEffect(() => {
    if (!socket || !invite || !user) return;

    const handleRoom = (room: Room) => {
      if (room.id !== invite.room.id) return;

      const joined = room.users.some(
        (roomUser) => roomUser.id === user._id && roomUser.status !== "left",
      );

      if (joined) {
        const occupiedSeats = new Set(
          room.users
            .filter((roomUser) => roomUser.status !== "left")
            .map((roomUser) => roomUser.id),
        ).size;

        router.push(
          room.isActive && occupiedSeats >= 4 ? `/rooms/${room.id}` : "/rooms",
        );
      }
    };

    const handleSocketError = (message: string) => {
      setJoining(false);
      setError(resolveInviteError(message, t));
    };

    socket.on("getRoom", handleRoom);
    socket.on("error", handleSocketError);

    return () => {
      socket.off("getRoom", handleRoom);
      socket.off("error", handleSocketError);
    };
  }, [invite, router, socket, t, user]);

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>{t("eyebrow")}</p>
        <h1>{invite?.room?.name || t("title")}</h1>

        {loadingInvite && <p>{t("states.loadingInvite")}</p>}
        {!loadingInvite && !user && <p>{t("states.loadingSession")}</p>}
        {!loadingInvite && !error && joining && <p>{t("states.joining")}</p>}
        {invite?.expiresAt && !error && (
          <p className={styles.meta}>
            {t("expires", {
              date: new Date(invite.expiresAt).toLocaleString(),
            })}
          </p>
        )}
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button onClick={() => router.push("/rooms")}>
            {t("cta.rooms")}
          </button>
          <button onClick={() => router.push("/")}>{t("cta.home")}</button>
        </div>
      </section>
    </main>
  );
}
