
-- Drop the existing policies first
DROP POLICY IF EXISTS "Administradores podem fazer SELECT em salas" ON public.salas;
DROP POLICY IF EXISTS "Administradores podem fazer INSERT em salas" ON public.salas;
DROP POLICY IF EXISTS "Administradores podem fazer UPDATE em salas" ON public.salas;
DROP POLICY IF EXISTS "Administradores podem fazer DELETE em salas" ON public.salas;
DROP POLICY IF EXISTS "Professores podem visualizar salas" ON public.salas;
DROP POLICY IF EXISTS "Alunos podem visualizar salas" ON public.salas;

-- Enable RLS on salas table
ALTER TABLE public.salas ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check user permissions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
DECLARE
  user_email TEXT;
  user_role TEXT;
BEGIN
  -- Get the current user's email from auth metadata
  SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
  
  IF user_email IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Check if user is an administrator
  IF EXISTS (SELECT 1 FROM public.administrador WHERE email = user_email) THEN
    RETURN 'administrador';
  END IF;
  
  -- Check if user is a professor
  IF EXISTS (SELECT 1 FROM public.professores WHERE email = user_email) THEN
    RETURN 'professor';
  END IF;
  
  -- Check if user is a student
  IF EXISTS (SELECT 1 FROM public.alunos WHERE email = user_email) THEN
    RETURN 'aluno';
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create new policies using the security definer function
CREATE POLICY "Administradores podem gerenciar salas" 
ON public.salas 
FOR ALL 
USING (public.get_current_user_role() = 'administrador')
WITH CHECK (public.get_current_user_role() = 'administrador');

CREATE POLICY "Professores e alunos podem visualizar salas" 
ON public.salas 
FOR SELECT 
USING (public.get_current_user_role() IN ('professor', 'aluno', 'administrador'));
