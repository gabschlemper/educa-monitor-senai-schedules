export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      administrador: {
        Row: {
          cpf: string
          created_at: string | null
          email: string
          id_administrador: number
          matricula: number
          nome: string
          permissao: number
          senha: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          cpf: string
          created_at?: string | null
          email: string
          id_administrador?: number
          matricula: number
          nome: string
          permissao: number
          senha: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          cpf?: string
          created_at?: string | null
          email?: string
          id_administrador?: number
          matricula?: number
          nome?: string
          permissao?: number
          senha?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      alunos: {
        Row: {
          cpf: string
          created_at: string | null
          email: string
          fk_turma: number | null
          id_aluno: number
          matricula: number
          nome: string
          permissao: number
          senha: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          cpf: string
          created_at?: string | null
          email: string
          fk_turma?: number | null
          id_aluno?: number
          matricula: number
          nome: string
          permissao: number
          senha: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          cpf?: string
          created_at?: string | null
          email?: string
          fk_turma?: number | null
          id_aluno?: number
          matricula?: number
          nome?: string
          permissao?: number
          senha?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alunos_fk_turma_fkey"
            columns: ["fk_turma"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id_turma"]
          },
        ]
      }
      datas_especiais: {
        Row: {
          data: string
          descricao: string | null
          id: number
          tipo: string
        }
        Insert: {
          data: string
          descricao?: string | null
          id?: number
          tipo: string
        }
        Update: {
          data?: string
          descricao?: string | null
          id?: number
          tipo?: string
        }
        Relationships: []
      }
      destinatarios: {
        Row: {
          created_at: string | null
          fk_notificacao: number | null
          id_destinatarios: number
          id_referencia: number
          tipo_destinatario: string
        }
        Insert: {
          created_at?: string | null
          fk_notificacao?: number | null
          id_destinatarios?: number
          id_referencia: number
          tipo_destinatario: string
        }
        Update: {
          created_at?: string | null
          fk_notificacao?: number | null
          id_destinatarios?: number
          id_referencia?: number
          tipo_destinatario?: string
        }
        Relationships: [
          {
            foreignKeyName: "destinatarios_fk_notificacao_fkey"
            columns: ["fk_notificacao"]
            isOneToOne: false
            referencedRelation: "notificacoes"
            referencedColumns: ["id_notificacao"]
          },
        ]
      }
      disciplina: {
        Row: {
          created_at: string | null
          disciplina: string
          id_disciplina: number
        }
        Insert: {
          created_at?: string | null
          disciplina: string
          id_disciplina?: number
        }
        Update: {
          created_at?: string | null
          disciplina?: string
          id_disciplina?: number
        }
        Relationships: []
      }
      disponibilidade: {
        Row: {
          fk_recursos: number
          fk_salas: number
          recurso_disponivel: boolean | null
        }
        Insert: {
          fk_recursos: number
          fk_salas: number
          recurso_disponivel?: boolean | null
        }
        Update: {
          fk_recursos?: number
          fk_salas?: number
          recurso_disponivel?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "disponibilidade_fk_recursos_fkey"
            columns: ["fk_recursos"]
            isOneToOne: false
            referencedRelation: "recursos"
            referencedColumns: ["id_recurso"]
          },
          {
            foreignKeyName: "disponibilidade_fk_salas_fkey"
            columns: ["fk_salas"]
            isOneToOne: false
            referencedRelation: "salas"
            referencedColumns: ["id_sala"]
          },
        ]
      }
      horario_escolar: {
        Row: {
          created_at: string | null
          fk_administrador: number | null
          fk_disciplina: number | null
          fk_horarios: number | null
          fk_professores: number | null
          fk_salas: number | null
          fk_turmas: number | null
          id_horario_escolar: number
        }
        Insert: {
          created_at?: string | null
          fk_administrador?: number | null
          fk_disciplina?: number | null
          fk_horarios?: number | null
          fk_professores?: number | null
          fk_salas?: number | null
          fk_turmas?: number | null
          id_horario_escolar?: number
        }
        Update: {
          created_at?: string | null
          fk_administrador?: number | null
          fk_disciplina?: number | null
          fk_horarios?: number | null
          fk_professores?: number | null
          fk_salas?: number | null
          fk_turmas?: number | null
          id_horario_escolar?: number
        }
        Relationships: [
          {
            foreignKeyName: "horario_escolar_fk_administrador_fkey"
            columns: ["fk_administrador"]
            isOneToOne: false
            referencedRelation: "administrador"
            referencedColumns: ["id_administrador"]
          },
          {
            foreignKeyName: "horario_escolar_fk_disciplina_fkey"
            columns: ["fk_disciplina"]
            isOneToOne: false
            referencedRelation: "disciplina"
            referencedColumns: ["id_disciplina"]
          },
          {
            foreignKeyName: "horario_escolar_fk_horarios_fkey"
            columns: ["fk_horarios"]
            isOneToOne: false
            referencedRelation: "horarios"
            referencedColumns: ["id_horario"]
          },
          {
            foreignKeyName: "horario_escolar_fk_professores_fkey"
            columns: ["fk_professores"]
            isOneToOne: false
            referencedRelation: "professores"
            referencedColumns: ["id_professor"]
          },
          {
            foreignKeyName: "horario_escolar_fk_salas_fkey"
            columns: ["fk_salas"]
            isOneToOne: false
            referencedRelation: "salas"
            referencedColumns: ["id_sala"]
          },
          {
            foreignKeyName: "horario_escolar_fk_turmas_fkey"
            columns: ["fk_turmas"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id_turma"]
          },
        ]
      }
      horarios: {
        Row: {
          created_at: string | null
          data: string
          fk_salas: number | null
          hora_inicio: string
          hora_termino: string
          id_horario: number
          is_dia_util: boolean
        }
        Insert: {
          created_at?: string | null
          data: string
          fk_salas?: number | null
          hora_inicio: string
          hora_termino: string
          id_horario?: number
          is_dia_util?: boolean
        }
        Update: {
          created_at?: string | null
          data?: string
          fk_salas?: number | null
          hora_inicio?: string
          hora_termino?: string
          id_horario?: number
          is_dia_util?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "horarios_fk_salas_fkey"
            columns: ["fk_salas"]
            isOneToOne: false
            referencedRelation: "salas"
            referencedColumns: ["id_sala"]
          },
        ]
      }
      leciona: {
        Row: {
          fk_disciplina: number
          fk_professor: number
        }
        Insert: {
          fk_disciplina: number
          fk_professor: number
        }
        Update: {
          fk_disciplina?: number
          fk_professor?: number
        }
        Relationships: [
          {
            foreignKeyName: "leciona_fk_disciplina_fkey"
            columns: ["fk_disciplina"]
            isOneToOne: false
            referencedRelation: "disciplina"
            referencedColumns: ["id_disciplina"]
          },
          {
            foreignKeyName: "leciona_fk_professor_fkey"
            columns: ["fk_professor"]
            isOneToOne: false
            referencedRelation: "professores"
            referencedColumns: ["id_professor"]
          },
        ]
      }
      log_acessos: {
        Row: {
          data_hora: string | null
          descricao: string
          id_log: number
          operacao: string
          permissao: number
          tabela_alvo: string
          usuario_id: number
        }
        Insert: {
          data_hora?: string | null
          descricao: string
          id_log?: number
          operacao: string
          permissao: number
          tabela_alvo: string
          usuario_id: number
        }
        Update: {
          data_hora?: string | null
          descricao?: string
          id_log?: number
          operacao?: string
          permissao?: number
          tabela_alvo?: string
          usuario_id?: number
        }
        Relationships: []
      }
      log_administrador: {
        Row: {
          acao: string
          cpf: string
          created_at: string | null
          data_hora: string | null
          email: string
          id_administrador: number
          id_log: number
          matricula: number
          nome: string
          permissao: number
          senha: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          acao: string
          cpf: string
          created_at?: string | null
          data_hora?: string | null
          email: string
          id_administrador: number
          id_log?: number
          matricula: number
          nome: string
          permissao: number
          senha: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          acao?: string
          cpf?: string
          created_at?: string | null
          data_hora?: string | null
          email?: string
          id_administrador?: number
          id_log?: number
          matricula?: number
          nome?: string
          permissao?: number
          senha?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      log_alunos: {
        Row: {
          acao: string
          cpf: string
          data_hora: string | null
          email: string
          fk_turma: number | null
          id_aluno: number
          id_log: number
          matricula: number
          nome: string
          permissao: number
          telefone: string | null
        }
        Insert: {
          acao: string
          cpf: string
          data_hora?: string | null
          email: string
          fk_turma?: number | null
          id_aluno: number
          id_log?: number
          matricula: number
          nome: string
          permissao: number
          telefone?: string | null
        }
        Update: {
          acao?: string
          cpf?: string
          data_hora?: string | null
          email?: string
          fk_turma?: number | null
          id_aluno?: number
          id_log?: number
          matricula?: number
          nome?: string
          permissao?: number
          telefone?: string | null
        }
        Relationships: []
      }
      log_destinatarios: {
        Row: {
          acao: string
          created_at: string | null
          data_hora: string | null
          fk_notificacao: number | null
          id_destinatarios: number
          id_log: number
          id_referencia: number
          tipo_destinatario: string
        }
        Insert: {
          acao: string
          created_at?: string | null
          data_hora?: string | null
          fk_notificacao?: number | null
          id_destinatarios: number
          id_log?: number
          id_referencia: number
          tipo_destinatario: string
        }
        Update: {
          acao?: string
          created_at?: string | null
          data_hora?: string | null
          fk_notificacao?: number | null
          id_destinatarios?: number
          id_log?: number
          id_referencia?: number
          tipo_destinatario?: string
        }
        Relationships: []
      }
      log_disciplina: {
        Row: {
          acao: string
          data_hora: string | null
          disciplina: string
          id_disciplina: number
          id_log: number
        }
        Insert: {
          acao: string
          data_hora?: string | null
          disciplina: string
          id_disciplina: number
          id_log?: number
        }
        Update: {
          acao?: string
          data_hora?: string | null
          disciplina?: string
          id_disciplina?: number
          id_log?: number
        }
        Relationships: []
      }
      log_disponibilidade: {
        Row: {
          acao: string
          data_hora: string | null
          fk_recursos: number
          fk_salas: number
          id_log: number
          recurso_disponivel: boolean | null
        }
        Insert: {
          acao: string
          data_hora?: string | null
          fk_recursos: number
          fk_salas: number
          id_log?: number
          recurso_disponivel?: boolean | null
        }
        Update: {
          acao?: string
          data_hora?: string | null
          fk_recursos?: number
          fk_salas?: number
          id_log?: number
          recurso_disponivel?: boolean | null
        }
        Relationships: []
      }
      log_horario_escolar: {
        Row: {
          data_hora: string | null
          fk_administrador: number | null
          fk_disciplina: number | null
          fk_horarios: number | null
          fk_professores: number | null
          fk_salas: number | null
          fk_turmas: number | null
          id_horario_escolar: number
          id_log: number
          logged_at: string | null
        }
        Insert: {
          data_hora?: string | null
          fk_administrador?: number | null
          fk_disciplina?: number | null
          fk_horarios?: number | null
          fk_professores?: number | null
          fk_salas?: number | null
          fk_turmas?: number | null
          id_horario_escolar: number
          id_log?: number
          logged_at?: string | null
        }
        Update: {
          data_hora?: string | null
          fk_administrador?: number | null
          fk_disciplina?: number | null
          fk_horarios?: number | null
          fk_professores?: number | null
          fk_salas?: number | null
          fk_turmas?: number | null
          id_horario_escolar?: number
          id_log?: number
          logged_at?: string | null
        }
        Relationships: []
      }
      log_horarios: {
        Row: {
          acao: string
          created_at: string | null
          data: string
          data_hora: string | null
          fk_salas: number | null
          hora_inicio: string
          hora_termino: string
          id_horario: number
          id_log: number
        }
        Insert: {
          acao: string
          created_at?: string | null
          data: string
          data_hora?: string | null
          fk_salas?: number | null
          hora_inicio: string
          hora_termino: string
          id_horario: number
          id_log?: number
        }
        Update: {
          acao?: string
          created_at?: string | null
          data?: string
          data_hora?: string | null
          fk_salas?: number | null
          hora_inicio?: string
          hora_termino?: string
          id_horario?: number
          id_log?: number
        }
        Relationships: []
      }
      log_leciona: {
        Row: {
          acao: string
          data_hora: string | null
          fk_disciplina: number
          fk_professor: number
          id_log: number
        }
        Insert: {
          acao: string
          data_hora?: string | null
          fk_disciplina: number
          fk_professor: number
          id_log?: number
        }
        Update: {
          acao?: string
          data_hora?: string | null
          fk_disciplina?: number
          fk_professor?: number
          id_log?: number
        }
        Relationships: []
      }
      log_notificacoes: {
        Row: {
          acao: string
          created_at: string | null
          data_hora: string | null
          data_hora_original: string | null
          fk_horario_escolar: number | null
          id_log: number
          id_notificacao: number
          mensagem: string
          tipo: string
        }
        Insert: {
          acao: string
          created_at?: string | null
          data_hora?: string | null
          data_hora_original?: string | null
          fk_horario_escolar?: number | null
          id_log?: number
          id_notificacao: number
          mensagem: string
          tipo: string
        }
        Update: {
          acao?: string
          created_at?: string | null
          data_hora?: string | null
          data_hora_original?: string | null
          fk_horario_escolar?: number | null
          id_log?: number
          id_notificacao?: number
          mensagem?: string
          tipo?: string
        }
        Relationships: []
      }
      log_professores: {
        Row: {
          acao: string
          cpf: string
          data_hora: string | null
          email: string
          formacao_docente: string | null
          id_log: number
          id_professor: number
          matricula: number
          nome: string
          permissao: number
          telefone: string | null
        }
        Insert: {
          acao: string
          cpf: string
          data_hora?: string | null
          email: string
          formacao_docente?: string | null
          id_log?: number
          id_professor: number
          matricula: number
          nome: string
          permissao: number
          telefone?: string | null
        }
        Update: {
          acao?: string
          cpf?: string
          data_hora?: string | null
          email?: string
          formacao_docente?: string | null
          id_log?: number
          id_professor?: number
          matricula?: number
          nome?: string
          permissao?: number
          telefone?: string | null
        }
        Relationships: []
      }
      log_recursos: {
        Row: {
          acao: string
          data_hora: string | null
          id_log: number
          id_recurso: number
          tipo_recurso: string
        }
        Insert: {
          acao: string
          data_hora?: string | null
          id_log?: number
          id_recurso: number
          tipo_recurso: string
        }
        Update: {
          acao?: string
          data_hora?: string | null
          id_log?: number
          id_recurso?: number
          tipo_recurso?: string
        }
        Relationships: []
      }
      log_salas: {
        Row: {
          acao: string
          andar: number
          bloco: string
          capacidade: number
          data_hora: string | null
          id_log: number
          id_sala: number
          nome_sala: string
          tipo_sala: string
        }
        Insert: {
          acao: string
          andar: number
          bloco: string
          capacidade: number
          data_hora?: string | null
          id_log?: number
          id_sala: number
          nome_sala: string
          tipo_sala: string
        }
        Update: {
          acao?: string
          andar?: number
          bloco?: string
          capacidade?: number
          data_hora?: string | null
          id_log?: number
          id_sala?: number
          nome_sala?: string
          tipo_sala?: string
        }
        Relationships: []
      }
      log_turmas: {
        Row: {
          acao: string
          agrupamento: string
          ano: string
          data_hora: string | null
          id_log: number
          id_turma: number
        }
        Insert: {
          acao: string
          agrupamento: string
          ano: string
          data_hora?: string | null
          id_log?: number
          id_turma: number
        }
        Update: {
          acao?: string
          agrupamento?: string
          ano?: string
          data_hora?: string | null
          id_log?: number
          id_turma?: number
        }
        Relationships: []
      }
      notificacoes: {
        Row: {
          created_at: string | null
          data_hora: string | null
          fk_horario_escolar: number | null
          id_notificacao: number
          mensagem: string
          tipo: string
        }
        Insert: {
          created_at?: string | null
          data_hora?: string | null
          fk_horario_escolar?: number | null
          id_notificacao?: number
          mensagem: string
          tipo: string
        }
        Update: {
          created_at?: string | null
          data_hora?: string | null
          fk_horario_escolar?: number | null
          id_notificacao?: number
          mensagem?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_fk_horario_escolar_fkey"
            columns: ["fk_horario_escolar"]
            isOneToOne: false
            referencedRelation: "horario_escolar"
            referencedColumns: ["id_horario_escolar"]
          },
        ]
      }
      professores: {
        Row: {
          cpf: string
          created_at: string | null
          email: string
          formacao_docente: string | null
          id_professor: number
          matricula: number
          nome: string
          permissao: number
          senha: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          cpf: string
          created_at?: string | null
          email: string
          formacao_docente?: string | null
          id_professor?: number
          matricula: number
          nome: string
          permissao: number
          senha: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          cpf?: string
          created_at?: string | null
          email?: string
          formacao_docente?: string | null
          id_professor?: number
          matricula?: number
          nome?: string
          permissao?: number
          senha?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recursos: {
        Row: {
          created_at: string | null
          id_recurso: number
          tipo_recurso: string
        }
        Insert: {
          created_at?: string | null
          id_recurso?: number
          tipo_recurso: string
        }
        Update: {
          created_at?: string | null
          id_recurso?: number
          tipo_recurso?: string
        }
        Relationships: []
      }
      salas: {
        Row: {
          andar: number
          bloco: string
          capacidade: number
          created_at: string | null
          id_sala: number
          nome_sala: string
          tipo_sala: string
        }
        Insert: {
          andar: number
          bloco: string
          capacidade: number
          created_at?: string | null
          id_sala?: number
          nome_sala: string
          tipo_sala: string
        }
        Update: {
          andar?: number
          bloco?: string
          capacidade?: number
          created_at?: string | null
          id_sala?: number
          nome_sala?: string
          tipo_sala?: string
        }
        Relationships: []
      }
      turmas: {
        Row: {
          agrupamento: string
          ano: string
          created_at: string | null
          id_turma: number
        }
        Insert: {
          agrupamento: string
          ano: string
          created_at?: string | null
          id_turma?: number
        }
        Update: {
          agrupamento?: string
          ano?: string
          created_at?: string | null
          id_turma?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fn_inserir_destinatarios: {
        Args: {
          p_id_notificacao: number
          p_id_professor: number
          p_id_turma: number
        }
        Returns: undefined
      }
      fn_notifica_alteracao: {
        Args: { p_id_horario_escolar: number }
        Returns: undefined
      }
      fn_notifica_aula_adiada: {
        Args: {
          p_id_horario_escolar: number
          p_nova_data: string
          p_nova_hora_inicio: string
          p_nova_hora_termino: string
        }
        Returns: undefined
      }
      fn_notifica_cancelamento: {
        Args: { p_id_horario_escolar: number }
        Returns: undefined
      }
      fn_notifica_comunicado: {
        Args: { p_mensagem_livre: string }
        Returns: undefined
      }
      fn_notifica_evento: {
        Args: {
          p_nome_evento: string
          p_id_sala: number
          p_data: string
          p_hora_inicio: string
          p_hora_termino: string
        }
        Returns: undefined
      }
      fn_notifica_reserva: {
        Args: { p_id_horario_escolar: number }
        Returns: undefined
      }
      fn_notifica_substituicao: {
        Args: {
          p_id_horario_escolar: number
          p_professor_antigo: string
          p_professor_novo: string
        }
        Returns: undefined
      }
      fn_valida_email: {
        Args: { p_email: string }
        Returns: boolean
      }
      fn_valida_template_email: {
        Args: { p_texto: string }
        Returns: undefined
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      sp_busca_alunos: {
        Args: {
          p_fk_turma?: number
          p_nome_like?: string
          p_cpf?: string
          p_dt_ini?: string
          p_dt_fim?: string
        }
        Returns: {
          id_aluno: number
          nome: string
          cpf: string
          fk_turma: number
          created_at: string
        }[]
      }
      sp_busca_horario: {
        Args: {
          p_fk_prof?: number
          p_fk_turma?: number
          p_fk_sala?: number
          p_fk_disc?: number
          p_data_ini?: string
          p_data_fim?: string
        }
        Returns: {
          id_horario_escolar: number
          data: string
          hora_inicio: string
          hora_termino: string
          fk_professores: number
          fk_turmas: number
          fk_salas: number
          fk_disciplina: number
        }[]
      }
      sp_busca_horario_restrito: {
        Args: { p_matricula_professor?: number; p_matricula_aluno?: number }
        Returns: {
          id_horario_escolar: number
          data: string
          hora_inicio: string
          hora_termino: string
          fk_professores: number
          fk_turmas: number
          fk_salas: number
          fk_disciplina: number
        }[]
      }
      sp_busca_notificacoes: {
        Args: { p_tipo?: string; p_dt_ini?: string; p_dt_fim?: string }
        Returns: {
          id_notificacao: number
          mensagem: string
          data_hora: string
          tipo: string
        }[]
      }
    }
    Enums: {
      resource_type:
        | "TV"
        | "Projetor"
        | "Computadores"
        | "Internet"
        | "Ar Condicionado"
      room_type: "Sala de aula" | "Laboratório" | "Auditório"
      user_type: "administrador" | "professor" | "aluno"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      resource_type: [
        "TV",
        "Projetor",
        "Computadores",
        "Internet",
        "Ar Condicionado",
      ],
      room_type: ["Sala de aula", "Laboratório", "Auditório"],
      user_type: ["administrador", "professor", "aluno"],
    },
  },
} as const
