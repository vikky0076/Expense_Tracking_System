"use client";

import React, { useEffect } from "react";
import { playClickSound, isSoundEnabled } from "@/lib/sound";

function isInteractiveElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest(
      'button, a, input, select, textarea, summary, label, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [role="checkbox"], [role="switch"], [role="option"], [data-clickable], [tabindex]:not([tabindex="-1"])'
    )
  );
}

export const GlobalSoundListener: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    let lastTriggerTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchDown = false;
    let isTouchInteractive = false;

    const triggerSound = () => {
      if (!isSoundEnabled()) return;
      const now = Date.now();
      if (now - lastTriggerTime < 80) return;
      lastTriggerTime = now;
      playClickSound();
    };

    const handlePointerDown = (e: PointerEvent) => {
      const interactive = isInteractiveElement(e.target);

      if (e.pointerType === "touch") {
        isTouchDown = true;
        isTouchInteractive = interactive;
        touchStartX = e.clientX;
        touchStartY = e.clientY;
        // Do NOT play sound on pointerdown for touch to avoid playing audio during scroll gestures
      } else if (e.pointerType === "mouse" && interactive) {
        triggerSound();
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerType === "touch" && isTouchDown) {
        isTouchDown = false;
        const dragDistance = Math.hypot(e.clientX - touchStartX, e.clientY - touchStartY);
        
        // Only trigger sound if the touch tap didn't move significantly (i.e. not a scroll/swipe)
        // and occurred on an interactive target
        if (dragDistance < 8 && isTouchInteractive) {
          triggerSound();
        }
      }
    };

    const handlePointerCancel = () => {
      isTouchDown = false;
      isTouchInteractive = false;
    };

    window.addEventListener("pointerdown", handlePointerDown, { capture: true, passive: true });
    window.addEventListener("pointerup", handlePointerUp, { capture: true, passive: true });
    window.addEventListener("pointercancel", handlePointerCancel, { capture: true, passive: true });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown, { capture: true });
      window.removeEventListener("pointerup", handlePointerUp, { capture: true });
      window.removeEventListener("pointercancel", handlePointerCancel, { capture: true });
    };
  }, []);

  return <>{children}</>;
};

