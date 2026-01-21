// ============================================
// PÁGINA DE FACTURACIÓN
// ============================================

'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Invoice } from '@/types';
import { Badge, SectionHeader, EmptyState } from '@/components/ui';
import { DownloadInvoicePDF } from '@/components/invoice/InvoicePDF';
import { clinicConfig } from '@/data/mockData';
import {
    FileText, Search, Filter, Download, Send,
    Check, Clock, AlertTriangle, Eye, MoreVertical,
    ChevronDown
} from 'lucide-react';
import Link from 'next/link';

type FilterType = 'all' | 'pending' | 'paid' | 'overdue';

export function InvoicesPage() {
    const { invoices, patients, markInvoiceAsPaid, sendReminder } = useStore();
    const [filter, setFilter] = useState<FilterType>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    // Filtrar facturas
    const filteredInvoices = invoices.filter(invoice => {
        // Filtro por estado
        if (filter !== 'all' && invoice.status !== filter) return false;

        // Filtro por búsqueda
        if (searchTerm) {
            const patient = patients.find(p => p.id === invoice.patientId);
            const searchLower = searchTerm.toLowerCase();
            return (
                invoice.number.toLowerCase().includes(searchLower) ||
                patient?.name.toLowerCase().includes(searchLower) ||
                patient?.email.toLowerCase().includes(searchLower)
            );
        }

        return true;
    }).sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime());

    // Estadísticas
    const stats = {
        total: invoices.length,
        pending: invoices.filter(i => i.status === 'pending').length,
        paid: invoices.filter(i => i.status === 'paid').length,
        overdue: invoices.filter(i => i.status === 'overdue').length,
        pendingAmount: invoices
            .filter(i => i.status === 'pending' || i.status === 'overdue')
            .reduce((sum, i) => sum + i.total, 0),
    };

    const getStatusBadge = (status: Invoice['status']) => {
        const variants: Record<string, { variant: 'success' | 'warning' | 'danger' | 'gray'; label: string; icon: React.ReactNode }> = {
            paid: { variant: 'success', label: 'Pagada', icon: <Check className="w-3 h-3" /> },
            pending: { variant: 'warning', label: 'Pendiente', icon: <Clock className="w-3 h-3" /> },
            overdue: { variant: 'danger', label: 'Vencida', icon: <AlertTriangle className="w-3 h-3" /> },
            cancelled: { variant: 'gray', label: 'Cancelada', icon: null },
        };
        const { variant, label, icon } = variants[status];
        return (
            <Badge variant={variant}>
                <span className="flex items-center gap-1">
                    {icon}
                    {label}
                </span>
            </Badge>
        );
    };

    return (
        <div className="space-y-8 md:space-y-10">
            {/* Header - improved layout with better responsive */}
            <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                <div className="space-y-1 min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Facturación</h1>
                    <p className="text-sm md:text-base text-gray-500">
                        {stats.total} facturas • <span className="text-yellow-600 font-medium">{stats.pendingAmount.toLocaleString('es-ES')}€ pendientes</span>
                    </p>
                </div>
                <Link href="/invoices/new" className="btn-invoice flex-shrink-0">
                    <FileText className="w-4 h-4" />
                    Nueva Factura
                </Link>
            </section>

            {/* Stats Cards - with subtle divider effect */}
            <section className="relative">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                    <button
                        onClick={() => setFilter('all')}
                        className={`card p-4 sm:p-5 text-left transition-all hover:shadow-lg ${filter === 'all' ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''}`}
                    >
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Total</p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold">{stats.total}</p>
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`card p-4 sm:p-5 text-left transition-all hover:shadow-lg ${filter === 'pending' ? 'ring-2 ring-yellow-500 bg-yellow-50/50' : ''}`}
                    >
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Pendientes</p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-600">{stats.pending}</p>
                    </button>
                    <button
                        onClick={() => setFilter('overdue')}
                        className={`card p-4 sm:p-5 text-left transition-all hover:shadow-lg ${filter === 'overdue' ? 'ring-2 ring-red-500 bg-red-50/50' : ''}`}
                    >
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Vencidas</p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600">{stats.overdue}</p>
                    </button>
                    <button
                        onClick={() => setFilter('paid')}
                        className={`card p-4 sm:p-5 text-left transition-all hover:shadow-lg ${filter === 'paid' ? 'ring-2 ring-green-500 bg-green-50/50' : ''}`}
                    >
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Pagadas</p>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">{stats.paid}</p>
                    </button>
                </div>
            </section>

            {/* Filters - with better mobile layout */}
            <section className="card p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por número, paciente o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input pl-10 w-full"
                        />
                    </div>

                    {/* Actions row */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {/* Filter dropdown */}
                        <button className="btn btn-ghost flex items-center gap-2 text-sm">
                            <Filter className="w-4 h-4" />
                            <span className="hidden xs:inline">Filtros</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        {/* Actions */}
                        <button className="btn btn-ghost text-sm">
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Exportar</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Table Section */}
            <section className="card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {filteredInvoices.length > 0 ? (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Factura</th>
                                    <th>Paciente</th>
                                    <th>Fecha</th>
                                    <th>Importe</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map(invoice => {
                                    const patient = patients.find(p => p.id === invoice.patientId);
                                    const daysSinceIssue = Math.floor(
                                        (new Date().getTime() - invoice.issueDate.getTime()) / (1000 * 60 * 60 * 24)
                                    );

                                    return (
                                        <tr key={invoice.id}>
                                            <td>
                                                <div className="font-medium text-gray-900">{invoice.number}</div>
                                                <div className="text-xs text-gray-500">
                                                    {invoice.items.length} item{invoice.items.length > 1 ? 's' : ''}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="font-medium">{patient?.name}</div>
                                                <div className="text-xs text-gray-500">{patient?.email}</div>
                                            </td>
                                            <td>
                                                <div>{invoice.issueDate.toLocaleDateString('es-ES')}</div>
                                                <div className="text-xs text-gray-500">
                                                    {invoice.status !== 'paid' && `hace ${daysSinceIssue} días`}
                                                    {invoice.status === 'paid' && invoice.paidDate &&
                                                        `Cobrada ${invoice.paidDate.toLocaleDateString('es-ES')}`
                                                    }
                                                </div>
                                            </td>
                                            <td>
                                                <div className="font-semibold text-lg">
                                                    {invoice.total.toLocaleString('es-ES')}€
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    +{invoice.vatAmount.toFixed(2)}€ IVA
                                                </div>
                                            </td>
                                            <td>{getStatusBadge(invoice.status)}</td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    {patient && (
                                                        <DownloadInvoicePDF
                                                            invoice={invoice}
                                                            patient={patient}
                                                            clinic={clinicConfig}
                                                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                        >
                                                            <Download className="w-4 h-4 text-gray-600" />
                                                        </DownloadInvoicePDF>
                                                    )}

                                                    {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                                                        <>
                                                            <button
                                                                onClick={() => sendReminder(invoice.id)}
                                                                className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-600 transition-colors"
                                                                title="Enviar recordatorio"
                                                            >
                                                                <Send className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => markInvoiceAsPaid(invoice.id, 'Efectivo')}
                                                                className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                                                                title="Marcar como pagada"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}

                                                    <button
                                                        onClick={() => setSelectedInvoice(invoice)}
                                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState
                        icon={<FileText className="w-12 h-12 text-gray-300" />}
                        title="No hay facturas"
                        description={searchTerm ? 'No se encontraron facturas con esos criterios' : 'Aún no has creado ninguna factura'}
                        action={
                            <Link href="/invoices/new" className="btn btn-primary">
                                Crear primera factura
                            </Link>
                        }
                    />
                )}
            </section>

            {/* Modal de detalle */}
            {selectedInvoice && (
                <div className="modal-overlay" onClick={() => setSelectedInvoice(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="text-lg font-semibold">Factura {selectedInvoice.number}</h3>
                            <button
                                onClick={() => setSelectedInvoice(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Estado</span>
                                    {getStatusBadge(selectedInvoice.status)}
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Fecha emisión</span>
                                    <span className="font-medium">
                                        {selectedInvoice.issueDate.toLocaleDateString('es-ES')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Vencimiento</span>
                                    <span className="font-medium">
                                        {selectedInvoice.dueDate.toLocaleDateString('es-ES')}
                                    </span>
                                </div>
                                <hr />
                                {selectedInvoice.items.map((item, i) => (
                                    <div key={i} className="flex justify-between">
                                        <span>{item.description}</span>
                                        <span className="font-medium">{item.total}€</span>
                                    </div>
                                ))}
                                <hr />
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{selectedInvoice.subtotal.toFixed(2)}€</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>IVA ({selectedInvoice.vatRate}%)</span>
                                    <span>{selectedInvoice.vatAmount.toFixed(2)}€</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>{selectedInvoice.total}€</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {patients.find(p => p.id === selectedInvoice.patientId) && (
                                <DownloadInvoicePDF
                                    invoice={selectedInvoice}
                                    patient={patients.find(p => p.id === selectedInvoice.patientId)!}
                                    clinic={clinicConfig}
                                    className="btn btn-primary"
                                >
                                    <Download className="w-4 h-4" />
                                    Descargar PDF
                                </DownloadInvoicePDF>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
