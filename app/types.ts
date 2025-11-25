export interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface Volunteering {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  link?: string;
}

export interface Organization {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    photoUrl?: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  volunteering: Volunteering[];
  projects: Project[];
  organizations: Organization[];
  additionalInfo: string;
  references: Reference[];
  sectionOrder: string[];
}
