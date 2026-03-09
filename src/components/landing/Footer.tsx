"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  Solutions: [
    { label: "For Businesses", href: "/register" },
    { label: "For Freelancers", href: "/register" },
    { label: "Browse Projects", href: "/register" },
    { label: "Browse Talent", href: "/register" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "How it Works", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Community", href: "#" },
    { label: "Status", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Dispute Resolution", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-400">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                <span className="text-white font-bold">DS</span>
              </div>
              <span className="text-white font-bold text-xl" style={{ fontFamily: "var(--font-outfit)" }}>
                DigitalSewa
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Nepal's hyperlocal freelancing platform connecting local businesses with verified local talent.
              Pay in NPR. Build trust locally.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal-400 flex-shrink-0" />
                Kathmandu, Nepal
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal-400 flex-shrink-0" />
                hello@digitalsewa.com.np
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-teal-400 flex-shrink-0" />
                +977 9800000000
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-teal-600 transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm hover:text-teal-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>© 2024 DigitalSewa. All rights reserved. Made with ❤️ in Nepal.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-teal-400 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-teal-400 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-teal-400 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
