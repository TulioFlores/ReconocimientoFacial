import { Camera, ScanFace } from 'lucide-react';

export default function CameraZone() {
  return (
    <div className="bg-background p-4 rounded-xl shadow-sm border border-border h-full">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-foreground font-semibold">Live Camera Zone</h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
          </span>
          <span className="text-xs font-medium text-destructive">Live Feed</span>
        </div>
      </div>

      {/* Simulación del Video Feed */}
      {/* Usamos bg-muted o foreground/5 para simular el área oscura de la cámara */}
      <div className="relative bg-muted/50 rounded-lg h-80 flex items-center justify-center overflow-hidden">
        
        {/* Círculo Guía (El aro de escaneo) */}
        <div className="absolute w-48 h-48 border-4 border-primary rounded-full opacity-80 shadow-[0_0_20px_var(--primary)] z-10"></div>
        
        {/* Icono central simulando al usuario */}
        <div className="text-muted-foreground bg-muted p-6 rounded-full opacity-50">
           <Camera size={48} />
        </div>

        {/* Texto de overlay */}
        <div className="absolute top-1/2 mt-12 text-center z-20">
            <p className="text-muted-foreground text-xs mt-8">Camera Preview</p>
            <p className="text-muted-foreground/60 text-[10px]">(Demo Mode)</p>
        </div>
        
        {/* Efecto de escaneo */}
        <div className="absolute w-full h-1 bg-primary/30 top-10 animate-scan"></div>
      </div>
    </div>
  );
}