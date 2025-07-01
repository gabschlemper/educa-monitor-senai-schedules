import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Edit, Trash2, Clock, MapPin, User, AlertTriangle, Loader2 } from "lucide-react";
import { useSchedules, type Schedule } from "@/hooks/useSchedules";
import { useRooms } from "@/hooks/useRooms";
import { useSubjects } from "@/hooks/useSubjects";
import { useTeachers } from "@/hooks/useTeachers";
import { useClasses } from "@/hooks/useClasses";

const ScheduleManagement = () => {
  const { schedules, loading: schedulesLoading, createSchedule, updateSchedule, deleteSchedule } = useSchedules();
  const { rooms, loading: roomsLoading } = useRooms();
  const { subjects, loading: subjectsLoading } = useSubjects();
  const { teachers, loading: teachersLoading } = useTeachers();
  const { classes, loading: classesLoading } = useClasses();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [viewMode, setViewMode] = useState<'professor' | 'room' | 'class' | 'subject'>('professor');
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    subjectId: '',
    teacherId: '',
    roomId: '',
    classId: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const timeSlots = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'
  ];

  const validateSchedule = (data: typeof formData) => {
    const errors = [];
    
    if (!data.date) errors.push('Defina a data');
    if (!data.startTime) errors.push('Defina o horário de início');
    if (!data.endTime) errors.push('Defina o horário de fim');
    if (!data.subjectId) errors.push('Selecione a disciplina');
    if (!data.teacherId) errors.push('Selecione o professor');
    if (!data.roomId) errors.push('Selecione a sala');
    if (!data.classId) errors.push('Selecione a turma');

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

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateSchedule(formData);
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const scheduleData = {
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        fk_disciplina: parseInt(formData.subjectId),
        fk_professores: parseInt(formData.teacherId),
        fk_salas: parseInt(formData.roomId),
        fk_turmas: parseInt(formData.classId)
      };

      if (editingSchedule) {
        await updateSchedule(editingSchedule.id_horario_escolar, scheduleData);
      } else {
        await createSchedule(scheduleData);
      }

      setIsDialogOpen(false);
      setEditingSchedule(null);
      resetForm();
    } catch (error) {
      console.error('Error submitting schedule:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      date: '',
      startTime: '',
      endTime: '',
      subjectId: '',
      teacherId: '',
      roomId: '',
      classId: ''
    });
    setError('');
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      date: schedule.data,
      startTime: schedule.hora_inicio,
      endTime: schedule.hora_termino,
      subjectId: schedule.fk_disciplina.toString(),
      teacherId: schedule.fk_professores.toString(),
      roomId: schedule.fk_salas.toString(),
      classId: schedule.fk_turmas.toString()
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (scheduleId: number) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      await deleteSchedule(scheduleId);
    }
  };

  const getSchedulesByView = () => {
    const grouped: Record<string, Schedule[]> = {};
    
    schedules.forEach(schedule => {
      let key = '';
      switch (viewMode) {
        case 'professor':
          key = schedule.professor_nome;
          break;
        case 'room':
          key = schedule.sala_nome;
          break;
        case 'class':
          key = schedule.turma_nome;
          break;
        case 'subject':
          key = schedule.disciplina;
          break;
      }
      
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(schedule);
    });
    
    return grouped;
  };

  const isLoading = schedulesLoading || roomsLoading || subjectsLoading || teachersLoading || classesLoading;

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? 'Editar Agendamento' : 'Novo Agendamento'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações para agendar uma aula
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date */}
              <div>
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
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

              {/* Subject, Teacher */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject">Disciplina *</Label>
                  <Select value={formData.subjectId} onValueChange={(value) => setFormData({...formData, subjectId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject.id_disciplina} value={subject.id_disciplina.toString()}>
                          {subject.disciplina}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="teacher">Professor *</Label>
                  <Select value={formData.teacherId} onValueChange={(value) => setFormData({...formData, teacherId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map(teacher => (
                        <SelectItem key={teacher.id_professor} value={teacher.id_professor.toString()}>
                          {teacher.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Room, Class */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="room">Sala *</Label>
                  <Select value={formData.roomId} onValueChange={(value) => setFormData({...formData, roomId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map(room => (
                        <SelectItem key={room.id_sala} value={room.id_sala.toString()}>
                          {room.nome_sala}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="class">Turma *</Label>
                  <Select value={formData.classId} onValueChange={(value) => setFormData({...formData, classId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls.id_turma} value={cls.id_turma.toString()}>
                          {cls.agrupamento}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-senai-blue hover:bg-senai-blue-dark" disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
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

      {/* Schedule List */}
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
                  <div key={schedule.id_horario_escolar} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h4 className="font-medium">{schedule.disciplina}</h4>
                        <Badge variant="outline">
                          {new Date(schedule.data).toLocaleDateString('pt-BR')}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {schedule.hora_inicio} - {schedule.hora_termino}
                        </div>
                        {viewMode !== 'room' && (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {schedule.sala_nome}
                          </div>
                        )}
                        {viewMode !== 'professor' && (
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {schedule.professor_nome}
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
                        onClick={() => handleDelete(schedule.id_horario_escolar)}
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