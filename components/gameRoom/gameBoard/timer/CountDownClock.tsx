import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import styles from "./CountDownClock.module.scss";

interface CountDownClockProps {
  duration?: number; // Duration in seconds
  fontSize?: number; // Font size for the time display
  textColor?: string; // Color for the countdown circle
  onComplete?: () => void;
}

const CountDownClock: React.FC<CountDownClockProps> = ({
  duration = 30,
  fontSize = 1,
  textColor,
  onComplete,
}) => {
  const controls = useAnimation();
  const backgroundControls = useAnimation();
  const [remainingTime, setRemainingTime] = useState(duration);

  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isCompletedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    isCompletedRef.current = false; // Reset completion flag
    setRemainingTime(duration); // Reset displayed time
    startTimeRef.current = Date.now(); // Record new start time

    controls.stop();
    backgroundControls.stop();

    intervalRef.current = setInterval(() => {
      if (isCompletedRef.current) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      const elapsedTime = Date.now() - (startTimeRef.current ?? Date.now());
      const newRemainingSeconds = Math.max(
        0,
        Math.round(duration - elapsedTime / 1000)
      );

      setRemainingTime((prev) =>
        prev === newRemainingSeconds ? prev : newRemainingSeconds
      );

      if (newRemainingSeconds <= 0) {
        isCompletedRef.current = true; // Set flag
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        try {
          onCompleteRef.current?.();
        } catch (error) {
          console.error(
            "CountDownClock: Error executing onComplete callback:",
            error
          ); // Log 9
        }
      }
    }, 250);

    controls.start({
      rotate: 360,
      transition: { duration: duration, ease: "linear" },
    });
    backgroundControls.start({
      strokeDashoffset: 0,
      "--hue": 0,
      transition: { duration: duration, ease: "linear" },
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [duration, controls, backgroundControls]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const initialHue = 120; // Green

  return (
    <div className={styles.clockContainer}>
      <svg className={styles.clockSvg} viewBox="0 0 100 100">
        {/* Static background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          className={styles.backgroundCircle}
        />
        {/* Animated circle with explicit initial state */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          className={styles.progressCircle}
          strokeDasharray={circumference}
          transform="rotate(-90 50 50)"
          key={duration}
          initial={{
            strokeDashoffset: circumference,
            "--hue": initialHue,
          }}
          animate={backgroundControls}
          style={
            {
              stroke: `hsl(var(--hue), 85%, 55%)`,
            } as React.CSSProperties
          }
        />
      </svg>
      {/* Animated Arrow */}
      <motion.div
        className={styles.arrowContainer}
        key={`${duration}-arrow`}
        initial={{ rotate: 0 }}
        animate={controls}
      >
        <div className={styles.arrow}></div>
      </motion.div>
      {/* Display remaining time */}
      <div
        style={{ fontSize: `${fontSize}rem`, color: textColor }}
        className={styles.timeDisplay}
      >
        {remainingTime}
      </div>
    </div>
  );
};

export default CountDownClock;
