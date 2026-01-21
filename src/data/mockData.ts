// ============================================
// DATOS INICIALES - VACÍOS PARA CONFIGURAR
// ============================================

import {
    Patient, Professional, Service, Appointment,
    Invoice, Expense, ClinicConfig
} from '@/types';

// Configuración de la clínica - VACÍA para configurar
export const clinicConfig: ClinicConfig = {
    name: '',
    address: '',
    phone: '',
    email: '',
    nif: '',
    website: '',
    bankAccount: '',
    defaultVatRate: 21,
    invoicePrefix: 'FAC',
    reminderDays: [7, 15, 30],
};

// Profesionales - vacío para añadir
export const professionals: Professional[] = [];

// Servicios - vacío para añadir
export const services: Service[] = [];

// Pacientes - vacío
export const patients: Patient[] = [];

// Citas - vacío
export const appointments: Appointment[] = [];

// Facturas - vacío
export const invoices: Invoice[] = [];

// Gastos - vacío
export const expenses: Expense[] = [];

// Helper para enriquecer datos con relaciones
export const getEnrichedAppointments = (): Appointment[] => {
    return appointments.map(apt => ({
        ...apt,
        patient: patients.find(p => p.id === apt.patientId),
        professional: professionals.find(p => p.id === apt.professionalId),
        service: services.find(s => s.id === apt.serviceId),
    }));
};

export const getEnrichedInvoices = (): Invoice[] => {
    return invoices.map(inv => ({
        ...inv,
        patient: patients.find(p => p.id === inv.patientId),
        appointment: appointments.find(a => a.id === inv.appointmentId),
    }));
};
