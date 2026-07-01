"use client";

import styles from "./LevelBadge.module.scss";
import { useTranslations } from "next-intl";
import Image from "next/image";

type UserLevel =
  | "novice"
  | "amateur"
  | "competent"
  | "promising"
  | "professional"
  | "diabolical"
  | "legend"
  | "joker";

interface LevelBadgeProps {
  level?: string;
  compact?: boolean;
  className?: string;
}

const VALID_LEVELS: ReadonlySet<UserLevel> = new Set<UserLevel>([
  "novice",
  "amateur",
  "competent",
  "promising",
  "professional",
  "diabolical",
  "legend",
  "joker",
]);

const TYPO_MAP: Record<string, UserLevel> = {
  novece: "novice",
};

const BADGE_IMAGE_SRC: Record<UserLevel, string> = {
  novice: "/badges/novice.png",
  amateur: "/badges/amateur.png",
  competent: "/badges/competent.png",
  promising: "/badges/promising.png",
  professional: "/badges/professional.png",
  diabolical: "/badges/diabolical.png",
  legend: "/badges/legend.png",
  joker: "/badges/joker.png",
};

const normalizeLevel = (level?: string): UserLevel | null => {
  if (!level) return null;

  const normalized = level.toLowerCase().trim();
  if (TYPO_MAP[normalized]) {
    return TYPO_MAP[normalized];
  }

  const canonical = normalized as UserLevel;
  if (VALID_LEVELS.has(canonical)) return canonical;

  return null;
};

const formatUnknownLevel = (level: string) => {
  const normalized = level.trim().toLowerCase();
  if (!normalized) return "Level";

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  compact = false,
  className,
}) => {
  const t = useTranslations("LevelBadge");
  const normalizedLevel = normalizeLevel(level);
  if (!level) return null;

  const label = normalizedLevel
    ? t(`levels.${normalizedLevel}`)
    : formatUnknownLevel(level);
  const levelPrefix = t("label");
  const hasKnownLevel = Boolean(normalizedLevel);
  const imageWidth = compact ? 56 : 72;
  const imageHeight = compact ? 20 : 24;

  return (
    <span
      className={`${styles.badge} ${compact ? styles.compact : ""} ${className ?? ""}`.trim()}
      title={`${levelPrefix}: ${label}`}
      aria-label={`${levelPrefix}: ${label}`}
    >
      {hasKnownLevel && normalizedLevel ? (
        <Image
          src={BADGE_IMAGE_SRC[normalizedLevel]}
          alt=""
          width={imageWidth}
          height={imageHeight}
          className={styles.badge_img}
        />
      ) : (
        <span className={styles.badge_text}>{label}</span>
      )}
    </span>
  );
};

export default LevelBadge;
