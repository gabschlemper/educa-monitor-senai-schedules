import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Search, Filter, Wifi, Monitor, Projector, AirVent, Tv } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Sala, Recurso } from "@/types/database";

const RoomManagement = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterBloco, setFilterBloco] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSala, setEditingSala] = useState<Sala | null>(null);
  const [formData, setFormData] = useState({
    nome_sala: '',
    tipo_sala: '',
    bloco: '',
    andar: '',
    capacidade: ''
  });
  const [selectedRecursos, setSelectedRecursos] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchSalas();
    fetchRecursos();
  }, []);

  const fetchSalas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('salas').select('*');
      if (error) throw error;
      setSalas(data || []);
    } catch (error) {
      console.error('Error fetching salas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar salas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecursos = async () => {
    try {
      const { data, error } = await supabase.from('recursos').select('*');
      if (error) throw error;
      setRecursos(data || []);
    } catch (error) {
      console.error('Error fetching recursos:', error);
    }
  };

  const validateForm = () => {
    if (!formData.nome_sala || !formData.tipo_sala || !formData.bloco || !formData.andar || !formData.capacidade) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return false;
    }

    if (formData.nome_sala.length > 6) {
      setError('Nome da sala deve ter no máximo 6 caracteres');
      return false;
    }

    if (formData.bloco.length !== 1) {
      setError('Bloco deve ter exatamente 1 caractere');
      return false;
    }

    if (parseInt(formData.andar) < 0 || parseInt(formData.capacidade) < 1) {
      setError('Andar e capacidade devem ser números positivos');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      const salaData = {
        nome_sala: formData.nome_sala.toUpperCase(),
        tipo_sala: formData.tipo_sala,
        bloco: formData.bloco.toUpperCase(),
        andar: parseInt(formData.andar),
        capacidade: parseInt(formData.capacidade)
      };

      let result;
      
      if (editingSala) {
        // Update existing sala
        result = await supabase
          .from('salas')
          .update(salaData)
          .eq('id_sala', editingSala.id_sala);
      } else {
        // Create new sala
        result = await supabase.from('salas').insert([salaData]).select();
      }

      if (result.error) throw result.error;

      // Handle recursos (only for new salas or if recursos changed)
      if (result.data && result.data.length > 0) {
        const salaId = editingSala ? editingSala.id_sala : result.data[0].id_sala;
        
        // Delete existing recursos for this sala if editing
        if (editingSala) {
          await supabase.from('disponibilidade').delete().eq('fk_salas', salaId);
        }

        // Insert selected recursos
        const recursosToInsert = Object.entries(selectedRecursos)
          .filter(([_, selected]) => selected)
          .map(([recursoId, _]) => ({
            fk_salas: salaId,
            fk_recursos: parseInt(recursoId),
            recurso_disponivel: true
          }));

        if (recursosToInsert.length > 0) {
          const { error: recursosError } = await supabase
            .from('disponibilidade')
            .insert(recursosToInsert);
          
          if (recursosError) throw recursosError;
        }
      }

      toast({
        title: "Sucesso",
        description: `Sala ${editingSala ? 'atualizada' : 'criada'} com sucesso`,
      });

      setIsDialogOpen(false);
      setEditingSala(null);
      resetForm();
      fetchSalas();
    } catch (error: any) {
      console.error('Error saving sala:', error);
      setError(error.message || 'Erro ao salvar sala');
    }
  };

  const handleDelete = async (sala: Sala) => {
    if (!confirm('Tem certeza que deseja excluir esta sala? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('salas')
        .delete()
        .eq('id_sala', sala.id_sala);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Sala excluída com sucesso",
      });

      fetchSalas();
    } catch (error: any) {
      console.error('Error deleting sala:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir sala",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nome_sala: '',
      tipo_sala: '',
      bloco: '',
      andar: '',
      capacidade: ''
    });
    setSelectedRecursos({});
    setError('');
  };

  const handleEdit = async (sala: Sala) => {
    setEditingSala(sala);
    setFormData({
      nome_sala: sala.nome_sala,
      tipo_sala: sala.tipo_sala,
      bloco: sala.bloco,
      andar: sala.andar.toString(),
      capacidade: sala.capacidade.toString()
    });

    // Fetch recursos for this sala
    try {
      const { data, error } = await supabase
        .from('disponibilidade')
        .select('fk_recursos')
        .eq('fk_salas', sala.id_sala)
        .eq('recurso_disponivel', true);

      if (error) throw error;

      const salaRecursos: { [key: string]: boolean } = {};
      data?.forEach(item => {
        salaRecursos[item.fk_recursos.toString()] = true;
      });
      setSelectedRecursos(salaRecursos);
    } catch (error) {
      console.error('Error fetching sala recursos:', error);
    }

    setIsDialogOpen(true);
  };

  const getResourceIcon = (tipoRecurso: string) => {
    switch (tipoRecurso.toLowerCase()) {
      case 'tv': return <Tv className="h-4 w-4" />;
      case 'projetor': return <Projector className="h-4 w-4" />;
      case 'computadores': return <Monitor className="h-4 w-4" />;
      case 'internet': return <Wifi className="h-4 w-4" />;
      case 'ar condicionado': return <AirVent className="h-4 w-4" />;
      default: return null;
    }
  };

  const getRoomTypeBadge = (tipoSala: string) => {
    const colors = {
      'Sala de aula': 'bg-blue-100 text-blue-800',
      'Laboratório': 'bg-purple-100 text-purple-800',
      'Auditório': 'bg-green-100 text-green-800'
    };
    return colors[tipoSala as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredSalas = salas.filter(sala => {
    const matchesSearch = sala.nome_sala.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sala.tipo_sala.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || sala.tipo_sala === filterType;
    const matchesBloco = filterBloco === 'all' || sala.bloco === filterBloco;
    return matchesSearch && matchesType && matchesBloco;
  });

  const uniqueBlocos = [...new Set(salas.map(sala => sala.bloco))].sort();

  if (loading) {
    return <div className="p-6">Carregando salas...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Salas</h1>
          <p className="text-muted-foreground">Administre salas de aula, laboratórios e auditórios</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-senai-blue hover:bg-senai-blue-dark" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Sala
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSala ? 'Editar Sala' : 'Nova Sala'}
              </DialogTitle>
              <DialogDescription>
                {editingSala ? 'Atualize as informações da sala' : 'Preencha as informações para cadastrar uma nova sala'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome_sala">Nome/Identificação da Sala *</Label>
                  <Input
                    id="nome_sala"
                    value={formData.nome_sala}
                    onChange={(e) => setFormData({...formData, nome_sala: e.target.value})}
                    maxLength={6}
                    placeholder="Ex: A101"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tipo_sala">Tipo de Sala *</Label>
                  <Select value={formData.tipo_sala} onValueChange={(value) => setFormData({...formData, tipo_sala: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sala de aula">Sala de aula</SelectItem>
                      <SelectItem value="Laboratório">Laboratório</SelectItem>
                      <SelectItem value="Auditório">Auditório</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bloco">Bloco *</Label>
                  <Input
                    id="bloco"
                    value={formData.bloco}
                    onChange={(e) => setFormData({...formData, bloco: e.target.value})}
                    maxLength={1}
                    placeholder="A"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="andar">Andar *</Label>
                  <Input
                    id="andar"
                    type="number"
                    value={formData.andar}
                    onChange={(e) => setFormData({...formData, andar: e.target.value})}
                    min="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="capacidade">Capacidade *</Label>
                  <Input
                    id="capacidade"
                    type="number"
                    value={formData.capacidade}
                    onChange={(e) => setFormData({...formData, capacidade: e.target.value})}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Recursos Disponíveis</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {recursos.map((recurso) => (
                    <div key={recurso.id_recurso} className="flex items-center space-x-2">
                      <Checkbox
                        id={`recurso-${recurso.id_recurso}`}
                        checked={selectedRecursos[recurso.id_recurso.toString()] || false}
                        onCheckedChange={(checked) => 
                          setSelectedRecursos({
                            ...selectedRecursos,
                            [recurso.id_recurso.toString()]: checked === true
                          })
                        }
                      />
                      <Label 
                        htmlFor={`recurso-${recurso.id_recurso}`}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        {getResourceIcon(recurso.tipo_recurso)}
                        <span>{recurso.tipo_recurso}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-senai-blue hover:bg-senai-blue-dark">
                  {editingSala ? 'Atualizar' : 'Cadastrar'} Sala
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou tipo de sala..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="Sala de aula">Sala de aula</SelectItem>
                  <SelectItem value="Laboratório">Laboratório</SelectItem>
                  <SelectItem value="Auditório">Auditório</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterBloco} onValueChange={setFilterBloco}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {uniqueBlocos.map((bloco) => (
                    <SelectItem key={bloco} value={bloco}>
                      Bloco {bloco}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSalas.map((sala) => (
          <Card key={sala.id_sala} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{sala.nome_sala}</CardTitle>
                  <Badge className={getRoomTypeBadge(sala.tipo_sala)}>
                    {sala.tipo_sala}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(sala)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(sala)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bloco:</span>
                  <span className="font-medium">{sala.bloco}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Andar:</span>
                  <span className="font-medium">{sala.andar}º</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacidade:</span>
                  <span className="font-medium">{sala.capacidade} pessoas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSalas.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma sala encontrada</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoomManagement;
