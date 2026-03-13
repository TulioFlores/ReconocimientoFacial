'use client'
import { useEffect, useState } from 'react';
import { ShieldCheck, User } from 'lucide-react';
import { getUserCookie, UserData } from '../../utils/cookieUtils';

export default function UserProfileCard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Leer datos del usuario de la cookie
    const user = getUserCookie();
    setUserData(user);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-background rounded-xl shadow-sm border border-border overflow-hidden h-full">
        <div className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-background rounded-xl shadow-sm border border-border overflow-hidden h-full">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No hay sesión activa</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-xl shadow-sm border border-border overflow-hidden h-full">
      <div className="p-8 flex flex-col items-center">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-muted mb-4 shadow-sm bg-muted flex items-center justify-center">
          <User 
            className="w-12 h-12 text-muted-foreground"
          />
        </div>

        <h2 className="text-xl font-bold text-foreground">{userData.full_name}</h2>
        
        {/* Badge de Verificación */}
        <div className="mt-4 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium border border-primary/20 flex items-center gap-2">
          <ShieldCheck size={16} />
          Verificado biométricamente
        </div>
      </div>

      {/* Separador */}
      <div className="border-t border-border"></div>

      {/* Datos del usuario */}
      <div className="p-8 space-y-6">
        <div className="text-center">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">CURP</p>
          <p className="text-foreground font-medium font-mono text-sm">{userData.curp}</p>
        </div>

        <div className="text-center">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Email</p>
          <p className="text-foreground font-medium text-sm">{userData.email}</p>
        </div>

        <div className="text-center">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Confianza de Identidad</p>
          <p className="text-green-600 font-bold">{(userData.confidence * 100).toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
}