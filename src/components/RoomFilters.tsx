
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import type { Sala } from "@/types/database";

interface RoomFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onTypeChange: (value: string) => void;
  filterBloco: string;
  onBlocoChange: (value: string) => void;
  rooms: Sala[];
}

const RoomFilters: React.FC<RoomFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterType,
  onTypeChange,
  filterBloco,
  onBlocoChange,
  rooms
}) => {
  const uniqueBlocos = [...new Set(rooms.map(sala => sala.bloco))].sort();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome ou tipo de sala..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterType} onValueChange={onTypeChange}>
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
            <Select value={filterBloco} onValueChange={onBlocoChange}>
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
  );
};

export default RoomFilters;
