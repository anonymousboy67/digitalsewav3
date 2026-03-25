"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Categories } from "@/components/landing/Categories";
import { FeaturedProjects } from "@/components/landing/FeaturedProjects";
import { TopFreelancers } from "@/components/landing/TopFreelancers";
import { WhyChooseUs } from "@/components/landing/WhyChooseUs";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function LoadingScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800"
    >
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
          className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/30"
        >
          <span className="text-white font-bold text-3xl" style={{ fontFamily: "var(--font-outfit)" }}>DS</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-4xl font-bold text-white mb-2"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          DigitalSewa
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-teal-100 text-sm"
        >
          Nepal&apos;s Local Freelancing Platform
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 overflow-hidden rounded-full"
          style={{ width: 200, height: 2, background: "rgba(255,255,255,0.2)" }}
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
            className="h-full bg-white rounded-full"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs">DS</span>
          </div>
          <span className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-outfit)" }}>DigitalSewa</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-teal-500 hover:bg-teal-400 text-white">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function LandingPage() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      </AnimatePresence>
      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Navbar />
          <main>
            <Hero />
            <HowItWorks />
            <Categories />
            <FeaturedProjects />
            <TopFreelancers />
            <WhyChooseUs />
          </main>
          <Footer />
        </motion.div>
      )}
    </>
  );
}
