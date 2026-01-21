// ============================================
// PÁGINA DE ANÁLISIS FINANCIERO
// ============================================

'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { SectionHeader, KPICard, ProgressBar } from '@/components/ui';
import { RevenueChart, ServiceChart } from '@/components/charts/Charts';
import {
    TrendingUp, TrendingDown, DollarSign, PieChart,
    Users, Calendar, Clock, Target, ArrowUp, ArrowDown
} from 'lucide-react';

export default function AnalyticsPage() {
    const { getKPIs, invoices, expenses, patients, appointments } = useStore();
    const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');

    const kpis = getKPIs();

    // Análisis de gastos por categoría
    const expensesByCategory = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {} as Record<string, number>);

    const totalExpenses = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);

    // Análisis de profesionales
    const professionalStats = appointments.reduce((acc, apt) => {
        if (!acc[apt.professionalId]) {
            acc[apt.professionalId] = { revenue: 0, appointments: 0, noShows: 0 };
        }
        acc[apt.professionalId].appointments++;
        if (apt.status === 'completed') {
            acc[apt.professionalId].revenue += apt.price;
        }
        if (apt.status === 'no-show') {
            acc[apt.professionalId].noShows++;
        }
        return acc;
    }, {} as Record<string, { revenue: number; appointments: number; noShows: number }>);

    // Métricas clave
    const metrics = {
        avgInvoiceValue: invoices.length > 0
            ? invoices.reduce((sum, i) => sum + i.total, 0) / invoices.length
            : 0,
        collectionRate: invoices.length > 0
            ? (invoices.filter(i => i.status === 'paid').length / invoices.length) * 100
            : 0,
        avgDaysToPayment: invoices.filter(i => i.paidDate).length > 0
            ? invoices.filter(i => i.paidDate).reduce((sum, i) => {
                const days = Math.floor((i.paidDate!.getTime() - i.issueDate.getTime()) / (1000 * 60 * 60 * 24));
                return sum + days;
            }, 0) / invoices.filter(i => i.paidDate).length
            : 0,
        patientLTV: patients.length > 0
            ? patients.reduce((sum, p) => sum + p.totalSpent, 0) / patients.length
            : 0,
    };

    return (
        <div className="space-y-6">
            <SectionHeader
                title="Análisis Financiero"
                subtitle="Visión completa del rendimiento de tu clínica"
                action={
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as 'month' | 'quarter' | 'year')}
                        className="input !w-auto"
                    >
                        <option value="month">Este mes</option>
                        <option value="quarter">Este trimestre</option>
                        <option value="year">Este año</option>
                    </select>
                }
            />

            {/* KPIs principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                    title="Ingresos Totales"
                    value={kpis.currentMonthIncome}
                    change={kpis.incomeChange}
                    changeLabel="vs anterior"
                    type="income"
                    icon={<DollarSign className="w-5 h-5 text-green-600" />}
                />
                <KPICard
                    title="Gastos Totales"
                    value={kpis.currentMonthExpenses}
                    change={kpis.expensesChange}
                    changeLabel="vs anterior"
                    type="expense"
                    icon={<TrendingDown className="w-5 h-5 text-red-500" />}
                />
                <KPICard
                    title="Beneficio Neto"
                    value={kpis.cashFlow}
                    change={kpis.cashFlowChange}
                    changeLabel="vs anterior"
                    type="flow"
                    icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
                />
                <KPICard
                    title="Margen Operativo"
                    value={`${kpis.averageMargin.toFixed(1)}%`}
                    type="neutral"
                    icon={<Target className="w-5 h-5 text-purple-500" />}
                />
            </div>

            {/* Métricas secundarias */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-lg bg-blue-100">
                            <DollarSign className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-500">Factura media</span>
                    </div>
                    <p className="text-2xl font-bold">{metrics.avgInvoiceValue.toFixed(0)}€</p>
                </div>

                <div className="card p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-lg bg-green-100">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm text-gray-500">Tasa de cobro</span>
                    </div>
                    <p className="text-2xl font-bold">{metrics.collectionRate.toFixed(0)}%</p>
                </div>

                <div className="card p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-lg bg-yellow-100">
                            <Clock className="w-4 h-4 text-yellow-600" />
                        </div>
                        <span className="text-sm text-gray-500">Días cobro medio</span>
                    </div>
                    <p className="text-2xl font-bold">{metrics.avgDaysToPayment.toFixed(0)}d</p>
                </div>

                <div className="card p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-lg bg-purple-100">
                            <Users className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-sm text-gray-500">Valor paciente</span>
                    </div>
                    <p className="text-2xl font-bold">{metrics.patientLTV.toFixed(0)}€</p>
                </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Evolución ingresos/gastos */}
                <div className="card p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Evolución Financiera</h3>
                    <RevenueChart type="bar" />
                </div>

                {/* Desglose por servicio */}
                <div className="card p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Ingresos por Servicio</h3>
                    <ServiceChart data={kpis.topServices} />
                </div>
            </div>

            {/* Desglose de gastos */}
            <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-6">Desglose de Gastos</h3>
                <div className="space-y-4">
                    {Object.entries(expensesByCategory)
                        .sort(([, a], [, b]) => b - a)
                        .map(([category, amount]) => {
                            const percentage = (amount / totalExpenses) * 100;
                            const labels: Record<string, string> = {
                                supplies: 'Suministros',
                                rent: 'Alquiler',
                                salaries: 'Nóminas',
                                utilities: 'Servicios',
                                marketing: 'Marketing',
                                insurance: 'Seguros',
                                equipment: 'Equipos',
                                other: 'Otros',
                            };

                            return (
                                <div key={category}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">
                                            {labels[category] || category}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {amount.toLocaleString('es-ES')}€ ({percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                    <ProgressBar
                                        value={percentage}
                                        max={100}
                                        variant={percentage > 40 ? 'danger' : percentage > 25 ? 'warning' : 'success'}
                                    />
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Insights */}
            <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-4">💡 Insights Automáticos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {kpis.noShowRate > 8 && (
                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
                            <ArrowDown className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900">No-shows elevados</p>
                                <p className="text-sm text-gray-600">
                                    Tasa de {kpis.noShowRate.toFixed(1)}% puede suponer ~{(kpis.noShowRate * kpis.currentMonthIncome / 100).toFixed(0)}€ perdidos.
                                    Considera SMS recordatorios.
                                </p>
                            </div>
                        </div>
                    )}

                    {kpis.pendingInvoices > 2 && (
                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
                            <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900">Cobros pendientes</p>
                                <p className="text-sm text-gray-600">
                                    {kpis.pendingInvoices} facturas por {kpis.pendingInvoicesAmount.toLocaleString('es-ES')}€.
                                    Envía recordatorios para mejorar flujo de caja.
                                </p>
                            </div>
                        </div>
                    )}

                    {kpis.topServices.length > 0 && (
                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
                            <ArrowUp className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900">Servicio estrella</p>
                                <p className="text-sm text-gray-600">
                                    {kpis.topServices[0].name} genera {kpis.topServices[0].revenue.toLocaleString('es-ES')}€.
                                    Considera promocionarlo más.
                                </p>
                            </div>
                        </div>
                    )}

                    {kpis.averageMargin > 30 && (
                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
                            <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900">Margen saludable</p>
                                <p className="text-sm text-gray-600">
                                    Tu margen del {kpis.averageMargin.toFixed(1)}% está por encima del objetivo.
                                    ¡Buen trabajo controlando gastos!
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
