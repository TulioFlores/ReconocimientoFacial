'use client'
import { ShieldCheck, User } from 'lucide-react';
import { getCookie } from '@/utils/getCookie';
import {useState, useEffect} from 'react'
// 1. Definimos la estructura de los datos que vamos a recibir
interface UserProfileProps {
  user?: {
    full_name: string;
    curp: string;
    email: string;
    confidence?: number;
  };
}

// 2. Recibimos la prop "user"
export default function UserProfileCard({ user }: UserProfileProps) {
  const [confidence, setConfidence] = useState<string | null>(null);
  useEffect(() => {
    // 2. Buscamos la cookie SOLO cuando el componente se monta en el cliente
    const savedConfidence = getCookie('login_confidence');
    
    if (savedConfidence) {
      setConfidence(savedConfidence);
    }
  }, []); // El array vacío asegura que esto solo corra una vez
  // Si por alguna razón no llega el usuario, mostramos el mensaje de error
  if (!user) {
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
          <User className="w-12 h-12 text-muted-foreground" />
        </div>

        {/* 3. Inyectamos el Nombre */}
        <h2 className="text-xl font-bold text-foreground">{user.full_name}</h2>
        
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
          {/* 4. Inyectamos el CURP */}
          <p className="text-foreground font-medium font-mono text-sm">{user.curp}</p>
        </div>

        <div className="text-center">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Email</p>
          {/* 5. Inyectamos el Email */}
          <p className="text-foreground font-medium text-sm">{user.email}</p>
        </div>

        <div className="text-center">
          <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Confianza de Identidad</p>
          {/* 6. Inyectamos la confianza (o un valor por defecto alto si tu endpoint /me no lo devuelve) */}
          <p className="text-green-600 font-bold">
            {confidence}%
          </p>
        </div>
      </div>
    </div>
  );
}