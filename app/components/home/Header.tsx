import styles from "./Header.module.scss";
import { FaCaretDown } from "react-icons/fa6";

const Header = () => {
  return (
    <header className={styles.header}>
      <nav>
        <div className={styles.logo}>
          <h1>LOGO</h1>
        </div>
        <ul>
          <li>link one</li>
          <li>link two</li>
        </ul>
      </nav>
      <div className={styles.user}>
        <p>user name</p>
        <div className={styles.avatar}>
          <img
            src="https://richarddeescifi.co.uk/wp-content/uploads/2017/06/hgjh.jpg"
            alt="avatar"
            className={styles.avatar_img}
          />
          <div className={styles.caret}>
            <FaCaretDown className={styles.caret_icon} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
