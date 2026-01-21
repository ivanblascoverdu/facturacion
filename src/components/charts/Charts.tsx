// ============================================
// GRÁFICO DE INGRESOS VS GASTOS
// ============================================

'use client';

import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface RevenueChartProps {
    type?: 'line' | 'bar';
}

export function RevenueChart({ type = 'line' }: RevenueChartProps) {
    // Datos simulados de últimos 6 meses
    const labels = ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene'];

    const incomeData = [7200, 7800, 8100, 7500, 8500, 8234];
    const expenseData = [6100, 6400, 6800, 7100, 6500, 6892];

    const data = {
        labels,
        datasets: [
            {
                label: 'Ingresos',
                data: incomeData,
                borderColor: '#10b981',
                backgroundColor: type === 'line' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.8)',
                fill: type === 'line',
                tension: 0.4,
                borderWidth: 3,
                pointRadius: type === 'line' ? 4 : 0,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6,
            },
            {
                label: 'Gastos',
                data: expenseData,
                borderColor: '#ef4444',
                backgroundColor: type === 'line' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.8)',
                fill: type === 'line',
                tension: 0.4,
                borderWidth: 3,
                pointRadius: type === 'line' ? 4 : 0,
                pointBackgroundColor: '#ef4444',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6,
            },
        ],
    };

    const options: ChartOptions<'line' | 'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                align: 'end' as const,
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: {
                        size: 12,
                        weight: 500,
                    },
                },
            },
            tooltip: {
                backgroundColor: '#1f2937',
                titleFont: { size: 14, weight: 600 },
                bodyFont: { size: 13 },
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    label: function (context) {
                        const value = context.parsed.y ?? 0;
                        return `${context.dataset.label}: ${value.toLocaleString('es-ES')}€`;
                    }
                }
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: { size: 12 },
                    color: '#6b7280',
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f3f4f6',
                },
                ticks: {
                    font: { size: 12 },
                    color: '#6b7280',
                    callback: function (value) {
                        return value.toLocaleString('es-ES') + '€';
                    }
                },
            },
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    const ChartComponent = type === 'bar' ? Bar : Line;

    return (
        <div className="chart-container">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <ChartComponent data={data} options={options as any} />
        </div>
    );
}

// ============================================
// GRÁFICO DE SERVICIOS (DONUT)
// ============================================

import { Doughnut } from 'react-chartjs-2';
import { ArcElement } from 'chart.js';

ChartJS.register(ArcElement);

interface ServiceChartProps {
    data?: { name: string; revenue: number }[];
}

export function ServiceChart({ data }: ServiceChartProps) {
    const defaultData = [
        { name: 'Fisioterapia', revenue: 2450 },
        { name: 'Odontología', revenue: 3120 },
        { name: 'Estética', revenue: 1890 },
    ];

    const chartData = data || defaultData;

    const donutData = {
        labels: chartData.map(d => d.name),
        datasets: [
            {
                data: chartData.map(d => d.revenue),
                backgroundColor: [
                    '#10b981',
                    '#3b82f6',
                    '#f59e0b',
                    '#8b5cf6',
                    '#ef4444',
                ],
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverOffset: 10,
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 15,
                    font: {
                        size: 12,
                    },
                    generateLabels: function (chart) {
                        const datasets = chart.data.datasets;
                        return chart.data.labels?.map((label, i) => ({
                            text: `${label}: ${datasets[0].data[i]?.toLocaleString('es-ES')}€`,
                            fillStyle: (datasets[0].backgroundColor as string[])[i],
                            strokeStyle: '#fff',
                            lineWidth: 0,
                            hidden: false,
                            index: i,
                            pointStyle: 'circle',
                        })) || [];
                    },
                },
            },
            tooltip: {
                backgroundColor: '#1f2937',
                titleFont: { size: 14, weight: 600 },
                bodyFont: { size: 13 },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((context.parsed / total) * 100).toFixed(1);
                        return `${context.parsed.toLocaleString('es-ES')}€ (${percentage}%)`;
                    }
                }
            },
        },
    };

    return (
        <div className="chart-container" style={{ height: '250px' }}>
            <Doughnut data={donutData} options={options} />
        </div>
    );
}

// ============================================
// GRÁFICO DE FLUJO DE CAJA DIARIO
// ============================================

export function CashFlowChart() {
    const labels = Array.from({ length: 20 }, (_, i) => i + 1);

    // Simulamos flujo acumulado
    const cashFlowData = [
        450, 890, 1200, 980, 1400, 1650, 1420, 1800, 2100, 1950,
        2300, 2150, 2500, 2800, 2650, 3000, 2850, 3200, 3100, 3400
    ];

    const data = {
        labels: labels.map(d => `${d}`),
        datasets: [
            {
                label: 'Flujo de Caja',
                data: cashFlowData,
                borderColor: '#3b82f6',
                backgroundColor: (context: { chart: ChartJS }) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return 'rgba(59, 130, 246, 0.1)';

                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, 'rgba(59, 130, 246, 0)');
                    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.3)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1f2937',
                titleFont: { size: 12 },
                bodyFont: { size: 13, weight: 600 },
                padding: 10,
                cornerRadius: 6,
                callbacks: {
                    title: (items) => `Día ${items[0]?.label ?? ''}`,
                    label: (context) => `+${(context.parsed.y ?? 0).toLocaleString('es-ES')}€`,
                }
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            },
        },
    };

    return (
        <div style={{ height: '80px' }}>
            <Line data={data} options={options} />
        </div>
    );
}
