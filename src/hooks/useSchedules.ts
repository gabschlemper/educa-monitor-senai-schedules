import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Schedule {
  id_horario_escolar: number;
  data: string;
  hora_inicio: string;
  hora_termino: string;
  disciplina: string;
  professor_nome: string;
  sala_nome: string;
  turma_nome: string;
  fk_disciplina: number;
  fk_professores: number;
  fk_salas: number;
  fk_turmas: number;
  fk_horarios: number;
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
        .order('horarios(data)', { ascending: true });

      if (error) throw error;

      const formattedSchedules = data?.map(item => ({
        id_horario_escolar: item.id_horario_escolar,
        data: item.horarios?.data || '',
        hora_inicio: item.horarios?.hora_inicio || '',
        hora_termino: item.horarios?.hora_termino || '',
        disciplina: item.disciplina?.disciplina || '',
        professor_nome: item.professores?.nome || '',
        sala_nome: item.salas?.nome_sala || '',
        turma_nome: item.turmas?.agrupamento || '',
        fk_disciplina: item.fk_disciplina || 0,
        fk_professores: item.fk_professores || 0,
        fk_salas: item.fk_salas || 0,
        fk_turmas: item.fk_turmas || 0,
        fk_horarios: item.fk_horarios || 0,
      })) || [];

      setSchedules(formattedSchedules);
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

  const createSchedule = async (scheduleData: CreateScheduleData) => {
    try {
      // First create the horario entry
      const { data: horarioData, error: horarioError } = await supabase
        .from('horarios')
        .insert({
          data: scheduleData.date,
          hora_inicio: scheduleData.startTime,
          hora_termino: scheduleData.endTime,
          fk_salas: scheduleData.fk_salas,
          is_dia_util: true
        })
        .select()
        .single();

      if (horarioError) throw horarioError;

      // Then create the horario_escolar entry
      const { data, error } = await supabase
        .from('horario_escolar')
        .insert({
          fk_horarios: horarioData.id_horario,
          fk_disciplina: scheduleData.fk_disciplina,
          fk_professores: scheduleData.fk_professores,
          fk_salas: scheduleData.fk_salas,
          fk_turmas: scheduleData.fk_turmas
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Agendamento criado com sucesso",
      });

      await fetchSchedules();
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating schedule:', error);
      const errorMessage = error.message || 'Erro ao criar agendamento';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateSchedule = async (id: number, scheduleData: Partial<CreateScheduleData>) => {
    try {
      // Get the current schedule to update horarios table
      const { data: currentSchedule, error: fetchError } = await supabase
        .from('horario_escolar')
        .select('fk_horarios')
        .eq('id_horario_escolar', id)
        .single();

      if (fetchError) throw fetchError;

      // Update horarios table if date/time changed
      if (scheduleData.date || scheduleData.startTime || scheduleData.endTime) {
        const { error: horarioError } = await supabase
          .from('horarios')
          .update({
            ...(scheduleData.date && { data: scheduleData.date }),
            ...(scheduleData.startTime && { hora_inicio: scheduleData.startTime }),
            ...(scheduleData.endTime && { hora_termino: scheduleData.endTime }),
          })
          .eq('id_horario', currentSchedule.fk_horarios);

        if (horarioError) throw horarioError;
      }

      // Update horario_escolar table
      const updateData: any = {};
      if (scheduleData.fk_disciplina) updateData.fk_disciplina = scheduleData.fk_disciplina;
      if (scheduleData.fk_professores) updateData.fk_professores = scheduleData.fk_professores;
      if (scheduleData.fk_salas) updateData.fk_salas = scheduleData.fk_salas;
      if (scheduleData.fk_turmas) updateData.fk_turmas = scheduleData.fk_turmas;

      if (Object.keys(updateData).length > 0) {
        const { data, error } = await supabase
          .from('horario_escolar')
          .update(updateData)
          .eq('id_horario_escolar', id)
          .select()
          .single();

        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: "Agendamento atualizado com sucesso",
      });

      await fetchSchedules();
      return { data: null, error: null };
    } catch (error: any) {
      console.error('Error updating schedule:', error);
      const errorMessage = error.message || 'Erro ao atualizar agendamento';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteSchedule = async (id: number) => {
    try {
      // Get the horario id first
      const { data: scheduleData, error: fetchError } = await supabase
        .from('horario_escolar')
        .select('fk_horarios')
        .eq('id_horario_escolar', id)
        .single();

      if (fetchError) throw fetchError;

      // Delete horario_escolar first
      const { error: scheduleError } = await supabase
        .from('horario_escolar')
        .delete()
        .eq('id_horario_escolar', id);

      if (scheduleError) throw scheduleError;

      // Then delete the horario
      const { error: horarioError } = await supabase
        .from('horarios')
        .delete()
        .eq('id_horario', scheduleData.fk_horarios);

      if (horarioError) throw horarioError;

      toast({
        title: "Sucesso",
        description: "Agendamento excluído com sucesso",
      });

      await fetchSchedules();
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting schedule:', error);
      const errorMessage = error.message || 'Erro ao excluir agendamento';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { error };
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