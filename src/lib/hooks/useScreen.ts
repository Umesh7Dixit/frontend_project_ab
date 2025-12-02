"use client";

import * as React from "react";
import { BREAKPOINTS, BreakpointKey } from "@/lib/constants";

type ScreenInfo = {
    width: number;
    height: number;
    bp: BreakpointKey;
    isSmDown: boolean;
    isMdDown: boolean;
    isLgDown: boolean;
    isSmUp: boolean;
    isMdUp: boolean;
    isLgUp: boolean;
    prefersReducedMotion: boolean;
    matches: (q: string) => boolean; // raw media query checker
};

const bpFromWidth = (w: number): BreakpointKey => {
    if (w >= BREAKPOINTS["2xl"]) return "2xl";
    if (w >= BREAKPOINTS.xl) return "xl";
    if (w >= BREAKPOINTS.lg) return "lg";
    if (w >= BREAKPOINTS.md) return "md";
    return "sm";
};

export function useScreen(): ScreenInfo {
    const getSize = () => {
        if (typeof window === "undefined")
            return { width: 0, height: 0, prm: false };
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            prm: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        };
    };

    const [{ width, height, prm }, setSize] = React.useState(getSize);

    React.useEffect(() => {
        if (typeof window === "undefined") return;

        let raf = 0;
        const onResize = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => setSize(getSize()));
        };

        window.addEventListener("resize", onResize, { passive: true });
        // sync once in case of hydration mismatch
        onResize();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    const bp = bpFromWidth(width);
    const isSmDown = width < BREAKPOINTS.md;
    const isMdDown = width < BREAKPOINTS.lg;
    const isLgDown = width < BREAKPOINTS.xl;

    const isSmUp = width >= BREAKPOINTS.sm;
    const isMdUp = width >= BREAKPOINTS.md;
    const isLgUp = width >= BREAKPOINTS.lg;

    const matches = React.useCallback((q: string) => {
        if (typeof window === "undefined") return false;
        return window.matchMedia(q).matches;
    }, []);

    return {
        width,
        height,
        bp,
        isSmDown,
        isMdDown,
        isLgDown,
        isSmUp,
        isMdUp,
        isLgUp,
        prefersReducedMotion: prm,
        matches,
    };
}
