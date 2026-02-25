import React from 'react';

interface DetailProps {
  label: string;
  value: string;
  isStatus?: boolean;
}

const DetailRow = ({ label, value, isStatus }: DetailProps) => (
  <div className="flex justify-between py-3 border-b border-border last:border-0">
    <span className="text-muted-foreground font-medium">{label}:</span>
    <div className="flex items-center gap-2">
      {/* Indicador de estado */}
      {isStatus && <div className="w-2 h-2 rounded-full bg-primary" />}
      <span className={`${isStatus ? 'text-primary font-semibold' : 'text-foreground font-bold'}`}>
        {value}
      </span>
    </div>
  </div>
);

export const TransactionDetails = () => {
  return (
    <div className="bg-muted/20 rounded-xl p-6 border border-border">
      <h3 className="text-foreground font-bold mb-4">Transaction Details</h3>
      <div className="space-y-1">
        <DetailRow label="Folio" value="#A-2025" />
        <DetailRow label="Date" value="January 2, 2026" />
        <DetailRow label="Validation" value="Biometric Match" isStatus />
      </div>
    </div>
  );
};