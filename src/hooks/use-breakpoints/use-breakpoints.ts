import { useEffect, useState } from "react";
import { TBreakpoints } from "./use-breakpoints.types";

export const useBreakpoints = (): TBreakpoints => {
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xl2: 1536,
  };
  const { md, lg, xl, xl2 } = breakpoints;

  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setViewportWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    isMobile: viewportWidth < md,
    isTablet: viewportWidth >= md && viewportWidth < lg,
    isDesktop: viewportWidth >= lg && viewportWidth < xl,
    isDesktopOrHigher: viewportWidth >= lg,
    isLargeDesktop: viewportWidth >= xl && viewportWidth < xl2,
    isExtraLargeDesktop: viewportWidth >= xl2,
  };
};
