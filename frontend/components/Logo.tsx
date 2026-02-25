import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
    return (
        <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                <Image
                    src="/logo_rfa.svg"       // Ruta relativa a la carpeta 'public'
                    alt="Logo de GobID"
                    width={32}            // Ajusta el ancho según necesites
                    height={32}           // Ajusta el alto según necesites
                    priority              // Carga el logo inmediatamente (recomendado para Navbars)
                    className="w-auto h-8" // Clases opcionales para control extra
                />
                <div>
                    <h1 className="font-bold text-gray-800 text-lg leading-none">GobID</h1>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">
                        Plataforma de verificación de identidad
                    </p>
                </div>
            </Link>
        </div>
    );
}