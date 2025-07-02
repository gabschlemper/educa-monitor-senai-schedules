
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Schedule {
  id_horario_escolar: number;
  data: string;
  hora_inicio: string;
  hora_termino: string;
  fk_disciplina: number;
  fk_professores: number;
  fk_salas: number;
  fk_turmas: number;
  fk_horarios: number;
  disciplina: string;
  professor_nome: string;
  sala_nome: string;
  turma_nome: string;
}

export interface CreateScheduleData {
  date: string;
  startTime: string;
  endTime: string;
  fk_disciplina: number;
  fk_professores: number;
  fk_salas: number;
  fk_turmas: number;
}

export const useSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('horario_escolar')
        .select(`
          *,
          disciplina:fk_disciplina(disciplina),
          professores:fk_professores(nome),
          salas:fk_salas(nome_sala),
          turmas:fk_turmas(agrupamento),
          horarios:fk_horarios(data, hora_inicio, hora_termino)
        `)
        .order('id_horario_escolar', { ascending: false });

      if (error) throw error;

      const transformedData = data?.map(item => ({
        id_horario_escolar: item.id_horario_escolar,
        data: item.horarios?.data || '',
        hora_inicio: item.horarios?.hora_inicio || '',
        hora_termino: item.horarios?.hora_termino || '',
        fk_disciplina: item.fk_disciplina,
        fk_professores: item.fk_professores,
        fk_salas: item.fk_salas,
        fk_turmas: item.fk_turmas,
        fk_horarios: item.fk_horarios,
        disciplina: item.disciplina?.disciplina || '',
        professor_nome: item.professores?.nome || '',
        sala_nome: item.salas?.nome_sala || '',
        turma_nome: item.turmas?.agrupamento || ''
      })) || [];

      setSchedules(transformedData);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar agendamentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (data: CreateScheduleData) => {
    try {
      // First, create the horario entry
      const { data: horarioData, error: horarioError } = await supabase
        .from('horarios')
        .insert({
          data: data.date,
          hora_inicio: data.startTime,
          hora_termino: data.endTime,
          fk_salas: data.fk_salas,
          is_dia_util: true
        })
        .select()
        .single();

      if (horarioError) throw horarioError;

      // Then create the horario_escolar entry
      const { error: scheduleError } = await supabase
        .from('horario_escolar')
        .insert({
          fk_disciplina: data.fk_disciplina,
          fk_professores: data.fk_professores,
          fk_salas: data.fk_salas,
          fk_turmas: data.fk_turmas,
          fk_horarios: horarioData.id_horario,
          fk_administrador: null // Will be set by triggers if needed
        });

      if (scheduleError) throw scheduleError;

      toast({
        title: "Sucesso",
        description: "Agendamento criado com sucesso",
      });

      await fetchSchedules();
    } catch (error) {
      console.error('Error creating schedule:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar agendamento",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateSchedule = async (id: number, data: CreateScheduleData) => {
    try {
      // Get the current schedule to find the horario_id
      const { data: currentSchedule, error: fetchError } = await supabase
        .from('horario_escolar')
        .select('fk_horarios')
        .eq('id_horario_escolar', id)
        .single();

      if (fetchError) throw fetchError;

      // Update the horario entry
      const { error: horarioError } = await supabase
        .from('horarios')
        .update({
          data: data.date,
          hora_inicio: data.startTime,
          hora_termino: data.endTime,
          fk_salas: data.fk_salas
        })
        .eq('id_horario', currentSchedule.fk_horarios);

      if (horarioError) throw horarioError;

      // Update the horario_escolar entry
      const { error: scheduleError } = await supabase
        .from('horario_escolar')
        .update({
          fk_disciplina: data.fk_disciplina,
          fk_professores: data.fk_professores,
          fk_salas: data.fk_salas,
          fk_turmas: data.fk_turmas
        })
        .eq('id_horario_escolar', id);

      if (scheduleError) throw scheduleError;

      toast({
        title: "Sucesso",
        description: "Agendamento atualizado com sucesso",
      });

      await fetchSchedules();
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar agendamento",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteSchedule = async (id: number) => {
    try {
      // Get the current schedule to find the horario_id
      const { data: currentSchedule, error: fetchError } = await supabase
        .from('horario_escolar')
        .select('fk_horarios')
        .eq('id_horario_escolar', id)
        .single();

      if (fetchError) throw fetchError;

      // Delete the horario_escolar entry first
      const { error: scheduleError } = await supabase
        .from('horario_escolar')
        .delete()
        .eq('id_horario_escolar', id);

      if (scheduleError) throw scheduleError;

      // Then delete the horario entry
      const { error: horarioError } = await supabase
        .from('horarios')
        .delete()
        .eq('id_horario', currentSchedule.fk_horarios);

      if (horarioError) throw horarioError;

      toast({
        title: "Sucesso",
        description: "Agendamento excluído com sucesso",
      });

      await fetchSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir agendamento",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return {
    schedules,
    loading,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    refreshSchedules: fetchSchedules
  };
};
