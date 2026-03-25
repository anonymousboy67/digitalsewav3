"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, CheckCircle, Briefcase, Send, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const clientSteps = [
  {
    icon: FileText,
    title: "Post Your Project",
    description: "Describe your project, set your budget in NPR, and specify your location preference.",
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: Search,
    title: "Review Proposals",
    description: "Browse proposals from local freelancers, check their profiles, ratings, and portfolios.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: CheckCircle,
    title: "Hire & Pay Securely",
    description: "Accept the best proposal, use escrow protection, and release payment upon completion.",
    color: "bg-blue-50 text-blue-600",
  },
];

const freelancerSteps = [
  {
    icon: Briefcase,
    title: "Browse Projects",
    description: "Find projects matching your skills in your district or work remotely from anywhere in Nepal.",
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: Send,
    title: "Submit a Proposal",
    description: "Write a compelling cover letter, set your competitive bid, and showcase your experience.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: TrendingUp,
    title: "Work & Get Paid",
    description: "Complete the project, submit deliverables, and receive payment in NPR to your preferred method.",
    color: "bg-blue-50 text-blue-600",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-teal-600 text-sm font-semibold tracking-wider uppercase">Simple Process</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            How DigitalSewa Works
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Whether you're looking to hire or looking for work, get started in minutes
          </p>
        </motion.div>

        <Tabs defaultValue="clients" className="max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-10 bg-gray-100">
            <TabsTrigger value="clients" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              For Clients
            </TabsTrigger>
            <TabsTrigger value="freelancers" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              For Freelancers
            </TabsTrigger>
          </TabsList>

          {[
            { value: "clients", steps: clientSteps },
            { value: "freelancers", steps: freelancerSteps },
          ].map(({ value, steps }) => (
            <TabsContent key={value} value={value}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {steps.map((step, i) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative"
                  >
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-xl ${step.color}`}>
                          <step.icon className="h-5 w-5" />
                        </div>
                        <span className="text-4xl font-bold text-gray-100" style={{ fontFamily: "var(--font-outfit)" }}>
                          0{i + 1}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                    </div>
                    {i < 2 && (
                      <div className="hidden md:block absolute top-10 -right-3 z-10 text-gray-300 text-2xl">→</div>
                    )}
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
