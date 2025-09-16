'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const useGSAP = <T extends HTMLElement = HTMLDivElement>(callback: (context: { timeline: gsap.core.Timeline }) => void, dependencies: any[] = []) => {
  const ref = useRef<T>(null);
  const timelineRef = useRef<gsap.core.Timeline>();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      timelineRef.current = gsap.timeline();
      callback({ timeline: timelineRef.current });
    }, ref);

    return () => ctx.revert();
  }, dependencies);

  return ref;
};