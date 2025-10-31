'use client';

import { useEffect, useState } from 'react';

export type BreakpointState = {
  isMobile: boolean;
};

// Tailwind default breakpoint: sm = 640px (min-width). Mobile is < 640px.
const MOBILE_MAX_WIDTH_PX = 639.98;

export const useBreakpoint = (): BreakpointState => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH_PX}px)`);

    const update = () => setIsMobile(mediaQuery.matches);
    update();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update);
      return () => mediaQuery.removeEventListener('change', update);
    }
    // Safari fallback
    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  return { isMobile };
};

export default useBreakpoint;
