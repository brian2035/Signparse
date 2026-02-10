
export enum DocumentStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  EXPIRED = 'Expired',
}

export interface Document {
  id: string;
  name: string;
  owner: string;
  status: DocumentStatus;
  createdAt: string;
  lastModified: string;
  size: string;
  category: string;
}

export interface Field {
  id: string;
  type: 'signature' | 'initials' | 'date' | 'text';
  x: number;
  y: number;
  signerId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  jobTitle?: string;
  organization?: string;
  role: 'individual' | 'company_admin' | 'company_member';
  twoFactorEnabled?: boolean;
}

export interface Organization {
  name: string;
  logo?: string;
  primaryColor?: string;
  accentColor?: string;
}

export interface Plan {
  name: string;
  price: string;
  features: string[];
  cta: string;
  popular?: boolean;
}
