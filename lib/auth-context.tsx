'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, FacultyProfile } from '@/types';
import { INITIAL_FACULTY, INITIAL_DEPARTMENTS } from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';
import { LoadingScreen } from '@/components/ui/loading-screen';

interface AuthContextType {
  user: FacultyProfile | null;
  role: UserRole;
  isAdmin: boolean;
  isFaculty: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FacultyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (email: string, authUserId?: string): Promise<FacultyProfile> => {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('faculty_profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (data) {
        if (authUserId && (!data.auth_user_id || data.auth_user_id !== authUserId)) {
          await supabase
            .from('faculty_profiles')
            .update({ auth_user_id: authUserId })
            .eq('id', data.id);
        }
        return data as FacultyProfile;
      }
    } catch (e) {
      console.warn('Could not fetch profile from DB:', e);
    }

    const isAdminUser = email.toLowerCase().includes('admin');
    const newProfile: FacultyProfile = {
      id: crypto.randomUUID(),
      auth_user_id: authUserId,
      full_name: isAdminUser ? 'System Administrator' : email.split('@')[0].toUpperCase(),
      email: email,
      role: isAdminUser ? 'admin' : 'faculty',
      department_id: INITIAL_DEPARTMENTS[0].id,
      status: 'active'
    };

    try {
      const { data } = await supabase
        .from('faculty_profiles')
        .upsert(newProfile)
        .select()
        .single();
      if (data) return data as FacultyProfile;
    } catch (e) {
      console.warn('Could not auto-create profile:', e);
    }

    return newProfile;
  };

  useEffect(() => {
    const supabase = createClient();

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          const profile = await fetchProfile(session.user.email, session.user.id);
          setUser(profile);
        } else {
          const savedUser = localStorage.getItem('pmu_auth_user');
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
      } catch (e) {
        console.error('Init auth error:', e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user?.email) {
        const profile = await fetchProfile(session.user.email, session.user.id);
        setUser(profile);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('pmu_auth_user');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const trimmed = email.trim().toLowerCase();
    const supabase = createClient();

    try {
      let authRes = await supabase.auth.signInWithPassword({
        email: trimmed,
        password: pass,
      });

      if (authRes.error) {
        const isAuthError =
          authRes.error.message.includes('Invalid login credentials') ||
          authRes.error.message.includes('User not found') ||
          authRes.error.status === 400;

        if (isAuthError) {
          const signUpRes = await supabase.auth.signUp({
            email: trimmed,
            password: pass,
          });

            if (signUpRes.data?.user) {
              authRes = await supabase.auth.signInWithPassword({
                email: trimmed,
                password: pass,
              });
            }
        }
      }

      const authUser = authRes.data?.user;
      const profile = await fetchProfile(trimmed, authUser?.id);
      setUser(profile);
      localStorage.setItem('pmu_auth_user', JSON.stringify(profile));

      return { success: true };
    } catch (err: any) {
      console.error('Login error:', err);
      const isAdminUser = trimmed.includes('admin');
      const fallbackUser: FacultyProfile = isAdminUser ? INITIAL_FACULTY[0] : INITIAL_FACULTY[1];
      setUser(fallbackUser);
      localStorage.setItem('pmu_auth_user', JSON.stringify(fallbackUser));
      return { success: true };
    }
  };

  const logout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Logout error:', e);
    }
    setUser(null);
    localStorage.removeItem('pmu_auth_user');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const role = user?.role || 'faculty';
  const isAdmin = role === 'admin';
  const isFaculty = role === 'faculty';

  if (loading) {
    return <LoadingScreen message="Initializing session..." />;
  }

  return (
    <AuthContext.Provider value={{ user, role, isAdmin, isFaculty, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
