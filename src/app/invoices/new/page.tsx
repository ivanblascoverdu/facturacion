// ============================================
// PÁGINA CREAR NUEVA FACTURA
// ============================================

'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { SectionHeader } from '@/components/ui';
import { DownloadInvoicePDF } from '@/components/invoice/InvoicePDF';
import { clinicConfig as defaultClinicConfig } from '@/data/mockData';
import { Invoice, InvoiceItem } from '@/types';
import {
    FileText, Plus, Trash2, ArrowLeft, Save,
    Download, Send, Check
} from 'lucide-react';
import Link from 'next/link';

export default function NewInvoicePage() {
    const { patients, services, addInvoice, invoices } = useStore();

    const [selectedPatient, setSelectedPatient] = useState('');
    const [items, setItems] = useState<{ serviceId: string; quantity: number; customPrice?: number }[]>([
        { serviceId: '', quantity: 1 }
    ]);
    const [notes, setNotes] = useState('');
    const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null);

    const addItem = () => {
        setItems([...items, { serviceId: '', quantity: 1 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: string, value: string | number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    // Calcular totales
    const calculateTotals = () => {
        let subtotal = 0;
        let vatAmount = 0;

        items.forEach(item => {
            const service = services.find(s => s.id === item.serviceId);
            if (service) {
                const price = item.customPrice || service.price;
                const itemSubtotal = (price / (1 + service.vatRate / 100)) * item.quantity;
                const itemVat = (price - (price / (1 + service.vatRate / 100))) * item.quantity;
                subtotal += itemSubtotal;
                vatAmount += itemVat;
            }
        });

        return { subtotal, vatAmount, total: subtotal + vatAmount };
    };

    const totals = calculateTotals();

    const generateInvoiceNumber = () => {
        const year = new Date().getFullYear();
        const count = invoices.filter(i => i.number.includes(year.toString())).length + 1;
        return `${defaultClinicConfig.invoicePrefix}-${year}-${count.toString().padStart(3, '0')}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const patient = patients.find(p => p.id === selectedPatient);
        if (!patient) return;

        const invoiceItems: InvoiceItem[] = items.map((item, i) => {
            const service = services.find(s => s.id === item.serviceId)!;
            const price = item.customPrice || service.price;
            const unitPrice = price / (1 + service.vatRate / 100);

            return {
                id: `item-${i}`,
                description: service.name,
                quantity: item.quantity,
                unitPrice,
                vatRate: service.vatRate,
                total: price * item.quantity,
            };
        });

        const newInvoice: Invoice = {
            id: '',
            number: generateInvoiceNumber(),
            patientId: selectedPatient,
            items: invoiceItems,
            subtotal: totals.subtotal,
            vatAmount: totals.vatAmount,
            vatRate: 21,
            total: totals.total,
            issueDate: new Date(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'pending',
            notes: notes || undefined,
            remindersSent: 0,
        };

        addInvoice(newInvoice);
        setCreatedInvoice({
            ...newInvoice,
            id: 'temp-' + Date.now(),
            patient,
        });
    };

    if (createdInvoice) {
        const patient = patients.find(p => p.id === createdInvoice.patientId);

        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="card p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Factura Creada!</h2>
                    <p className="text-gray-500 mb-6">
                        Factura {createdInvoice.number} por {createdInvoice.total.toFixed(2)}€
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {patient && (
                            <DownloadInvoicePDF
                                invoice={createdInvoice}
                                patient={patient}
                                clinic={defaultClinicConfig}
                                className="btn btn-primary"
                            >
                                <Download className="w-5 h-5" />
                                Descargar PDF
                            </DownloadInvoicePDF>
                        )}

                        <button className="btn btn-success">
                            <Send className="w-5 h-5" />
                            Enviar por WhatsApp
                        </button>
                    </div>

                    <Link href="/invoices" className="block mt-6 text-blue-600 hover:underline">
                        ← Volver a facturas
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/invoices" className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <SectionHeader
                    title="Nueva Factura"
                    subtitle="Crea una factura profesional en segundos"
                />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Seleccionar paciente */}
                <div className="card p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Datos del Cliente</h3>
                    <select
                        value={selectedPatient}
                        onChange={(e) => setSelectedPatient(e.target.value)}
                        className="input"
                        required
                    >
                        <option value="">Selecciona un paciente...</option>
                        {patients.map(patient => (
                            <option key={patient.id} value={patient.id}>
                                {patient.name} - {patient.email}
                            </option>
                        ))}
                    </select>

                    {selectedPatient && (() => {
                        const patient = patients.find(p => p.id === selectedPatient);
                        return patient && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <p className="font-medium">{patient.name}</p>
                                <p className="text-sm text-gray-500">{patient.email}</p>
                                <p className="text-sm text-gray-500">{patient.phone}</p>
                                {patient.nif && <p className="text-sm text-gray-500">NIF: {patient.nif}</p>}
                            </div>
                        );
                    })()}
                </div>

                {/* Items de la factura */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Conceptos</h3>
                        <button type="button" onClick={addItem} className="btn btn-ghost text-sm">
                            <Plus className="w-4 h-4" />
                            Añadir línea
                        </button>
                    </div>

                    <div className="space-y-4">
                        {items.map((item, index) => {
                            const service = services.find(s => s.id === item.serviceId);

                            return (
                                <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Servicio</label>
                                        <select
                                            value={item.serviceId}
                                            onChange={(e) => updateItem(index, 'serviceId', e.target.value)}
                                            className="input"
                                            required
                                        >
                                            <option value="">Selecciona...</option>
                                            {services.map(s => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name} - {s.price}€
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-24">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                                            className="input"
                                            required
                                        />
                                    </div>

                                    <div className="w-32">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={item.customPrice || service?.price || ''}
                                            onChange={(e) => updateItem(index, 'customPrice', parseFloat(e.target.value))}
                                            className="input"
                                            placeholder={service?.price.toString()}
                                        />
                                    </div>

                                    <div className="w-24 text-right">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                                        <p className="py-2 font-semibold">
                                            {((item.customPrice || service?.price || 0) * item.quantity).toFixed(2)}€
                                        </p>
                                    </div>

                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="mt-7 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Totales */}
                <div className="card p-6">
                    <div className="flex justify-end">
                        <div className="w-64 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span>{totals.subtotal.toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">IVA (21%)</span>
                                <span>{totals.vatAmount.toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold pt-2 border-t">
                                <span>Total</span>
                                <span>{totals.total.toFixed(2)}€</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notas */}
                <div className="card p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Notas (opcional)</h3>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="input min-h-[100px]"
                        placeholder="Añade notas adicionales para el cliente..."
                    />
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3">
                    <Link href="/invoices" className="btn btn-ghost">
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        className="btn-invoice"
                        disabled={!selectedPatient || items.every(i => !i.serviceId)}
                    >
                        <FileText className="w-5 h-5" />
                        Crear Factura
                    </button>
                </div>
            </form>
        </div>
    );
}
