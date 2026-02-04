import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Timer.module.scss";

interface AnimatedTimerProps {
  duration: number; // Duration of the timer in seconds
}

const Timer: React.FC<AnimatedTimerProps> = ({ duration }) => {
  const [progress, setProgress] = useState(0); // Progress from 0 to 1
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [isPulsating, setIsPulsating] = useState(false);

  // Function to interpolate color from green to red
  const interpolateColor = useCallback((value: number) => {
    // value is between 0 (green) and 1 (red)
    const r1 = 0; // Green R
    const g1 = 255; // Green G
    const b1 = 0; // Green B

    const r2 = 255; // Red R
    const g2 = 0; // Red G
    const b2 = 0; // Red B

    const r = Math.round(r1 + (r2 - r1) * value);
    const g = Math.round(g1 + (g2 - g1) * value);
    const b = Math.round(b1 + (b2 - b1) * value);

    return `rgb(${r}, ${g}, ${b})`;
  }, []);

  const animate = useCallback(
    (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const currentProgress = Math.min(elapsed / (duration * 1000), 1); // Ensure progress doesn't exceed 1

      setProgress(currentProgress);

      const pulsationStartPoint = 0.7;

      if (currentProgress >= pulsationStartPoint && currentProgress < 1) {
        setIsPulsating(true);
      } else {
        setIsPulsating(false);
      }

      if (currentProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Timer finished
        cancelAnimationFrame(animationFrameRef.current!);
        animationFrameRef.current = null;
        startTimeRef.current = null; // Reset for next run if needed
      }
    },
    [duration]
  );

  useEffect(() => {
    // Start animation on mount
    startTimeRef.current = null; // Reset start time
    setIsPulsating(false);
    animationFrameRef.current = requestAnimationFrame(animate);

    // Clean up on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate, duration]); // Re-run effect if duration or animate function changes

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const currentColor = interpolateColor(progress);

  const shadowFilterClass = isPulsating ? styles.shadowPulsate : styles.timer;

  return (
    <div className={styles.timerContainer}>
      <svg viewBox="0 0 200 200" className={shadowFilterClass}>
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#eee"
          strokeWidth="10"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={currentColor}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 100 100)" // Start from the top
          style={{ filter: isPulsating ? `url(#dropshadow)` : "none" }} // Smooth transition for progress updates
        />
        <text
          x="100"
          y="105"
          textAnchor="middle"
          fill="#AAA"
          fontSize="24px"
          dominantBaseline="middle"
        >
          {Math.ceil(duration * (1 - progress))}s
        </text>
      </svg>
    </div>
  );
};

export default Timer;
