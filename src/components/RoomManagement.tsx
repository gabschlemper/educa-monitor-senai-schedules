
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRooms } from "@/hooks/useRooms";
import { useResources } from "@/hooks/useResources";
import { useRoomResources } from "@/hooks/useRoomResources";
import RoomForm from "./RoomForm";
import RoomCard from "./RoomCard";
import RoomFilters from "./RoomFilters";
import type { Sala } from "@/types/database";

const RoomManagement = () => {
  const { user } = useAuth();
  const { rooms, loading, createRoom, updateRoom, deleteRoom } = useRooms();
  const { resources } = useResources();
  const { fetchRoomResources, updateRoomResources } = useRoomResources();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterBloco, setFilterBloco] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Sala | null>(null);
  const [currentRoomResources, setCurrentRoomResources] = useState<{ [key: string]: boolean }>({});

  const isAdmin = user?.userType === 'administrador';

  const filteredRooms = rooms.filter(sala => {
    const matchesSearch = sala.nome_sala.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sala.tipo_sala.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || sala.tipo_sala === filterType;
    const matchesBloco = filterBloco === 'all' || sala.bloco === filterBloco;
    return matchesSearch && matchesType && matchesBloco;
  });

  const handleCreateRoom = () => {
    setEditingRoom(null);
    setCurrentRoomResources({});
    setIsDialogOpen(true);
  };

  const handleEditRoom = async (room: Sala) => {
    setEditingRoom(room);
    const roomResources = await fetchRoomResources(room.id_sala);
    setCurrentRoomResources(roomResources);
    setIsDialogOpen(true);
  };

  const handleDeleteRoom = async (room: Sala) => {
    if (!confirm(`Tem certeza que deseja excluir a sala ${room.nome_sala}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    await deleteRoom(room.id_sala);
  };

  const handleFormSubmit = async (roomData: any, selectedResources: { [key: string]: boolean }) => {
    let result;
    
    if (editingRoom) {
      result = await updateRoom(editingRoom.id_sala, roomData);
    } else {
      result = await createRoom(roomData);
    }

    if (result.error) {
      return;
    }

    // Update room resources
    const roomId = editingRoom ? editingRoom.id_sala : result.data?.id_sala;
    if (roomId) {
      await updateRoomResources(roomId, selectedResources);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-senai-blue rounded-full animate-pulse mb-4 mx-auto"></div>
          <p className="text-muted-foreground">Carregando salas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Salas</h1>
          <p className="text-muted-foreground">
            {isAdmin ? 'Administre salas de aula, laboratórios e auditórios' : 'Visualize as salas disponíveis'}
          </p>
        </div>
        
        {isAdmin && (
          <Button className="bg-senai-blue hover:bg-senai-blue-dark" onClick={handleCreateRoom}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Sala
          </Button>
        )}
      </div>

      {/* Filters */}
      <RoomFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onTypeChange={setFilterType}
        filterBloco={filterBloco}
        onBlocoChange={setFilterBloco}
        rooms={rooms}
      />

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <RoomCard
            key={room.id_sala}
            room={room}
            onEdit={handleEditRoom}
            onDelete={handleDeleteRoom}
            userType={user?.userType || ''}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              {rooms.length === 0 ? 'Nenhuma sala cadastrada' : 'Nenhuma sala encontrada com os filtros aplicados'}
            </p>
            {isAdmin && rooms.length === 0 && (
              <Button 
                className="mt-4 bg-senai-blue hover:bg-senai-blue-dark" 
                onClick={handleCreateRoom}
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeira Sala
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Room Form Dialog */}
      <RoomForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleFormSubmit}
        editingRoom={editingRoom}
        resources={resources}
        initialResources={currentRoomResources}
      />
    </div>
  );
};

export default RoomManagement;
