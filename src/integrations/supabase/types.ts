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
        }
        Insert: {
          created_at?: string | null
          data: string
          fk_salas?: number | null
          hora_inicio: string
          hora_termino: string
          id_horario?: number
        }
        Update: {
          created_at?: string | null
          data?: string
          fk_salas?: number | null
          hora_inicio?: string
          hora_termino?: string
          id_horario?: number
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
      [_ in never]: never
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
