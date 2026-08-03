"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl gradient-primary animate-pulse" />
          <div className="absolute inset-0 w-16 h-16 rounded-2xl border-2 border-primary/20 animate-ping" />
        </div>
        <div className="space-y-2 text-center">
          <div className="h-4 w-32 bg-muted rounded-full animate-pulse" />
          <div className="h-3 w-48 bg-muted/50 rounded-full animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
}
