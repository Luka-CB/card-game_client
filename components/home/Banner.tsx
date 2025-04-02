import Image from "next/image";
import styles from "./Banner.module.scss";

const Banner = () => {
  return (
    <div className={styles.banner}>
      <Image
        src="/banner-img.jpg"
        alt="banner image"
        fill
        className={styles.image}
      />
      <div className={styles.border}></div>
      <div className={styles.user_count}>
        <div className={styles.online}>
          <div className={styles.dot}></div>
          <small>online</small>
          <span>2469</span>
        </div>
        <div className={styles.total}>
          <div className={styles.dot}></div>
          <small>total</small>
          <span>15079</span>
        </div>
      </div>
      <div className={styles.glitch_wrapper}>
        <div className={styles.glitch} data-glitch="Joker Nation">
          Joker Nation
        </div>
      </div>
    </div>
  );
};

export default Banner;
