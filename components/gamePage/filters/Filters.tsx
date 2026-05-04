import { useEffect } from "react";
import styles from "./Filters.module.scss";
import useFilterStore from "@/store/gamePage/filterStore";
import useUserStore from "@/store/user/userStore";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FaTimesCircle } from "react-icons/fa";

const Filters = () => {
  const t = useTranslations("GamePage.filters");

  const { usersOnline, user } = useUserStore();
  const { showFilterOptions, checkedFilters, setCheckedFilters } =
    useFilterStore();

  useEffect(() => {}, []);

  return (
    <AnimatePresence>
      {showFilterOptions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            type: "spring",
          }}
          exit={{ opacity: 0, y: 20 }}
          className={styles.filters}
        >
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              name="classic"
              id="classic"
              checked={checkedFilters.classic}
              onChange={() =>
                setCheckedFilters({
                  ...checkedFilters,
                  classic: !checkedFilters.classic,
                })
              }
            />
            <label htmlFor="classic">{t("classic")}</label>
          </div>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              name="nines"
              id="nines"
              checked={checkedFilters.nines}
              onChange={() =>
                setCheckedFilters({
                  ...checkedFilters,
                  nines: !checkedFilters.nines,
                })
              }
            />
            <label htmlFor="nines">{t("nines")}</label>
          </div>
          <div className={styles.checkbox}>
              <input
                type="checkbox"
                name="betting"
                id="betting"
                checked={checkedFilters.betting}
                onChange={() =>
                  setCheckedFilters({
                    ...checkedFilters,
                    betting: !checkedFilters.betting,
                  })
                }
              />
              <label htmlFor="betting">{t("bet")}</label>
            </div>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              name="public"
              id="public"
              checked={checkedFilters.public}
              onChange={() =>
                setCheckedFilters({
                  ...checkedFilters,
                  public: !checkedFilters.public,
                })
              }
            />
            <label htmlFor="public">{t("public")}</label>
          </div>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              name="private"
              id="private"
              checked={checkedFilters.private}
              onChange={() =>
                setCheckedFilters({
                  ...checkedFilters,
                  private: !checkedFilters.private,
                })
              }
            />
            <label htmlFor="private">{t("private")}</label>
          </div>
          {usersOnline?.length > 100 && (
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                name="chat"
                id="chat"
                checked={checkedFilters.chat}
                onChange={() =>
                  setCheckedFilters({
                    ...checkedFilters,
                    chat: !checkedFilters.chat,
                  })
                }
              />
              <label htmlFor="chat">{t("chat")}</label>
            </div>
          )}
          <div className={styles.penalties}>
            <p>{t("penalties")}</p>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                name="200"
                id="200"
                checked={checkedFilters.penalties["200"]}
                onChange={() =>
                  setCheckedFilters({
                    ...checkedFilters,
                    penalties: {
                      ...checkedFilters.penalties,
                      "200": !checkedFilters.penalties["200"],
                    },
                  })
                }
              />
              <label htmlFor="200">200</label>
            </div>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                name="500"
                id="500"
                checked={checkedFilters.penalties["500"]}
                onChange={() =>
                  setCheckedFilters({
                    ...checkedFilters,
                    penalties: {
                      ...checkedFilters.penalties,
                      "500": !checkedFilters.penalties["500"],
                    },
                  })
                }
              />
              <label htmlFor="500">500</label>
            </div>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                name="900"
                id="900"
                checked={checkedFilters.penalties["900"]}
                onChange={() =>
                  setCheckedFilters({
                    ...checkedFilters,
                    penalties: {
                      ...checkedFilters.penalties,
                      "900": !checkedFilters.penalties["900"],
                    },
                  })
                }
              />
              <label htmlFor="900">900</label>
            </div>
          </div>
          <button
            className={styles.clear_filters}
            disabled={
              !checkedFilters.classic &&
              !checkedFilters.nines &&
              !checkedFilters.betting &&
              !checkedFilters.public &&
              !checkedFilters.private &&
              !checkedFilters.chat &&
              !checkedFilters.penalties["200"] &&
              !checkedFilters.penalties["500"] &&
              !checkedFilters.penalties["900"]
            }
            onClick={() =>
              setCheckedFilters({
                classic: false,
                nines: false,
                betting: false,
                public: false,
                private: false,
                chat: false,
                penalties: {
                  "200": false,
                  "500": false,
                  "900": false,
                },
              })
            }
          >
            <small>{t("btn")}</small>
            <FaTimesCircle className={styles.clear_icon} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Filters;
