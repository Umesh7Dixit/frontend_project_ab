"use client";

import * as React from "react";

export function useMediaQuery(query: string) {
    const get = () =>
        typeof window !== "undefined"
            ? window.matchMedia(query).matches
            : false;

    const [matches, setMatches] = React.useState<boolean>(get);

    React.useEffect(() => {
        if (typeof window === "undefined") return;
        const mql = window.matchMedia(query);
        const onChange = () => setMatches(mql.matches);
        onChange(); // sync once
        mql.addEventListener?.("change", onChange);
        return () => mql.removeEventListener?.("change", onChange);
    }, [query]);

    return matches;
}
