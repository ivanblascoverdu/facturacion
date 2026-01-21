// ============================================
// STORE PRINCIPAL - ZUSTAND
// ============================================

import { create } from 'zustand';
import {
    Patient, Professional, Service, Appointment,
    Invoice, Expense, Alert, DashboardKPIs, ClinicConfig
} from '@/types';
import {
    patients as mockPatients,
    professionals as mockProfessionals,
    services as mockServices,
    appointments as mockAppointments,
    invoices as mockInvoices,
    expenses as mockExpenses,
    clinicConfig as mockClinicConfig,
} from '@/data/mockData';

interface AppState {
    // Datos
    patients: Patient[];
    professionals: Professional[];
    services: Service[];
    appointments: Appointment[];
    invoices: Invoice[];
    expenses: Expense[];
    alerts: Alert[];
    clinicConfig: ClinicConfig;

    // UI State
    isLoading: boolean;
    selectedPeriod: 'week' | 'month' | 'quarter' | 'year';

    // Actions - Patients
    addPatient: (patient: Patient) => void;
    updatePatient: (id: string, patient: Partial<Patient>) => void;

    // Actions - Appointments
    addAppointment: (appointment: Appointment) => void;
    updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
    completeAppointment: (id: string) => void;

    // Actions - Invoices
    addInvoice: (invoice: Invoice) => void;
    updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
    markInvoiceAsPaid: (id: string, paymentMethod: string) => void;
    sendReminder: (id: string) => void;

    // Actions - Expenses
    addExpense: (expense: Expense) => void;
    deleteExpense: (id: string) => void;

    // Actions - Alerts
    dismissAlert: (id: string) => void;
    generateAlerts: () => void;

    // Actions - Period
    setSelectedPeriod: (period: 'week' | 'month' | 'quarter' | 'year') => void;

    // Computed - KPIs
    getKPIs: () => DashboardKPIs;
}

// Genera un ID único
const generateId = () => Math.random().toString(36).substring(2, 11);

// Genera número de factura
const generateInvoiceNumber = (invoices: Invoice[], prefix: string) => {
    const year = new Date().getFullYear();
    const count = invoices.filter(i => i.number.includes(year.toString())).length + 1;
    return `${prefix}-${year}-${count.toString().padStart(3, '0')}`;
};

export const useStore = create<AppState>((set, get) => ({
    // Initial data (mock)
    patients: mockPatients,
    professionals: mockProfessionals,
    services: mockServices,
    appointments: mockAppointments,
    invoices: mockInvoices,
    expenses: mockExpenses,
    alerts: [],
    clinicConfig: mockClinicConfig,

    isLoading: false,
    selectedPeriod: 'month',

    // Patient Actions
    addPatient: (patient) => set((state) => ({
        patients: [...state.patients, { ...patient, id: generateId() }]
    })),

    updatePatient: (id, updates) => set((state) => ({
        patients: state.patients.map(p => p.id === id ? { ...p, ...updates } : p)
    })),

    // Appointment Actions
    addAppointment: (appointment) => set((state) => ({
        appointments: [...state.appointments, { ...appointment, id: generateId() }]
    })),

    updateAppointmentStatus: (id, status) => set((state) => ({
        appointments: state.appointments.map(a => a.id === id ? { ...a, status } : a)
    })),

    completeAppointment: (id) => {
        const state = get();
        const appointment = state.appointments.find(a => a.id === id);
        if (!appointment) return;

        const patient = state.patients.find(p => p.id === appointment.patientId);
        const service = state.services.find(s => s.id === appointment.serviceId);

        if (!patient || !service) return;

        // Crear factura automáticamente
        const invoiceNumber = generateInvoiceNumber(state.invoices, state.clinicConfig.invoicePrefix);
        const subtotal = service.price / (1 + service.vatRate / 100);
        const vatAmount = service.price - subtotal;

        const newInvoice: Invoice = {
            id: generateId(),
            number: invoiceNumber,
            patientId: appointment.patientId,
            appointmentId: id,
            items: [{
                id: generateId(),
                description: service.name,
                quantity: 1,
                unitPrice: subtotal,
                vatRate: service.vatRate,
                total: service.price,
            }],
            subtotal,
            vatAmount,
            vatRate: service.vatRate,
            total: service.price,
            issueDate: new Date(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 días
            status: 'pending',
            remindersSent: 0,
        };

        set((state) => ({
            appointments: state.appointments.map(a =>
                a.id === id ? { ...a, status: 'completed', invoiceId: newInvoice.id } : a
            ),
            invoices: [...state.invoices, newInvoice],
        }));

        return newInvoice;
    },

    // Invoice Actions
    addInvoice: (invoice) => set((state) => ({
        invoices: [...state.invoices, {
            ...invoice,
            id: generateId(),
            number: generateInvoiceNumber(state.invoices, state.clinicConfig.invoicePrefix)
        }]
    })),

    updateInvoiceStatus: (id, status) => set((state) => ({
        invoices: state.invoices.map(i => i.id === id ? { ...i, status } : i)
    })),

    markInvoiceAsPaid: (id, paymentMethod) => set((state) => ({
        invoices: state.invoices.map(i =>
            i.id === id ? { ...i, status: 'paid', paidDate: new Date(), paymentMethod } : i
        )
    })),

    sendReminder: (id) => set((state) => ({
        invoices: state.invoices.map(i =>
            i.id === id ? {
                ...i,
                remindersSent: i.remindersSent + 1,
                lastReminderDate: new Date()
            } : i
        )
    })),

    // Expense Actions
    addExpense: (expense) => set((state) => ({
        expenses: [...state.expenses, { ...expense, id: generateId() }]
    })),

    deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter(e => e.id !== id)
    })),

    // Alert Actions
    dismissAlert: (id) => set((state) => ({
        alerts: state.alerts.map(a => a.id === id ? { ...a, dismissed: true } : a)
    })),

    generateAlerts: () => {
        const state = get();
        const newAlerts: Alert[] = [];
        const kpis = state.getKPIs();

        // Alerta: No-shows alto
        if (kpis.noShowRate > 10) {
            newAlerts.push({
                id: generateId(),
                type: 'danger',
                title: 'No-shows elevados',
                message: `Tasa de no-shows ${kpis.noShowRate.toFixed(1)}% > objetivo 10%. Activa SMS recordatorios.`,
                action: '/settings',
                actionLabel: 'Configurar SMS',
                createdAt: new Date(),
                dismissed: false,
            });
        }

        // Alerta: Facturas pendientes > 30 días
        const overdueInvoices = state.invoices.filter(i =>
            i.status === 'overdue' ||
            (i.status === 'pending' && i.dueDate < new Date())
        );
        if (overdueInvoices.length > 0) {
            newAlerts.push({
                id: generateId(),
                type: 'warning',
                title: 'Facturas vencidas',
                message: `${overdueInvoices.length} facturas pendientes por ${overdueInvoices.reduce((sum, i) => sum + i.total, 0).toFixed(2)}€`,
                action: '/invoices?filter=overdue',
                actionLabel: 'Enviar recordatorios',
                createdAt: new Date(),
                dismissed: false,
            });
        }

        // Alerta: Suministros > 35% ingresos
        const suppliesExpenses = state.expenses.filter(e => e.category === 'supplies').reduce((sum, e) => sum + e.amount, 0);
        const suppliesRatio = (suppliesExpenses / kpis.currentMonthIncome) * 100;
        if (suppliesRatio > 35) {
            newAlerts.push({
                id: generateId(),
                type: 'warning',
                title: 'Suministros elevados',
                message: `Suministros médicos representan ${suppliesRatio.toFixed(1)}% de ingresos. Revisar proveedores.`,
                action: '/expenses?category=supplies',
                actionLabel: 'Ver gastos',
                createdAt: new Date(),
                dismissed: false,
            });
        }

        // Alerta: Servicio top (positiva)
        if (kpis.topServices.length > 0) {
            const topService = kpis.topServices[0];
            newAlerts.push({
                id: generateId(),
                type: 'success',
                title: 'Servicio estrella',
                message: `${topService.name} lidera con ${topService.revenue.toFixed(0)}€ (${topService.count} sesiones). ¡Promocionarlo más!`,
                action: '/services',
                actionLabel: 'Ver servicios',
                createdAt: new Date(),
                dismissed: false,
            });
        }

        set({ alerts: newAlerts });
    },

    // Period
    setSelectedPeriod: (period) => set({ selectedPeriod: period }),

    // Computed KPIs
    getKPIs: () => {
        const state = get();
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Ingresos mes actual (facturas pagadas)
        const currentMonthIncome = state.invoices
            .filter(i => i.status === 'paid' && i.paidDate && i.paidDate >= startOfMonth)
            .reduce((sum, i) => sum + i.total, 0);

        // Ingresos mes anterior
        const previousMonthIncome = state.invoices
            .filter(i => i.status === 'paid' && i.paidDate && i.paidDate >= startOfPrevMonth && i.paidDate <= endOfPrevMonth)
            .reduce((sum, i) => sum + i.total, 0);

        // Gastos mes actual
        const currentMonthExpenses = state.expenses
            .filter(e => e.date >= startOfMonth)
            .reduce((sum, e) => sum + e.amount, 0);

        // Gastos mes anterior
        const previousMonthExpenses = state.expenses
            .filter(e => e.date >= startOfPrevMonth && e.date <= endOfPrevMonth)
            .reduce((sum, e) => sum + e.amount, 0);

        // Facturas pendientes
        const pendingInvoices = state.invoices.filter(i => i.status === 'pending' || i.status === 'overdue');
        const pendingInvoicesAmount = pendingInvoices.reduce((sum, i) => sum + i.total, 0);

        // Días promedio pendientes
        const avgDaysPending = pendingInvoices.length > 0
            ? pendingInvoices.reduce((sum, i) => {
                const days = Math.floor((now.getTime() - i.issueDate.getTime()) / (1000 * 60 * 60 * 24));
                return sum + days;
            }, 0) / pendingInvoices.length
            : 0;

        // No-shows
        const monthAppointments = state.appointments.filter(a => a.date >= startOfMonth);
        const noShows = monthAppointments.filter(a => a.status === 'no-show').length;
        const noShowRate = monthAppointments.length > 0 ? (noShows / monthAppointments.length) * 100 : 0;

        // Margen
        const totalIncome = currentMonthIncome || 1; // Evitar división por 0
        const averageMargin = ((totalIncome - currentMonthExpenses) / totalIncome) * 100;

        // Top servicios
        const serviceRevenue = new Map<string, { revenue: number; count: number }>();
        state.invoices
            .filter(i => i.paidDate && i.paidDate >= startOfMonth)
            .forEach(i => {
                i.items.forEach(item => {
                    const current = serviceRevenue.get(item.description) || { revenue: 0, count: 0 };
                    serviceRevenue.set(item.description, {
                        revenue: current.revenue + item.total,
                        count: current.count + 1,
                    });
                });
            });

        const topServices = Array.from(serviceRevenue.entries())
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Cambios porcentuales
        const incomeChange = previousMonthIncome > 0
            ? ((currentMonthIncome - previousMonthIncome) / previousMonthIncome) * 100
            : 0;
        const expensesChange = previousMonthExpenses > 0
            ? ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100
            : 0;
        const cashFlow = currentMonthIncome - currentMonthExpenses;
        const prevCashFlow = previousMonthIncome - previousMonthExpenses;
        const cashFlowChange = prevCashFlow !== 0
            ? ((cashFlow - prevCashFlow) / Math.abs(prevCashFlow)) * 100
            : 0;

        return {
            currentMonthIncome,
            previousMonthIncome,
            incomeChange,
            currentMonthExpenses,
            previousMonthExpenses,
            expensesChange,
            cashFlow,
            cashFlowChange,
            pendingInvoices: pendingInvoices.length,
            pendingInvoicesAmount,
            averageDaysPending: avgDaysPending,
            noShowRate,
            noShowTarget: 8,
            averageMargin,
            marginChange: 0, // Calcular si se necesita
            topServices,
        };
    },
}));
