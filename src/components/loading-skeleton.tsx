"use client";

import { Shield, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 relative overflow-x-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/10"></div>
      
      <div className="relative container mx-auto p-4 md:p-8 lg:p-12 z-10">
        {/* Header Section Skeleton */}
        <div className="mb-8 sm:mb-12 text-center space-y-4">
          {/* Icons Skeleton */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-primary/10 shadow-lg animate-pulse">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary/30" />
            </div>
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-primary/10 shadow-lg animate-pulse">
              <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-primary/30" />
            </div>
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-primary/10 shadow-lg animate-pulse">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary/30" />
            </div>
          </div>
          
          {/* Title Skeleton */}
          <div className="px-2 sm:px-4">
            <div className="h-10 sm:h-12 md:h-16 lg:h-20 w-full max-w-2xl mx-auto bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg mb-4 animate-pulse"></div>
            <div className="h-6 sm:h-7 md:h-8 w-full max-w-xl mx-auto bg-muted/50 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Indicator Skeleton */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="h-1 w-12 bg-primary/30 rounded-full animate-pulse"></div>
            <div className="h-1 w-2 bg-primary/20 rounded-full animate-pulse"></div>
            <div className="h-1 w-2 bg-primary/10 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Main Generator Component Skeleton */}
        <div className="w-full max-w-5xl mx-auto space-y-6">
          <div className="border-2 shadow-lg rounded-lg bg-card animate-pulse">
            <div className="p-6 space-y-6">
              {/* Card Header Skeleton */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-8 w-48 bg-muted rounded"></div>
                  <div className="h-4 w-64 bg-muted/50 rounded"></div>
                </div>
                <div className="h-10 w-24 bg-muted rounded"></div>
              </div>
              
              {/* Content Skeleton */}
              <div className="space-y-4">
                <div className="h-12 w-full bg-muted/50 rounded"></div>
                <div className="h-32 w-full bg-muted/30 rounded"></div>
                <div className="h-10 w-full bg-muted/50 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="mt-8 sm:mt-12 text-center px-4">
          <div className="h-4 w-64 mx-auto bg-muted/30 rounded animate-pulse"></div>
        </div>
      </div>
      
      {/* Loading Spinner */}
      <div className="fixed inset-0 flex items-center justify-center z-[100] bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
          />
          <p className="text-sm text-muted-foreground font-medium">Loading Secret Generator...</p>
        </motion.div>
      </div>
    </div>
  );
}

