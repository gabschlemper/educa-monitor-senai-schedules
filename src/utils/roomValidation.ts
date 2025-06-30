
export interface RoomFormData {
  nome_sala: string;
  tipo_sala: string;
  bloco: string;
  andar: string;
  capacidade: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export const validateRoomForm = (formData: RoomFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validação de campos obrigatórios
  if (!formData.nome_sala.trim()) {
    errors.push({ field: 'nome_sala', message: 'Nome da sala é obrigatório' });
  } else if (formData.nome_sala.length > 6) {
    errors.push({ field: 'nome_sala', message: 'Nome da sala deve ter no máximo 6 caracteres' });
  }

  if (!formData.tipo_sala) {
    errors.push({ field: 'tipo_sala', message: 'Tipo da sala é obrigatório' });
  }

  if (!formData.bloco.trim()) {
    errors.push({ field: 'bloco', message: 'Bloco é obrigatório' });
  } else if (formData.bloco.length !== 1) {
    errors.push({ field: 'bloco', message: 'Bloco deve ter exatamente 1 caractere' });
  }

  if (!formData.andar.trim()) {
    errors.push({ field: 'andar', message: 'Andar é obrigatório' });
  } else {
    const andar = parseInt(formData.andar);
    if (isNaN(andar) || andar < 0) {
      errors.push({ field: 'andar', message: 'Andar deve ser um número positivo ou zero' });
    }
  }

  if (!formData.capacidade.trim()) {
    errors.push({ field: 'capacidade', message: 'Capacidade é obrigatória' });
  } else {
    const capacidade = parseInt(formData.capacidade);
    if (isNaN(capacidade) || capacidade < 1) {
      errors.push({ field: 'capacidade', message: 'Capacidade deve ser um número maior que zero' });
    }
  }

  return errors;
};

export const formatRoomData = (formData: RoomFormData) => {
  return {
    nome_sala: formData.nome_sala.toUpperCase().trim(),
    tipo_sala: formData.tipo_sala,
    bloco: formData.bloco.toUpperCase().trim(),
    andar: parseInt(formData.andar),
    capacidade: parseInt(formData.capacidade)
  };
};
