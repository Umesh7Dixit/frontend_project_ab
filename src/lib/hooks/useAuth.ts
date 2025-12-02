"use client";

import { useEffect, useState } from "react";
import { isLoggedInClient } from "../auth/client";

export function useAuth() {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        setAuthenticated(isLoggedInClient());
    }, []);

    return authenticated;
}
