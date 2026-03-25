import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI!;

// Define schemas inline to avoid module resolution issues
const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String,
  role: String, avatar: String, phone: String,
  location: { district: String, city: String },
  bio: String, skills: [String], hourlyRate: Number,
  portfolio: [{ title: String, description: String, image: String, link: String, skills: [String] }],
  availability: { type: String, default: "available" },
  rating: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
  verified: Boolean, panNumber: String,
  completedProjects: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
  title: String, description: String,
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: String, skills: [String],
  budget: { min: Number, max: Number, type: { type: String, default: "fixed" } },
  deadline: Date,
  location: { district: String, city: String, remote: Boolean },
  status: { type: String, default: "open" },
  urgency: { type: String, default: "normal" },
  proposals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Proposal" }],
  assignedFreelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  milestones: [{ title: String, amount: Number, status: { type: String, default: "pending" }, dueDate: Date }],
  attachments: [{ name: String, url: String }],
}, { timestamps: true });

const ProposalSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  coverLetter: String, bidAmount: Number, estimatedDuration: String,
  status: { type: String, default: "pending" },
}, { timestamps: true });

const ReviewSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: Number, comment: String,
}, { timestamps: true });

const TransactionSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number, type: String, status: String, paymentMethod: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
const Proposal = mongoose.models.Proposal || mongoose.model("Proposal", ProposalSchema);
const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);

async function seed() {
  console.log("🌱 Starting seed...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  // Clear existing
  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Proposal.deleteMany({}),
    Review.deleteMany({}),
    Transaction.deleteMany({}),
  ]);
  console.log("🧹 Cleared existing data");

  const password = await bcrypt.hash("password123", 12);

  // Create freelancers
  const freelancers = await User.insertMany([
    {
      name: "Sita Sharma", email: "sita@example.com", password,
      role: "freelancer", phone: "9841234567",
      location: { district: "Kathmandu", city: "Kathmandu" },
      bio: "Full-stack developer with 4 years of experience building web applications using React, Node.js, and MongoDB. Passionate about creating clean, performant code and excellent user experiences.",
      skills: ["React.js", "Node.js", "MongoDB", "TypeScript", "Next.js"],
      hourlyRate: 1500, availability: "available",
      rating: { average: 4.9, count: 24 },
      verified: true, completedProjects: 18, totalEarnings: 245000,
      portfolio: [
        { title: "E-Commerce Platform", description: "Built a full-stack e-commerce site with payment integration", skills: ["React.js", "Node.js", "MongoDB"] },
        { title: "Restaurant Management System", description: "Created a complete restaurant POS and management system", skills: ["React.js", "Express.js"] },
      ],
    },
    {
      name: "Hari Thapa", email: "hari@example.com", password,
      role: "freelancer", phone: "9852345678",
      location: { district: "Lalitpur", city: "Patan" },
      bio: "Creative UI/UX designer with expertise in Figma and Adobe Creative Suite. I focus on creating intuitive, beautiful interfaces that users love. 5+ years helping Nepali startups and businesses.",
      skills: ["UI/UX Design", "Figma", "Adobe XD", "Photoshop", "Illustrator"],
      hourlyRate: 1200, availability: "available",
      rating: { average: 4.8, count: 19 },
      verified: true, completedProjects: 14, totalEarnings: 168000,
      portfolio: [
        { title: "Banking App Redesign", description: "Redesigned mobile banking app improving user satisfaction by 40%", skills: ["UI/UX Design", "Figma"] },
        { title: "Brand Identity Package", description: "Complete brand identity including logo, colors, typography guide", skills: ["Illustrator", "Branding"] },
      ],
    },
    {
      name: "Anjali Rai", email: "anjali@example.com", password,
      role: "freelancer", phone: "9863456789",
      location: { district: "Bhaktapur", city: "Bhaktapur" },
      bio: "Professional content writer and SEO specialist with 6 years of experience. I write engaging content in both Nepali and English. Specialized in tech, tourism, and lifestyle niches.",
      skills: ["Content Writing", "SEO Writing", "Blog Writing", "Translation (Nepali-English)", "SEO"],
      hourlyRate: 800, availability: "busy",
      rating: { average: 4.7, count: 31 },
      verified: true, completedProjects: 22, totalEarnings: 132000,
      portfolio: [
        { title: "Travel Blog Series", description: "50+ articles about Nepal trekking for international tourism company", skills: ["Content Writing", "SEO Writing"] },
      ],
    },
    {
      name: "Bishal Karki", email: "bishal@example.com", password,
      role: "freelancer", phone: "9874567890",
      location: { district: "Kaski", city: "Pokhara" },
      bio: "Flutter mobile developer specializing in cross-platform apps. I've shipped 8+ apps to the Play Store and App Store. Strong focus on performance and beautiful animations.",
      skills: ["Flutter", "React Native", "Firebase", "iOS Development", "Android Development"],
      hourlyRate: 1800, availability: "available",
      rating: { average: 4.9, count: 15 },
      verified: false, completedProjects: 11, totalEarnings: 198000,
      portfolio: [
        { title: "Food Delivery App", description: "Full-featured food delivery app with real-time tracking", skills: ["Flutter", "Firebase"] },
      ],
    },
    {
      name: "Priya Gurung", email: "priya@example.com", password,
      role: "freelancer", phone: "9885678901",
      location: { district: "Chitwan", city: "Bharatpur" },
      bio: "Digital marketing specialist with expertise in Facebook Ads, Google Ads, and social media strategy. Helped 20+ Nepal businesses grow their online presence and revenue.",
      skills: ["Digital Marketing", "Facebook Ads", "Google Ads", "Social Media Marketing", "SEO"],
      hourlyRate: 1000, availability: "available",
      rating: { average: 4.6, count: 27 },
      verified: true, completedProjects: 19, totalEarnings: 145000,
      portfolio: [
        { title: "Restaurant Social Media Campaign", description: "Grew restaurant Facebook page from 500 to 15,000 followers in 3 months", skills: ["Social Media Marketing", "Facebook Ads"] },
      ],
    },
  ]);

  // Create clients
  const clients = await User.insertMany([
    {
      name: "Ram Shrestha", email: "ram@example.com", password,
      role: "client", phone: "9801234567",
      location: { district: "Kathmandu", city: "Kathmandu" },
      bio: "Owner of Shrestha Retail Chain. Looking for tech talent to digitize our business operations.",
      verified: true, panNumber: "123456789", totalSpent: 185000, completedProjects: 8,
      rating: { average: 4.5, count: 8 },
    },
    {
      name: "Sunita Maharjan", email: "sunita@example.com", password,
      role: "client", phone: "9812345678",
      location: { district: "Lalitpur", city: "Patan" },
      bio: "Co-founder of a Nepali fashion startup. Always looking for creative designers and marketers.",
      verified: true, panNumber: "234567890", totalSpent: 95000, completedProjects: 5,
      rating: { average: 4.8, count: 5 },
    },
    {
      name: "Deepak Adhikari", email: "deepak@example.com", password,
      role: "client", phone: "9823456789",
      location: { district: "Bhaktapur", city: "Bhaktapur" },
      bio: "Event management professional. Need freelancers for photography, videography, and content creation.",
      verified: false, totalSpent: 45000, completedProjects: 3,
      rating: { average: 4.2, count: 3 },
    },
  ]);

  console.log(`✅ Created ${freelancers.length} freelancers and ${clients.length} clients`);

  const deadlineFuture = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const deadlinePast = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Create projects
  const projects = await Project.insertMany([
    {
      title: "Build an E-commerce Website for Clothing Store",
      description: "We need a modern e-commerce website for our clothing boutique in Kathmandu. The site should have product listings, cart, checkout with Khalti integration (demo), order management, and an admin panel. Mobile responsive is a must.",
      client: clients[0]._id, category: "web-development",
      skills: ["React.js", "Node.js", "MongoDB"],
      budget: { min: 25000, max: 45000, type: "fixed" },
      deadline: deadlineFuture(21),
      location: { district: "Kathmandu", city: "Kathmandu", remote: false },
      status: "open", urgency: "urgent",
    },
    {
      title: "Social Media Management for Fashion Brand",
      description: "Looking for a social media manager to handle our Instagram and Facebook accounts. Need 3 posts per week, story creation, hashtag research, and engagement. Monthly report required.",
      client: clients[1]._id, category: "social-media",
      skills: ["Social Media Marketing", "Content Writing", "Facebook Ads"],
      budget: { min: 8000, max: 15000, type: "hourly" },
      deadline: deadlineFuture(30),
      location: { district: "Lalitpur", city: "Patan", remote: true },
      status: "open", urgency: "normal",
    },
    {
      title: "Logo and Brand Identity Design for Startup",
      description: "Our new tech startup needs a professional logo and brand identity package including logo (multiple formats), color palette, typography guide, and basic brand guidelines document.",
      client: clients[2]._id, category: "graphic-design",
      skills: ["Logo Design", "Illustrator", "Branding"],
      budget: { min: 12000, max: 20000, type: "fixed" },
      deadline: deadlineFuture(10),
      location: { district: "Bhaktapur", city: "Bhaktapur", remote: false },
      status: "in-progress", urgency: "normal",
      assignedFreelancer: freelancers[1]._id,
    },
    {
      title: "Flutter App for Restaurant Ordering System",
      description: "We need a cross-platform mobile app for table ordering in our restaurant. Features: menu browsing, order placement, kitchen display, and receipt printing. Must work offline.",
      client: clients[0]._id, category: "mobile-app",
      skills: ["Flutter", "Firebase", "UI/UX Design"],
      budget: { min: 35000, max: 60000, type: "fixed" },
      deadline: deadlineFuture(45),
      location: { district: "Kathmandu", city: "Kathmandu", remote: false },
      status: "open", urgency: "normal",
    },
    {
      title: "SEO Content Writing for Tourism Website",
      description: "Need 20 SEO-optimized articles about Nepal trekking, culture, and destinations for our tourism website. Each article should be 1000-1500 words. Keyword research included.",
      client: clients[1]._id, category: "content-writing",
      skills: ["SEO Writing", "Content Writing", "SEO"],
      budget: { min: 15000, max: 25000, type: "fixed" },
      deadline: deadlineFuture(14),
      location: { district: "Lalitpur", city: "Patan", remote: true },
      status: "open", urgency: "normal",
    },
    {
      title: "Wedding Photography and Videography Package",
      description: "Looking for an experienced photographer and videographer for a 2-day wedding event in Pokhara. Need pre-wedding shoot, ceremony coverage, and edited photos/video delivered within 4 weeks.",
      client: clients[2]._id, category: "photography",
      skills: ["Photography", "Video Editing", "Premiere Pro"],
      budget: { min: 40000, max: 70000, type: "fixed" },
      deadline: deadlineFuture(60),
      location: { district: "Kaski", city: "Pokhara", remote: false },
      status: "open", urgency: "normal",
    },
    {
      title: "Data Entry and Excel Spreadsheet Management",
      description: "Need someone to digitize our product inventory (2000+ items) into Excel with formulas, pivot tables, and automated reports. Must be detail-oriented and fast.",
      client: clients[0]._id, category: "data-entry",
      skills: ["Excel/Spreadsheets", "Data Entry"],
      budget: { min: 5000, max: 10000, type: "fixed" },
      deadline: deadlineFuture(7),
      location: { district: "Kathmandu", city: "Kathmandu", remote: true },
      status: "open", urgency: "urgent",
    },
    {
      title: "Google Ads Campaign Setup and Management",
      description: "Need a Google Ads specialist to set up and manage campaigns for our ecommerce store. Budget Rs. 50,000/month ads spend. Need keyword research, ad copy, and monthly optimization.",
      client: clients[1]._id, category: "digital-marketing",
      skills: ["Google Ads", "Digital Marketing", "SEO"],
      budget: { min: 18000, max: 30000, type: "hourly" },
      deadline: deadlineFuture(25),
      location: { district: "Lalitpur", city: "Patan", remote: true },
      status: "completed", urgency: "normal",
      assignedFreelancer: freelancers[4]._id,
    },
    {
      title: "Nepali to English Translation for Legal Documents",
      description: "Need accurate translation of 50 pages of Nepali legal documents to English. Translator must have experience with legal terminology. Confidentiality agreement required.",
      client: clients[2]._id, category: "translation",
      skills: ["Translation (Nepali-English)"],
      budget: { min: 8000, max: 12000, type: "fixed" },
      deadline: deadlineFuture(5),
      location: { district: "Bhaktapur", city: "Bhaktapur", remote: true },
      status: "open", urgency: "urgent",
    },
    {
      title: "React Dashboard for Business Analytics",
      description: "We need a data visualization dashboard built in React with charts showing sales, inventory, customer analytics. API integration with our existing backend. Must be responsive.",
      client: clients[0]._id, category: "web-development",
      skills: ["React.js", "TypeScript", "Recharts"],
      budget: { min: 20000, max: 35000, type: "fixed" },
      deadline: deadlineFuture(30),
      location: { district: "Kathmandu", city: "Kathmandu", remote: false },
      status: "cancelled", urgency: "normal",
    },
  ]);

  console.log(`✅ Created ${projects.length} projects`);

  // Create proposals
  const proposals = await Proposal.insertMany([
    {
      project: projects[0]._id, freelancer: freelancers[0]._id,
      coverLetter: "Hi! I'm a full-stack developer with 4 years of experience. I've built similar e-commerce platforms and can deliver a beautiful, fast website with all the features you need. I'll use React for the frontend, Node.js for backend, and MongoDB for the database. I can integrate demo payment system as well.",
      bidAmount: 38000, estimatedDuration: "3 weeks", status: "pending",
    },
    {
      project: projects[0]._id, freelancer: freelancers[3]._id,
      coverLetter: "Hello! While I'm primarily a mobile developer, I have strong web development skills too. I can build you a modern, responsive e-commerce site with great UX. My portfolio shows similar projects I've completed.",
      bidAmount: 42000, estimatedDuration: "4 weeks", status: "pending",
    },
    {
      project: projects[3]._id, freelancer: freelancers[3]._id,
      coverLetter: "I'm the perfect fit for this project! I've built 8+ mobile apps including 2 restaurant apps. My Flutter expertise means I can deliver a smooth, offline-capable ordering system. I'll use Firebase for real-time sync and can include a beautiful UI.",
      bidAmount: 55000, estimatedDuration: "6 weeks", status: "accepted",
    },
    {
      project: projects[7]._id, freelancer: freelancers[4]._id,
      coverLetter: "Digital marketing specialist here! I've managed Google Ads for 15+ Nepali businesses with average 3x ROAS. I'll set up conversion tracking, smart bidding, and provide weekly reports. Ready to start immediately.",
      bidAmount: 22000, estimatedDuration: "Ongoing monthly", status: "accepted",
    },
  ]);

  // Add proposals to projects
  await Project.findByIdAndUpdate(projects[0]._id, { proposals: [proposals[0]._id, proposals[1]._id] });
  await Project.findByIdAndUpdate(projects[3]._id, { proposals: [proposals[2]._id] });
  await Project.findByIdAndUpdate(projects[7]._id, { proposals: [proposals[3]._id] });

  console.log(`✅ Created ${proposals.length} proposals`);

  // Create reviews
  const reviews = await Review.insertMany([
    {
      project: projects[2]._id, reviewer: clients[2]._id, reviewee: freelancers[1]._id,
      rating: 5, comment: "Hari did an absolutely fantastic job on our brand identity! The logo is unique, modern, and perfectly captures our startup's vision. Delivered ahead of schedule and was very responsive. Highly recommended!",
    },
    {
      project: projects[7]._id, reviewer: clients[1]._id, reviewee: freelancers[4]._id,
      rating: 5, comment: "Priya is a Google Ads wizard! She tripled our ROAS in just 2 months. Very professional, detailed monthly reports, and always available to answer questions. Will definitely hire again.",
    },
    {
      project: projects[2]._id, reviewer: freelancers[1]._id, reviewee: clients[2]._id,
      rating: 4, comment: "Great client to work with! Clear requirements, quick feedback, and paid on time. Looking forward to future collaborations.",
    },
    {
      project: projects[7]._id, reviewer: freelancers[4]._id, reviewee: clients[1]._id,
      rating: 5, comment: "Sunita is a dream client. She knows exactly what she wants, gives detailed feedback, and trusts the expert. Very professional and timely payments.",
    },
  ]);

  // Update ratings
  await User.findByIdAndUpdate(freelancers[1]._id, { "rating.average": 4.8, "rating.count": 1 });
  await User.findByIdAndUpdate(freelancers[4]._id, { "rating.average": 4.6, "rating.count": 1 });

  console.log(`✅ Created ${reviews.length} reviews`);

  // Create transactions
  const transactions = await Transaction.insertMany([
    {
      project: projects[2]._id, from: clients[2]._id, to: freelancers[1]._id,
      amount: 18000, type: "escrow_release", status: "completed", paymentMethod: "khalti",
    },
    {
      project: projects[7]._id, from: clients[1]._id, to: freelancers[4]._id,
      amount: 22000, type: "escrow_release", status: "completed", paymentMethod: "esewa",
    },
    {
      project: projects[2]._id, from: clients[2]._id, to: clients[2]._id,
      amount: 18000, type: "escrow_deposit", status: "completed", paymentMethod: "khalti",
    },
  ]);

  console.log(`✅ Created ${transactions.length} transactions`);

  // Update user totals
  await User.findByIdAndUpdate(freelancers[1]._id, { totalEarnings: 18000, completedProjects: 1 });
  await User.findByIdAndUpdate(freelancers[4]._id, { totalEarnings: 22000, completedProjects: 1 });
  await User.findByIdAndUpdate(clients[2]._id, { totalSpent: 18000 });
  await User.findByIdAndUpdate(clients[1]._id, { totalSpent: 22000 });

  console.log("\n🎉 Seed complete! Test accounts:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Freelancers:");
  console.log("  sita@example.com / password123");
  console.log("  hari@example.com / password123");
  console.log("  anjali@example.com / password123");
  console.log("  bishal@example.com / password123");
  console.log("  priya@example.com / password123");
  console.log("Clients:");
  console.log("  ram@example.com / password123");
  console.log("  sunita@example.com / password123");
  console.log("  deepak@example.com / password123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
