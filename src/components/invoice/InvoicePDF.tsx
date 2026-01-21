// ============================================
// WRAPPER DINÁMICO PARA PDF (Client-side only)
// ============================================

'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Invoice, Patient, ClinicConfig } from '@/types';
import { Download } from 'lucide-react';

// Importación dinámica del componente PDF (solo cliente)
const InvoicePDFContent = dynamic(
    () => import('./InvoicePDFContent').then(mod => ({ default: mod.DownloadInvoicePDFButton })),
    {
        ssr: false,
        loading: () => (
            <button className="btn btn-primary opacity-50" disabled>
                <Download className="w-4 h-4 animate-pulse" />
                Cargando...
            </button>
        )
    }
);

interface DownloadInvoicePDFProps {
    invoice: Invoice;
    patient: Patient;
    clinic: ClinicConfig;
    className?: string;
    children?: React.ReactNode;
}

export function DownloadInvoicePDF(props: DownloadInvoicePDFProps) {
    return <InvoicePDFContent {...props} />;
}
