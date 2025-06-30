
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wifi, Monitor, Projector, AirVent, Tv } from "lucide-react";
import type { Sala, Recurso } from "@/types/database";
import { validateRoomForm, formatRoomData, type RoomFormData, type ValidationError } from "@/utils/roomValidation";

interface RoomFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roomData: any, resources: { [key: string]: boolean }) => Promise<void>;
  editingRoom: Sala | null;
  resources: Recurso[];
  initialResources?: { [key: string]: boolean };
}

const RoomForm: React.FC<RoomFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingRoom,
  resources,
  initialResources = {}
}) => {
  const [formData, setFormData] = useState<RoomFormData>({
    nome_sala: '',
    tipo_sala: '',
    bloco: '',
    andar: '',
    capacidade: ''
  });
  const [selectedResources, setSelectedResources] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingRoom) {
      setFormData({
        nome_sala: editingRoom.nome_sala,
        tipo_sala: editingRoom.tipo_sala,
        bloco: editingRoom.bloco,
        andar: editingRoom.andar.toString(),
        capacidade: editingRoom.capacidade.toString()
      });
      setSelectedResources(initialResources);
    } else {
      resetForm();
    }
  }, [editingRoom, initialResources]);

  const resetForm = () => {
    setFormData({
      nome_sala: '',
      tipo_sala: '',
      bloco: '',
      andar: '',
      capacidade: ''
    });
    setSelectedResources({});
    setErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateRoomForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setIsSubmitting(true);

    try {
      const roomData = formatRoomData(formData);
      await onSubmit(roomData, selectedResources);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
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

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              <Label htmlFor="nome_sala">Nome/Identificação da Sala *</Label>
              <Input
                id="nome_sala"
                value={formData.nome_sala}
                onChange={(e) => setFormData({...formData, nome_sala: e.target.value})}
                maxLength={6}
                placeholder="Ex: A101"
                className={getFieldError('nome_sala') ? 'border-red-500' : ''}
              />
              {getFieldError('nome_sala') && (
                <p className="text-sm text-red-500 mt-1">{getFieldError('nome_sala')}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="tipo_sala">Tipo de Sala *</Label>
              <Select 
                value={formData.tipo_sala} 
                onValueChange={(value) => setFormData({...formData, tipo_sala: value})}
              >
                <SelectTrigger className={getFieldError('tipo_sala') ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sala de aula">Sala de aula</SelectItem>
                  <SelectItem value="Laboratório">Laboratório</SelectItem>
                  <SelectItem value="Auditório">Auditório</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError('tipo_sala') && (
                <p className="text-sm text-red-500 mt-1">{getFieldError('tipo_sala')}</p>
              )}
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
                className={getFieldError('bloco') ? 'border-red-500' : ''}
              />
              {getFieldError('bloco') && (
                <p className="text-sm text-red-500 mt-1">{getFieldError('bloco')}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="andar">Andar *</Label>
              <Input
                id="andar"
                type="number"
                value={formData.andar}
                onChange={(e) => setFormData({...formData, andar: e.target.value})}
                min="0"
                placeholder="0"
                className={getFieldError('andar') ? 'border-red-500' : ''}
              />
              {getFieldError('andar') && (
                <p className="text-sm text-red-500 mt-1">{getFieldError('andar')}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="capacidade">Capacidade *</Label>
              <Input
                id="capacidade"
                type="number"
                value={formData.capacidade}
                onChange={(e) => setFormData({...formData, capacidade: e.target.value})}
                min="1"
                placeholder="30"
                className={getFieldError('capacidade') ? 'border-red-500' : ''}
              />
              {getFieldError('capacidade') && (
                <p className="text-sm text-red-500 mt-1">{getFieldError('capacidade')}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Recursos Disponíveis</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {resources.map((recurso) => (
                <div key={recurso.id_recurso} className="flex items-center space-x-2">
                  <Checkbox
                    id={`recurso-${recurso.id_recurso}`}
                    checked={selectedResources[recurso.id_recurso.toString()] || false}
                    onCheckedChange={(checked) => 
                      setSelectedResources({
                        ...selectedResources,
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

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                Por favor, corrija os erros acima antes de continuar.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-senai-blue hover:bg-senai-blue-dark" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : (editingRoom ? 'Atualizar' : 'Cadastrar')} Sala
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomForm;
