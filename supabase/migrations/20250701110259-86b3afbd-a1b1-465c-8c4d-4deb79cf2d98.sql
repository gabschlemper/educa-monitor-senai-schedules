-- Fix RLS policies for all log tables to allow audit logging

-- Enable RLS on all log tables
ALTER TABLE public.log_salas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_administrador ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_destinatarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_disciplina ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_disponibilidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_horario_escolar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_leciona ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_professores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_recursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_turmas ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for all log tables to allow audit logging
-- These tables are for audit purposes and should allow inserts from authenticated users

CREATE POLICY "Allow audit logging for salas" 
ON public.log_salas 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow audit logging for administrador" 
ON public.log_administrador 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow audit logging for alunos" 
ON public.log_alunos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow audit logging for destinatarios" 
ON public.log_destinatarios 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow audit logging for disciplina" 
ON public.log_disciplina 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow audit logging for disponibilidade" 
ON public.log_disponibilidade 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow audit logging for horario_escolar" 
ON public.log_horario_escolar 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow audit logging for horarios" 
ON public.log_horarios 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow audit logging for leciona" 
ON public.log_leciona 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow audit logging for notificacoes" 
ON public.log_notificacoes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow audit logging for professores" 
ON public.log_professores 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow audit logging for recursos" 
ON public.log_recursos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow audit logging for turmas" 
ON public.log_turmas 
FOR INSERT 
WITH CHECK (true);

-- Also need to create RLS policies for the horario_escolar table (agendamentos)
ALTER TABLE public.horario_escolar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Administradores podem gerenciar agendamentos" 
ON public.horario_escolar 
FOR ALL 
USING (public.get_current_user_role() = 'administrador')
WITH CHECK (public.get_current_user_role() = 'administrador');

CREATE POLICY "Professores podem ver seus agendamentos" 
ON public.horario_escolar 
FOR SELECT 
USING (
  public.get_current_user_role() = 'professor' AND 
  fk_professores = (
    SELECT id_professor FROM public.professores 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

CREATE POLICY "Alunos podem ver agendamentos de sua turma" 
ON public.horario_escolar 
FOR SELECT 
USING (
  public.get_current_user_role() = 'aluno' AND 
  fk_turmas = (
    SELECT fk_turma FROM public.alunos 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);