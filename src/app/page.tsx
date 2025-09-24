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
  const aboutTextPhase1Ref = useRef<HTMLParagraphElement>(null);
  const aboutTextPhase2Ref = useRef<HTMLParagraphElement>(null);
  const aboutTextPhase3Ref = useRef<HTMLParagraphElement>(null);
  const aboutTextPhase4Ref = useRef<HTMLParagraphElement>(null);
  const aboutTitleRef = useRef<HTMLHeadingElement>(null);
  const aboutImage1Ref = useRef<HTMLImageElement>(null);
  const aboutImage2Ref = useRef<HTMLImageElement>(null);
  const aboutImage3Ref = useRef<HTMLImageElement>(null);
  const aboutImage4Ref = useRef<HTMLImageElement>(null);
  const [currentTextPhase, setCurrentTextPhase] = useState(1);
  const [currentImagePhase, setCurrentImagePhase] = useState(1);

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
      let additionalScrollCount = 0;
      let isAtEnd = false;
      let scrollAccumulator = 0; // Accumulate small scroll events
      let lastScrollTime = 0;
      let localCurrentPhase = 1; // Track phase locally to avoid React state delay

      // Function to handle phase transitions
      const triggerPhaseTransition = (targetPhase: number) => {
        // Get all text phase refs
        const textPhaseRefs = [
          aboutTextPhase1Ref.current,
          aboutTextPhase2Ref.current,
          aboutTextPhase3Ref.current,
          aboutTextPhase4Ref.current,
        ];

        // Get all image refs
        const imagePhaseRefs = [
          aboutImage1Ref.current,
          aboutImage2Ref.current,
          aboutImage3Ref.current,
          aboutImage4Ref.current,
        ];

        // Animate text phases with scale and fade
        textPhaseRefs.forEach((ref, index) => {
          if (ref) {
            const isActive = index + 1 === targetPhase;
            gsap.to(ref.parentElement, {
              opacity: isActive ? 1 : 0,
              scale: isActive ? 1 : 0.95,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        });

        // Animate images with scale and fade
        imagePhaseRefs.forEach((ref, index) => {
          if (ref) {
            const isActive = index + 1 === targetPhase;

            if (isActive) {
              // Entering image: start small and scale up
              gsap.fromTo(ref,
                {
                  opacity: 0,
                  scale: 0.9,
                },
                {
                  opacity: 1,
                  scale: 1,
                  duration: 0.5,
                  ease: "power2.out",
                }
              );
            } else {
              // Exiting image: fade out and scale down slightly
              gsap.to(ref, {
                opacity: 0,
                scale: 0.95,
                duration: 0.3,
                ease: "power2.out",
              });
            }
          }
        });

        // Update current image phase state
        setCurrentImagePhase(targetPhase);
      };

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();

        // Update scroll progress based on wheel direction (slower)
        scrollProgress += e.deltaY * 0.0003;

        // Check if we're at the end or in phase mode
        if (scrollProgress >= 1.0 || (isAtEnd && additionalScrollCount > 0)) {
          isAtEnd = true;
          scrollProgress = 1.0; // Lock at 100%

          // Accumulate scroll events for slower phase changes
          const currentTime = Date.now();
          const timeDiff = currentTime - lastScrollTime;

          // Only count significant scroll events (throttle fast scrolling)
          if (timeDiff > 150) { // 150ms minimum between counts (much slower response)
            scrollAccumulator += Math.sign(e.deltaY);

            // Require more scroll accumulation before counting
            if (Math.abs(scrollAccumulator) >= 2) {
              if (scrollAccumulator > 0 && additionalScrollCount < 12) {
                additionalScrollCount += 1; // Forward scroll (max 12 = Phase 4)
                console.log(`Forward scroll, count: ${additionalScrollCount}`);
              } else if (scrollAccumulator < 0 && additionalScrollCount > 0) {
                additionalScrollCount -= 1; // Backward scroll only if we have count
                console.log(`Backward scroll, count: ${additionalScrollCount}`);
              } else if (scrollAccumulator < 0 && additionalScrollCount === 0) {
                // Allow leaving the end section when at count 0
                isAtEnd = false;
                scrollProgress = 0.99; // Move slightly back
                console.log(`Leaving end section`);
              }

              scrollAccumulator = 0; // Reset accumulator
            }

            lastScrollTime = currentTime;
          }

        } else {
          isAtEnd = false;
          additionalScrollCount = 0; // Reset when not at end
          scrollProgress = Math.max(0, scrollProgress);
        }

        // Move container horizontally
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

        // Trigger About section animations when reaching ~40% scroll progress
        if (
          (window as any).aboutAnimations &&
          !(window as any).aboutAnimations.triggered &&
          scrollProgress >= 0.4
        ) {
          (window as any).aboutAnimations.triggered = true;

          // Create timeline for coordinated animations
          const tl = gsap.timeline();

          // First animate title
          tl.to((window as any).aboutAnimations.titleSplit.chars, {
            duration: 0.8,
            ease: "power2.out",
            y: 0,
            opacity: 1,
            stagger: 0.03,
          })
            // Then animate paragraph with slight delay (much faster)
            .to(
              (window as any).aboutAnimations.textSplit.chars,
              {
                duration: 0.25,
                ease: "power2.out",
                y: 0,
                opacity: 1,
                stagger: 0.005,
              },
              0.1
            );
        }

        // Simple 5-scroll phase system - only when at 100%
        if (isAtEnd && scrollProgress === 1.0) {
          // Calculate phase based on every 3 scrolls (faster phase changes)
          const targetPhase = Math.min(Math.max(Math.floor(additionalScrollCount / 3) + 1, 1), 4);

          console.log(`Scroll count: ${additionalScrollCount}, Local phase: ${localCurrentPhase}, Target phase: ${targetPhase}`);

          // Trigger transitions immediately when crossing boundaries
          if (targetPhase !== localCurrentPhase) {
            localCurrentPhase = targetPhase; // Update local phase immediately
            setCurrentTextPhase(targetPhase); // Update React state
            triggerPhaseTransition(targetPhase);
            console.log(`Phase changed to ${targetPhase}, scroll count: ${additionalScrollCount}`);
          }
        }
      };

      // Add wheel event listener
      window.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        window.removeEventListener("wheel", handleWheel);
      };
    }
  }, [loading]);

  // About section animations setup
  useEffect(() => {
    if (
      !loading &&
      aboutSectionRef.current &&
      aboutTextPhase1Ref.current &&
      aboutTitleRef.current
    ) {
      let titleSplit: any;
      let textSplit: any;

      const setupSplitAnimations = () => {
        // Setup title SplitText
        titleSplit = SplitText.create(aboutTitleRef.current, {
          type: "words,chars",
          linesClass: "split-line",
        });

        // Setup paragraph SplitText
        textSplit = SplitText.create(aboutTextPhase1Ref.current, {
          type: "words,chars",
          linesClass: "split-line",
        });

        // Set initial states - start below and invisible
        gsap.set(titleSplit.chars, {
          y: 80,
          opacity: 0,
        });

        gsap.set(textSplit.chars, {
          y: 60,
          opacity: 0,
        });
      };

      // Setup splits
      setupSplitAnimations();

      // Store refs for wheel event access
      (window as any).aboutAnimations = {
        titleSplit,
        textSplit,
        triggered: false,
      };

      // Cleanup function
      return () => {
        if (titleSplit) {
          titleSplit.revert();
        }
        if (textSplit) {
          textSplit.revert();
        }
        if ((window as any).aboutAnimations) {
          delete (window as any).aboutAnimations;
        }
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
              className="relative w-screen h-screen flex flex-shrink-0 bg-[#f9f9f9]"
            >
              {/* Two Column Layout */}
              <div className="w-full h-full flex">
                {/* Left Side - Text/Story (50%) */}
                <div className="w-1/2 h-full flex flex-col items-center pl-24 pr-20">
                  {/* Content Container - Centered */}
                  <div className="flex-1 flex flex-col justify-center items-center max-w-6xl w-full ">
                    {/* Main Heading */}
                    <div className="mb-16 text-center">
                      <h2
                        ref={aboutTitleRef}
                        className="font-manrope font-black text-7xl uppercase text-[#130c01] leading-tight"
                      >
                        Artan, or the Art of Remembering
                      </h2>
                    </div>

                    {/* Text Container for Phased Content */}
                    <div className="relative min-h-[400px] w-full max-w-5xl overflow-visible">
                      {/* Phase 1 Text - asAkid1 */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-100 w-full ">
                        <p
                          ref={aboutTextPhase1Ref}
                          className="font-manrope font-light text-2xl text-[#130c01] leading-relaxed text-center w-full px-4"
                        >
                          Je m’appelle Artan Rushidi. J’ai grandi entre les
                          montagnes de Macédoine du Nord, dans un décor où
                          chaque pierre semblait porter une mémoire ancienne.
                          Dans ces paysages, j’ai appris la simplicité et la
                          force du silence. À dix ans, la Belgique est devenue
                          ma seconde maison, et depuis, je vis entre deux pays,
                          deux langues, deux cultures. Ce va-et-vient entre ici
                          et ailleurs est devenu une part de moi. Très jeune, je
                          ressentais déjà ce besoin profond : laisser une trace,
                          inscrire mon passage dans le monde.
                        </p>
                      </div>

                      {/* Phase 2 Text - asAkid2 */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0">
                        <p ref={aboutTextPhase2Ref} className="font-manrope font-light text-2xl text-[#130c01] leading-relaxed text-center w-full px-4">
                          Enfant, j’étais fasciné par les constructions : les
                          murs, les formes, les architectures qui défiaient le
                          temps. Cette admiration m’a naturellement conduit vers
                          des études d’architecture, persuadé que bâtir des
                          espaces, c’était écrire une histoire durable. Mais
                          l’art est entré dans ma vie presque par accident. Pour
                          arrondir mes fins de mois, je peignais et
                          personnalisais des chaussures. Peu à peu, ce geste est
                          devenu langage. J’ai compris que créer n’était pas
                          seulement une activité, mais une nécessité vitale : ma
                          manière de parler au monde, de raconter sans mots.
                        </p>
                      </div>

                      {/* Phase 3 Text - asAgrownup1 */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0">
                        <p ref={aboutTextPhase3Ref} className="font-manrope font-light text-2xl text-[#130c01] leading-relaxed text-center w-full px-4">
                          À travers mes œuvres, j’ai appris à marcher dans mes
                          souvenirs, à revivre mes émotions, à donner une forme
                          visible à ce qui m’habitait. Ma première exposition,
                          avec trente paires de chaussures peintes, fut un
                          moment fondateur : chaque pièce était une mémoire, un
                          fragment de moi offert aux regards. De là est né
                          ARTIK, un projet qui a grandi avec moi, traversant les
                          réseaux sociaux, les expositions et les rencontres.
                          Aujourd’hui, mes créations sont plus que des objets :
                          elles sont des poèmes visuels, des nœuds de mémoire,
                          des émotions suspendues dans le temps.
                        </p>
                      </div>

                      {/* Phase 4 Text - asAgrownup2 */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0">
                        <p ref={aboutTextPhase4Ref} className="font-manrope font-light text-2xl text-[#130c01] leading-relaxed text-center w-full px-4">
                          Je crois que l’art est avant tout un acte de mémoire
                          et de présence. Une manière de se rappeler, de relier,
                          de résister à l’oubli. Mon rêve est de continuer à
                          faire voyager mes créations, de collaborer avec le
                          monde de la mode et de l’art, et d’utiliser une partie
                          de ce que je construis pour soutenir des causes qui
                          comptent. Chaque œuvre est un pont jeté entre passé et
                          avenir, un espace où les souvenirs deviennent lumière.
                          Dans un monde saturé d’images, je veux offrir un temps
                          d’arrêt, une invitation à ressentir. Car au fond,
                          seules les émotions véritables restent gravées dans
                          les cœurs.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom explanation - positioned at bottom of left div only */}
                  <div className="flex justify-center mb-8">
                    <p className="font-ibm-plex-mono text-xs text-gray-600 opacity-60 leading-relaxed text-center max-w-5xl px-6 py-3">
                      This section reveals Artan's journey through scroll
                      interaction. As you scroll down, witness the evolution of
                      text that tells his story in four phases. Artan's work
                      weaves together memories, heritage, and contemporary
                      expression through the delicate art of lacework.
                    </p>
                  </div>
                </div>

                {/* Right Side - Images (50%) */}
                <div className="w-1/2 h-full relative overflow-hidden">
                  {/* Phase 1 Image - Childhood in Macedonia */}
                  <img
                    ref={aboutImage1Ref}
                    src="/ArtanasaKid.png"
                    alt="Artan Rushidi as a child in Macedonia - surrounded by traditional crafts"
                    className="absolute inset-0 w-full h-full object-cover opacity-100"
                  />

                  {/* Phase 2 Image - Architecture Studies */}
                  <img
                    ref={aboutImage2Ref}
                    src="/ArtanasaKid2.jpg"
                    alt="Artan during his architecture studies in Belgium"
                    className="absolute inset-0 w-full h-full object-cover opacity-0"
                  />

                  {/* Phase 3 Image - First Exhibition */}
                  <img
                    ref={aboutImage3Ref}
                    src="/ArtanasaGrownup1.jpg"
                    alt="Artan at his first exhibition - artist discovering his voice"
                    className="absolute inset-0 w-full h-full object-cover opacity-0"
                  />

                  {/* Phase 4 Image - Today's Artist */}
                  <img
                    ref={aboutImage4Ref}
                    src="/ArtanasaGrownup2.jpg"
                    alt="Artan Rushidi today - master of lacework and contemporary expression"
                    className="absolute inset-0 w-full h-full object-cover opacity-0"
                  />
                </div>
              </div>
            </section>
          </div>
        </main>
      )}
    </div>
  );
}
