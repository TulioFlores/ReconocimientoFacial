import { CheckCircle2, Video } from 'lucide-react';

export default function InstructionPanel() {
  const instructions = [
    "Remove glasses",
    "Look straight ahead",
    "Ensure good lighting"
  ];

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Panel de Instrucciones */}
      <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
        <h2 className="text-foreground font-semibold mb-4">Instructions</h2>
        
        <div className="space-y-3">
          {instructions.map((item, index) => (
            <div key={index} className="flex items-center gap-3 bg-muted/30 p-3 rounded-lg border border-border/50">
              <CheckCircle2 size={20} className="text-primary" />
              <span className="text-foreground text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Caja de Estado */}
      <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl flex items-start gap-4">
        <div className="bg-primary/10 p-2 rounded-lg text-primary mt-1">
            <Video size={20} />
        </div>
        <div>
            <h3 className="text-primary font-semibold text-sm">Status</h3>
            <p className="text-primary/80 text-sm mt-1">Face detected - Ready to proceed</p>
        </div>
      </div>
    </div>
  );
}