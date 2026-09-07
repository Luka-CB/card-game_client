import styles from "./Loader.module.scss";

const Loader = ({ fullPage }: { fullPage?: boolean }) => {
  if (fullPage) {
    return (
      <div className={styles.page_loader}>
        <span className={styles.loader}></span>
      </div>
    );
  }
  return <span className={styles.loader}></span>;
};

export default Loader;
