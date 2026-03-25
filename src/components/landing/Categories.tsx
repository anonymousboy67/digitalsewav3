"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Smartphone, Palette, PenTool, Video, TrendingUp, Database, Camera, Languages, Search, Share2, MoreHorizontal } from "lucide-react";

const categories = [
  { icon: Globe, label: "Web Development", count: "45 projects", color: "bg-blue-50 text-blue-600 group-hover:bg-blue-100" },
  { icon: Smartphone, label: "Mobile Apps", count: "23 projects", color: "bg-purple-50 text-purple-600 group-hover:bg-purple-100" },
  { icon: Palette, label: "Graphic Design", count: "67 projects", color: "bg-pink-50 text-pink-600 group-hover:bg-pink-100" },
  { icon: PenTool, label: "Content Writing", count: "34 projects", color: "bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100" },
  { icon: Video, label: "Video Editing", count: "19 projects", color: "bg-red-50 text-red-600 group-hover:bg-red-100" },
  { icon: TrendingUp, label: "Digital Marketing", count: "41 projects", color: "bg-orange-50 text-orange-600 group-hover:bg-orange-100" },
  { icon: Database, label: "Data Entry", count: "28 projects", color: "bg-gray-50 text-gray-600 group-hover:bg-gray-100" },
  { icon: Camera, label: "Photography", count: "15 projects", color: "bg-teal-50 text-teal-600 group-hover:bg-teal-100" },
  { icon: Languages, label: "Translation", count: "12 projects", color: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100" },
  { icon: Search, label: "SEO", count: "22 projects", color: "bg-green-50 text-green-600 group-hover:bg-green-100" },
  { icon: Share2, label: "Social Media", count: "31 projects", color: "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100" },
  { icon: MoreHorizontal, label: "Other", count: "50+ projects", color: "bg-slate-50 text-slate-600 group-hover:bg-slate-100" },
];

export function Categories() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-teal-600 text-sm font-semibold tracking-wider uppercase">Browse by Category</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Find Work in Any Domain
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            From web development to photography, find the right talent for your project
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href="/register">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-2xl p-5 border border-gray-200 hover:border-teal-200 hover:shadow-lg transition-all duration-300 text-center cursor-pointer"
                >
                  <div className={`inline-flex p-3 rounded-xl mb-3 transition-colors ${cat.color}`}>
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-gray-400">{cat.count}</p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
