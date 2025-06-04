
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Clock, MapPin, User, AlertTriangle } from "lucide-react";

interface Schedule {
  id: string;
  days: string[];
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  room: string;
  class: string;
  startDate: string;
  endDate: string;
  recurrence: 'semanal' | 'quinzenal' | 'mensal';
}

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: '1',
      days: ['segunda', 'quarta'],
      startTime: '08:00',
      endTime: '10:00',
      subject: 'Programação Web',
      teacher: 'Prof. João Silva',
      room: 'Lab-01',
      class: 'Turma A',
      startDate: '2024-01-15',
      endDate: '2024-06-15',
      recurrence: 'semanal'
    },
    {
      id: '2',
      days: ['terça', 'quinta'],
      startTime: '14:00',
      endTime: '16:00',
      subject: 'Banco de Dados',
      teacher: 'Prof. Maria Santos',
      room: 'Lab-02',
      class: 'Turma A',
      startDate: '2024-01-15',
      endDate: '2024-06-15',
      recurrence: 'semanal'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [viewMode, setViewMode] = useState<'professor' | 'room' | 'class' | 'subject'>('professor');
  const [formData, setFormData] = useState({
    days: [] as string[],
    startTime: '',
    endTime: '',
    subject: '',
    teacher: '',
    room: '',
    class: '',
    startDate: '',
    endDate: '',
    recurrence: 'semanal' as 'semanal' | 'quinzenal' | 'mensal'
  });
  const [error, setError] = useState('');
  const [conflicts, setConflicts] = useState<string[]>([]);

  const weekDays = [
    { id: 'segunda', label: 'Segunda-feira' },
    { id: 'terça', label: 'Terça-feira' },
    { id: 'quarta', label: 'Quarta-feira' },
    { id: 'quinta', label: 'Quinta-feira' },
    { id: 'sexta', label: 'Sexta-feira' },
    { id: 'sábado', label: 'Sábado' }
  ];

  const timeSlots = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'
  ];

  const subjects = ['Programação Web', 'Banco de Dados', 'Engenharia de Software', 'Programação Mobile', 'Redes'];
  const teachers = ['Prof. João Silva', 'Prof. Maria Santos', 'Prof. Carlos Costa', 'Prof. Ana Lima'];
  const rooms = ['Lab-01', 'Lab-02', 'Lab-03', '201-A', '201-B', '301-A'];
  const classes = ['Turma A', 'Turma B', 'Turma C'];

  const validateSchedule = (data: typeof formData) => {
    const errors = [];
    
    if (!data.days.length) errors.push('Selecione pelo menos um dia da semana');
    if (!data.startTime) errors.push('Defina o horário de início');
    if (!data.endTime) errors.push('Defina o horário de fim');
    if (!data.subject) errors.push('Selecione a disciplina');
    if (!data.teacher) errors.push('Selecione o professor');
    if (!data.room) errors.push('Selecione a sala');
    if (!data.class) errors.push('Selecione a turma');
    if (!data.startDate) errors.push('Defina a data de início');
    if (!data.endDate) errors.push('Defina a data de fim');

    // Validar horários
    if (data.startTime && data.endTime) {
      const start = new Date(`2000-01-01T${data.startTime}`);
      const end = new Date(`2000-01-01T${data.endTime}`);
      
      if (start >= end) {
        errors.push('O horário de início deve ser anterior ao horário de fim');
      }
      
      if (start.getHours() < 7 || end.getHours() > 23) {
        errors.push('Horários devem estar entre 07:00 e 23:00');
      }
    }

    // Verificar conflitos
    const conflictsList = checkConflicts(data);
    if (conflictsList.length > 0) {
      errors.push(...conflictsList);
    }

    return errors;
  };

  const checkConflicts = (data: typeof formData) => {
    const conflicts = [];
    
    for (const day of data.days) {
      // Verificar conflito de professor
      const teacherConflict = schedules.find(s => 
        s.id !== editingSchedule?.id &&
        s.teacher === data.teacher &&
        s.days.includes(day) &&
        isTimeOverlap(s.startTime, s.endTime, data.startTime, data.endTime)
      );
      
      if (teacherConflict) {
        conflicts.push(`Conflito: ${data.teacher} já tem aula na ${day} das ${data.startTime} às ${data.endTime}`);
      }

      // Verificar conflito de sala
      const roomConflict = schedules.find(s => 
        s.id !== editingSchedule?.id &&
        s.room === data.room &&
        s.days.includes(day) &&
        isTimeOverlap(s.startTime, s.endTime, data.startTime, data.endTime)
      );
      
      if (roomConflict) {
        conflicts.push(`Conflito: Sala ${data.room} já está ocupada na ${day} das ${data.startTime} às ${data.endTime}`);
      }
    }
    
    return conflicts;
  };

  const isTimeOverlap = (start1: string, end1: string, start2: string, end2: string) => {
    const startTime1 = new Date(`2000-01-01T${start1}`);
    const endTime1 = new Date(`2000-01-01T${end1}`);
    const startTime2 = new Date(`2000-01-01T${start2}`);
    const endTime2 = new Date(`2000-01-01T${end2}`);
    
    return startTime1 < endTime2 && startTime2 < endTime1;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateSchedule(formData);
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      setConflicts(validationErrors.filter(e => e.includes('Conflito:')));
      return;
    }

    const newSchedule: Schedule = {
      id: editingSchedule ? editingSchedule.id : Date.now().toString(),
      ...formData
    };

    if (editingSchedule) {
      setSchedules(schedules.map(s => s.id === editingSchedule.id ? newSchedule : s));
    } else {
      setSchedules([...schedules, newSchedule]);
    }

    setIsDialogOpen(false);
    setEditingSchedule(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      days: [],
      startTime: '',
      endTime: '',
      subject: '',
      teacher: '',
      room: '',
      class: '',
      startDate: '',
      endDate: '',
      recurrence: 'semanal'
    });
    setError('');
    setConflicts([]);
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({...schedule});
    setIsDialogOpen(true);
  };

  const handleDelete = (scheduleId: string) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      setSchedules(schedules.filter(s => s.id !== scheduleId));
    }
  };

  const getSchedulesByView = () => {
    const grouped: Record<string, Schedule[]> = {};
    
    schedules.forEach(schedule => {
      let key = '';
      switch (viewMode) {
        case 'professor':
          key = schedule.teacher;
          break;
        case 'room':
          key = schedule.room;
          break;
        case 'class':
          key = schedule.class;
          break;
        case 'subject':
          key = schedule.subject;
          break;
      }
      
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(schedule);
    });
    
    return grouped;
  };

  const getDayColor = (day: string) => {
    const colors = {
      'segunda': 'bg-blue-100 text-blue-800',
      'terça': 'bg-green-100 text-green-800',
      'quarta': 'bg-yellow-100 text-yellow-800',
      'quinta': 'bg-purple-100 text-purple-800',
      'sexta': 'bg-pink-100 text-pink-800',
      'sábado': 'bg-gray-100 text-gray-800'
    };
    return colors[day as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Agendamento de Horários</h1>
          <p className="text-muted-foreground">Gerencie os horários das aulas</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-senai-blue hover:bg-senai-blue-dark" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? 'Editar Agendamento' : 'Novo Agendamento'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações para agendar uma aula
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Days Selection */}
              <div>
                <Label className="text-base font-medium">Dia(s) da Semana *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {weekDays.map(day => (
                    <div key={day.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.id}
                        checked={formData.days.includes(day.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({...formData, days: [...formData.days, day.id]});
                          } else {
                            setFormData({...formData, days: formData.days.filter(d => d !== day.id)});
                          }
                        }}
                      />
                      <Label htmlFor={day.id}>{day.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Horário de Início *</Label>
                  <Select value={formData.startTime} onValueChange={(value) => setFormData({...formData, startTime: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="endTime">Horário de Fim *</Label>
                  <Select value={formData.endTime} onValueChange={(value) => setFormData({...formData, endTime: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Subject, Teacher, Room, Class */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject">Disciplina *</Label>
                  <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="teacher">Professor *</Label>
                  <Select value={formData.teacher} onValueChange={(value) => setFormData({...formData, teacher: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map(teacher => (
                        <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="room">Sala *</Label>
                  <Select value={formData.room} onValueChange={(value) => setFormData({...formData, room: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map(room => (
                        <SelectItem key={room} value={room}>{room}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="class">Turma *</Label>
                  <Select value={formData.class} onValueChange={(value) => setFormData({...formData, class: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Data de Início *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Data de Fim *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Recurrence */}
              <div>
                <Label htmlFor="recurrence">Recorrência</Label>
                <Select value={formData.recurrence} onValueChange={(value: 'semanal' | 'quinzenal' | 'mensal') => setFormData({...formData, recurrence: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="quinzenal">Quinzenal</SelectItem>
                    <SelectItem value="mensal">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conflicts Warning */}
              {conflicts.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      {conflicts.map((conflict, index) => (
                        <div key={index}>{conflict}</div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {error && !conflicts.length && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-senai-blue hover:bg-senai-blue-dark">
                  {editingSchedule ? 'Atualizar' : 'Agendar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* View Mode Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Label>Visualizar por:</Label>
            <Select value={viewMode} onValueChange={(value: 'professor' | 'room' | 'class' | 'subject') => setViewMode(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professor">Professor</SelectItem>
                <SelectItem value="room">Sala</SelectItem>
                <SelectItem value="class">Turma</SelectItem>
                <SelectItem value="subject">Disciplina</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Calendário Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => (
              <div key={day.id}>
                <h4 className="font-medium text-sm mb-3 p-2 bg-muted rounded text-center">
                  {day.label}
                </h4>
                <div className="space-y-2">
                  {schedules
                    .filter(s => s.days.includes(day.id))
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map(schedule => (
                      <div
                        key={`${schedule.id}-${day.id}`}
                        className="bg-senai-blue text-white text-xs p-2 rounded cursor-pointer hover:bg-senai-blue-dark transition-colors"
                        onClick={() => handleEdit(schedule)}
                      >
                        <div className="font-medium">{schedule.startTime}-{schedule.endTime}</div>
                        <div>{schedule.subject}</div>
                        <div className="text-blue-100">{schedule.room}</div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedules by View */}
      <div className="space-y-4">
        {Object.entries(getSchedulesByView()).map(([key, scheduleList]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {viewMode === 'professor' && <User className="h-5 w-5" />}
                {viewMode === 'room' && <MapPin className="h-5 w-5" />}
                <span>{key}</span>
                <Badge variant="secondary">{scheduleList.length} aulas</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {scheduleList.map(schedule => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h4 className="font-medium">{schedule.subject}</h4>
                        <div className="flex space-x-1">
                          {schedule.days.map(day => (
                            <Badge key={day} className={getDayColor(day)}>
                              {day.substring(0, 3)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {schedule.startTime} - {schedule.endTime}
                        </div>
                        {viewMode !== 'room' && (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {schedule.room}
                          </div>
                        )}
                        {viewMode !== 'professor' && (
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {schedule.teacher}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(schedule)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(schedule.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ScheduleManagement;
