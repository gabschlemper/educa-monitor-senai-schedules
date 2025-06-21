
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const AuthPage = () => {
  const { signIn, signUp, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nome: '',
    cpf: '',
    matricula: '',
    telefone: '',
    userType: '',
    formacao_docente: '', // for professors
    fk_turma: '' // for students
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCPF = (cpf: string) => {
    return cpf.replace(/\D/g, '').length === 11;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginData.email || !loginData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (!validateEmail(loginData.email)) {
      setError('Por favor, insira um email válido');
      return;
    }

    const { error } = await signIn(loginData.email, loginData.password);
    
    if (error) {
      setError(error.message === 'Invalid login credentials' 
        ? 'Email ou senha incorretos' 
        : 'Erro ao fazer login. Tente novamente.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!signupData.email || !signupData.password || !signupData.confirmPassword || 
        !signupData.nome || !signupData.cpf || !signupData.matricula || !signupData.userType) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!validateEmail(signupData.email)) {
      setError('Por favor, insira um email válido');
      return;
    }

    if (!validateCPF(signupData.cpf)) {
      setError('CPF deve ter 11 dígitos');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (signupData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Prepare user data based on type
    const userData = {
      userType: signupData.userType,
      nome: signupData.nome,
      cpf: signupData.cpf.replace(/\D/g, ''),
      matricula: parseInt(signupData.matricula),
      telefone: signupData.telefone || null,
      permissao: signupData.userType === 'administrador' ? 1 : 
                signupData.userType === 'professor' ? 2 : 3,
      ...(signupData.userType === 'professor' && { 
        formacao_docente: signupData.formacao_docente 
      }),
      ...(signupData.userType === 'aluno' && signupData.fk_turma && { 
        fk_turma: parseInt(signupData.fk_turma) 
      })
    };

    const { error } = await signUp(signupData.email, signupData.password, userData);
    
    if (error) {
      if (error.message.includes('duplicate key')) {
        setError('Email, CPF ou matrícula já cadastrados');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
      console.error('Signup error:', error);
    }
  };

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-senai-blue/10 via-background to-senai-blue/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-senai-blue rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-3xl font-bold text-senai-blue">Educa Monitor</h1>
          <p className="text-muted-foreground mt-2">Sistema de Gestão de Horários SENAI</p>
        </div>

        <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Acesso ao Sistema</CardTitle>
            <CardDescription className="text-center">
              Entre com sua conta ou crie uma nova
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email Institucional</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu.email@senai.br"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      className="h-11"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="h-11 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-senai-blue hover:bg-senai-blue-dark"
                    disabled={loading}
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-nome">Nome Completo *</Label>
                      <Input
                        id="signup-nome"
                        placeholder="João Silva"
                        value={signupData.nome}
                        onChange={(e) => setSignupData({...signupData, nome: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email *</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="joao@senai.br"
                        value={signupData.email}
                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-cpf">CPF *</Label>
                      <Input
                        id="signup-cpf"
                        placeholder="000.000.000-00"
                        value={signupData.cpf}
                        onChange={(e) => setSignupData({...signupData, cpf: formatCPF(e.target.value)})}
                        maxLength={14}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-matricula">Matrícula *</Label>
                      <Input
                        id="signup-matricula"
                        type="number"
                        placeholder="12345"
                        value={signupData.matricula}
                        onChange={(e) => setSignupData({...signupData, matricula: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-telefone">Telefone</Label>
                      <Input
                        id="signup-telefone"
                        placeholder="(11) 99999-9999"
                        value={signupData.telefone}
                        onChange={(e) => setSignupData({...signupData, telefone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-usertype">Tipo de Usuário *</Label>
                      <Select value={signupData.userType} onValueChange={(value) => setSignupData({...signupData, userType: value})}>
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

                  {signupData.userType === 'professor' && (
                    <div className="space-y-2">
                      <Label htmlFor="signup-formacao">Formação Docente</Label>
                      <Input
                        id="signup-formacao"
                        placeholder="Ex: Licenciatura em Matemática"
                        value={signupData.formacao_docente}
                        onChange={(e) => setSignupData({...signupData, formacao_docente: e.target.value})}
                      />
                    </div>
                  )}

                  {signupData.userType === 'aluno' && (
                    <div className="space-y-2">
                      <Label htmlFor="signup-turma">Turma</Label>
                      <Select value={signupData.fk_turma} onValueChange={(value) => setSignupData({...signupData, fk_turma: value})}>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Senha *</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={signupData.password}
                        onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">Confirmar Senha *</Label>
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="Repita a senha"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-senai-blue hover:bg-senai-blue-dark"
                    disabled={loading}
                  >
                    {loading ? 'Criando conta...' : 'Criar Conta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
