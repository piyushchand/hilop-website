'use client';

import Lenis from '@studio-freight/lenis';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

interface ScrollProviderProps {
  children: ReactNode;
}

type LenisContextType = {
  lenis: Lenis | null;
  isReady: boolean;
};

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  isReady: false,
});

export const useLenis = () => useContext(LenisContext);

export function ScrollProvider({ children }: ScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const [isReady, setIsReady] = useState(false);
  const rafRef = useRef<number | null>(null);

  const initLenis = useCallback(() => {
    if (typeof window === 'undefined') return null;

    const lenis = new Lenis({
      duration: 1.6, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.2, 
      infinite: false,
      lerp: 0.1, 
    });

    return lenis;
  }, []);

  const createRaf = useCallback((lenis: Lenis) => {
    if (!lenis) return null;

    const animate = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return rafRef.current;
  }, []);

  const handleResize = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.resize();
    }
  }, []);

  useEffect(() => {
    const lenis = initLenis();
    if (!lenis) return;

    lenisRef.current = lenis;

    createRaf(lenis);

    window.addEventListener('resize', handleResize);

    setIsReady(true);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }

      window.removeEventListener('resize', handleResize);
      setIsReady(false);
    };
  }, [initLenis, createRaf, handleResize]);

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, isReady }}>
      {children}
    </LenisContext.Provider>
  );
}
