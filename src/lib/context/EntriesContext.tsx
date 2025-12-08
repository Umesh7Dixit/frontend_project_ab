"use client";

import React, { createContext, useContext, useState } from "react";
import { UserContextType, UserTemplate } from "./utils";

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { },
    entries: [],
    scopedEntries: [],
    setEntries: () => { },
    addedEntries: [],
    setScopedEntries: () => { },
    isViewer: false,
    setAddedEntries: () => { },
    setIsViewer: () => { },
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<UserTemplate | null>(null);
    const [entries, setEntries] = useState<any[]>([]);
    const [scopedEntries, setScopedEntries] = useState<any[]>([]);
    const [addedEntries, setAddedEntries] = useState<any[]>([]);
    const [isViewer, setIsViewer] = useState(false);

    return (
        <UserContext.Provider value={{ isViewer, setIsViewer, user, setUser, entries, setEntries, addedEntries, setAddedEntries, scopedEntries, setScopedEntries }}>
            {children}
        </UserContext.Provider>
    );
};
