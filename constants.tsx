
import React from 'react';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { DocumentStatus, Plan } from './types';

export const COLORS = {
  primary: '#1e293b', // Deep Blue
  secondary: '#3b82f6', // Neon Blue
  accent: '#10b981', // Emerald
};

export const STATUS_ICONS = {
  [DocumentStatus.DRAFT]: <FileText className="w-4 h-4 text-slate-400" />,
  [DocumentStatus.PENDING]: <Clock className="w-4 h-4 text-amber-500" />,
  [DocumentStatus.COMPLETED]: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  [DocumentStatus.EXPIRED]: <AlertCircle className="w-4 h-4 text-rose-500" />,
};

export const PRICING_PLANS: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    features: ['3 documents/month', 'Basic editor', 'Email support', 'Real-time status'],
    cta: 'Start for free',
  },
  {
    name: 'Professional',
    price: '$29',
    features: ['Unlimited documents', 'Custom branding', 'Templates', 'Priority support', 'Audit trails'],
    cta: 'Get Professional',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: ['SSO integration', 'Dedicated account manager', 'Volume pricing', 'Custom API access', 'Compliance reporting'],
    cta: 'Contact Sales',
  },
];
