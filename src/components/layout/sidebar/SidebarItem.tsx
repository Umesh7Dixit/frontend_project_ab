"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarItem as Item } from "./sidebar.data";
import { cn } from "@/lib/utils";

type Props = {
  item: Item;
  depth?: number;
  collapsed?: boolean;
  setOpenNotifications?: (val: boolean) => void;
};

export default function SidebarItem({
  item,
  depth = 0,
  collapsed = false,
  setOpenNotifications,
}: Props) {
  const pathname = usePathname();
  const isActive =
    item.href && pathname ? pathname.startsWith(item.href) : false;

  const padding = collapsed
    ? "px-2 justify-center"
    : depth === 0
      ? "px-3"
      : "pl-10 pr-3";
  const Icon = item.icon;

  const containerClass = cn(
    "group flex items-center gap-3 rounded-lg py-2 text-sm transition",
    padding,
    isActive ? "bg-[#2b5f5d] text-white" : "text-white/90 hover:bg-[#2b5f5d]/20"
  );

  if (item.action === "notifications") {
    return (
      <button
        onClick={() => setOpenNotifications?.(true)}
        className={containerClass}
        title={item.label}
      >
        {Icon && (
          <Icon
            className={cn(
              "shrink-0",
              collapsed ? "h-6 w-6" : "h-5 w-5",
              isActive ? "text-white" : "text-white/90"
            )}
            aria-hidden="true"
          />
        )}
        {!collapsed && <span className="truncate">{item.label}</span>}
      </button>
    );
  }

  return (
    <Link
      href={item.href ?? "#"}
      className={containerClass}
      title={item.label}
      aria-current={isActive ? "page" : undefined}
    >
      {Icon && (
        <Icon
          className={cn(
            "shrink-0",
            collapsed ? "h-6 w-6" : "h-5 w-5",
            isActive ? "text-white" : "text-white/90"
          )}
          aria-hidden="true"
        />
      )}
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}
