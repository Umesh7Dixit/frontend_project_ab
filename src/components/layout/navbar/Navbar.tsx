"use client";

import { Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { springSmooth, springSnappy } from "@/lib/animations";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  // Flip to true as soon as the user scrolls any amount; false again at top.
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 0));

  return (
    <motion.header
      className="hidden md:block sticky top-0 z-40 mx-auto rounded-2xl border border-white/20 bg-[#dfdfdf] backdrop-blur-md"
      initial={{ width: "90%", marginTop: 10 }}
      animate={{ width: scrolled ? "100%" : "90%" }}
      transition={scrolled ? springSnappy : springSmooth}
    >
      <div className="flex h-14 w-full items-center justify-between px-4 md:px-6">
        <h6 className="text-sm font-bold text-[#0b1f1d] font-montserrat">
          Welcome back, <span className="text-primary">James</span>
        </h6>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-[#2b5f5d]/30"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#51b575] px-1 text-[10px] font-semibold text-white">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="inline-flex items-center gap-2 hover:bg-[#2b5f5d]/30"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    src="https://cdn.pixabay.com/photo/2023/08/27/14/17/man-8217185_1280.jpg"
                    alt="Profile"
                  />
                  <AvatarFallback>CA</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">James Pandean</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Company Profile</DropdownMenuItem>
              <DropdownMenuItem>Change Password</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[#dc2626]">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
