
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Administrador, Professor, Aluno, Turma } from "@/types/database";

type User = Administrador | Professor | Aluno;

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    matricula: '',
    permissao: 'aluno' as 'administrador' | 'professor' | 'aluno',
    senha: '',
    confirmSenha: '',
    formacao_docente: '',
    fk_turma: ''
  });
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchTurmas();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch all user types
      const [adminsResult, professorsResult, alunosResult] = await Promise.all([
        supabase.from('administrador').select('*'),
        supabase.from('professores').select('*'),
        supabase.from('alunos').select('*, turmas(agrupamento, ano)')
      ]);

      const allUsers: User[] = [
        ...(adminsResult.data || []).map(admin => ({ ...admin, userType: 'administrador' as const })),
        ...(professorsResult.data || []).map(prof => ({ ...prof, userType: 'professor' as const })),
        ...(alunosResult.data || []).map(aluno => ({ ...aluno, userType: 'aluno' as const }))
      ];

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

  const fetchTurmas = async () => {
    try {
      const { data, error } = await supabase.from('turmas').select('*');
      if (error) throw error;
      setTurmas(data || []);
    } catch (error) {
      console.error('Error fetching turmas:', error);
    }
  };

  const validateForm = () => {
    if (!formData.nome || !formData.email || !formData.cpf || !formData.matricula) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return false;
    }

    if (formData.nome.length > 100) {
      setError('Nome deve ter no máximo 100 caracteres');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email deve ter um formato válido');
      return false;
    }

    const cpfRegex = /^\d{11}$/;
    if (!cpfRegex.test(formData.cpf.replace(/\D/g, ''))) {
      setError('CPF deve conter 11 dígitos');
      return false;
    }

    if (!editingUser && formData.senha.length < 8) {
      setError('Senha deve ter no mínimo 8 caracteres');
      return false;
    }

    if (!editingUser && formData.senha !== formData.confirmSenha) {
      setError('Senhas não coincidem');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      const userData = {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf.replace(/\D/g, ''),
        telefone: formData.telefone.replace(/\D/g, '') || null,
        matricula: parseInt(formData.matricula),
        permissao: formData.permissao === 'administrador' ? 1 : formData.permissao === 'professor' ? 2 : 3,
        ...(formData.senha && { senha: formData.senha })
      };

      let result;
      
      if (editingUser) {
        // Update existing user
        const table = getTableName(formData.permissao);
        const idField = getIdField(formData.permissao);
        result = await supabase
          .from(table)
          .update(userData)
          .eq(idField, (editingUser as any)[idField]);
      } else {
        // Create new user
        const table = getTableName(formData.permissao);
        const specificData = formData.permissao === 'professor' 
          ? { ...userData, formacao_docente: formData.formacao_docente || null }
          : formData.permissao === 'aluno'
          ? { ...userData, fk_turma: formData.fk_turma ? parseInt(formData.fk_turma) : null }
          : userData;

        result = await supabase.from(table).insert([specificData]);
      }

      if (result.error) throw result.error;

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
      setError(error.message || 'Erro ao salvar usuário');
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const userType = getUserType(user);
      const table = getTableName(userType);
      const idField = getIdField(userType);
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq(idField, (user as any)[idField]);

      if (error) throw error;

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

  const getUserType = (user: User): 'administrador' | 'professor' | 'aluno' => {
    if ('id_administrador' in user) return 'administrador';
    if ('id_professor' in user) return 'professor';
    return 'aluno';
  };

  const getTableName = (userType: string) => {
    switch (userType) {
      case 'administrador': return 'administrador';
      case 'professor': return 'professores';
      case 'aluno': return 'alunos';
      default: return 'alunos';
    }
  };

  const getIdField = (userType: string) => {
    switch (userType) {
      case 'administrador': return 'id_administrador';
      case 'professor': return 'id_professor';
      case 'aluno': return 'id_aluno';
      default: return 'id_aluno';
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      cpf: '',
      telefone: '',
      matricula: '',
      permissao: 'aluno',
      senha: '',
      confirmSenha: '',
      formacao_docente: '',
      fk_turma: ''
    });
    setError('');
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    const userType = getUserType(user);
    setFormData({
      nome: user.nome,
      email: user.email,
      cpf: user.cpf,
      telefone: user.telefone || '',
      matricula: user.matricula.toString(),
      permissao: userType,
      senha: '',
      confirmSenha: '',
      formacao_docente: userType === 'professor' ? (user as Professor).formacao_docente || '' : '',
      fk_turma: userType === 'aluno' ? (user as Aluno).fk_turma?.toString() || '' : ''
    });
    setIsDialogOpen(true);
  };

  const formatCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.matricula.toString().includes(searchTerm);
    const matchesType = filterType === 'all' || getUserType(user) === filterType;
    return matchesSearch && matchesType;
  });

  const getUserTypeBadge = (userType: string) => {
    const colors = {
      administrador: 'bg-red-100 text-red-800',
      professor: 'bg-blue-100 text-blue-800',
      aluno: 'bg-green-100 text-green-800'
    };
    const labels = {
      administrador: 'Admin',
      professor: 'Professor',
      aluno: 'Aluno'
    };
    return { color: colors[userType as keyof typeof colors], label: labels[userType as keyof typeof labels] };
  };

  if (loading) {
    return <div className="p-6">Carregando usuários...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">Administre administradores, professores e alunos</p>
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
                    maxLength={100}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Institucional *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formatCPF(formData.cpf)}
                    onChange={(e) => setFormData({...formData, cpf: e.target.value.replace(/\D/g, '')})}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formatPhone(formData.telefone)}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value.replace(/\D/g, '')})}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                </div>
                <div>
                  <Label htmlFor="matricula">Matrícula *</Label>
                  <Input
                    id="matricula"
                    type="number"
                    value={formData.matricula}
                    onChange={(e) => setFormData({...formData, matricula: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="permissao">Tipo de Usuário *</Label>
                <Select value={formData.permissao} onValueChange={(value: 'administrador' | 'professor' | 'aluno') => setFormData({...formData, permissao: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrador">Administrador</SelectItem>
                    <SelectItem value="professor">Professor</SelectItem>
                    <SelectItem value="aluno">Aluno</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.permissao === 'professor' && (
                <div>
                  <Label htmlFor="formacao">Formação Docente</Label>
                  <Input
                    id="formacao"
                    value={formData.formacao_docente}
                    onChange={(e) => setFormData({...formData, formacao_docente: e.target.value})}
                    maxLength={50}
                  />
                </div>
              )}

              {formData.permissao === 'aluno' && (
                <div>
                  <Label htmlFor="turma">Turma</Label>
                  <Select value={formData.fk_turma} onValueChange={(value) => setFormData({...formData, fk_turma: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma turma" />
                    </SelectTrigger>
                    <SelectContent>
                      {turmas.map((turma) => (
                        <SelectItem key={turma.id_turma} value={turma.id_turma.toString()}>
                          {turma.ano}{turma.agrupamento}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="senha">Senha {editingUser ? '' : '*'}</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={formData.senha}
                    onChange={(e) => setFormData({...formData, senha: e.target.value})}
                    minLength={8}
                    required={!editingUser}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmSenha">Confirmar Senha {editingUser ? '' : '*'}</Label>
                  <Input
                    id="confirmSenha"
                    type="password"
                    value={formData.confirmSenha}
                    onChange={(e) => setFormData({...formData, confirmSenha: e.target.value})}
                    required={!editingUser}
                  />
                </div>
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
                  placeholder="Buscar por nome, email ou matrícula..."
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

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Nome</th>
                  <th className="text-left py-3 px-2">Email</th>
                  <th className="text-left py-3 px-2">CPF</th>
                  <th className="text-left py-3 px-2">Matrícula</th>
                  <th className="text-left py-3 px-2">Tipo</th>
                  <th className="text-center py-3 px-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const userType = getUserType(user);
                  const badge = getUserTypeBadge(userType);
                  const userId = (user as any)[getIdField(userType)];
                  
                  return (
                    <tr key={`${userType}-${userId}`} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2 font-medium">{user.nome}</td>
                      <td className="py-3 px-2">{user.email}</td>
                      <td className="py-3 px-2">{formatCPF(user.cpf)}</td>
                      <td className="py-3 px-2">{user.matricula}</td>
                      <td className="py-3 px-2">
                        <Badge className={badge.color}>
                          {badge.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex justify-center space-x-2">
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
