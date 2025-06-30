
-- Criar políticas RLS para a tabela salas
-- Permitir que administradores façam todas as operações CRUD
CREATE POLICY "Administradores podem fazer SELECT em salas" 
ON public.salas 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.administrador 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

CREATE POLICY "Administradores podem fazer INSERT em salas" 
ON public.salas 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.administrador 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

CREATE POLICY "Administradores podem fazer UPDATE em salas" 
ON public.salas 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.administrador 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

CREATE POLICY "Administradores podem fazer DELETE em salas" 
ON public.salas 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.administrador 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Permitir que professores e alunos vejam as salas (somente leitura)
CREATE POLICY "Professores podem visualizar salas" 
ON public.salas 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.professores 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

CREATE POLICY "Alunos podem visualizar salas" 
ON public.salas 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.alunos 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);
