"use client";

/**
 * @author: @dorianbaffier
 * @description: Dynamic Text
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 *
 * Star Gardens edit: greetings in Indian languages, larger wood-theme styling,
 * and an onComplete callback so the intro can lift away when the greetings finish.
 */
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface Greeting {
  text: string;
  language: string;
}

const greetings: Greeting[] = [
  { text: "Hello", language: "English" },
  { text: "வணக்கம்", language: "Tamil" },
  { text: "ನಮಸ್ಕಾರ", language: "Kannada" },
  { text: "नमस्ते", language: "Hindi" },
  { text: "నమస్కారం", language: "Telugu" },
  { text: "നമസ്കാരം", language: "Malayalam" },
  { text: "Welcome", language: "English" },
];

interface DynamicTextProps {
  onComplete?: () => void;
  interval?: number;
}

const DynamicText = ({ onComplete, interval = 300 }: DynamicTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= greetings.length) {
          clearInterval(timer);
          setIsAnimating(false);
          return prevIndex;
        }
        return nextIndex;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isAnimating, interval]);

  useEffect(() => {
    if (!isAnimating) onComplete?.();
  }, [isAnimating, onComplete]);

  // Animation variants for the text
  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -100, opacity: 0 },
  };

  return (
    <section
      aria-label="Rapid greetings in different languages"
      className="flex min-h-[200px] items-center justify-center gap-1 p-4"
    >
      <div className="relative flex h-28 w-[min(92vw,960px)] items-center justify-center overflow-visible">
        {isAnimating ? (
          <AnimatePresence mode="popLayout">
            <motion.div
              animate={textVariants.visible}
              aria-live="off"
              className="sg-greet absolute flex items-center gap-4"
              exit={textVariants.exit}
              initial={textVariants.hidden}
              key={currentIndex}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div aria-hidden="true" className="sg-greet-dot" />
              {greetings[currentIndex].text}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="sg-greet flex items-center gap-4">
            <div aria-hidden="true" className="sg-greet-dot" />
            {greetings[currentIndex].text}
          </div>
        )}
      </div>
    </section>
  );
};

export default DynamicText;
