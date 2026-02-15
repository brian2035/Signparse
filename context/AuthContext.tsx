
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Organization } from '../types';

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  login: (email: string, role: User['role']) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateOrganization: (updates: Partial<Organization>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('signflow_user');
    const savedOrg = localStorage.getItem('signflow_org');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedOrg) setOrganization(JSON.parse(savedOrg));
  }, []);

  const login = (email: string, role: User['role']) => {
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      jobTitle: 'Professional',
      organization: role === 'company_admin' ? 'SignParse Labs' : undefined
    };
    setUser(newUser);
    localStorage.setItem('signflow_user', JSON.stringify(newUser));

    if (role === 'company_admin') {
      const newOrg: Organization = {
        name: 'SignParse Labs',
        primaryColor: '#3b82f6',
        accentColor: '#10b981'
      };
      setOrganization(newOrg);
      localStorage.setItem('signflow_org', JSON.stringify(newOrg));
    }
  };

  const logout = () => {
    setUser(null);
    setOrganization(null);
    localStorage.removeItem('signflow_user');
    localStorage.removeItem('signflow_org');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('signflow_user', JSON.stringify(updated));
      return updated;
    });
  };

  const updateOrganization = (updates: Partial<Organization>) => {
    setOrganization(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('signflow_org', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      organization, 
      login, 
      logout, 
      updateUser, 
      updateOrganization,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
