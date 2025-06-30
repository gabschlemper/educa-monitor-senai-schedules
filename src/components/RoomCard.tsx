
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import type { Sala } from "@/types/database";

interface RoomCardProps {
  room: Sala;
  onEdit: (room: Sala) => void;
  onDelete: (room: Sala) => void;
  userType: string;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onEdit, onDelete, userType }) => {
  const getRoomTypeBadge = (tipoSala: string) => {
    const colors = {
      'Sala de aula': 'bg-blue-100 text-blue-800',
      'Laboratório': 'bg-purple-100 text-purple-800',
      'Auditório': 'bg-green-100 text-green-800'
    };
    return colors[tipoSala as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const canEdit = userType === 'admin' || userType === 'administrador';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{room.nome_sala}</CardTitle>
            <Badge className={getRoomTypeBadge(room.tipo_sala)}>
              {room.tipo_sala}
            </Badge>
          </div>
          {canEdit && (
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(room)}
                title="Editar sala"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(room)}
                className="text-destructive hover:text-destructive"
                title="Excluir sala"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bloco:</span>
            <span className="font-medium">{room.bloco}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Andar:</span>
            <span className="font-medium">{room.andar}º</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Capacidade:</span>
            <span className="font-medium">{room.capacidade} pessoas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
