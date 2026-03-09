import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerStep2Schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  district: z.string().min(1, "Please select a district"),
  city: z.string().min(1, "Please enter your city"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const freelancerStep3Schema = z.object({
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
  hourlyRate: z.number().min(100, "Hourly rate must be at least Rs. 100"),
  bio: z.string().min(50, "Bio must be at least 50 characters"),
});

export const clientStep3Schema = z.object({
  panNumber: z.string().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  category: z.string().min(1, "Please select a category"),
  skills: z.array(z.string()).min(1, "Please add at least one skill"),
  budget: z.object({
    min: z.number().min(500, "Minimum budget is Rs. 500"),
    max: z.number().min(500, "Maximum budget is Rs. 500"),
    type: z.enum(["fixed", "hourly"]),
  }),
  deadline: z.string().min(1, "Please set a deadline"),
  location: z.object({
    district: z.string().min(1, "Please select a district"),
    city: z.string().min(1, "Please enter a city"),
    remote: z.boolean(),
  }),
  urgency: z.enum(["normal", "urgent"]),
});

export const proposalSchema = z.object({
  coverLetter: z.string().min(100, "Cover letter must be at least 100 characters"),
  bidAmount: z.number().min(500, "Bid amount must be at least Rs. 500"),
  estimatedDuration: z.string().min(1, "Please provide estimated duration"),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(20, "Review must be at least 20 characters"),
});

export const portfolioItemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  image: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  skills: z.array(z.string()).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterStep2Data = z.infer<typeof registerStep2Schema>;
export type FreelancerStep3Data = z.infer<typeof freelancerStep3Schema>;
export type ClientStep3Data = z.infer<typeof clientStep3Schema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type ProposalFormData = z.infer<typeof proposalSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type PortfolioItemFormData = z.infer<typeof portfolioItemSchema>;
