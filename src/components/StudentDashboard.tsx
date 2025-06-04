
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User, BookOpen, AlertCircle } from "lucide-react";

const StudentDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const todayClasses = [
    { time: "08:00 - 10:00", subject: "Programação Web", teacher: "Prof. João Silva", room: "Lab-01", block: "Bloco A - 2º Andar", status: "completed" },
    { time: "10:30 - 12:30", subject: "Banco de Dados", teacher: "Prof. Maria Santos", room: "Lab-02", block: "Bloco A - 2º Andar", status: "current" },
    { time: "14:00 - 16:00", subject: "Engenharia de Software", teacher: "Prof. Carlos Costa", room: "201-A", block: "Bloco B - 1º Andar", status: "upcoming" },
    { time: "19:00 - 21:00", subject: "Programação Mobile", teacher: "Prof. Ana Lima", room: "Lab-03", block: "Bloco A - 3º Andar", status: "upcoming" },
  ];

  const subjects = [
    { name: "Programação Web", teacher: "Prof. João Silva", credits: 4 },
    { name: "Banco de Dados", teacher: "Prof. Maria Santos", credits: 3 },
    { name: "Engenharia de Software", teacher: "Prof. Carlos Costa", credits: 4 },
    { name: "Programação Mobile", teacher: "Prof. Ana Lima", credits: 3 },
    { name: "Redes de Computadores", teacher: "Prof. Pedro Oliveira", credits: 3 },
  ];

  const notifications = [
    { message: "Prova de Banco de Dados agendada para sexta-feira", time: "2 horas atrás", type: "warning" },
    { message: "Material de Programação Web disponível no portal", time: "1 dia atrás", type: "info" },
    { message: "Alteração de sala: Eng. Software - Nova sala 202-B", time: "2 dias atrás", type: "info" },
  ];

  const getNextClass = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    for (const classItem of todayClasses) {
      if (classItem.status === 'upcoming') {
        const [startTime] = classItem.time.split(' - ');
        const [hour, minute] = startTime.split(':').map(Number);
        const classTimeInMinutes = hour * 60 + minute;
        
        if (classTimeInMinutes > currentTimeInMinutes) {
          const timeDiff = classTimeInMinutes - currentTimeInMinutes;
          const hoursLeft = Math.floor(timeDiff / 60);
          const minutesLeft = timeDiff % 60;
          
          return {
            ...classItem,
            timeLeft: `${hoursLeft}h ${minutesLeft}m`
          };
        }
      }
    }
    return null;
  };

  const nextClass = getNextClass();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'current': return 'bg-blue-500';
      case 'upcoming': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Minha Agenda</h1>
        <p className="text-muted-foreground">Olá, Maria! Aqui estão suas aulas de hoje</p>
        <p className="text-sm text-muted-foreground mt-1">
          {currentTime.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} - {currentTime.toLocaleTimeString('pt-BR')}
        </p>
      </div>

      {/* Next Class Countdown */}
      {nextClass && (
        <Card className="bg-gradient-to-r from-senai-blue to-senai-blue-dark text-white">
          <CardHeader>
            <CardTitle className="text-white">Próxima Aula</CardTitle>
            <CardDescription className="text-blue-100">
              Sua próxima aula começa em
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{nextClass.timeLeft}</div>
            <div className="space-y-1">
              <p className="text-lg font-medium">{nextClass.subject}</p>
              <div className="flex items-center space-x-4 text-sm text-blue-100">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {nextClass.teacher}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {nextClass.room}
                </div>
              </div>
              <p className="text-xs text-blue-100">{nextClass.block}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Aulas de Hoje</CardTitle>
            <CardDescription>
              Sua programação de aulas para hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayClasses.map((classItem, index) => (
                <div key={index} className="flex items-start space-x-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-3 h-3 rounded-full mt-2 ${getStatusColor(classItem.status)}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{classItem.subject}</h4>
                      <Badge variant="outline">{classItem.time}</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {classItem.teacher}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {classItem.room} - {classItem.block}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subjects */}
        <Card>
          <CardHeader>
            <CardTitle>Minhas Disciplinas</CardTitle>
            <CardDescription>
              Disciplinas matriculadas neste semestre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subjects.map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-4 w-4 text-senai-blue" />
                    <div>
                      <h4 className="font-medium">{subject.name}</h4>
                      <p className="text-sm text-muted-foreground">{subject.teacher}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{subject.credits} créd.</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Calendário Semanal</CardTitle>
          <CardDescription>
            Visão geral das suas aulas esta semana
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
              <div key={index} className="text-center">
                <h4 className="font-medium text-sm mb-3 p-2 bg-muted rounded">{day}</h4>
                <div className="space-y-2">
                  {index > 0 && index < 6 && (
                    <>
                      <div className="bg-senai-blue text-white text-xs p-2 rounded">
                        <div className="font-medium">08:00</div>
                        <div>Prog. Web</div>
                      </div>
                      <div className="bg-green-500 text-white text-xs p-2 rounded">
                        <div className="font-medium">14:00</div>
                        <div>Banco</div>
                      </div>
                      {index < 5 && (
                        <div className="bg-orange-500 text-white text-xs p-2 rounded">
                          <div className="font-medium">19:00</div>
                          <div>Mobile</div>
                        </div>
                      )}
                    </>
                  )}
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
            Avisos importantes e atualizações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                <AlertCircle className={`h-5 w-5 mt-0.5 ${
                  notification.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {notification.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
