// ============================================
// TIPOS PRINCIPALES - FACTURACIÓN PYMES
// ============================================

// Estado de cita
export type AppointmentStatus = 'scheduled' | 'completed' | 'no-show' | 'cancelled';

// Estado de factura  
export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

// Categorías de gastos
export type ExpenseCategory = 
  | 'supplies' 
  | 'rent' 
  | 'salaries' 
  | 'utilities' 
  | 'marketing' 
  | 'insurance'
  | 'equipment'
  | 'other';

// Paciente/Cliente
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  nif?: string;
  createdAt: Date;
  totalVisits: number;
  totalSpent: number;
}

// Profesional/Empleado
export interface Professional {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone?: string;
  color: string; // Para calendario
}

// Servicio
export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // en minutos
  category: string;
  vatRate: number; // IVA (21%)
}

// Cita/Agenda
export interface Appointment {
  id: string;
  patientId: string;
  patient?: Patient;
  professionalId: string;
  professional?: Professional;
  serviceId: string;
  service?: Service;
  date: Date;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  price: number;
  invoiceId?: string;
}

// Factura
export interface Invoice {
  id: string;
  number: string; // Número factura (ej: FAC-2024-001)
  patientId: string;
  patient?: Patient;
  appointmentId?: string;
  appointment?: Appointment;
  items: InvoiceItem[];
  subtotal: number;
  vatAmount: number;
  vatRate: number;
  total: number;
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  status: InvoiceStatus;
  paymentMethod?: string;
  notes?: string;
  remindersSent: number;
  lastReminderDate?: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  total: number;
}

// Gasto
export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  supplier?: string;
  invoiceNumber?: string;
  notes?: string;
}

// KPIs del Dashboard
export interface DashboardKPIs {
  // Ingresos
  currentMonthIncome: number;
  previousMonthIncome: number;
  incomeChange: number;
  
  // Gastos
  currentMonthExpenses: number;
  previousMonthExpenses: number;
  expensesChange: number;
  
  // Flujo de caja
  cashFlow: number;
  cashFlowChange: number;
  
  // Facturas pendientes
  pendingInvoices: number;
  pendingInvoicesAmount: number;
  averageDaysPending: number;
  
  // No-shows
  noShowRate: number;
  noShowTarget: number;
  
  // Margen
  averageMargin: number;
  marginChange: number;
  
  // Top servicios
  topServices: {
    name: string;
    revenue: number;
    count: number;
  }[];
}

// Alerta inteligente
export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'success' | 'info';
  title: string;
  message: string;
  action?: string;
  actionLabel?: string;
  createdAt: Date;
  dismissed: boolean;
}

// Configuración de la clínica
export interface ClinicConfig {
  name: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  nif: string;
  website?: string;
  bankAccount?: string;
  defaultVatRate: number;
  invoicePrefix: string;
  reminderDays: number[]; // [7, 15, 30]
}

// Datos para gráficos
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    fill?: boolean;
  }[];
}

// Filtros de fecha
export interface DateFilter {
  startDate: Date;
  endDate: Date;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
}
