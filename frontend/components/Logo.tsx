import React from 'react';
import Image from 'next/image';

export default function Logo({ invert = false }: { invert?: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
                <Image
                    src="/logo_rfa.svg"
                    alt="Logo de GobID"
                    width={50}
                    height={50}
                    priority
                    className={`w-auto h-12 transition-all duration-500 ${invert ? '' : 'brightness-100 invert'}`}
                />
                <div>
                    <h1 className={`font-bold text-lg leading-none transition-colors duration-500 ${invert ? 'text-white' : 'text-slate-800'}`}>
                        GobID
                    </h1>
                    <p className={`text-[10px] sm:text-xs mt-1 font-medium uppercase tracking-wider transition-colors duration-500 ${invert ? 'text-white' : 'text-slate-800'}`}>
                        Verificación de identidad
                    </p>
                </div>
            </div>
        </div>
    );
}