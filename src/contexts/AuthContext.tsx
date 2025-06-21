
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Administrador, Professor, Aluno } from '@/types/database';

interface AuthUser {
  id: string;
  email: string;
  userType: 'administrador' | 'professor' | 'aluno';
  userData: Administrador | Professor | Aluno;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Fetch user data from our custom tables
          setTimeout(async () => {
            await fetchUserData(session.user);
          }, 100);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserData(session.user);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (authUser: User) => {
    try {
      console.log('Fetching user data for:', authUser.email);
      
      // Try to find user in each table
      const { data: adminData } = await supabase
        .from('administrador')
        .select('*')
        .eq('email', authUser.email)
        .single();

      if (adminData) {
        setUser({
          id: authUser.id,
          email: authUser.email!,
          userType: 'administrador',
          userData: adminData
        });
        return;
      }

      const { data: professorData } = await supabase
        .from('professores')
        .select('*')
        .eq('email', authUser.email)
        .single();

      if (professorData) {
        setUser({
          id: authUser.id,
          email: authUser.email!,
          userType: 'professor',
          userData: professorData
        });
        return;
      }

      const { data: alunoData } = await supabase
        .from('alunos')
        .select('*')
        .eq('email', authUser.email)
        .single();

      if (alunoData) {
        setUser({
          id: authUser.id,
          email: authUser.email!,
          userType: 'aluno',
          userData: alunoData
        });
        return;
      }

      console.log('User not found in any table');
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      console.error('Error signing in:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      
      // First create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      // Then create the user in the appropriate table
      const { userType, ...userInfo } = userData;
      
      let insertError;
      switch (userType) {
        case 'administrador':
          const { error: adminError } = await supabase
            .from('administrador')
            .insert([{ ...userInfo, email, senha: password }]);
          insertError = adminError;
          break;
        case 'professor':
          const { error: professorError } = await supabase
            .from('professores')
            .insert([{ ...userInfo, email, senha: password }]);
          insertError = professorError;
          break;
        case 'aluno':
          const { error: alunoError } = await supabase
            .from('alunos')
            .insert([{ ...userInfo, email, senha: password }]);
          insertError = alunoError;
          break;
      }

      if (insertError) throw insertError;

      return { error: null };
    } catch (error: any) {
      console.error('Error signing up:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
