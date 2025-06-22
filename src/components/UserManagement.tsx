
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Edit, Trash2, Search, Filter, User, Users, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Simplified type definitions to avoid infinite recursion
interface UserData {
  id: number;
  email: string;
  nome: string;
  cpf: string;
  matricula: number;
  telefone?: string;
  permissao: number;
  userType: 'administrador' | 'professor' | 'aluno';
  formacao_docente?: string; // Only for professors
  fk_turma?: number; // Only for students
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    matricula: '',
    telefone: '',
    senha: '',
    userType: '',
    formacao_docente: '',
    fk_turma: ''
  });
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const allUsers: UserData[] = [];

      // Fetch administrators
      const { data: admins } = await supabase.from('administrador').select('*');
      if (admins) {
        admins.forEach(admin => {
          allUsers.push({
            id: admin.id_administrador,
            email: admin.email,
            nome: admin.nome,
            cpf: admin.cpf,
            matricula: admin.matricula,
            telefone: admin.telefone,
            permissao: admin.permissao,
            userType: 'administrador'
          });
        });
      }

      // Fetch professors
      const { data: professors } = await supabase.from('professores').select('*');
      if (professors) {
        professors.forEach(prof => {
          allUsers.push({
            id: prof.id_professor,
            email: prof.email,
            nome: prof.nome,
            cpf: prof.cpf,
            matricula: prof.matricula,
            telefone: prof.telefone,
            permissao: prof.permissao,
            userType: 'professor',
            formacao_docente: prof.formacao_docente
          });
        });
      }

      // Fetch students
      const { data: students } = await supabase.from('alunos').select('*');
      if (students) {
        students.forEach(student => {
          allUsers.push({
            id: student.id_aluno,
            email: student.email,
            nome: student.nome,
            cpf: student.cpf,
            matricula: student.matricula,
            telefone: student.telefone,
            permissao: student.permissao,
            userType: 'aluno',
            fk_turma: student.fk_turma
          });
        });
      }

      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.nome || !formData.email || !formData.cpf || !formData.matricula || !formData.userType) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return false;
    }

    if (!editingUser && !formData.senha) {
      setError('Senha é obrigatória para novos usuários');
      return false;
    }

    if (formData.cpf.replace(/\D/g, '').length !== 11) {
      setError('CPF deve ter 11 dígitos');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email deve ter formato válido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      const userData: any = {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf.replace(/\D/g, ''),
        matricula: parseInt(formData.matricula),
        telefone: formData.telefone || null,
        permissao: formData.userType === 'administrador' ? 1 : 
                  formData.userType === 'professor' ? 2 : 3,
        ...(formData.senha && { senha: formData.senha }),
        ...(formData.userType === 'professor' && { 
          formacao_docente: formData.formacao_docente 
        }),
        ...(formData.userType === 'aluno' && formData.fk_turma && { 
          fk_turma: parseInt(formData.fk_turma) 
        })
      };

      // Explicitly handle each user type to avoid type inference issues
      if (formData.userType === 'administrador') {
        if (editingUser) {
          const { error } = await supabase
            .from('administrador')
            .update(userData)
            .eq('id_administrador', editingUser.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('administrador')
            .insert([userData]);
          if (error) throw error;
        }
      } else if (formData.userType === 'professor') {
        if (editingUser) {
          const { error } = await supabase
            .from('professores')
            .update(userData)
            .eq('id_professor', editingUser.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('professores')
            .insert([userData]);
          if (error) throw error;
        }
      } else if (formData.userType === 'aluno') {
        if (editingUser) {
          const { error } = await supabase
            .from('alunos')
            .update(userData)
            .eq('id_aluno', editingUser.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('alunos')
            .insert([userData]);
          if (error) throw error;
        }
      }

      toast({
        title: "Sucesso",
        description: `Usuário ${editingUser ? 'atualizado' : 'criado'} com sucesso`,
      });

      setIsDialogOpen(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      console.error('Error saving user:', error);
      if (error.code === '23505') {
        setError('Email, CPF ou matrícula já cadastrados');
      } else {
        setError(error.message || 'Erro ao salvar usuário');
      }
    }
  };

  const handleDelete = async (user: UserData) => {
    if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      // Explicitly handle each user type to avoid type inference issues
      if (user.userType === 'administrador') {
        const { error } = await supabase
          .from('administrador')
          .delete()
          .eq('id_administrador', user.id);
        if (error) throw error;
      } else if (user.userType === 'professor') {
        const { error } = await supabase
          .from('professores')
          .delete()
          .eq('id_professor', user.id);
        if (error) throw error;
      } else if (user.userType === 'aluno') {
        const { error } = await supabase
          .from('alunos')
          .delete()
          .eq('id_aluno', user.id);
        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso",
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir usuário",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      cpf: '',
      matricula: '',
      telefone: '',
      senha: '',
      userType: '',
      formacao_docente: '',
      fk_turma: ''
    });
    setError('');
  };

  const handleEdit = (user: UserData) => {
    setEditingUser(user);
    setFormData({
      nome: user.nome,
      email: user.email,
      cpf: user.cpf,
      matricula: user.matricula.toString(),
      telefone: user.telefone || '',
      senha: '',
      userType: user.userType,
      formacao_docente: user.formacao_docente || '',
      fk_turma: user.fk_turma?.toString() || ''
    });
    setIsDialogOpen(true);
  };

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const getUserTypeBadge = (userType: string) => {
    const configs = {
      'administrador': { color: 'bg-red-100 text-red-800', icon: UserCheck, label: 'Administrador' },
      'professor': { color: 'bg-blue-100 text-blue-800', icon: User, label: 'Professor' },
      'aluno': { color: 'bg-green-100 text-green-800', icon: Users, label: 'Aluno' }
    };
    const config = configs[userType as keyof typeof configs];
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.cpf.includes(searchTerm);
    const matchesType = filterType === 'all' || user.userType === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return <div className="p-6">Carregando usuários...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">Administre usuários do sistema</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-senai-blue hover:bg-senai-blue-dark" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </DialogTitle>
              <DialogDescription>
                {editingUser ? 'Atualize as informações do usuário' : 'Preencha as informações para cadastrar um novo usuário'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="João Silva"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="joao@senai.br"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData({...formData, cpf: formatCPF(e.target.value)})}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="matricula">Matrícula *</Label>
                  <Input
                    id="matricula"
                    type="number"
                    value={formData.matricula}
                    onChange={(e) => setFormData({...formData, matricula: e.target.value})}
                    placeholder="12345"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="userType">Tipo de Usuário *</Label>
                  <Select value={formData.userType} onValueChange={(value) => setFormData({...formData, userType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="administrador">Administrador</SelectItem>
                      <SelectItem value="professor">Professor</SelectItem>
                      <SelectItem value="aluno">Aluno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.userType === 'professor' && (
                <div>
                  <Label htmlFor="formacao_docente">Formação Docente</Label>
                  <Input
                    id="formacao_docente"
                    value={formData.formacao_docente}
                    onChange={(e) => setFormData({...formData, formacao_docente: e.target.value})}
                    placeholder="Ex: Licenciatura em Matemática"
                  />
                </div>
              )}

              {formData.userType === 'aluno' && (
                <div>
                  <Label htmlFor="fk_turma">Turma</Label>
                  <Select value={formData.fk_turma} onValueChange={(value) => setFormData({...formData, fk_turma: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a turma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">A01</SelectItem>
                      <SelectItem value="2">B01</SelectItem>
                      <SelectItem value="3">A02</SelectItem>
                      <SelectItem value="4">B02</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="senha">{editingUser ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}</Label>
                <Input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({...formData, senha: e.target.value})}
                  placeholder="Mínimo 6 caracteres"
                  required={!editingUser}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-senai-blue hover:bg-senai-blue-dark">
                  {editingUser ? 'Atualizar' : 'Cadastrar'} Usuário
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, email ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="administrador">Administradores</SelectItem>
                  <SelectItem value="professor">Professores</SelectItem>
                  <SelectItem value="aluno">Alunos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={`${user.userType}-${user.id}`} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{user.nome}</CardTitle>
                  {getUserTypeBadge(user.userType)}
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(user)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Matrícula:</strong> {user.matricula}</div>
                <div><strong>CPF:</strong> {user.cpf}</div>
                {user.telefone && <div><strong>Telefone:</strong> {user.telefone}</div>}
                {user.userType === 'professor' && user.formacao_docente && (
                  <div><strong>Formação:</strong> {user.formacao_docente}</div>
                )}
                {user.userType === 'aluno' && user.fk_turma && (
                  <div><strong>Turma:</strong> {user.fk_turma}</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhum usuário encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;
