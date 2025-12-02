import { cookies } from "next/headers";
import { ORGANIZATION_INFO } from "../constants";

export async function getOrgServer() {
    const store = await cookies();
    const raw = store.get(ORGANIZATION_INFO)?.value;
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export async function isOrgServer() {
    const org = await getOrgServer();
    return Boolean(org);
}
