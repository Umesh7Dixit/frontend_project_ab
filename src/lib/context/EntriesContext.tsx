"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "@/lib/axios/axios";
import {  getUserId } from "../jwt";
import { UserApiResponse, UserContextType, UserTemplate } from "./utils";

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    entries: [],
    scopedEntries: [],
    setEntries: () => {},
    addedEntries: [],
    setScopedEntries: () => {},
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
    
    async function fetchUser(user_id: number) {
        try {
            const res = await axios.post<UserApiResponse>(
                "/getUserInfoByUserID",
                { user_id }
            );
            const templates = res?.data?.data?.templates;

            if (templates?.length) {
                setUser(templates[0]);
            }

        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    }

    useEffect(() => {
        const userId = getUserId();
        if (userId) {
            fetchUser(Number(userId));
        }
    }, []);

    return (
        <UserContext.Provider value={{ isViewer, setIsViewer, user, setUser, entries, setEntries, addedEntries, setAddedEntries, scopedEntries, setScopedEntries }}>
            {children}
        </UserContext.Provider>
    );
};
