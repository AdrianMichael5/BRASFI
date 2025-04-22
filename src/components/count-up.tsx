"use client";

import { useState, useEffect, useRef } from "react";

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export function CountUp({
  end,
  start = 0,
  duration = 2000,
  prefix = "",
  suffix = "",
}: CountUpProps) {
  const [count, setCount] = useState(start);
  const countRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCount();
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);

  const animateCount = () => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min(1, (now - startTime) / duration);
      const currentCount = Math.floor(start + progress * (end - start));

      setCount(currentCount);

      if (now < endTime) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  };

  return (
    <div ref={countRef}>
      {prefix}
      {count}
      {suffix}
    </div>
  );
}
