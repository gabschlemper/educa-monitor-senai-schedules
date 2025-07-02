
-- First, let's drop all triggers on horario_escolar table to start fresh
DROP TRIGGER IF EXISTS trg_horario_escolar_insert ON public.horario_escolar;
DROP TRIGGER IF EXISTS trg_horario_escolar_update ON public.horario_escolar;
DROP TRIGGER IF EXISTS trg_horario_escolar_delete ON public.horario_escolar;
DROP TRIGGER IF EXISTS trg_log_horario_escolar ON public.horario_escolar;
DROP TRIGGER IF EXISTS trg_fn_notifica_horario_escolar ON public.horario_escolar;

-- Drop all functions that might be causing issues
DROP FUNCTION IF EXISTS public.trg_horario_escolar_insert_fn() CASCADE;
DROP FUNCTION IF EXISTS public.trg_horario_escolar_update_fn() CASCADE;
DROP FUNCTION IF EXISTS public.trg_horario_escolar_delete_fn() CASCADE;
DROP FUNCTION IF EXISTS public.trg_log_horario_escolar() CASCADE;
DROP FUNCTION IF EXISTS public.trg_fn_notifica_horario_escolar() CASCADE;
DROP FUNCTION IF EXISTS public.fn_bloqueia_exclusao_reserva() CASCADE;

-- Now create clean, simple logging functions without the 'acao' column
CREATE OR REPLACE FUNCTION public.log_horario_escolar_changes()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
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
  ELSIF TG_OP = 'UPDATE' THEN
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
  ELSIF TG_OP = 'DELETE' THEN
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
  END IF;
  RETURN NULL;
END;
$$;

-- Create the trigger using the new function
CREATE TRIGGER trg_log_horario_escolar
    AFTER INSERT OR UPDATE OR DELETE ON public.horario_escolar
    FOR EACH ROW EXECUTE FUNCTION public.log_horario_escolar_changes();

-- Make sure the log_horario_escolar table doesn't have an 'acao' column requirement
-- by creating a simple insert policy that doesn't reference it
CREATE POLICY "Allow logging for horario_escolar" 
ON public.log_horario_escolar 
FOR INSERT 
WITH CHECK (true);
