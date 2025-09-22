"use client";

import { useState, useEffect, useRef } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { gsap } from "gsap";
import { RoughEase, ExpoScaleEase, SlowMo } from "gsap/EasePack";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(
  DrawSVGPlugin,
  MorphSVGPlugin,
  ScrambleTextPlugin,
  ScrollTrigger,
  SplitText,
  TextPlugin,
  RoughEase,
  ExpoScaleEase,
  SlowMo
);

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showHero, setShowHero] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00:00");
  const heroSectionRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const artanTextRef = useRef<HTMLDivElement>(null);
  const rushidiTextRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const imageRef1 = useRef<HTMLImageElement>(null);
  const imageRef2 = useRef<HTMLImageElement>(null);
  const imageRef3 = useRef<HTMLImageElement>(null);
  const imageOverlay1 = useRef<HTMLDivElement>(null);
  const imageOverlay2 = useRef<HTMLDivElement>(null);
  const imageOverlay3 = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const smallNameRef = useRef<HTMLDivElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);


  const handleTransitionStart = () => {
    setShowHero(true);
  };

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  // Update time every second - only after loading is complete
  useEffect(() => {
    if (!loading) {
      const updateTime = () => {
        const now = new Date();
        const belgiumTime = now.toLocaleTimeString("en-US", {
          timeZone: "Europe/Brussels",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setCurrentTime(belgiumTime);
      };

      updateTime(); // Set initial time
      const interval = setInterval(updateTime, 1000);

      return () => clearInterval(interval);
    }
  }, [loading]);

  // Custom cursor effect
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Hero text animations
  useEffect(() => {
    if (
      showHero &&
      artanTextRef.current &&
      rushidiTextRef.current &&
      menuRef.current &&
      descriptionRef.current &&
      smallNameRef.current
    ) {
      // Set initial positions completely outside the screen
      gsap.set(artanTextRef.current, { y: -window.innerHeight, opacity: 0 });
      gsap.set(rushidiTextRef.current, { y: window.innerHeight, opacity: 0 });
      gsap.set(menuRef.current, { x: 100, opacity: 0 });
      gsap.set(descriptionRef.current, { opacity: 0 });

      // Set image overlays to cover images completely from bottom
      if (
        imageOverlay1.current &&
        imageOverlay2.current &&
        imageOverlay3.current
      ) {
        gsap.set(
          [imageOverlay1.current, imageOverlay2.current, imageOverlay3.current],
          {
            height: "100%",
            transformOrigin: "bottom",
            y: 0,
          }
        );
      }
    }
  }, [showHero]);

  // Trigger animations after loading is complete
  useEffect(() => {
    if (
      !loading &&
      artanTextRef.current &&
      rushidiTextRef.current &&
      menuRef.current &&
      descriptionRef.current &&
      smallNameRef.current
    ) {
      // Animate in with synchronized timing for titles and menu
      gsap.to(artanTextRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
      });

      gsap.to(rushidiTextRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
      });

      // Menu slides in from right (synchronized with titles)
      gsap.to(menuRef.current, {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
      });

      // Description fades in
      gsap.to(descriptionRef.current, {
        opacity: 1,
        duration: 1.4,
        ease: "power3.out",
        delay: 0.5,
      });

      // Image reveal animation - staggered bottom to top reveal
      if (
        imageOverlay1.current &&
        imageOverlay2.current &&
        imageOverlay3.current
      ) {
        gsap.to(
          [imageOverlay3.current, imageOverlay2.current, imageOverlay1.current],
          {
            y: "100%",
            duration: 1.8,
            ease: "power3.out",
            delay: 0.8,
            stagger: 0.15,
          }
        );
      }
    }
  }, [loading]);

  // Simple horizontal scroll setup
  useEffect(() => {
    if (!loading && horizontalContainerRef.current) {
      let scrollProgress = 0;

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();

        // Update scroll progress based on wheel direction (slower)
        scrollProgress += e.deltaY * 0.0003;
        scrollProgress = Math.max(0, Math.min(1, scrollProgress));

        // Move container horizontally (less smooth)
        gsap.to(horizontalContainerRef.current, {
          x: -scrollProgress * window.innerWidth,
          duration: 0.6,
          ease: "power2.out",
        });

        // Animate name elements based on scroll progress
        if (artanTextRef.current) {
          gsap.to(artanTextRef.current, {
            y: -scrollProgress * 650,
            opacity: 1 - scrollProgress,
            duration: 0.6,
            ease: "power2.out",
          });
        }

        if (rushidiTextRef.current) {
          gsap.to(rushidiTextRef.current, {
            y: scrollProgress * 650,
            duration: 0.6,
            ease: "power2.out",
          });
        }

        // Show small logo when titles are completely off screen
        if (smallNameRef.current) {
          console.log("Scroll progress:", scrollProgress);
          // Slide logo down from top when scrollProgress > 0.4
          if (scrollProgress > 0.35) {
            gsap.to(smallNameRef.current, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
            });
          } else {
            gsap.to(smallNameRef.current, {
              y: -100,
              opacity: 0,
              duration: 0.8,
              ease: "power2.out",
            });
          }
        }

        // Animate images to the right and fade out from left
        if (imageRef1.current && imageRef2.current && imageRef3.current) {
          // Image 3 (leftmost) fades out first
          gsap.to(imageRef3.current.parentElement, {
            x: scrollProgress * 200,
            opacity: 1 - scrollProgress * 1.5,
            duration: 0.6,
            ease: "power2.out",
          });

          // Image 2 (middle) fades out second
          gsap.to(imageRef2.current.parentElement, {
            x: scrollProgress * 250,
            opacity: 1 - scrollProgress * 1.2,
            duration: 0.6,
            ease: "power2.out",
          });

          // Image 1 (rightmost) fades out last
          gsap.to(imageRef1.current.parentElement, {
            x: scrollProgress * 300,
            opacity: 1 - scrollProgress * 0.8,
            duration: 0.6,
            ease: "power2.out",
          });
        }
      };

      // Add wheel event listener
      window.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        window.removeEventListener("wheel", handleWheel);
      };
    }
  }, [loading]);

  return (
    <div
      className="h-screen overflow-hidden"
      style={
        {
          "--color-light": "#fffbf3",
          "--color-dark": "#2a2a2a",
        } as React.CSSProperties
      }
    >
      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[10000] w-2 h-2 bg-white rounded-full mix-blend-difference"
        style={{
          transform: "translate(-50%, -50%)",
        }}
      />

      {loading && (
        <LoadingScreen
          onComplete={handleLoadingComplete}
          onTransitionStart={handleTransitionStart}
        />
      )}

      {showHero && (
        <main className="h-screen overflow-hidden">
          {/* Fixed Menu - Always on screen */}
          <div
            ref={menuRef}
            className="fixed top-8 right-8 z-50 flex flex-col gap-2 mix-blend-difference"
          >
            <span className="font-ibm-plex-mono font-semibold text-[20px] text-white cursor-pointer animated-underline">
              PORTFOLIO
            </span>
            <span className="font-ibm-plex-mono text-[20px] font-semibold text-white cursor-pointer animated-underline">
              CONTACT
            </span>
          </div>

          {/* Small logo that appears when large titles exit */}
          <div
            ref={smallNameRef}
            className="fixed top-8 left-8 font-lovelo text-[32px] uppercase text-white z-50 opacity-0 mix-blend-difference"
          >
            ARTAN RUSHIDI
          </div>

          {/* Fixed time display */}
          <div className="fixed font-ibm-plex-mono text-[16px] text-white z-50 mix-blend-difference right-8 bottom-8 text-right">
            <p>Liège, Belgium</p>
            <p>{currentTime} CET</p>
          </div>

          {/* Horizontal Container */}
          <div ref={horizontalContainerRef} className="flex w-[200vw] h-screen">
            {/* Hero Section - Screen 1 */}
            <section
              ref={heroSectionRef}
              className="hero-section relative w-screen h-screen flex flex-col justify-between p-8 flex-shrink-0"
              style={{ backgroundColor: "#f9f9f9" }}
            >
              {/* Top Section: Name */}
              <div className="w-full flex justify-start items-start">
                <div className="flex flex-col">
                  <div
                    ref={artanTextRef}
                    className="font-manropue font-black text-[240px] uppercase leading-none text-[#130c01]"
                  >
                    Artan
                  </div>
                </div>
              </div>

              {/* Center Section: Description + Images */}
              <div className="w-full flex flex-row items-start justify-between h-full relative">
                <div
                  ref={descriptionRef}
                  className="font-manrope text-xl text-black max-w-1/6  mr-8"
                >
                  Belgian artist expressing memories and emotions through
                  lacework and visual art.
                </div>
                <div className="flex gap-3 justify-center w-full h-full items-center">
                  <div className="relative overflow-hidden rounded-lg w-[460px] h-[550px]">
                    <img
                      ref={imageRef3}
                      src="/HeroImage.png"
                      alt="Artan Rushidi Portrait 3"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                    <div
                      ref={imageOverlay3}
                      className="absolute inset-0 w-full h-full bg-[#f9f9f9] z-10 rounded-lg"
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-lg w-[460px] h-[550px]">
                    <img
                      ref={imageRef2}
                      src="/2.jpg"
                      alt="Artan Rushidi Portrait 2"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                    <div
                      ref={imageOverlay2}
                      className="absolute inset-0 w-full h-full bg-[#f9f9f9] z-10 rounded-lg"
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-lg w-[460px] h-[550px]">
                    <img
                      ref={imageRef1}
                      src="/1.jpg"
                      alt="Artan Rushidi Portrait 1"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                    <div
                      ref={imageOverlay1}
                      className="absolute inset-0 w-full h-full bg-[#f9f9f9] z-10 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Section: Lastname */}
              <div className="w-full flex justify-between items-end">
                <div className="flex flex-col">
                  <div
                    ref={rushidiTextRef}
                    className="font-manropue font-black text-[240px] uppercase leading-none text-[  #130c01]"
                  >
                    Rushidi
                  </div>
                </div>
              </div>
            </section>

            {/* About Artan Section - Screen 2 */}
            <section
              ref={aboutSectionRef}
              className="relative w-screen h-screen flex flex-col justify-center p-8 flex-shrink-0 bg-[#f9f9f9] border-l-2"
            ></section>
          </div>
        </main>
      )}
    </div>
  );
}
