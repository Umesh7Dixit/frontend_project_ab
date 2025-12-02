"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";

type NotificationItem = {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
};

const notifications: NotificationItem[] = [
  {
    id: 1,
    title: "Your bid is placed",
    description: "waiting for auction ended",
    time: "24 Minutes ago",
    icon: <div className="bg-blue-100 text-blue-600 p-2 rounded-full">🔄</div>,
  },
  {
    id: 2,
    title: "You have new message",
    description: "2 unread messages",
    time: "1 Hours ago",
    icon: (
      <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full">💬</div>
    ),
  },
  {
    id: 3,
    title: "New item created",
    description: "in nft art category",
    time: "4 Days ago",
    icon: <div className="bg-teal-100 text-teal-600 p-2 rounded-full">📦</div>,
  },
];

type NotificationProps = {
  open: boolean;
  onClose: () => void;
};

export default function Notification({ open, onClose }: NotificationProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end items-start"
        >
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative mt-2 mr-2 w-80"
          >
            <Card className="rounded-xl shadow-2xl border border-gray-200 bg-white/80 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Notification
                </CardTitle>
                <p className="text-sm text-gray-500">
                  You have 0 unread messages
                </p>
              </CardHeader>
              <Separator />
              <CardContent className="p-0">
                <div className="divide-y">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-4 hover:bg-gray-50 transition cursor-pointer"
                    >
                      <span> {item.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                          <Clock size={12} />
                          {item.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
