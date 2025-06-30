
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useRoomResources = () => {
  const { toast } = useToast();

  const fetchRoomResources = async (roomId: number) => {
    try {
      const { data, error } = await supabase
        .from('disponibilidade')
        .select('fk_recursos')
        .eq('fk_salas', roomId)
        .eq('recurso_disponivel', true);

      if (error) throw error;

      const resourceIds: { [key: string]: boolean } = {};
      data?.forEach(item => {
        resourceIds[item.fk_recursos.toString()] = true;
      });

      return resourceIds;
    } catch (error) {
      console.error('Error fetching room resources:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar recursos da sala",
        variant: "destructive",
      });
      return {};
    }
  };

  const updateRoomResources = async (roomId: number, selectedResources: { [key: string]: boolean }) => {
    try {
      // Delete existing resources for this room
      await supabase.from('disponibilidade').delete().eq('fk_salas', roomId);

      // Insert selected resources
      const resourcesToInsert = Object.entries(selectedResources)
        .filter(([_, selected]) => selected)
        .map(([resourceId, _]) => ({
          fk_salas: roomId,
          fk_recursos: parseInt(resourceId),
          recurso_disponivel: true
        }));

      if (resourcesToInsert.length > 0) {
        const { error } = await supabase
          .from('disponibilidade')
          .insert(resourcesToInsert);
        
        if (error) throw error;
      }

      return { error: null };
    } catch (error: any) {
      console.error('Error updating room resources:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar recursos da sala",
        variant: "destructive",
      });
      return { error };
    }
  };

  return {
    fetchRoomResources,
    updateRoomResources
  };
};
