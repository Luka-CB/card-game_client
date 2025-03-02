"use client";

import Link from "next/link";
import styles from "./RouteLink.module.scss";
import { IoMdArrowRoundBack } from "react-icons/io";

interface propsIFace {
  route: string;
  text: string;
}

const RouteLink: React.FC<propsIFace> = ({ route, text }) => {
  return (
    <div className={styles.go_back_wrapper}>
      <div className={styles.go_back}>
        <IoMdArrowRoundBack className={styles.icon} />
        <Link href={route}>{text}</Link>
      </div>
    </div>
  );
};

export default RouteLink;
