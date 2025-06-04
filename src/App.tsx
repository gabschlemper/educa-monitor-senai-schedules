
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "@/components/LoginPage";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AdminDashboard from "@/components/AdminDashboard";
import TeacherDashboard from "@/components/TeacherDashboard";
import StudentDashboard from "@/components/StudentDashboard";
import UserManagement from "@/components/UserManagement";
import RoomManagement from "@/components/RoomManagement";
import ScheduleManagement from "@/components/ScheduleManagement";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<{ type: 'admin' | 'professor' | 'aluno'; name: string } | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = (userType: 'admin' | 'professor' | 'aluno') => {
    const userNames = {
      admin: 'João Administrador',
      professor: 'Prof. João Silva', 
      aluno: 'Maria Santos'
    };
    
    setUser({ type: userType, name: userNames[userType] });
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
  };

  const renderCurrentPage = () => {
    if (!user) return null;

    switch (currentPage) {
      case 'dashboard':
        if (user.type === 'admin') return <AdminDashboard />;
        if (user.type === 'professor') return <TeacherDashboard />;
        if (user.type === 'aluno') return <StudentDashboard />;
        break;
      case 'users':
        return user.type === 'admin' ? <UserManagement /> : <AdminDashboard />;
      case 'rooms':
        return user.type === 'admin' ? <RoomManagement /> : <AdminDashboard />;
      case 'schedules':
        return user.type === 'admin' ? <ScheduleManagement /> : <AdminDashboard />;
      case 'my-schedules':
        return user.type === 'professor' ? <TeacherDashboard /> : <StudentDashboard />;
      case 'my-classes':
        return <TeacherDashboard />;
      case 'subjects':
      case 'classes':
      case 'notifications':
      case 'settings':
      default:
        if (user.type === 'admin') return <AdminDashboard />;
        if (user.type === 'professor') return <TeacherDashboard />;
        if (user.type === 'aluno') return <StudentDashboard />;
    }
  };

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LoginPage onLogin={handleLogin} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="flex h-screen bg-gray-50">
          <Sidebar 
            userType={user.type}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onLogout={handleLogout}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header userType={user.type} userName={user.name} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              {renderCurrentPage()}
            </main>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
