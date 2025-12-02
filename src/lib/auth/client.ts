import Cookies from "js-cookie";
import { COOKIE_USER_INFO, ORGANIZATION_INFO } from "../constants";

const AUTH_KEY = COOKIE_USER_INFO;
const ORG_KEY = ORGANIZATION_INFO;

const USER_DATA_KEY = "user_data";
const LOGIN_TIMESTAMP_KEY = "login_timestamp";
const TOKEN_EXPIRY_HOURS = 24

// export const MOCK_USER = {
//     email: "admin@gmail.com",
//     password: "admin",
// };

// export const loginUser = (token: string) => {
//     Cookies.set(AUTH_KEY, token, { expires: 1 });
// };

export const loginUser = (token: string, userData?: any) => {
    const now = new Date().toISOString();
    Cookies.set(AUTH_KEY, token, { expires: 1 });
    Cookies.set(LOGIN_TIMESTAMP_KEY, now, { expires: 1 });
    if (userData) {
        // Cookies.set('user_data', JSON.stringify(userData), { expires: 1 });
        Cookies.set(USER_DATA_KEY, JSON.stringify(userData), { expires: 1 });
    }
};

export const logoutUser = () => {
    Cookies.remove(AUTH_KEY);
    Cookies.remove(USER_DATA_KEY);
    Cookies.remove(LOGIN_TIMESTAMP_KEY);
    Cookies.remove(ORG_KEY);
};

// export const isLoggedInClient = () => {
//     return Boolean(Cookies.get(AUTH_KEY));
// };


export const isLoggedInClient = (): boolean => {
    const token = Cookies.get(AUTH_KEY);
    const loginTime = Cookies.get(LOGIN_TIMESTAMP_KEY);

    if (!token || !loginTime) {
        return false;
    }

    const loginDate = new Date(loginTime);
    const now = new Date();

    const hoursSinceLogin = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

    // 🔥 If more than 24 hours, auto-logout
    if (hoursSinceLogin > TOKEN_EXPIRY_HOURS) {
        logoutUser();
        return false;
    }

    return true;
};

export const MOCK_FACILITY = {
    id: "",
    name: "",
    role: "admin",
};

// export const loginOrgClient = (org: typeof MOCK_FACILITY) => {
//     Cookies.set(ORG_KEY, JSON.stringify(org), { expires: 1 });
// };

// export const logoutOrgClient = () => {
//     Cookies.remove(ORG_KEY);
// };


export const loginOrgClient = (org: any) => {
  Cookies.set(ORG_KEY, JSON.stringify(org), { expires: 1 });
};

export const logoutOrgClient = () => {
  Cookies.remove(ORG_KEY);
};