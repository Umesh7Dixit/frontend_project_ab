import React from "react";
import { motion } from "motion/react";
import { GitPullRequestArrow } from "lucide-react";
import { useRouter } from "next/navigation";
import { MotionButton } from "@/components/MotionItems";

const RequestHeader = ({
  title,
  button = false,
}: {
  title: string;
  button?: boolean;
}) => {
  const router = useRouter();
  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between py-3 px-5 rounded-2xl bg-white/60 backdrop-blur-[10px] shadow-lg"
    >
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      {button && (
        <MotionButton
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          variant="secondary"
          onClick={() => router.push("/requests/raise-request")}
        >
          <GitPullRequestArrow />
          Raise Request
        </MotionButton>
      )}
    </motion.header>
  );
};

export default RequestHeader;
