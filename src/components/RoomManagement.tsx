import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Search, Filter, MapPin, Monitor, Wifi, Snowflake, Computer } from "lucide-react";

interface Room {
  id: string;
  identification: string;
  capacity: number;
  block: string;
  floor: number;
  type: 'Sala de aula' | 'Laboratório' | 'Auditório';
  resources: {
    projector: boolean;
    tv: boolean;
    computers: boolean;
    internet: boolean;
    airConditioning: boolean;
    others: string;
  };
}

const RoomManagement = () => {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '1',
      identification: '101-A',
      capacity: 40,
      block: 'A',
      floor: 1,
      type: 'Sala de aula',
      resources: { projector: true, tv: false, computers: false, internet: true, airConditioning: true, others: '' }
    },
    {
      id: '2',
      identification: 'Lab-01',
      capacity: 25,
      block: 'A',
      floor: 2,
      type: 'Laboratório',
      resources: { projector: true, tv: true, computers: true, internet: true, airConditioning: true, others: 'Software de programação' }
    },
    {
      id: '3',
      identification: 'Aud-01',
      capacity: 100,
      block: 'B',
      floor: 1,
      type: 'Auditório',
      resources: { projector: true, tv: false, computers: false, internet: true, airConditioning: true, others: 'Sistema de som profissional' }
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBlock, setFilterBlock] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    identification: '',
    capacity: '',
    block: '',
    floor: '',
    type: 'Sala de aula' as 'Sala de aula' | 'Laboratório' | 'Auditório',
    resources: {
      projector: false,
      tv: false,
      computers: false,
      internet: false,
      airConditioning: false,
      others: ''
    }
  });
  const [error, setError] = useState('');

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.identification.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.block.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = filterBlock === 'all' || room.block === filterBlock;
    const matchesType = filterType === 'all' || room.type === filterType;
    return matchesSearch && matchesBlock && matchesType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.identification || !formData.capacity || !formData.block || !formData.floor) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (formData.identification.length > 6) {
      setError('A identificação deve ter no máximo 6 caracteres');
      return;
    }

    const capacity = parseInt(formData.capacity);
    if (isNaN(capacity) || capacity <= 0) {
      setError('A capacidade deve ser um número válido maior que zero');
      return;
    }

    const floor = parseInt(formData.floor);
    if (isNaN(floor) || floor < 0) {
      setError('O andar deve ser um número válido');
      return;
    }

    const newRoom: Room = {
      id: editingRoom ? editingRoom.id : Date.now().toString(),
      identification: formData.identification,
      capacity,
      block: formData.block,
      floor,
      type: formData.type,
      resources: formData.resources
    };

    if (editingRoom) {
      setRooms(rooms.map(room => room.id === editingRoom.id ? newRoom : room));
    } else {
      setRooms([...rooms, newRoom]);
    }

    setIsDialogOpen(false);
    setEditingRoom(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      identification: '',
      capacity: '',
      block: '',
      floor: '',
      type: 'Sala de aula',
      resources: {
        projector: false,
        tv: false,
        computers: false,
        internet: false,
        airConditioning: false,
        others: ''
      }
    });
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      identification: room.identification,
      capacity: room.capacity.toString(),
      block: room.block,
      floor: room.floor.toString(),
      type: room.type,
      resources: room.resources
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (roomId: string) => {
    if (confirm('Tem certeza que deseja excluir esta sala? Esta ação não pode ser desfeita.')) {
      setRooms(rooms.filter(room => room.id !== roomId));
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Sala de aula': return 'bg-blue-100 text-blue-800';
      case 'Laboratório': return 'bg-green-100 text-green-800';
      case 'Auditório': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderResources = (resources: Room['resources']) => {
    const activeResources = [];
    if (resources.projector) activeResources.push(<div key="projector" className="flex items-center" title="Projetor"><Monitor className="h-4 w-4" /></div>);
    if (resources.tv) activeResources.push(<div key="tv" className="text-xs bg-gray-500 text-white px-1 rounded">TV</div>);
    if (resources.computers) activeResources.push(<div key="computers" className="flex items-center" title="Computadores"><Computer className="h-4 w-4" /></div>);
    if (resources.internet) activeResources.push(<div key="internet" className="flex items-center" title="Internet"><Wifi className="h-4 w-4" /></div>);
    if (resources.airConditioning) activeResources.push(<div key="ac" className="flex items-center" title="Ar Condicionado"><Snowflake className="h-4 w-4" /></div>);
    
    return (
      <div className="flex items-center space-x-1 flex-wrap">
        {activeResources.length > 0 ? activeResources : <span className="text-muted-foreground text-sm">Nenhum</span>}
      </div>
    );
  };

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
                    value={formData.identification}
                    onChange={(e) => setFormData({...formData, identification: e.target.value})}
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
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    placeholder="Ex: 40"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="block">Bloco *</Label>
                  <Select value={formData.block} onValueChange={(value) => setFormData({...formData, block: value})}>
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
                    value={formData.floor}
                    onChange={(e) => setFormData({...formData, floor: e.target.value})}
                    placeholder="Ex: 1"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo de Sala *</Label>
                  <Select value={formData.type} onValueChange={(value: 'Sala de aula' | 'Laboratório' | 'Auditório') => setFormData({...formData, type: value})}>
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
                  {[
                    { key: 'projector', label: 'Projetor' },
                    { key: 'tv', label: 'TV' },
                    { key: 'computers', label: 'Computadores' },
                    { key: 'internet', label: 'Internet' },
                    { key: 'airConditioning', label: 'Ar Condicionado' }
                  ].map(resource => (
                    <div key={resource.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={resource.key}
                        checked={formData.resources[resource.key as keyof typeof formData.resources] as boolean}
                        onCheckedChange={(checked) => 
                          setFormData({
                            ...formData, 
                            resources: {
                              ...formData.resources,
                              [resource.key]: checked
                            }
                          })
                        }
                      />
                      <Label htmlFor={resource.key}>{resource.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="others">Outros Recursos</Label>
                <Input
                  id="others"
                  value={formData.resources.others}
                  onChange={(e) => setFormData({
                    ...formData,
                    resources: {...formData.resources, others: e.target.value}
                  })}
                  placeholder="Ex: Sistema de som, softwares específicos..."
                />
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
                  <tr key={room.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2 font-medium">{room.identification}</td>
                    <td className="py-3 px-2">{room.block}</td>
                    <td className="py-3 px-2">{room.floor}º</td>
                    <td className="py-3 px-2">{room.capacity} pessoas</td>
                    <td className="py-3 px-2">
                      <Badge className={getTypeColor(room.type)}>
                        {room.type}
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
                          onClick={() => handleDelete(room.id)}
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

      {/* Weekly Availability Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Disponibilidade Semanal das Salas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
              <div key={index}>
                <h4 className="font-medium text-sm mb-2 p-2 bg-muted rounded">{day}</h4>
                <div className="space-y-1">
                  {index > 0 && index < 6 && (
                    <>
                      <div className="bg-green-100 text-green-800 text-xs p-1 rounded">
                        8h-10h: {Math.floor(Math.random() * 5) + 1} livres
                      </div>
                      <div className="bg-yellow-100 text-yellow-800 text-xs p-1 rounded">
                        14h-16h: {Math.floor(Math.random() * 3) + 1} livres
                      </div>
                      <div className="bg-red-100 text-red-800 text-xs p-1 rounded">
                        19h-21h: Todas ocupadas
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomManagement;
