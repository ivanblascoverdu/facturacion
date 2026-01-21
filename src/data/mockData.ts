// ============================================
// DATOS INICIALES - CLÍNICA SALUD ALICANTE
// ============================================

import {
    Patient, Professional, Service, Appointment,
    Invoice, Expense, ClinicConfig
} from '@/types';

// Configuración de la clínica
export const clinicConfig: ClinicConfig = {
    name: 'Clínica Salud Alicante',
    address: 'Avenida de la Constitución, 45, 03001 Alicante',
    phone: '+34 965 123 456',
    email: 'info@clinicasaludalicante.es',
    nif: 'B-12345678',
    website: 'www.clinicasaludalicante.es',
    bankAccount: 'ES12 1234 5678 9012 3456 7890',
    defaultVatRate: 21,
    invoicePrefix: 'FAC',
    reminderDays: [7, 15, 30],
};

// Profesionales (necesarios para crear citas)
export const professionals: Professional[] = [
    {
        id: 'prof-1',
        name: 'Dra. María García',
        specialty: 'Fisioterapia',
        email: 'maria.garcia@clinicasaludalicante.es',
        phone: '+34 600 111 222',
        color: '#10B981',
    },
    {
        id: 'prof-2',
        name: 'Dr. Carlos Martínez',
        specialty: 'Odontología',
        email: 'carlos.martinez@clinicasaludalicante.es',
        phone: '+34 600 333 444',
        color: '#3B82F6',
    },
    {
        id: 'prof-3',
        name: 'Ana López',
        specialty: 'Estética',
        email: 'ana.lopez@clinicasaludalicante.es',
        phone: '+34 600 555 666',
        color: '#F59E0B',
    },
];

// Servicios (necesarios para crear citas y facturas)
export const services: Service[] = [
    // Fisioterapia
    { id: 'srv-1', name: 'Sesión Fisioterapia', description: 'Sesión de 45 minutos', price: 50, duration: 45, category: 'Fisioterapia', vatRate: 21 },
    { id: 'srv-2', name: 'Masaje Deportivo', description: 'Masaje descontracturante', price: 45, duration: 30, category: 'Fisioterapia', vatRate: 21 },
    { id: 'srv-3', name: 'Punción Seca', description: 'Tratamiento puntos gatillo', price: 55, duration: 30, category: 'Fisioterapia', vatRate: 21 },

    // Odontología
    { id: 'srv-4', name: 'Limpieza Dental', description: 'Limpieza profesional', price: 65, duration: 45, category: 'Odontología', vatRate: 21 },
    { id: 'srv-5', name: 'Empaste', description: 'Obturación dental', price: 80, duration: 30, category: 'Odontología', vatRate: 21 },
    { id: 'srv-6', name: 'Blanqueamiento', description: 'Blanqueamiento LED', price: 250, duration: 60, category: 'Odontología', vatRate: 21 },
    { id: 'srv-7', name: 'Revisión', description: 'Revisión general', price: 35, duration: 20, category: 'Odontología', vatRate: 21 },

    // Estética
    { id: 'srv-8', name: 'Limpieza Facial', description: 'Limpieza profunda', price: 60, duration: 60, category: 'Estética', vatRate: 21 },
    { id: 'srv-9', name: 'Tratamiento Antiarrugas', description: 'Sérum + mascarilla', price: 85, duration: 45, category: 'Estética', vatRate: 21 },
    { id: 'srv-10', name: 'Depilación Láser', description: 'Zona pequeña', price: 40, duration: 20, category: 'Estética', vatRate: 21 },
];

// ============================================
// DATOS VACÍOS - Añadir manualmente o con semilla
// ============================================

// Pacientes - vacío para empezar limpio
export const patients: Patient[] = [];

// Citas - vacío para empezar limpio
export const appointments: Appointment[] = [];

// Facturas - vacío para empezar limpio
export const invoices: Invoice[] = [];

// Gastos - vacío para empezar limpio
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

