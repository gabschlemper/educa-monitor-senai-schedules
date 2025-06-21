
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'administrador' | 'professor' | 'aluno';
  allowedUserTypes?: ('administrador' | 'professor' | 'aluno')[];
}

const ProtectedRoute = ({ 
  children, 
  requiredUserType, 
  allowedUserTypes = [] 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (!user) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Você precisa estar logado para acessar esta página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Check specific user type requirement
  if (requiredUserType && user.userType !== requiredUserType) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Você não tem permissão para acessar esta página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Check allowed user types
  if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(user.userType)) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Você não tem permissão para acessar esta página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
