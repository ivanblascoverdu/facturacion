// ============================================
// DASHBOARD - PÁGINA PRINCIPAL
// ============================================

'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import {
    KPICard, AlertBanner, Badge, SectionHeader, ProgressBar
} from '@/components/ui';
import { RevenueChart, ServiceChart, CashFlowChart } from '@/components/charts/Charts';
import {
    Euro, TrendingDown, Clock, Users,
    FileText, AlertTriangle, CheckCircle,
    ArrowRight, Send, Calendar
} from 'lucide-react';
import Link from 'next/link';

export function Dashboard() {
    const {
        getKPIs,
        alerts,
        generateAlerts,
        dismissAlert,
        invoices,
        appointments,
        patients,
    } = useStore();

    const kpis = getKPIs();

    useEffect(() => {
        generateAlerts();
    }, [generateAlerts]);

    // Facturas pendientes más recientes
    const pendingInvoices = invoices
        .filter(i => i.status === 'pending' || i.status === 'overdue')
        .slice(0, 5);

    // Próximas citas
    const upcomingAppointments = appointments
        .filter(a => a.status === 'scheduled')
        .slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Buenos días 👋
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Resumen de tu clínica • {new Date().toLocaleDateString('es-ES', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                        })}
                    </p>
                </div>

                {/* Action buttons - responsive layout */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0">
                    <Link href="/invoices/new" className="btn-invoice">
                        <FileText className="w-4 h-4" />
                        Generar Factura
                    </Link>
                    <Link href="/invoices?filter=pending" className="btn-collect">
                        <Send className="w-4 h-4" />
                        Cobrar Pendientes
                    </Link>
                </div>
            </div>

            {/* Alertas inteligentes */}
            {alerts.filter(a => !a.dismissed).length > 0 && (
                <div className="space-y-2">
                    {alerts.filter(a => !a.dismissed).map(alert => (
                        <AlertBanner
                            key={alert.id}
                            type={alert.type}
                            title={alert.title}
                            message={alert.message}
                            onDismiss={() => dismissAlert(alert.id)}
                            action={alert.actionLabel ? {
                                label: alert.actionLabel,
                                onClick: () => console.log('Navigate to', alert.action),
                            } : undefined}
                        />
                    ))}
                </div>
            )}

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Ingresos del Mes"
                    value={kpis.currentMonthIncome}
                    change={kpis.incomeChange}
                    changeLabel="vs mes anterior"
                    type="income"
                    icon={<Euro className="w-5 h-5 text-green-600" />}
                />

                <KPICard
                    title="Gastos del Mes"
                    value={kpis.currentMonthExpenses}
                    change={kpis.expensesChange}
                    changeLabel="vs mes anterior"
                    type="expense"
                    icon={<TrendingDown className="w-5 h-5 text-red-500" />}
                />

                <KPICard
                    title="Flujo de Caja"
                    value={kpis.cashFlow}
                    change={kpis.cashFlowChange}
                    changeLabel="vs mes anterior"
                    type="flow"
                    icon={<CheckCircle className="w-5 h-5 text-blue-500" />}
                    action={<CashFlowChart />}
                />

                <KPICard
                    title="Facturas Pendientes"
                    value={`${kpis.pendingInvoices} (${kpis.pendingInvoicesAmount.toLocaleString('es-ES')}€)`}
                    subtitle={`${kpis.averageDaysPending.toFixed(0)} días de media`}
                    type="pending"
                    icon={<Clock className="w-5 h-5 text-yellow-500" />}
                    action={
                        <Link href="/invoices?filter=pending" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
                            Ver pendientes <ArrowRight className="w-3 h-3" />
                        </Link>
                    }
                />
            </div>

            {/* Indicadores secundarios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* No-shows */}
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-500">Tasa No-Shows</span>
                        <Badge variant={kpis.noShowRate > 10 ? 'danger' : kpis.noShowRate > 8 ? 'warning' : 'success'}>
                            {kpis.noShowRate > 10 ? 'Alto' : kpis.noShowRate > 8 ? 'Medio' : 'OK'}
                        </Badge>
                    </div>
                    <div className="text-3xl font-bold mb-2">
                        {kpis.noShowRate.toFixed(1)}%
                    </div>
                    <ProgressBar
                        value={kpis.noShowRate}
                        max={20}
                        variant={kpis.noShowRate > 10 ? 'danger' : kpis.noShowRate > 8 ? 'warning' : 'success'}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Objetivo: {'<'}8% • Actual: {kpis.noShowRate.toFixed(1)}%
                    </p>
                </div>

                {/* Margen medio */}
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-500">Margen Operativo</span>
                        <Badge variant={kpis.averageMargin > 40 ? 'success' : kpis.averageMargin > 20 ? 'warning' : 'danger'}>
                            {kpis.averageMargin > 40 ? 'Bueno' : kpis.averageMargin > 20 ? 'Ajustado' : 'Bajo'}
                        </Badge>
                    </div>
                    <div className="text-3xl font-bold mb-2">
                        {kpis.averageMargin.toFixed(1)}%
                    </div>
                    <ProgressBar
                        value={kpis.averageMargin}
                        max={100}
                        variant={kpis.averageMargin > 40 ? 'success' : kpis.averageMargin > 20 ? 'warning' : 'danger'}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Ingresos - Gastos = {kpis.cashFlow.toLocaleString('es-ES')}€
                    </p>
                </div>

                {/* Pacientes activos */}
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-500">Pacientes Activos</span>
                        <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold mb-2">
                        {patients.length}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">
                            Valor medio: <span className="font-semibold text-gray-900">
                                {(patients.reduce((sum, p) => sum + p.totalSpent, 0) / patients.length).toFixed(0)}€
                            </span>
                        </span>
                    </div>
                    <Link href="/patients" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1 mt-2">
                        Ver pacientes <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>

            {/* Gráficos principales */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Ingresos vs Gastos */}
                <div className="lg:col-span-2 card p-6">
                    <SectionHeader
                        title="Ingresos vs Gastos"
                        subtitle="Últimos 6 meses"
                        action={
                            <select className="input !w-auto !py-2 !px-3 text-sm">
                                <option>Últimos 6 meses</option>
                                <option>Último año</option>
                                <option>Este año</option>
                            </select>
                        }
                    />
                    <RevenueChart type="line" />
                </div>

                {/* Servicios más rentables */}
                <div className="card p-6">
                    <SectionHeader
                        title="Por Servicio"
                        subtitle="Ingresos del mes"
                    />
                    <ServiceChart data={kpis.topServices} />
                </div>
            </div>

            {/* Tablas: Facturas pendientes y Próximas citas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Facturas pendientes */}
                <div className="card overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                        <SectionHeader
                            title="Facturas Pendientes"
                            subtitle={`${pendingInvoices.length} facturas por cobrar`}
                            action={
                                <Link href="/invoices?filter=pending" className="btn btn-ghost text-sm">
                                    Ver todas
                                </Link>
                            }
                        />
                    </div>

                    {pendingInvoices.length > 0 ? (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Factura</th>
                                        <th>Importe</th>
                                        <th>Días</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingInvoices.map(invoice => {
                                        const patient = patients.find(p => p.id === invoice.patientId);
                                        const daysPending = Math.floor(
                                            (new Date().getTime() - invoice.issueDate.getTime()) / (1000 * 60 * 60 * 24)
                                        );

                                        return (
                                            <tr key={invoice.id}>
                                                <td>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{invoice.number}</p>
                                                        <p className="text-xs text-gray-500">{patient?.name}</p>
                                                    </div>
                                                </td>
                                                <td className="font-semibold">{invoice.total}€</td>
                                                <td>
                                                    <span className={daysPending > 30 ? 'text-red-600 font-medium' : ''}>
                                                        {daysPending}d
                                                    </span>
                                                </td>
                                                <td>
                                                    <Badge variant={invoice.status === 'overdue' ? 'danger' : 'warning'}>
                                                        {invoice.status === 'overdue' ? 'Vencida' : 'Pendiente'}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                            <p>¡Todas las facturas cobradas!</p>
                        </div>
                    )}
                </div>

                {/* Próximas citas */}
                <div className="card overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                        <SectionHeader
                            title="Próximas Citas"
                            subtitle={`${upcomingAppointments.length} citas programadas`}
                            action={
                                <Link href="/appointments" className="btn btn-ghost text-sm">
                                    Ver agenda
                                </Link>
                            }
                        />
                    </div>

                    {upcomingAppointments.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {upcomingAppointments.map(apt => {
                                const patient = patients.find(p => p.id === apt.patientId);

                                return (
                                    <div key={apt.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{patient?.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {apt.date.toLocaleDateString('es-ES')} • {apt.startTime}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">{apt.price}€</p>
                                                <Badge variant="primary" size="sm">Confirmada</Badge>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No hay citas programadas</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Top servicios */}
            <div className="card p-6">
                <SectionHeader
                    title="Servicios Más Rentables"
                    subtitle="Este mes"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {kpis.topServices.slice(0, 5).map((service, index) => (
                        <div
                            key={service.name}
                            className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                            </div>
                            <p className="font-semibold text-gray-900 truncate">{service.name}</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">
                                {service.revenue.toLocaleString('es-ES')}€
                            </p>
                            <p className="text-sm text-gray-500">{service.count} sesiones</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
