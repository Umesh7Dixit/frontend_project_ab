"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";
import RequestHeader from "./components/Header";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

type Comment = {
  id: number;
  name: string;
  text?: string;
  image?: string;
};

// ✅ Static mock comments (outside component so they don’t re-init each render)
const mockComments: Comment[] = [
  {
    id: 1,
    name: "Alice",
    text: "I’m not sure. But my creators struggled to create me useful",
  },
  {
    id: 2,
    name: "You",
    text: "Here’s a screenshot 👇",
    image:
      "https://cdn.prod.website-files.com/603404ef5024775bea8de703/6668018995093eddb0cf5ff1_dd%20cta%20image.webp",
  },
  {
    id: 3,
    name: "Alice",
    text: "Hopefully we’ll get better soon 🚀",
  },
];

const RequestAccess = ({ requestId }: { requestId: string }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const comments = mockComments;

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments.length]);

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <RequestHeader title="Request Access" />
      <div className="flex h-full">
        {/* Chat section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col bg-white/50 rounded-xl shadow-xl p-6"
        >
          <div className="space-y-6 p-4 bg-white/60 rounded-lg shadow-inner max-h-[400px] overflow-y-auto">
            <AnimatePresence>
              {comments.map((c) => {
                const isUser = c.name === "You";
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-md">
                      <p className="text-xs italic mb-1 text-gray-500">
                        {c.name}
                      </p>
                      <div
                        className={`px-4 py-2 rounded-2xl shadow-sm text-sm leading-relaxed ${
                          isUser
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        {c.text && <p className="mb-2">{c.text}</p>}
                        {c.image && (
                          <div
                            className="relative w-[300px] h-[180px] cursor-pointer hover:opacity-90 transition"
                            onClick={() => setSelectedImage(c.image!)}
                          >
                            <Image
                              src={c.image}
                              alt="attachment"
                              fill
                              className="object-cover rounded-lg shadow-md"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="mt-4 flex gap-2">
            <Input placeholder="Write a comment..." className="flex-1" />
            <Button variant="outline" className="flex items-center gap-1">
              <Paperclip className="h-4 w-4" /> Attach
            </Button>
            <Button className="flex items-center gap-1">
              <Send className="h-4 w-4" /> Send
            </Button>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.aside
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 12 }}
          className="w-80 border-l bg-white/60 backdrop-blur-md p-6 flex flex-col gap-6 shadow-2xl rounded-xl ml-4"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            Request Details
          </h3>

          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Request ID
              </span>
              <span className="text-sm font-medium text-gray-800">
                {requestId}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Created on
              </span>
              <span className="text-sm font-medium text-gray-800">
                2025-09-26
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Created by
              </span>
              <span className="text-sm font-medium text-gray-800">
                John Doe
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Status
              </span>
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700 w-fit">
                Active
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Agent name
              </span>
              <span className="text-sm font-medium text-gray-800">
                Agent Smith
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Last activity
              </span>
              <span className="text-sm font-medium text-gray-800">2h ago</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Project ID
              </span>
              <span className="text-sm font-medium text-gray-800">P12345</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Purpose
              </span>
              <span className="text-sm font-medium text-gray-800">
                Data access request
              </span>
            </div>
          </div>
        </motion.aside>
      </div>

      {/* Fullscreen Image Viewer */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative w-[90%] h-[90%] flex items-center justify-center">
              <Image
                src={selectedImage}
                alt="preview"
                fill
                className="object-contain rounded-lg shadow-xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RequestAccess;
