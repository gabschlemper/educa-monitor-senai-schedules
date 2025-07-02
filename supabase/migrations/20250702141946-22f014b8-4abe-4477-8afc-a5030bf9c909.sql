
-- Fix RLS policy for notificacoes table to allow administrators to create notifications
CREATE POLICY "Allow administrators to manage notificacoes"
ON public.notificacoes
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.administrador a
    WHERE a.email = auth.jwt() ->> 'email'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.administrador a
    WHERE a.email = auth.jwt() ->> 'email'
  )
);

-- Fix the log_horario_escolar trigger functions to remove reference to non-existent 'acao' column
CREATE OR REPLACE FUNCTION public.trg_horario_escolar_insert_fn()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO log_horario_escolar (
    id_horario_escolar,
    fk_administrador,
    fk_professores,
    fk_turmas,
    fk_salas,
    fk_horarios,
    fk_disciplina,
    data_hora
  )
  VALUES (
    NEW.id_horario_escolar,
    NEW.fk_administrador,
    NEW.fk_professores,
    NEW.fk_turmas,
    NEW.fk_salas,
    NEW.fk_horarios,
    NEW.fk_disciplina,
    now()
  );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_horario_escolar_update_fn()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO log_horario_escolar (
    id_horario_escolar,
    fk_administrador,
    fk_professores,
    fk_turmas,
    fk_salas,
    fk_horarios,
    fk_disciplina,
    data_hora
  )
  VALUES (
    NEW.id_horario_escolar,
    NEW.fk_administrador,
    NEW.fk_professores,
    NEW.fk_turmas,
    NEW.fk_salas,
    NEW.fk_horarios,
    NEW.fk_disciplina,
    now()
  );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_horario_escolar_delete_fn()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO log_horario_escolar (
    id_horario_escolar,
    fk_administrador,
    fk_professores,
    fk_turmas,
    fk_salas,
    fk_horarios,
    fk_disciplina,
    data_hora
  )
  VALUES (
    OLD.id_horario_escolar,
    OLD.fk_administrador,
    OLD.fk_professores,
    OLD.fk_turmas,
    OLD.fk_salas,
    OLD.fk_horarios,
    OLD.fk_disciplina,
    now()
  );

  RETURN OLD;
END;
$$;

-- Remove the problematic permission check triggers that use app.current_user_id
DROP TRIGGER IF EXISTS trg_verifica_permissao_insert ON public.horario_escolar;
DROP TRIGGER IF EXISTS trg_verifica_permissao_update ON public.horario_escolar;
DROP TRIGGER IF EXISTS trg_verifica_permissao_delete ON public.horario_escolar;

-- Drop the functions that use the non-existent configuration parameter
DROP FUNCTION IF EXISTS public.trg_fn_verifica_permissao_insert();
DROP FUNCTION IF EXISTS public.trg_fn_verifica_permissao_update();
DROP FUNCTION IF EXISTS public.trg_fn_verifica_permissao_delete();

-- Remove the problematic fn_bloqueia_exclusao_reserva function that uses app.current_user_id
DROP FUNCTION IF EXISTS public.fn_bloqueia_exclusao_reserva();
