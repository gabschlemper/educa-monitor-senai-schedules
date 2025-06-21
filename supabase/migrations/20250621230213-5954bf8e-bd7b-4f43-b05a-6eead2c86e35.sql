
-- Criar enum para tipos de usuário
CREATE TYPE user_type AS ENUM ('administrador', 'professor', 'aluno');

-- Criar enum para tipos de sala
CREATE TYPE room_type AS ENUM ('Sala de aula', 'Laboratório', 'Auditório');

-- Criar enum para tipos de recurso
CREATE TYPE resource_type AS ENUM ('TV', 'Projetor', 'Computadores', 'Internet', 'Ar Condicionado');

-- Tabela de administradores
CREATE TABLE administrador (
    id_administrador SERIAL PRIMARY KEY,
    permissao INTEGER NOT NULL,
    matricula INTEGER UNIQUE NOT NULL,
    telefone VARCHAR(11),
    cpf VARCHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(60) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de professores
CREATE TABLE professores (
    id_professor SERIAL PRIMARY KEY,
    permissao INTEGER NOT NULL,
    matricula INTEGER UNIQUE NOT NULL,
    telefone VARCHAR(11),
    cpf VARCHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(60) NOT NULL,
    formacao_docente VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de turmas
CREATE TABLE turmas (
    id_turma SERIAL PRIMARY KEY,
    agrupamento CHAR(1) NOT NULL,
    ano CHAR(2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de alunos
CREATE TABLE alunos (
    id_aluno SERIAL PRIMARY KEY,
    permissao INTEGER NOT NULL,
    matricula INTEGER UNIQUE NOT NULL,
    telefone VARCHAR(11),
    cpf VARCHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(60) NOT NULL,
    fk_turma INTEGER REFERENCES turmas(id_turma),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de disciplinas
CREATE TABLE disciplina (
    id_disciplina SERIAL PRIMARY KEY,
    disciplina VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de salas
CREATE TABLE salas (
    id_sala SERIAL PRIMARY KEY,
    nome_sala CHAR(6) NOT NULL UNIQUE,
    tipo_sala VARCHAR(20) NOT NULL,
    bloco CHAR(1) NOT NULL,
    andar INTEGER NOT NULL,
    capacidade INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de recursos
CREATE TABLE recursos (
    id_recurso SERIAL PRIMARY KEY,
    tipo_recurso VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de disponibilidade de recursos por sala
CREATE TABLE disponibilidade (
    fk_recursos INTEGER REFERENCES recursos(id_recurso),
    recurso_disponivel BOOLEAN DEFAULT FALSE,
    fk_salas INTEGER REFERENCES salas(id_sala),
    PRIMARY KEY (fk_recursos, fk_salas)
);

-- Tabela de horários
CREATE TABLE horarios (
    id_horario SERIAL PRIMARY KEY,
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_termino TIME NOT NULL,
    fk_salas INTEGER REFERENCES salas(id_sala),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de horário escolar (relacionamento principal)
CREATE TABLE horario_escolar (
    id_horario_escolar SERIAL PRIMARY KEY,
    fk_administrador INTEGER REFERENCES administrador(id_administrador),
    fk_professores INTEGER REFERENCES professores(id_professor),
    fk_turmas INTEGER REFERENCES turmas(id_turma),
    fk_salas INTEGER REFERENCES salas(id_sala),
    fk_horarios INTEGER REFERENCES horarios(id_horario),
    fk_disciplina INTEGER REFERENCES disciplina(id_disciplina),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notificações
CREATE TABLE notificacoes (
    id_notificacao SERIAL PRIMARY KEY,
    mensagem TEXT NOT NULL,
    data_hora TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fk_horario_escolar INTEGER REFERENCES horario_escolar(id_horario_escolar),
    tipo VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de destinatários das notificações
CREATE TABLE destinatarios (
    id_destinatarios SERIAL PRIMARY KEY,
    fk_notificacao INTEGER REFERENCES notificacoes(id_notificacao),
    tipo_destinatario VARCHAR(20) NOT NULL,
    id_referencia INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de relacionamento professor-disciplina (leciona)
CREATE TABLE leciona (
    fk_disciplina INTEGER REFERENCES disciplina(id_disciplina),
    fk_professor INTEGER REFERENCES professores(id_professor),
    PRIMARY KEY (fk_disciplina, fk_professor)
);

-- Inserir alguns recursos básicos
INSERT INTO recursos (tipo_recurso) VALUES 
('TV'),
('Projetor'),
('Computadores'),
('Internet'),
('Ar Condicionado');

-- Inserir algumas turmas de exemplo
INSERT INTO turmas (agrupamento, ano) VALUES 
('A', '01'),
('B', '01'),
('A', '02'),
('B', '02');

-- Criar índices para melhor performance
CREATE INDEX idx_horario_escolar_professor ON horario_escolar(fk_professores);
CREATE INDEX idx_horario_escolar_turma ON horario_escolar(fk_turmas);
CREATE INDEX idx_horario_escolar_sala ON horario_escolar(fk_salas);
CREATE INDEX idx_horario_escolar_horario ON horario_escolar(fk_horarios);
CREATE INDEX idx_notificacoes_data ON notificacoes(data_hora);
CREATE INDEX idx_destinatarios_tipo ON destinatarios(tipo_destinatario, id_referencia);

-- Habilitar RLS (Row Level Security) nas tabelas principais
ALTER TABLE administrador ENABLE ROW LEVEL SECURITY;
ALTER TABLE professores ENABLE ROW LEVEL SECURITY;
ALTER TABLE alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE horario_escolar ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (você pode ajustar conforme necessário)
CREATE POLICY "Administradores podem ver todos os dados" ON administrador FOR ALL USING (true);
CREATE POLICY "Professores podem ver seus próprios dados" ON professores FOR SELECT USING (true);
CREATE POLICY "Alunos podem ver seus próprios dados" ON alunos FOR SELECT USING (true);
CREATE POLICY "Todos podem ver horários" ON horario_escolar FOR SELECT USING (true);
CREATE POLICY "Todos podem ver notificações públicas" ON notificacoes FOR SELECT USING (true);
