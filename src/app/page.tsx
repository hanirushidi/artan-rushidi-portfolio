'use client';

import { useState, useEffect } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { gsap } from 'gsap';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showHero, setShowHero] = useState(false);

  const handleLoadingComplete = () => {
    setLoading(false);
    // Small delay before showing hero to ensure smooth transition
    setTimeout(() => {
      setShowHero(true);
    }, 100);
  };

  useEffect(() => {
    if (showHero) {
      // Set initial state - hidden
      gsap.set('.hero-content', {
        opacity: 0,
        y: 30,
        scale: 0.95,
      });

      // Animate in with cinematic effect
      gsap.to('.hero-content', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 2,
        ease: 'power2.out',
        delay: 0.3,
      });
    }
  }, [showHero]);

  return (
    <>
      {loading && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}
      
      {showHero && (
        <div className="w-screen h-screen flex items-center justify-center" style={{ backgroundColor: '#f3f4f6' }}>
          <div className="hero-content text-center">
            <h1 className="text-6xl font-light mb-4">Artan Rushidi</h1>
            <p className="text-xl text-gray-600">"Lace of Memories. Thread of Feelings."</p>
          </div>
        </div>
      )}
    </>
  );
}
