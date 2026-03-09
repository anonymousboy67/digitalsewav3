"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const freelancers = [
  {
    name: "Sita Sharma",
    skill: "React.js Developer",
    rating: 4.9,
    reviews: 24,
    rate: 1500,
    district: "Kathmandu",
    availability: "available",
    initials: "SS",
    gradient: "from-teal-400 to-emerald-500",
    completedProjects: 18,
  },
  {
    name: "Hari Thapa",
    skill: "UI/UX Designer",
    rating: 4.8,
    reviews: 19,
    rate: 1200,
    district: "Lalitpur",
    availability: "available",
    initials: "HT",
    gradient: "from-blue-400 to-indigo-500",
    completedProjects: 14,
  },
  {
    name: "Anjali Rai",
    skill: "Content Writer",
    rating: 4.7,
    reviews: 31,
    rate: 800,
    district: "Bhaktapur",
    availability: "busy",
    initials: "AR",
    gradient: "from-pink-400 to-rose-500",
    completedProjects: 22,
  },
  {
    name: "Bishal Karki",
    skill: "Flutter Developer",
    rating: 4.9,
    reviews: 15,
    rate: 1800,
    district: "Kaski",
    availability: "available",
    initials: "BK",
    gradient: "from-purple-400 to-violet-500",
    completedProjects: 11,
  },
];

export function TopFreelancers() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="text-teal-600 text-sm font-semibold tracking-wider uppercase">Top Rated</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2" style={{ fontFamily: "var(--font-outfit)" }}>
              Local Talent
            </h2>
          </div>
          <Link href="/register">
            <Button variant="outline" className="border-teal-200 text-teal-600 hover:bg-teal-50 gap-2">
              Browse All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {freelancers.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="bg-white rounded-2xl border border-gray-200 hover:border-teal-200 hover:shadow-lg transition-all duration-300 p-6 text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <Avatar className={`h-20 w-20 bg-gradient-to-br ${f.gradient}`}>
                    <AvatarFallback className={`bg-gradient-to-br ${f.gradient} text-white text-xl font-bold`}>
                      {f.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                    f.availability === "available" ? "bg-green-400" : "bg-yellow-400"
                  }`} />
                </div>

                <h3 className="font-semibold text-gray-900 mb-0.5">{f.name}</h3>
                <p className="text-sm text-teal-600 mb-2">{f.skill}</p>

                <div className="flex items-center justify-center gap-1 mb-3">
                  <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium">{f.rating}</span>
                  <span className="text-xs text-gray-400">({f.reviews} reviews)</span>
                </div>

                <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-4">
                  <MapPin className="h-3 w-3" />
                  {f.district}
                </div>

                <div className="flex items-center justify-between text-xs border-t border-gray-100 pt-3">
                  <span className="text-gray-500">{f.completedProjects} projects</span>
                  <span className="font-semibold text-teal-600">Rs.{f.rate}/hr</span>
                </div>

                <Link href="/register">
                  <Button className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-sm h-9">
                    View Profile
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
