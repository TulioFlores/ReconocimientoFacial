import React from 'react';

export const DocumentPreview = () => {
  return (
    <div className="relative bg-white rounded-lg shadow-2xl p-8 w-full max-w-md aspect-[3/4] border border-gray-100">
      {/* Header del documento */}
      <div className="flex justify-between items-start mb-12">
        <div className="space-y-2">
          <div className="w-12 h-12 bg-blue-600 rounded-sm" />
          <div className="w-32 h-3 bg-gray-200 rounded-full" />
          <div className="w-24 h-2 bg-gray-100 rounded-full" />
        </div>
        
        {/* Sello de Firma Digital */}
        <div className="absolute -right-4 top-10 transform rotate-12">
           <div className="bg-blue-600 text-white p-4 rounded-full w-24 h-24 flex items-center justify-center text-[10px] font-bold text-center border-4 border-white shadow-lg leading-tight uppercase">
             Digitally<br/>Signed
           </div>
        </div>
      </div>

      {/* Cuerpo del documento (Skeleton) */}
      <div className="space-y-6">
        <div className="w-full h-4 bg-slate-800 rounded-full" />
        <div className="w-2/3 h-3 bg-gray-200 rounded-full" />
        
        <div className="space-y-3 pt-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-2 bg-gray-100 rounded-full ${i % 2 === 0 ? 'w-full' : 'w-5/6'}`} />
          ))}
        </div>

        <div className="pt-10 space-y-2">
           <div className="w-24 h-3 bg-gray-200 rounded-full" />
           <div className="w-40 h-1 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
};