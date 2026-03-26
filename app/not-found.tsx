import Link from "next/link";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1>404 - Page Not Found</h1>
      <p>
        Sorry, the page you are looking for does not exist. It might have been
        moved or deleted.
      </p>
      <Link href="/">Go back to Home</Link>
    </div>
  );
}
