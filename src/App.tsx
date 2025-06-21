
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AuthPage from "@/components/AuthPage";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AdminDashboard from "@/components/AdminDashboard";
import TeacherDashboard from "@/components/TeacherDashboard";
import StudentDashboard from "@/components/StudentDashboard";
import UserManagement from "@/components/UserManagement";
import RoomManagement from "@/components/RoomManagement";
import ScheduleManagement from "@/components/ScheduleManagement";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = React.useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-senai-blue rounded-xl flex items-center justify-center mb-4 mx-auto">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleLogout = async () => {
    const { signOut } = useAuth();
    await signOut();
    setCurrentPage('dashboard');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        if (user.userType === 'administrador') return <AdminDashboard />;
        if (user.userType === 'professor') return <TeacherDashboard />;
        if (user.userType === 'aluno') return <StudentDashboard />;
        break;
      case 'users':
        return user.userType === 'administrador' ? <UserManagement /> : <AdminDashboard />;
      case 'rooms':
        return user.userType === 'administrador' ? <RoomManagement /> : <AdminDashboard />;
      case 'schedules':
        return user.userType === 'administrador' ? <ScheduleManagement /> : <AdminDashboard />;
      case 'my-schedules':
        return user.userType === 'professor' ? <TeacherDashboard /> : <StudentDashboard />;
      case 'my-classes':
        return <TeacherDashboard />;
      case 'subjects':
      case 'classes':
      case 'notifications':
      case 'settings':
      default:
        if (user.userType === 'administrador') return <AdminDashboard />;
        if (user.userType === 'professor') return <TeacherDashboard />;
        if (user.userType === 'aluno') return <StudentDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        userType={user.userType === 'administrador' ? 'admin' : user.userType}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          userType={user.userType === 'administrador' ? 'admin' : user.userType} 
          userName={user.userData.nome} 
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
