"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const featuredProjects = [
  {
    title: "E-commerce Website for Boutique Store",
    category: "web-development",
    categoryLabel: "Web Development",
    budget: { min: 25000, max: 45000 },
    deadline: "2 weeks",
    skills: ["React.js", "Node.js", "MongoDB"],
    status: "open",
    urgency: "urgent",
    client: "Ram Shrestha",
    district: "Kathmandu",
    proposals: 3,
  },
  {
    title: "Social Media Content for Restaurant Chain",
    category: "social-media",
    categoryLabel: "Social Media",
    budget: { min: 8000, max: 15000 },
    deadline: "1 week",
    skills: ["Content Creation", "Instagram", "Facebook Ads"],
    status: "open",
    urgency: "normal",
    client: "Sunita Maharjan",
    district: "Lalitpur",
    proposals: 7,
  },
  {
    title: "Logo & Brand Identity Design",
    category: "graphic-design",
    categoryLabel: "Graphic Design",
    budget: { min: 12000, max: 20000 },
    deadline: "10 days",
    skills: ["Illustrator", "Logo Design", "Branding"],
    status: "open",
    urgency: "normal",
    client: "Deepak Adhikari",
    district: "Bhaktapur",
    proposals: 5,
  },
];

export function FeaturedProjects() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="text-teal-600 text-sm font-semibold tracking-wider uppercase">Hot Opportunities</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2" style={{ fontFamily: "var(--font-outfit)" }}>
              Featured Projects
            </h2>
          </div>
          <Link href="/register">
            <Button variant="outline" className="border-teal-200 text-teal-600 hover:bg-teal-50 gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="bg-white rounded-2xl border border-gray-200 hover:border-teal-200 hover:shadow-lg transition-all duration-300 p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-xs font-medium bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full">
                    {project.categoryLabel}
                  </span>
                  <div className="flex gap-1">
                    {project.urgency === "urgent" && (
                      <span className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-medium">Urgent</span>
                    )}
                    <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium capitalize">
                      {project.status}
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 flex-1">{project.title}</h3>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.skills.map((skill) => (
                    <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 py-4 border-y border-gray-100">
                  <div>
                    <p className="text-gray-400 mb-0.5">Budget</p>
                    <p className="font-medium text-gray-900">
                      Rs.{project.budget.min.toLocaleString()} - {project.budget.max.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5">Deadline</p>
                    <p className="font-medium text-gray-900">{project.deadline}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5">Location</p>
                    <p className="font-medium text-gray-900">{project.district}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5">Proposals</p>
                    <p className="font-medium text-gray-900">{project.proposals} bids</p>
                  </div>
                </div>

                <Link href="/register" className="mt-4">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-sm">
                    View & Apply
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
