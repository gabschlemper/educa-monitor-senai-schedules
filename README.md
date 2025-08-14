# Educa Monitor - Sistema de Gestão de Horários SENAI

Um sistema completo de gestão de horários escolares desenvolvido para o SENAI, permitindo o agendamento e controle de aulas, salas, professores e turmas.

## 📋 Funcionalidades

- **Gestão de Usuários**: Administradores, professores e alunos
- **Agendamento de Horários**: Criação, edição e exclusão de horários de aulas
- **Gestão de Salas**: Controle de salas e recursos disponíveis
- **Gestão de Turmas**: Organização de turmas e disciplinas
- **Sistema de Notificações**: Alertas para alterações e cancelamentos
- **Relatórios e Logs**: Histórico completo de alterações
- **Interface Responsiva**: Adaptada para desktop e mobile

## 🛠 Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: Sonner

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Git**

### Instalação do Node.js

#### Windows:
1. Acesse [nodejs.org](https://nodejs.org/)
2. Baixe a versão LTS
3. Execute o instalador e siga as instruções

#### Mac/Linux:
```bash
# Usando nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts
```

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd educa-monitor
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configuração do Supabase

O projeto já está configurado com uma instância do Supabase. As configurações estão em:
- `src/integrations/supabase/client.ts`
- `supabase/config.toml`

**Importante**: As credenciais do Supabase já estão configuradas no projeto. Se você quiser usar sua própria instância:

1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Substitua as credenciais em `src/integrations/supabase/client.ts`:

```typescript
const SUPABASE_URL = "SUA_URL_AQUI";
const SUPABASE_PUBLISHABLE_KEY = "SUA_CHAVE_PUBLICA_AQUI";
```

### 4. Execute o projeto

```bash
npm run dev
```

O projeto estará disponível em: `http://localhost:8080`

## 📁 Estrutura do Projeto

```
educa-monitor/
├── public/                 # Arquivos estáticos
├── src/
│   ├── components/        # Componentes React
│   │   ├── ui/           # Componentes UI (shadcn)
│   │   ├── AdminDashboard.tsx
│   │   ├── AuthPage.tsx
│   │   ├── Header.tsx
│   │   └── ...
│   ├── contexts/         # Contextos React
│   │   └── AuthContext.tsx
│   ├── hooks/           # Custom hooks
│   │   ├── useRooms.ts
│   │   ├── useSchedules.ts
│   │   └── ...
│   ├── integrations/    # Integrações externas
│   │   └── supabase/    # Configuração Supabase
│   ├── lib/            # Utilitários
│   │   └── utils.ts
│   ├── pages/          # Páginas da aplicação
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── types/          # Definições TypeScript
│   │   └── database.ts
│   ├── utils/          # Funções utilitárias
│   │   └── roomValidation.ts
│   ├── App.tsx         # Componente principal
│   ├── main.tsx        # Ponto de entrada
│   └── index.css       # Estilos globais
├── supabase/           # Configurações e migrações
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

## 🎯 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia o servidor de desenvolvimento

# Build para produção
npm run build           # Gera build otimizado
npm run preview         # Visualiza o build de produção

# Linting e formatação
npm run lint            # Executa ESLint
```

## 👥 Tipos de Usuário

O sistema possui três tipos de usuário:

### 1. **Administrador**
- Acesso completo ao sistema
- Gestão de usuários, salas, turmas e disciplinas
- Criação e gestão de horários
- Visualização de relatórios e logs

### 2. **Professor**
- Visualização dos próprios horários
- Criação de horários para suas disciplinas
- Gestão de recursos das salas

### 3. **Aluno**
- Visualização dos horários da sua turma
- Consulta de informações sobre aulas

## 🔐 Autenticação

Para testar o sistema, você pode:

1. **Criar uma nova conta** através da página de registro
2. **Usar credenciais de teste** (se disponíveis)

### Estrutura de Autenticação
- Email/senha via Supabase Auth
- Perfis de usuário vinculados às tabelas específicas (administrador, professores, alunos)
- Sistema de permissões baseado em roles

## 🗄 Banco de Dados

O projeto utiliza PostgreSQL via Supabase com as seguintes tabelas principais:

- **administrador**: Dados dos administradores
- **professores**: Dados dos professores
- **alunos**: Dados dos alunos e vínculo com turmas
- **turmas**: Informações das turmas
- **salas**: Dados das salas e recursos
- **disciplina**: Disciplinas disponíveis
- **horarios**: Horários disponíveis
- **horario_escolar**: Agendamentos de aulas
- **notificacoes**: Sistema de notificações
- **log_**: Tabelas de auditoria

## 🎨 Personalização

### Temas e Cores
O projeto utiliza um sistema de design baseado em CSS Custom Properties e Tailwind CSS. Para personalizar:

1. **Cores**: Edite `src/index.css` nas variáveis CSS
2. **Componentes**: Personalize os componentes em `src/components/ui/`
3. **Tema SENAI**: As cores principais estão definidas como `--senai-blue`

### Configuração do Tailwind
Personalize em `tailwind.config.ts`:
- Cores customizadas
- Breakpoints
- Animações
- Espaçamentos

## 🚨 Solução de Problemas

### Problemas Comuns

1. **Erro de porta ocupada**:
   ```bash
   # Mude a porta no vite.config.ts ou mate o processo
   lsof -ti:8080 | xargs kill -9
   ```

2. **Erro de dependências**:
   ```bash
   # Limpe o cache e reinstale
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Erro de build**:
   ```bash
   # Verifique os tipos TypeScript
   npm run build
   ```

4. **Erro de Supabase**:
   - Verifique se as credenciais estão corretas
   - Confirme se o projeto Supabase está ativo

### Logs e Debug
- **Console do navegador**: F12 para ver erros
- **Network tab**: Para verificar requisições
- **Supabase Dashboard**: Para logs do backend

## 📱 Deploy

### Deploy no Lovable
O projeto já está configurado para deploy automático no Lovable.

### Deploy Manual
Para fazer deploy em outras plataformas:

1. **Build do projeto**:
   ```bash
   npm run build
   ```

2. **Upload da pasta `dist/`** para seu provedor de hospedagem

### Variáveis de Ambiente
Se usar sua própria instância Supabase, configure:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é desenvolvido para o SENAI. Todos os direitos reservados.

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Consulte os logs de erro
3. Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido com ❤️ para o SENAI**

## 🔗 Links Úteis

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)