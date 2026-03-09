import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNPR(amount: number): string {
  return new Intl.NumberFormat("ne-NP", {
    style: "currency",
    currency: "NPR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace("NPR", "Rs.");
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMM dd, yyyy");
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    "web-development": "bg-blue-100 text-blue-800",
    "mobile-app": "bg-purple-100 text-purple-800",
    "graphic-design": "bg-pink-100 text-pink-800",
    "content-writing": "bg-yellow-100 text-yellow-800",
    "video-editing": "bg-red-100 text-red-800",
    "digital-marketing": "bg-orange-100 text-orange-800",
    "data-entry": "bg-gray-100 text-gray-800",
    photography: "bg-teal-100 text-teal-800",
    translation: "bg-indigo-100 text-indigo-800",
    seo: "bg-green-100 text-green-800",
    "social-media": "bg-cyan-100 text-cyan-800",
    other: "bg-slate-100 text-slate-800",
  };
  return colors[category] || "bg-gray-100 text-gray-800";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    open: "bg-blue-100 text-blue-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    disputed: "bg-orange-100 text-orange-800",
    pending: "bg-gray-100 text-gray-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    withdrawn: "bg-slate-100 text-slate-800",
    available: "bg-green-100 text-green-800",
    busy: "bg-yellow-100 text-yellow-800",
    unavailable: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function getCategoryLabel(value: string): string {
  const labels: Record<string, string> = {
    "web-development": "Web Development",
    "mobile-app": "Mobile App",
    "graphic-design": "Graphic Design",
    "content-writing": "Content Writing",
    "video-editing": "Video Editing",
    "digital-marketing": "Digital Marketing",
    "data-entry": "Data Entry",
    photography: "Photography",
    translation: "Translation",
    seo: "SEO",
    "social-media": "Social Media",
    other: "Other",
  };
  return labels[value] || value;
}
