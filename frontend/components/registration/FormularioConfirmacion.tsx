'use client'
import { useState } from 'react';
import { Mail, User, Fingerprint, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

interface FormularioConfirmacionProps {
  // Datos extraídos previamente por tu OCR
  extractedData: {
    fullName: string;
    curp: string;
    fecha_nacimiento: string;
  };
  isLoading: boolean;
  // Función que se ejecutará al hacer clic en guardar
  onSubmit: (email: string) => void;
}

export default function FormularioConfirmacion({ extractedData, isLoading, onSubmit }: FormularioConfirmacionProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación súper rápida del formato del correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    setEmailError('');
    onSubmit(email);
  };

  return (
    <div className="bg-background p-6 rounded-xl shadow-sm border border-border h-full flex flex-col">
      <div className="mb-6 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="text-primary" size={24} />
        </div>
        <h2 className="text-xl font-semibold text-foreground">¡Casi listo!</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Confirma que tus datos sean correctos e ingresa tu correo para finalizar.
        </p>
      </div>

      {/* Tarjeta resumen de datos extraídos (Solo lectura) */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-4 mb-6 border border-border/50">
        <div className="flex items-start gap-3">
          <User className="text-muted-foreground mt-0.5" size={18} />
          <div>
            <p className="text-xs text-muted-foreground font-medium">Nombre Completo</p>
            <p className="text-sm font-semibold text-foreground">{extractedData.fullName}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Fingerprint className="text-muted-foreground mt-0.5" size={18} />
          <div>
            <p className="text-xs text-muted-foreground font-medium">CURP</p>
            <p className="text-sm font-semibold text-foreground">{extractedData.curp}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          {/* Cambiamos MapPin por Calendar para que sea acorde a una fecha */}
          <Calendar className="text-muted-foreground mt-0.5" size={18} />
          <div>
            <p className="text-xs text-muted-foreground font-medium">Fecha de Nacimiento</p>
            <p className="text-sm font-semibold text-foreground">
              {extractedData.fecha_nacimiento || "No detectada"}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario para el Email */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
            <Mail size={16} />
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            disabled={isLoading}
            className={`w-full p-3 rounded-lg border bg-background text-foreground text-sm outline-none transition-all focus:ring-2 focus:ring-primary/50 disabled:opacity-50 ${emailError ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
              }`}
          />
          {emailError && (
            <p className="text-xs text-destructive mt-1">{emailError}</p>
          )}
        </div>

        {/* Botón Final */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium transition-all hover:opacity-90 shadow-lg shadow-primary/20 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="animate-pulse">Creando cuenta...</span>
            ) : (
              <>
                Crear Mi Cuenta <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
