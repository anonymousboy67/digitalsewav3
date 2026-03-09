export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "client" | "freelancer";
  avatar?: string;
  phone?: string;
  location?: {
    district: string;
    city: string;
  };
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  portfolio?: IPortfolioItem[];
  availability?: "available" | "busy" | "unavailable";
  rating?: {
    average: number;
    count: number;
  };
  verified?: boolean;
  panNumber?: string;
  completedProjects?: number;
  totalEarnings?: number;
  totalSpent?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPortfolioItem {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  skills?: string[];
}

export type ProjectCategory =
  | "web-development"
  | "mobile-app"
  | "graphic-design"
  | "content-writing"
  | "video-editing"
  | "digital-marketing"
  | "data-entry"
  | "photography"
  | "translation"
  | "seo"
  | "social-media"
  | "other";

export interface IProject {
  _id: string;
  title: string;
  description: string;
  client: IUser | string;
  category: ProjectCategory;
  skills: string[];
  budget: {
    min: number;
    max: number;
    type: "fixed" | "hourly";
  };
  deadline: string;
  location: {
    district: string;
    city: string;
    remote: boolean;
  };
  status: "open" | "in-progress" | "completed" | "cancelled" | "disputed";
  urgency: "normal" | "urgent";
  proposals?: IProposal[] | string[];
  assignedFreelancer?: IUser | string;
  milestones?: IMilestone[];
  attachments?: { name: string; url: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IMilestone {
  _id?: string;
  title: string;
  amount: number;
  status: "pending" | "in-progress" | "completed" | "paid";
  dueDate?: string;
}

export interface IProposal {
  _id: string;
  project: IProject | string;
  freelancer: IUser | string;
  coverLetter: string;
  bidAmount: number;
  estimatedDuration: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt?: string;
  updatedAt?: string;
}

export interface IMessage {
  _id: string;
  conversation: string;
  sender: IUser | string;
  content: string;
  attachments?: { name: string; url: string }[];
  read: boolean;
  createdAt?: string;
}

export interface IConversation {
  _id: string;
  participants: IUser[] | string[];
  project?: IProject | string;
  lastMessage?: {
    content: string;
    sender: string;
    createdAt: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface IReview {
  _id: string;
  project: IProject | string;
  reviewer: IUser | string;
  reviewee: IUser | string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface ITransaction {
  _id: string;
  project: IProject | string;
  from: IUser | string;
  to: IUser | string;
  amount: number;
  type: "escrow_deposit" | "escrow_release" | "refund";
  status: "pending" | "completed" | "failed";
  paymentMethod: "khalti" | "esewa" | "bank";
  createdAt?: string;
}

export interface INotification {
  _id: string;
  user: string;
  type:
    | "new_proposal"
    | "proposal_accepted"
    | "proposal_rejected"
    | "milestone_completed"
    | "payment_received"
    | "new_message"
    | "project_completed"
    | "review_received";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt?: string;
}
