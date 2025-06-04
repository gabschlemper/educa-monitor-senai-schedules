
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, MapPin, BookOpen, Calendar, TrendingUp, Clock } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    { title: "Total de Alunos", value: "1,247", icon: Users, color: "bg-blue-500" },
    { title: "Total de Professores", value: "89", icon: GraduationCap, color: "bg-green-500" },
    { title: "Total de Salas", value: "45", icon: MapPin, color: "bg-purple-500" },
    { title: "Total de Disciplinas", value: "32", icon: BookOpen, color: "bg-orange-500" },
  ];

  const weeklySchedule = [
    { day: "Segunda", occupied: 85, available: 15 },
    { day: "Terça", occupied: 92, available: 8 },
    { day: "Quarta", occupied: 78, available: 22 },
    { day: "Quinta", occupied: 88, available: 12 },
    { day: "Sexta", occupied: 95, available: 5 },
    { day: "Sábado", occupied: 60, available: 40 },
  ];

  const recentNotifications = [
    { message: "Nova turma de Mecânica criada", time: "2 horas atrás", type: "info" },
    { message: "Sala 301-A com problema no projetor", time: "4 horas atrás", type: "warning" },
    { message: "Professor João solicitou mudança de horário", time: "1 dia atrás", type: "info" },
    { message: "Manutenção preventiva agendada", time: "2 dias atrás", type: "info" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">Visão geral do sistema de gestão de horários</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% desde o mês passado
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Schedule Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Ocupação Semanal das Salas</CardTitle>
            <CardDescription>
              Percentual de salas ocupadas por dia da semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklySchedule.map((day, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 text-sm font-medium">{day.day}</div>
                  <div className="flex-1 bg-muted rounded-full h-2 relative">
                    <div 
                      className="bg-senai-blue h-2 rounded-full"
                      style={{ width: `${day.occupied}%` }}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {day.occupied}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notificações Recentes</CardTitle>
            <CardDescription>
              Últimas atividades do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.map((notification, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {notification.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Agenda de Hoje</CardTitle>
          <CardDescription>
            Visão geral das aulas programadas para hoje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { time: "08:00", subject: "Matemática Aplicada", room: "201-A", teacher: "Prof. Silva" },
              { time: "10:00", subject: "Física", room: "301-B", teacher: "Prof. Santos" },
              { time: "14:00", subject: "Programação", room: "Lab-01", teacher: "Prof. Costa" },
              { time: "16:00", subject: "Eletrônica", room: "Lab-02", teacher: "Prof. Lima" },
              { time: "19:00", subject: "Gestão", room: "101-A", teacher: "Prof. Oliveira" },
              { time: "21:00", subject: "Segurança", room: "201-B", teacher: "Prof. Pereira" },
            ].map((schedule, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{schedule.time}</Badge>
                  <Badge variant="secondary">{schedule.room}</Badge>
                </div>
                <h4 className="font-medium">{schedule.subject}</h4>
                <p className="text-sm text-muted-foreground">{schedule.teacher}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
