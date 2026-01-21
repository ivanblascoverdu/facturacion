// ============================================
// PÁGINA DE CITAS/AGENDA
// ============================================

'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { SectionHeader, Badge, EmptyState } from '@/components/ui';
import {
    Calendar, Plus, Clock, User, CheckCircle,
    XCircle, AlertCircle, FileText
} from 'lucide-react';
import Link from 'next/link';

export default function AppointmentsPage() {
    const {
        appointments,
        patients,
        professionals,
        services,
        completeAppointment,
        updateAppointmentStatus
    } = useStore();

    const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'no-show'>('all');

    const getEnrichedAppointments = () => {
        return appointments.map(apt => ({
            ...apt,
            patient: patients.find(p => p.id === apt.patientId),
            professional: professionals.find(p => p.id === apt.professionalId),
            service: services.find(s => s.id === apt.serviceId),
        }));
    };

    const enrichedAppointments = getEnrichedAppointments()
        .filter(apt => filter === 'all' || apt.status === filter)
        .sort((a, b) => b.date.getTime() - a.date.getTime());

    const stats = {
        total: appointments.length,
        scheduled: appointments.filter(a => a.status === 'scheduled').length,
        completed: appointments.filter(a => a.status === 'completed').length,
        noShow: appointments.filter(a => a.status === 'no-show').length,
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: 'success' | 'warning' | 'danger' | 'primary'; label: string; icon: React.ReactNode }> = {
            scheduled: { variant: 'primary', label: 'Programada', icon: <Clock className="w-3 h-3" /> },
            completed: { variant: 'success', label: 'Completada', icon: <CheckCircle className="w-3 h-3" /> },
            'no-show': { variant: 'danger', label: 'No-show', icon: <XCircle className="w-3 h-3" /> },
            cancelled: { variant: 'warning', label: 'Cancelada', icon: <AlertCircle className="w-3 h-3" /> },
        };
        const { variant, label, icon } = variants[status] || variants.scheduled;
        return (
            <Badge variant={variant}>
                <span className="flex items-center gap-1">{icon}{label}</span>
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            <SectionHeader
                title="Agenda de Citas"
                subtitle={`${stats.scheduled} citas programadas`}
                action={
                    <button className="btn btn-primary">
                        <Plus className="w-5 h-5" />
                        Nueva Cita
                    </button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                    onClick={() => setFilter('all')}
                    className={`card p-4 text-left ${filter === 'all' ? 'ring-2 ring-blue-500' : ''}`}
                >
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                </button>
                <button
                    onClick={() => setFilter('scheduled')}
                    className={`card p-4 text-left ${filter === 'scheduled' ? 'ring-2 ring-blue-500' : ''}`}
                >
                    <p className="text-sm text-gray-500">Programadas</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
                </button>
                <button
                    onClick={() => setFilter('completed')}
                    className={`card p-4 text-left ${filter === 'completed' ? 'ring-2 ring-green-500' : ''}`}
                >
                    <p className="text-sm text-gray-500">Completadas</p>
                    <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </button>
                <button
                    onClick={() => setFilter('no-show')}
                    className={`card p-4 text-left ${filter === 'no-show' ? 'ring-2 ring-red-500' : ''}`}
                >
                    <p className="text-sm text-gray-500">No-shows</p>
                    <p className="text-2xl font-bold text-red-600">{stats.noShow}</p>
                </button>
            </div>

            {/* Appointments list */}
            <div className="card overflow-hidden">
                {enrichedAppointments.length > 0 ? (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha/Hora</th>
                                    <th>Paciente</th>
                                    <th>Servicio</th>
                                    <th>Profesional</th>
                                    <th>Precio</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrichedAppointments.map(apt => (
                                    <tr key={apt.id}>
                                        <td>
                                            <div className="font-medium">{apt.date.toLocaleDateString('es-ES')}</div>
                                            <div className="text-sm text-gray-500">{apt.startTime} - {apt.endTime}</div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-gray-500" />
                                                </div>
                                                <span className="font-medium">{apt.patient?.name}</span>
                                            </div>
                                        </td>
                                        <td>{apt.service?.name}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: apt.professional?.color }}
                                                />
                                                {apt.professional?.name}
                                            </div>
                                        </td>
                                        <td className="font-semibold">{apt.price}€</td>
                                        <td>{getStatusBadge(apt.status)}</td>
                                        <td>
                                            {apt.status === 'scheduled' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => completeAppointment(apt.id)}
                                                        className="btn btn-success text-xs py-1 px-3"
                                                        title="Completar y facturar"
                                                    >
                                                        <FileText className="w-3 h-3" />
                                                        Facturar
                                                    </button>
                                                    <button
                                                        onClick={() => updateAppointmentStatus(apt.id, 'no-show')}
                                                        className="btn btn-ghost text-xs py-1 px-3 text-red-600"
                                                    >
                                                        No-show
                                                    </button>
                                                </div>
                                            )}
                                            {apt.status === 'completed' && apt.invoiceId && (
                                                <Link
                                                    href={`/invoices?id=${apt.invoiceId}`}
                                                    className="text-sm text-blue-600 hover:underline"
                                                >
                                                    Ver factura
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState
                        icon={<Calendar className="w-12 h-12 text-gray-300" />}
                        title="No hay citas"
                        description="No hay citas que mostrar con los filtros actuales"
                        action={
                            <button className="btn btn-primary">
                                <Plus className="w-4 h-4" />
                                Nueva Cita
                            </button>
                        }
                    />
                )}
            </div>
        </div>
    );
}
