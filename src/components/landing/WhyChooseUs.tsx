"use client";

import { motion } from "framer-motion";
import { MapPin, CreditCard, Shield, Star, Zap } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Local-First Approach",
    description: "Connect with freelancers in your own district. Meet in person, build real relationships, get local insights.",
    color: "from-teal-400 to-emerald-500",
  },
  {
    icon: CreditCard,
    title: "NPR Payments",
    description: "Pay and receive in Nepali Rupees via Khalti, eSewa, or bank transfer. No foreign currency hassle.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: Shield,
    title: "Verified Businesses",
    description: "All clients go through PAN verification. All freelancers have reviewed portfolios. Trust built-in.",
    color: "from-purple-400 to-violet-500",
  },
  {
    icon: Star,
    title: "Two-Way Ratings",
    description: "Both clients and freelancers rate each other. Transparent feedback builds a trustworthy community.",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: Zap,
    title: "Quick Gigs",
    description: "Need something done urgently? Filter by 'Urgent' projects and get proposals within hours.",
    color: "from-pink-400 to-rose-500",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-teal-600 text-sm font-semibold tracking-wider uppercase">Why DigitalSewa</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Built for Nepal, By Nepalese
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            We understand the unique needs of Nepali businesses and freelancers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={i === 4 ? "md:col-span-2 lg:col-span-1 lg:col-start-2" : ""}
            >
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300 p-8 h-full group">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
