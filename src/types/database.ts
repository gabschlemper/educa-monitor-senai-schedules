
export interface DatabaseUser {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  matricula: number;
  telefone?: string;
  permissao: number;
  created_at?: string;
  updated_at?: string;
}

export interface Administrador extends DatabaseUser {
  id_administrador: number;
}

export interface Professor extends DatabaseUser {
  id_professor: number;
  formacao_docente?: string;
}

export interface Aluno extends DatabaseUser {
  id_aluno: number;
  fk_turma?: number;
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

export interface Turma {
  id_turma: number;
  agrupamento: string;
  ano: string;
  created_at?: string;
}

export interface Disciplina {
  id_disciplina: number;
  disciplina: string;
  created_at?: string;
}

export interface Recurso {
  id_recurso: number;
  tipo_recurso: string;
  created_at?: string;
}

export interface HorarioEscolar {
  id_horario_escolar: number;
  fk_administrador?: number;
  fk_professores?: number;
  fk_turmas?: number;
  fk_salas?: number;
  fk_horarios?: number;
  fk_disciplina?: number;
  created_at?: string;
}

export interface Notificacao {
  id_notificacao: number;
  mensagem: string;
  data_hora?: string;
  fk_horario_escolar?: number;
  tipo: string;
  created_at?: string;
}

// Union type for all user types
export type User = (Administrador & { userType: 'administrador' }) | 
                   (Professor & { userType: 'professor' }) | 
                   (Aluno & { userType: 'aluno' });
