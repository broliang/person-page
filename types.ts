export interface Profile {
  name: string;
  title: string;
  affiliation: string;
  email: string;
  phone: string;
  bio: string;
  researchInterests: string[];
  avatarUrl?: string;
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  major?: string;
}

export interface Experience {
  role: string;
  institution: string;
  department?: string;
  period: string;
}

export interface Project {
  title: string;
  role: string; // e.g., 主持, 参与
  period: string;
  source: string; // e.g., 国家自然科学基金委员会
  code: string;
  funding?: string;
}

export interface Publication {
  authors: string;
  title: string;
  venue: string;
  year: string;
  tags?: string[]; // e.g., CCF-A, Best Paper
  isCorresponding?: boolean; // If S. Liang*
}

export interface Patent {
  inventors: string;
  title: string;
  date: string;
  number: string;
  type: string; // e.g. 发明专利, 软件著作权
  country?: string;
}

export interface ResumeData {
  profile: Profile;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  publications: Publication[];
  patents: Patent[];
}