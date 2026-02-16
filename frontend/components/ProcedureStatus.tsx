import React from 'react';

interface DetailProps {
  label: string;
  value: string;
  isStatus?: boolean;
}

const DetailRow = ({ label, value, isStatus }: DetailProps) => (
  <div className="flex justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-gray-500 font-medium">{label}:</span>
    <div className="flex items-center gap-2">
      {isStatus && <div className="w-2 h-2 rounded-full bg-green-500" />}
      <span className={`${isStatus ? 'text-green-600 font-semibold' : 'text-gray-800 font-bold'}`}>
        {value}
      </span>
    </div>
  </div>
);

export const TransactionDetails = () => {
  return (
    <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
      <h3 className="text-gray-800 font-bold mb-4">Transaction Details</h3>
      <div className="space-y-1">
        <DetailRow label="Folio" value="#A-2025" />
        <DetailRow label="Date" value="January 2, 2026" />
        <DetailRow label="Validation" value="Biometric Match" isStatus />
      </div>
    </div>
  );
};