
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
import { Plus, Edit, Trash2, Search, Filter, Monitor, Wifi, Snowflake, Computer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Sala, Recurso } from "@/types/database";

interface RoomWithResources extends Sala {
  resources: {
    [key: string]: boolean;
  };
}

const RoomManagement = () => {
  const [rooms, setRooms] = useState<RoomWithResources[]>([]);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBlock, setFilterBlock] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomWithResources | null>(null);
  const [formData, setFormData] = useState({
    nome_sala: '',
    capacidade: '',
    bloco: '',
    andar: '',
    tipo_sala: 'Sala de aula' as 'Sala de aula' | 'Laboratório' | 'Auditório',
    resources: {} as { [key: string]: boolean }
  });
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchRooms();
    fetchRecursos();
  }, []);

  const fetchRecursos = async () => {
    try {
      const { data, error } = await supabase.from('recursos').select('*');
      if (error) throw error;
      setRecursos(data || []);
    } catch (error) {
      console.error('Error fetching recursos:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      
      // Fetch rooms with their resources
      const { data: roomsData, error: roomsError } = await supabase
        .from('salas')
        .select('*');
        
      if (roomsError) throw roomsError;

      // Fetch room resources
      const { data: disponibilidadeData, error: dispError } = await supabase
        .from('disponibilidade')
        .select(`
          fk_salas,
          recurso_disponivel,
          recursos(tipo_recurso)
        `);
        
      if (dispError) throw dispError;

      // Combine rooms with their resources
      const roomsWithResources = (roomsData || []).map(room => {
        const roomResources = disponibilidadeData?.filter(d => d.fk_salas === room.id_sala) || [];
        const resources: { [key: string]: boolean } = {};
        
        roomResources.forEach(resource => {
          if (resource.recursos?.tipo_recurso) {
            resources[resource.recursos.tipo_recurso] = resource.recurso_disponivel || false;
          }
        });

        return {
          ...room,
          resources
        };
      });

      setRooms(roomsWithResources);
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

  const validateForm = () => {
    if (!formData.nome_sala || !formData.capacidade || !formData.bloco || !formData.andar) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return false;
    }

    if (formData.nome_sala.length > 6) {
      setError('A identificação deve ter no máximo 6 caracteres');
      return false;
    }

    const capacity = parseInt(formData.capacidade);
    if (isNaN(capacity) || capacity <= 0) {
      setError('A capacidade deve ser um número válido maior que zero');
      return false;
    }

    const floor = parseInt(formData.andar);
    if (isNaN(floor) || floor < 0) {
      setError('O andar deve ser um número válido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      const roomData = {
        nome_sala: formData.nome_sala,
        capacidade: parseInt(formData.capacidade),
        bloco: formData.bloco,
        andar: parseInt(formData.andar),
        tipo_sala: formData.tipo_sala
      };

      let roomId: number;

      if (editingRoom) {
        // Update existing room
        const { error: updateError } = await supabase
          .from('salas')
          .update(roomData)
          .eq('id_sala', editingRoom.id_sala);

        if (updateError) throw updateError;
        roomId = editingRoom.id_sala;
      } else {
        // Create new room
        const { data, error: insertError } = await supabase
          .from('salas')
          .insert([roomData])
          .select()
          .single();

        if (insertError) throw insertError;
        roomId = data.id_sala;
      }

      // Update room resources
      // First, delete existing resources for this room
      await supabase
        .from('disponibilidade')
        .delete()
        .eq('fk_salas', roomId);

      // Then insert new resources
      const resourceInserts = recursos
        .filter(recurso => formData.resources[recurso.tipo_recurso])
        .map(recurso => ({
          fk_recursos: recurso.id_recurso,
          fk_salas: roomId,
          recurso_disponivel: true
        }));

      if (resourceInserts.length > 0) {
        const { error: resourceError } = await supabase
          .from('disponibilidade')
          .insert(resourceInserts);

        if (resourceError) throw resourceError;
      }

      toast({
        title: "Sucesso",
        description: `Sala ${editingRoom ? 'atualizada' : 'criada'} com sucesso`,
      });

      setIsDialogOpen(false);
      setEditingRoom(null);
      resetForm();
      fetchRooms();
    } catch (error: any) {
      console.error('Error saving room:', error);
      setError(error.message || 'Erro ao salvar sala');
    }
  };

  const handleDelete = async (room: RoomWithResources) => {
    if (!confirm('Tem certeza que deseja excluir esta sala? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      // First delete resources
      await supabase
        .from('disponibilidade')
        .delete()
        .eq('fk_salas', room.id_sala);

      // Then delete room
      const { error } = await supabase
        .from('salas')
        .delete()
        .eq('id_sala', room.id_sala);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Sala excluída com sucesso",
      });

      fetchRooms();
    } catch (error: any) {
      console.error('Error deleting room:', error);
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
      capacidade: '',
      bloco: '',
      andar: '',
      tipo_sala: 'Sala de aula',
      resources: {}
    });
    setError('');
  };

  const handleEdit = (room: RoomWithResources) => {
    setEditingRoom(room);
    setFormData({
      nome_sala: room.nome_sala,
      capacidade: room.capacidade.toString(),
      bloco: room.bloco,
      andar: room.andar.toString(),
      tipo_sala: room.tipo_sala as 'Sala de aula' | 'Laboratório' | 'Auditório',
      resources: room.resources
    });
    setIsDialogOpen(true);
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.nome_sala.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.bloco.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = filterBlock === 'all' || room.bloco === filterBlock;
    const matchesType = filterType === 'all' || room.tipo_sala === filterType;
    return matchesSearch && matchesBlock && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Sala de aula': return 'bg-blue-100 text-blue-800';
      case 'Laboratório': return 'bg-green-100 text-green-800';
      case 'Auditório': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderResources = (resources: { [key: string]: boolean }) => {
    const activeResources = [];
    if (resources['Projetor']) activeResources.push(<div key="projector" className="flex items-center" title="Projetor"><Monitor className="h-4 w-4" /></div>);
    if (resources['TV']) activeResources.push(<div key="tv" className="text-xs bg-gray-500 text-white px-1 rounded">TV</div>);
    if (resources['Computadores']) activeResources.push(<div key="computers" className="flex items-center" title="Computadores"><Computer className="h-4 w-4" /></div>);
    if (resources['Internet']) activeResources.push(<div key="internet" className="flex items-center" title="Internet"><Wifi className="h-4 w-4" /></div>);
    if (resources['Ar Condicionado']) activeResources.push(<div key="ac" className="flex items-center" title="Ar Condicionado"><Snowflake className="h-4 w-4" /></div>);
    
    return (
      <div className="flex items-center space-x-1 flex-wrap">
        {activeResources.length > 0 ? activeResources : <span className="text-muted-foreground text-sm">Nenhum</span>}
      </div>
    );
  };

  if (loading) {
    return <div className="p-6">Carregando salas...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Salas</h1>
          <p className="text-muted-foreground">Administre as salas de aula e laboratórios</p>
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
                {editingRoom ? 'Editar Sala' : 'Nova Sala'}
              </DialogTitle>
              <DialogDescription>
                {editingRoom ? 'Atualize as informações da sala' : 'Preencha as informações para cadastrar uma nova sala'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="identification">Identificação/Número *</Label>
                  <Input
                    id="identification"
                    value={formData.nome_sala}
                    onChange={(e) => setFormData({...formData, nome_sala: e.target.value})}
                    placeholder="Ex: 101-A, Lab-01"
                    maxLength={6}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacidade *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacidade}
                    onChange={(e) => setFormData({...formData, capacidade: e.target.value})}
                    placeholder="Ex: 40"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="block">Bloco *</Label>
                  <Select value={formData.bloco} onValueChange={(value) => setFormData({...formData, bloco: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {['A', 'B', 'C', 'D', 'E', 'F'].map(block => (
                        <SelectItem key={block} value={block}>Bloco {block}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="floor">Andar *</Label>
                  <Input
                    id="floor"
                    type="number"
                    value={formData.andar}
                    onChange={(e) => setFormData({...formData, andar: e.target.value})}
                    placeholder="Ex: 1"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo de Sala *</Label>
                  <Select value={formData.tipo_sala} onValueChange={(value: 'Sala de aula' | 'Laboratório' | 'Auditório') => setFormData({...formData, tipo_sala: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sala de aula">Sala de aula</SelectItem>
                      <SelectItem value="Laboratório">Laboratório</SelectItem>
                      <SelectItem value="Auditório">Auditório</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Recursos Disponíveis</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {recursos.map(recurso => (
                    <div key={recurso.id_recurso} className="flex items-center space-x-2">
                      <Checkbox
                        id={recurso.tipo_recurso}
                        checked={formData.resources[recurso.tipo_recurso] || false}
                        onCheckedChange={(checked) => 
                          setFormData({
                            ...formData, 
                            resources: {
                              ...formData.resources,
                              [recurso.tipo_recurso]: checked
                            }
                          })
                        }
                      />
                      <Label htmlFor={recurso.tipo_recurso}>{recurso.tipo_recurso}</Label>
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
                  {editingRoom ? 'Atualizar' : 'Cadastrar'} Sala
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
                  placeholder="Buscar por identificação ou bloco..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterBlock} onValueChange={setFilterBlock}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Blocos</SelectItem>
                  {['A', 'B', 'C', 'D', 'E', 'F'].map(block => (
                    <SelectItem key={block} value={block}>Bloco {block}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Tipos</SelectItem>
                  <SelectItem value="Sala de aula">Sala de aula</SelectItem>
                  <SelectItem value="Laboratório">Laboratório</SelectItem>
                  <SelectItem value="Auditório">Auditório</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Table */}
      <Card>
        <CardHeader>
          <CardTitle>Salas ({filteredRooms.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Identificação</th>
                  <th className="text-left py-3 px-2">Bloco</th>
                  <th className="text-left py-3 px-2">Andar</th>
                  <th className="text-left py-3 px-2">Capacidade</th>
                  <th className="text-left py-3 px-2">Tipo</th>
                  <th className="text-left py-3 px-2">Recursos</th>
                  <th className="text-center py-3 px-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room) => (
                  <tr key={room.id_sala} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2 font-medium">{room.nome_sala}</td>
                    <td className="py-3 px-2">{room.bloco}</td>
                    <td className="py-3 px-2">{room.andar}º</td>
                    <td className="py-3 px-2">{room.capacidade} pessoas</td>
                    <td className="py-3 px-2">
                      <Badge className={getTypeColor(room.tipo_sala)}>
                        {room.tipo_sala}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      {renderResources(room.resources)}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(room)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(room)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomManagement;
