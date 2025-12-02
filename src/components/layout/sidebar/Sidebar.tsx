// Sidebar.tsx
"use client";

import Image from "next/image";
import * as React from "react";
import { Bell, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  SIDEBAR_ITEMS,
  SidebarItem as ItemType,
  ROUTE_MAP,
} from "./sidebar.data";
import { useScreen } from "@/lib/hooks/useScreen";
import { Avatar, AvatarFallback} from "@/components/ui/avatar";
import SidebarItem from "./SidebarItem";
import { cn } from "@/lib/utils";
import { MotionButton } from "@/components/MotionItems";
import { useUser } from "@/lib/context/EntriesContext";

/** simple matcher: exact or prefix "/*" */
function matchPattern(pathname: string, pattern: string) {
  if (pattern === "fallback") return false;
  if (pattern.endsWith("/*")) {
    const prefix = pattern.slice(0, -1);
    return pathname.startsWith(prefix);
  }
  return pathname === pattern;
}

/** pick longest matching key (most specific) */
function pickRouteKey(pathname: string) {
  const keys = Object.keys(ROUTE_MAP).filter((k) => k !== "fallback");
  const matches = keys.filter((k) => matchPattern(pathname, k));
  if (matches.length === 0) return "fallback";
  return matches.sort((a, b) => b.length - a.length)[0];
}

/** find item by id */
function findItem(id: string): ItemType | undefined {
  return SIDEBAR_ITEMS.find((it) => it.id === id);
}

export default function Sidebar({ setOpenNotifications }: any) {
  const { user } = useUser();
  const name = user?.full_name || "John Doe";
  const { isLgUp } = useScreen();
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const [collapsed, setCollapsedState] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem("sidebar:collapsed");
    if (stored !== null) setCollapsedState(stored === "1");
    else setCollapsedState(!isLgUp);
  }, [isLgUp]);

  // persist collapsed whenever it changes
  const setCollapsed = React.useCallback(
    (updater: boolean | ((p: boolean) => boolean)) => {
      setCollapsedState((prev) => {
        const next =
          typeof updater === "function"
            ? (updater as (p: boolean) => boolean)(prev)
            : updater;
        try {
          localStorage.setItem("sidebar:collapsed", next ? "1" : "0");
        } catch {
          // ignore (SSR or privacy)
        }
        return next;
      });
    },
    []
  );

  const visibleIds = React.useMemo(() => {
    const key = pickRouteKey(pathname);
    return ROUTE_MAP[key] ?? ROUTE_MAP["fallback"];
  }, [pathname]);

  const visibleItems = React.useMemo(() => {
    return visibleIds.map((id) => findItem(id)).filter(Boolean) as ItemType[];
  }, [visibleIds]);

  const ariaExpanded = collapsed ? "false" : "true";

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);



  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-white/10 bg-[#0b1f1d]/90 backdrop-blur transition-[width] duration-200 rounded-tr-2xl",
        collapsed
          ? "sticky top-0 w-16 rounded-tr-none"
          : "lg:sticky lg:top-0 lg:w-64 fixed inset-y-0 left-0 z-50 w-72"
      )}
      aria-label="Sidebar"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
          role="button"
          tabIndex={0}
        >
          {mounted && isLgUp && (
            <Image
              src="/icons/main.png"
              alt="CarbonScan.ai"
              width={28}
              height={28}
              className="rounded-md"
            />
          )}
          {!collapsed && (
            <span
              className="truncate text-sm font-semibold text-white"
              onClick={() => router.push("/")}
            >
              CarbonScan.ai
            </span>
          )}
        </div>


        <button
          type="button"
          onClick={() => setCollapsed((s) => !s)}
          role="button"
          aria-expanded={ariaExpanded}
          title={collapsed ? "Expand" : "Collapse"}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 cursor-pointer",
            collapsed &&
            "absolute right-[-41] top-0 bg-[#0b1f1d]/90 text-white rounded-md rounded-l-none z-[999] h-10 w-10"
          )}
        >
          <Menu className="h-4 w-4" />
        </button>

      </div>

      <nav
        className="mt-2 flex-1 overflow-y-auto px-2 pb-4"
        aria-label="Primary"
      >
        <div className="space-y-1">
          {visibleItems.map((item) => {
            if (item.id === "back") {
              return (
                <button
                  key="back"
                  onClick={() => router.back()}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-lg py-2 px-3 text-sm transition",
                    "text-white/90 hover:bg-[#2b5f5d]/20",
                    collapsed ? "justify-center px-2" : ""
                  )}
                  title={item.label}
                >
                  {item?.icon && <item.icon />}
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {collapsed && <span className="sr-only">{item.label}</span>}
                </button>
              );
            }

            return (
              <SidebarItem
                key={item.id}
                item={item}
                collapsed={collapsed}
                setOpenNotifications={setOpenNotifications}
              />
            );
          })}
        </div>
      </nav>

      <div
        className={cn(
          "px-3 py-3 text-xs text-white/40",
          collapsed ? "flex items-center justify-center" : ""
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between w-full gap-3 cursor-pointer bg-primary/90",
            collapsed ? "p-[6px] rounded-full" : "px-3 py-2 rounded-3xl"
          )}
          onClick={() => router.push("/settings")}
          role="button"
        >
          <div className="flex items-center gap-3">
            <Avatar className={collapsed ? "size-7" : "size-8 "}>
              <AvatarFallback className="text-black/80 text-lg">{name?.charAt(0)}</AvatarFallback>
            </Avatar>

            {!collapsed && <span className="text-white">{name}</span>}
          </div>

          {!collapsed && (
            <MotionButton
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setOpenNotifications(true);
              }}
              variant="ghost"
              size="icon"
              className="relative bg-secondary rounded-full text-white"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </MotionButton>
          )}
        </div>


        {!collapsed && (
          <div className="mt-2 text-xs text-white/40">© CarbonScan.ai</div>
        )}
      </div>
    </aside>
  );
}
