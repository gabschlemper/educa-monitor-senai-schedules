
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
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user && event === 'SIGNED_IN') {
          // Use setTimeout to prevent blocking the auth callback
          setTimeout(() => {
            if (mounted) {
              fetchUserData(session.user);
            }
          }, 100);
        } else {
          setUser(null);
          if (event !== 'INITIAL_SESSION') {
            setLoading(false);
          }
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      if (session?.user) {
        fetchUserData(session.user);
      } else {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (authUser: User) => {
    try {
      console.log('Fetching user data for:', authUser.email);
      let userData: AuthUser | null = null;
      
      // Try to find user in admin table
      const { data: adminData, error: adminError } = await supabase
        .from('administrador')
        .select('*')
        .eq('email', authUser.email)
        .maybeSingle();

      if (adminData && !adminError) {
        userData = {
          id: authUser.id,
          email: authUser.email!,
          userType: 'administrador',
          userData: {
            ...adminData,
            id: adminData.id_administrador
          }
        };
      }

      // If not admin, try professor
      if (!userData) {
        const { data: professorData, error: professorError } = await supabase
          .from('professores')
          .select('*')
          .eq('email', authUser.email)
          .maybeSingle();

        if (professorData && !professorError) {
          userData = {
            id: authUser.id,
            email: authUser.email!,
            userType: 'professor',
            userData: {
              ...professorData,
              id: professorData.id_professor
            }
          };
        }
      }

      // If not professor, try student
      if (!userData) {
        const { data: alunoData, error: alunoError } = await supabase
          .from('alunos')
          .select('*')
          .eq('email', authUser.email)
          .maybeSingle();

        if (alunoData && !alunoError) {
          userData = {
            id: authUser.id,
            email: authUser.email!,
            userType: 'aluno',
            userData: {
              ...alunoData,
              id: alunoData.id_aluno
            }
          };
        }
      }

      setUser(userData);
      setLoading(false);
      
      if (!userData) {
        console.log('User not found in any table, signing out');
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // First, check if user exists in our custom tables
      let userFound = false;
      let userType: 'administrador' | 'professor' | 'aluno' | null = null;
      
      // Check admin
      const { data: adminData } = await supabase
        .from('administrador')
        .select('*')
        .eq('email', email)
        .eq('senha', password)
        .maybeSingle();
      
      if (adminData) {
        userFound = true;
        userType = 'administrador';
      }
      
      // Check professor if not admin
      if (!userFound) {
        const { data: professorData } = await supabase
          .from('professores')
          .select('*')
          .eq('email', email)
          .eq('senha', password)
          .maybeSingle();
        
        if (professorData) {
          userFound = true;
          userType = 'professor';
        }
      }
      
      // Check student if not professor
      if (!userFound) {
        const { data: alunoData } = await supabase
          .from('alunos')
          .select('*')
          .eq('email', email)
          .eq('senha', password)
          .maybeSingle();
        
        if (alunoData) {
          userFound = true;
          userType = 'aluno';
        }
      }
      
      if (!userFound) {
        return { error: { message: 'Invalid login credentials' } };
      }
      
      // Try to sign in with Supabase Auth
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // If auth user doesn't exist or email not confirmed, create/handle appropriately
        if (signInError.message.includes('Invalid login credentials')) {
          // Auth user doesn't exist, create it without email confirmation
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: {
                email_confirm: true // This won't work, but we'll handle it differently
              }
            }
          });
          
          if (signUpError) {
            return { error: signUpError };
          }
          
          // The user is created but needs email confirmation
          // For now, we'll return a specific message about email confirmation
          return { error: { message: 'Account created. Please check your email to confirm your account before logging in.' } };
          
        } else if (signInError.message.includes('Email not confirmed')) {
          return { error: { message: 'Please check your email and click the confirmation link before logging in.' } };
        }
        
        return { error: signInError };
      }

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
      
      // First create the user in our custom table
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

      // Then create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

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
