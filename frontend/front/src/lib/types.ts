// src/lib/types.ts
export type Education =
  | "High School"
  | "Diploma"
  | "Undergraduate"
  | "Postgraduate"
  | "PhD"
  | "Bootcamp"
  | "Self-taught"
  | "Working Professional"
  | "Career Switch"
  | "Other";

export type Industry =
  | "Software Development"
  | "Data Science"
  | "Cybersecurity"
  | "Cloud & DevOps"
  | "Product Management"
  | "UI/UX Design"
  | "Digital Marketing"
  | "Business & Entrepreneurship"
  | "Game Development"
  | "AI & Machine Learning";

export type Platform = "Coursera" | "Udemy";

export type UserQuickProfile = {
  name: string;
  education: Education;
  industry: Industry;
  skills: string[];
  interests: string[];
};

export type Course = {
  title: string;
  platform: Platform;
  link: string;
  description?: string;
  rating?: number;
  level?: "Beginner" | "Intermediate" | "Advanced";
};
