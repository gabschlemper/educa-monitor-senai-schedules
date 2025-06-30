
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Sala } from "@/types/database";

export const useRooms = () => {
  const [rooms, setRooms] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('salas').select('*').order('nome_sala');
      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar salas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async (roomData: Omit<Sala, 'id_sala' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('salas')
        .insert([roomData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Sala criada com sucesso",
      });

      await fetchRooms();
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating room:', error);
      const errorMessage = error.message || 'Erro ao criar sala';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateRoom = async (id: number, roomData: Partial<Sala>) => {
    try {
      const { data, error } = await supabase
        .from('salas')
        .update(roomData)
        .eq('id_sala', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Sala atualizada com sucesso",
      });

      await fetchRooms();
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating room:', error);
      const errorMessage = error.message || 'Erro ao atualizar sala';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteRoom = async (id: number) => {
    try {
      const { error } = await supabase
        .from('salas')
        .delete()
        .eq('id_sala', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Sala excluída com sucesso",
      });

      await fetchRooms();
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting room:', error);
      const errorMessage = error.message || 'Erro ao excluir sala';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return {
    rooms,
    loading,
    createRoom,
    updateRoom,
    deleteRoom,
    refreshRooms: fetchRooms
  };
};
