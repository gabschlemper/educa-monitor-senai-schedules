
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Recurso } from "@/types/database";

export const useResources = () => {
  const [resources, setResources] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('recursos').select('*').order('tipo_recurso');
      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar recursos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return {
    resources,
    loading,
    refreshResources: fetchResources
  };
};
