"use client";

import React, { useEffect } from "react";
import { playClickSound, isSoundEnabled } from "@/lib/sound";

export const GlobalSoundListener: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    let lastTriggerTime = 0;

    const handleGlobalTouchOrClick = (e: PointerEvent | TouchEvent | MouseEvent) => {
      if (!isSoundEnabled()) return;

      const now = Date.now();
      // Throttle double-events (e.g. pointerdown followed immediately by mousedown/click within 70ms)
      if (now - lastTriggerTime < 70) return;
      lastTriggerTime = now;

      // Play Instagram/YouTube style haptic touch click sound on every touch/click across the entire site
      playClickSound();
    };

    // Attach to pointerdown phase for instantaneous zero-latency touch feedback
    window.addEventListener("pointerdown", handleGlobalTouchOrClick, { capture: true, passive: true });

    return () => {
      window.removeEventListener("pointerdown", handleGlobalTouchOrClick, { capture: true });
    };
  }, []);

  return <>{children}</>;
};
