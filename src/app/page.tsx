"use client";

import { useState, useEffect } from "react";
import { SecretGenerator } from "@/components/secret-generator";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Shield, Lock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 15,
    },
  },
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // 800ms loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingSkeleton />
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isLoading && isMounted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 relative overflow-x-hidden"
        >
      {/* Theme Toggle - Fixed position */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50"
      >
        <ThemeToggle />
      </motion.div>
      
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/10" aria-hidden="true"></div>
      
      <main className="relative container mx-auto p-4 md:p-8 lg:p-12 z-10">
        {/* Header Section */}
        <header>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-12 text-center space-y-4"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-3 mb-4"
              aria-label="Security icons"
            >
              <motion.div
                variants={iconVariants}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-2xl bg-primary/10 shadow-lg"
                aria-hidden="true"
              >
                <Shield className="h-8 w-8 text-primary" />
              </motion.div>
              <motion.div
                variants={iconVariants}
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-2xl bg-primary/10 shadow-lg"
                aria-hidden="true"
              >
                <Lock className="h-8 w-8 text-primary" />
              </motion.div>
              <motion.div
                variants={iconVariants}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-2xl bg-primary/10 shadow-lg"
                aria-hidden="true"
              >
                <Sparkles className="h-8 w-8 text-primary" />
              </motion.div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Secret Key Generator
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Generate cryptographically secure secrets using various algorithms
              </p>
            </motion.div>
          
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-2 pt-2"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "3rem" }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-1 bg-primary rounded-full"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "0.5rem" }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="h-1 bg-primary/50 rounded-full"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "0.5rem" }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="h-1 bg-primary/30 rounded-full"
            />
          </motion.div>
        </motion.div>
        </header>

        {/* Main Generator Component */}
        <section aria-label="Secret generator tool">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SecretGenerator />
          </motion.div>
        </section>

        {/* Footer Info */}
        <footer>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-muted-foreground">
              All secrets are generated using cryptographically secure random number generators
            </p>
          </motion.div>
        </footer>
      </main>
        </motion.div>
      )}
    </>
  );
}

