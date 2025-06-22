
export interface Administrador {
  id: number;
  id_administrador: number;
  email: string;
  senha: string;
  nome: string;
  cpf: string;
  matricula: number;
  telefone?: string;
  permissao: number;
  created_at?: string;
  updated_at?: string;
}

export interface Professor {
  id: number;
  id_professor: number;
  email: string;
  senha: string;
  nome: string;
  cpf: string;
  matricula: number;
  telefone?: string;
  formacao_docente?: string;
  permissao: number;
  created_at?: string;
  updated_at?: string;
}

export interface Aluno {
  id: number;
  id_aluno: number;
  email: string;
  senha: string;
  nome: string;
  cpf: string;
  matricula: number;
  telefone?: string;
  fk_turma?: number;
  permissao: number;
  created_at?: string;
  updated_at?: string;
}

export interface Sala {
  id_sala: number;
  nome_sala: string;
  tipo_sala: string;
  bloco: string;
  andar: number;
  capacidade: number;
  created_at?: string;
}

export interface Recurso {
  id_recurso: number;
  tipo_recurso: string;
  created_at?: string;
}

export interface Turma {
  id_turma: number;
  ano: string;
  agrupamento: string;
  created_at?: string;
}

export interface Disciplina {
  id_disciplina: number;
  disciplina: string;
  created_at?: string;
}

export interface Horario {
  id_horario: number;
  data: string;
  hora_inicio: string;
  hora_termino: string;
  fk_salas?: number;
  created_at?: string;
}
