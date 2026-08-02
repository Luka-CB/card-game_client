"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import styles from "./LanguageSwitcher.module.scss";
import GeoFlag from "@/public/svgs/GeoFlag";
import RusFlag from "@/public/svgs/RusFlag";
import EngFlag from "@/public/svgs/EngFlag";

const localeOptions = {
  en: { flag: <EngFlag />, short: "EN" },
  ka: { flag: <GeoFlag />, short: "KA" },
  ru: { flag: <RusFlag />, short: "RU" },
} as const;

export default function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale() as keyof typeof localeOptions;
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setMenuStyle(undefined);
      return;
    }

    const updateMenuPosition = () => {
      const root = rootRef.current;
      const menu = menuRef.current;

      if (!root || !menu) {
        return;
      }

      const viewportPadding = 8;
      const rootRect = root.getBoundingClientRect();
      const menuWidth = menu.offsetWidth;
      const viewportWidth = window.innerWidth;
      const rightAlignedLeft = rootRect.width - menuWidth;
      const minLeft = viewportPadding - rootRect.left;
      const maxLeft =
        viewportWidth - viewportPadding - rootRect.left - menuWidth;
      const clampedLeft = Math.min(
        Math.max(rightAlignedLeft, minLeft),
        maxLeft,
      );

      setMenuStyle({ left: `${clampedLeft}px` });
    };

    const frameId = window.requestAnimationFrame(updateMenuPosition);

    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [isOpen]);

  const current = localeOptions[locale];

  return (
    <div className={styles.switcher} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className={styles.flag}>{current.flag}</span>
        <span className={styles.value}>{t(locale)}</span>
        <span className={styles.chevron} aria-hidden="true">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen ? (
        <div
          ref={menuRef}
          className={styles.menu}
          role="listbox"
          aria-label={t("label")}
          style={menuStyle}
        >
          {routing.locales.map((item) => {
            const option = localeOptions[item as keyof typeof localeOptions];
            const isActive = item === locale;

            return (
              <button
                key={item}
                type="button"
                role="option"
                aria-selected={isActive}
                className={`${styles.option} ${isActive ? styles.active : ""}`}
                onClick={() => {
                  setIsOpen(false);
                  router.replace(pathname, { locale: item });
                }}
              >
                <div className={styles.country}>
                  <span className={styles.flag}>{option.flag}</span>
                  <span className={styles.optionLabel}>{t(item)}</span>
                </div>
                <span className={styles.short}>{option.short}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
