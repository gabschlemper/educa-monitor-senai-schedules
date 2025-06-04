
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  BookOpen, 
  MapPin, 
  Calendar, 
  GraduationCap,
  Bell,
  LogOut,
  Settings
} from "lucide-react";

interface SidebarProps {
  userType: 'admin' | 'professor' | 'aluno';
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

const Sidebar = ({ userType, currentPage, onPageChange, onLogout }: SidebarProps) => {
  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'notifications', label: 'Notificações', icon: Bell },
    ];

    if (userType === 'admin') {
      return [
        ...commonItems,
        { id: 'users', label: 'Usuários', icon: Users },
        { id: 'subjects', label: 'Disciplinas', icon: BookOpen },
        { id: 'rooms', label: 'Salas', icon: MapPin },
        { id: 'schedules', label: 'Horários', icon: Calendar },
        { id: 'classes', label: 'Turmas', icon: GraduationCap },
      ];
    } else if (userType === 'professor') {
      return [
        ...commonItems,
        { id: 'my-schedules', label: 'Meus Horários', icon: Calendar },
        { id: 'my-classes', label: 'Minhas Turmas', icon: GraduationCap },
      ];
    } else {
      return [
        ...commonItems,
        { id: 'my-schedules', label: 'Meus Horários', icon: Calendar },
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-white border-r border-border h-screen flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-senai-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-senai-blue">Educa Monitor</h1>
            <p className="text-xs text-muted-foreground">SENAI</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                currentPage === item.id 
                  ? "bg-senai-blue text-white hover:bg-senai-blue-dark" 
                  : "hover:bg-muted"
              }`}
              onClick={() => onPageChange(item.id)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </nav>

      {/* User Actions */}
      <div className="p-4 border-t border-border">
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" onClick={() => onPageChange('settings')}>
            <Settings className="mr-3 h-4 w-4" />
            Configurações
          </Button>
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" onClick={onLogout}>
            <LogOut className="mr-3 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
