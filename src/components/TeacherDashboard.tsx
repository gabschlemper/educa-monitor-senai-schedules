
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, AlertCircle, CheckCircle } from "lucide-react";

const TeacherDashboard = () => {
  const todayClasses = [
    { time: "08:00 - 10:00", subject: "Programação Web", room: "Lab-01", students: 25, status: "completed" },
    { time: "10:30 - 12:30", subject: "Banco de Dados", room: "Lab-02", students: 22, status: "current" },
    { time: "14:00 - 16:00", subject: "Engenharia de Software", room: "201-A", students: 28, status: "upcoming" },
    { time: "19:00 - 21:00", subject: "Programação Mobile", room: "Lab-03", students: 20, status: "upcoming" },
  ];

  const weeklyHours = 32;
  const totalStudents = 95;

  const notifications = [
    { message: "Solicitação de mudança de sala aprovada", time: "1 hora atrás", type: "success" },
    { message: "Lembrete: Entrega de notas até sexta-feira", time: "3 horas atrás", type: "warning" },
    { message: "Nova turma atribuída: Algoritmos II", time: "1 dia atrás", type: "info" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'current': return 'bg-blue-500';
      case 'upcoming': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'current': return 'Em andamento';
      case 'upcoming': return 'Próxima';
      default: return 'Agendada';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard do Professor</h1>
        <p className="text-muted-foreground">Bem-vindo de volta, Prof. João Silva</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Semanais</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyHours}h</div>
            <p className="text-xs text-muted-foreground">
              +4h comparado à semana passada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Distribuídos em 4 turmas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próxima Aula</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14:00</div>
            <p className="text-xs text-muted-foreground">
              Engenharia de Software - Sala 201-A
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Aulas de Hoje</CardTitle>
            <CardDescription>
              Sua agenda de aulas para hoje, {new Date().toLocaleDateString('pt-BR')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayClasses.map((classItem, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(classItem.status)}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{classItem.subject}</h4>
                      <Badge variant="outline">{classItem.time}</Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground space-x-4">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {classItem.room}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {classItem.students} alunos
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {getStatusText(classItem.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>
              Últimas atualizações e avisos importantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {notification.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                    {notification.type === 'info' && <AlertCircle className="h-5 w-5 text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Calendar Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Calendário Semanal</CardTitle>
          <CardDescription>
            Visão geral das suas aulas desta semana
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
              <div key={index} className="text-center">
                <h4 className="font-medium text-sm mb-2">{day}</h4>
                <div className="space-y-1">
                  {index > 0 && index < 6 && (
                    <>
                      <div className="bg-senai-blue text-white text-xs p-1 rounded">08:00</div>
                      <div className="bg-green-500 text-white text-xs p-1 rounded">14:00</div>
                      {index < 5 && <div className="bg-orange-500 text-white text-xs p-1 rounded">19:00</div>}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button className="bg-senai-blue hover:bg-senai-blue-dark">
          Solicitar Mudança de Sala
        </Button>
        <Button variant="outline">
          Ver Lista de Alunos
        </Button>
        <Button variant="outline">
          Relatório de Frequência
        </Button>
      </div>
    </div>
  );
};

export default TeacherDashboard;
