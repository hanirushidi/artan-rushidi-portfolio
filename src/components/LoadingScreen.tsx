"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface LoadingScreenProps {
  onComplete: () => void;
  onTransitionStart: () => void;
}

const LoadingScreen = ({
  onComplete,
  onTransitionStart,
}: LoadingScreenProps) => {
  const greetingRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const counterNumberRef = useRef<HTMLSpanElement>(null);
  const loadingScreenRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const languages = [
    "BONJOUR",
    "HELLO",
    "CIAO",
    "مرحبا",
    "こんにちは",
    "HALLO",
    "안녕하세요",
  ];

  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

  useEffect(() => {
    const greeting = greetingRef.current;
    const counter = counterRef.current;
    const counterNumber = counterNumberRef.current;
    const screen = loadingScreenRef.current;

    if (!greeting || !counter || !counterNumber || !screen || hasAnimated.current) return;

    hasAnimated.current = true;

    // Initialize counter to 0
    counterNumber.textContent = "0";

    // Create timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Call onTransitionStart immediately before slide-up begins
        onTransitionStart();

        // Small pause to show 100%, then slide screen up
        gsap.to(screen, {
          y: "-100%",
          duration: 1.2,
          ease: "power2.inOut",
          delay: 0.5,
          onComplete: onComplete,
        });
      },
    });

    // Language cycling animation
    let currentLangIndex = 0;
    let langInterval: NodeJS.Timeout;

    // Cycle through languages
    langInterval = setInterval(() => {
      currentLangIndex = (currentLangIndex + 1) % languages.length;

      gsap.to(greeting, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          setCurrentLanguage(languages[currentLangIndex]);
          gsap.to(greeting, {
            opacity: 1,
            duration: 0.2,
          });
        },
      });
    }, 1000);

    // Counter animation from 0 to 100
    const counterObj = { value: 0 };
    tl.to(counterObj, {
      value: 100,
      duration: 4,
      ease: "power2.out",
      onUpdate: () => {
        counterNumber.textContent = Math.round(counterObj.value).toString();
      },
      onComplete: () => {
        // Stop the greeting animation when counter reaches 100
        clearInterval(langInterval);
        // Ensure counter stays at 100
        counterNumber.textContent = "100";
      },
      delay: 0.8,
    });

    // Cleanup
    return () => {
      clearInterval(langInterval);
      tl.kill();
    };
  }, [onComplete, onTransitionStart]);

  return (
    <div ref={loadingScreenRef} className="loading-screen ">
      <div ref={greetingRef} className="loading-greeting font-manrope">
        {currentLanguage}
      </div>
      <div ref={counterRef} className="loading-counter font-fraunces">
        <span ref={counterNumberRef}>0</span>
        <span>%</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
