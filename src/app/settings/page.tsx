// ============================================
// PÁGINA DE CONFIGURACIÓN
// ============================================

'use client';

import React, { useState } from 'react';
import { SectionHeader, Badge } from '@/components/ui';
import { clinicConfig } from '@/data/mockData';
import {
    Building, Mail, Phone, Globe, CreditCard,
    Bell, MessageSquare, FileText, Shield, Save,
    Check
} from 'lucide-react';

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);
    const [config, setConfig] = useState({
        name: clinicConfig.name,
        address: clinicConfig.address,
        phone: clinicConfig.phone,
        email: clinicConfig.email,
        nif: clinicConfig.nif,
        website: clinicConfig.website || '',
        bankAccount: clinicConfig.bankAccount || '',
        defaultVatRate: clinicConfig.defaultVatRate,
        invoicePrefix: clinicConfig.invoicePrefix,
        reminderDays: clinicConfig.reminderDays.join(', '),
    });

    const [notifications, setNotifications] = useState({
        emailReminders: true,
        smsReminders: false,
        whatsappReminders: false,
        autoReminders: true,
    });

    const handleSave = () => {
        // Simular guardado
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="space-y-6">
            <SectionHeader
                title="Configuración"
                subtitle="Personaliza tu clínica y preferencias"
            />

            {saved && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Configuración guardada correctamente</span>
                </div>
            )}

            {/* Datos de la clínica */}
            <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-blue-100">
                        <Building className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Datos de la Clínica</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            value={config.name}
                            onChange={(e) => setConfig({ ...config, name: e.target.value })}
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">NIF/CIF</label>
                        <input
                            type="text"
                            value={config.nif}
                            onChange={(e) => setConfig({ ...config, nif: e.target.value })}
                            className="input"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                        <input
                            type="text"
                            value={config.address}
                            onChange={(e) => setConfig({ ...config, address: e.target.value })}
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="tel"
                                value={config.phone}
                                onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                                className="input pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                value={config.email}
                                onChange={(e) => setConfig({ ...config, email: e.target.value })}
                                className="input pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Web</label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="url"
                                value={config.website}
                                onChange={(e) => setConfig({ ...config, website: e.target.value })}
                                className="input pl-10"
                                placeholder="https://"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cuenta bancaria</label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={config.bankAccount}
                                onChange={(e) => setConfig({ ...config, bankAccount: e.target.value })}
                                className="input pl-10"
                                placeholder="ES12 1234 5678 ..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Configuración de facturación */}
            <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-green-100">
                        <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Facturación</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prefijo facturas</label>
                        <input
                            type="text"
                            value={config.invoicePrefix}
                            onChange={(e) => setConfig({ ...config, invoicePrefix: e.target.value })}
                            className="input"
                            placeholder="FAC"
                        />
                        <p className="text-xs text-gray-500 mt-1">Ej: FAC-2024-001</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">IVA por defecto (%)</label>
                        <input
                            type="number"
                            value={config.defaultVatRate}
                            onChange={(e) => setConfig({ ...config, defaultVatRate: parseInt(e.target.value) })}
                            className="input"
                            min="0"
                            max="100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Días recordatorio</label>
                        <input
                            type="text"
                            value={config.reminderDays}
                            onChange={(e) => setConfig({ ...config, reminderDays: e.target.value })}
                            className="input"
                            placeholder="7, 15, 30"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separados por comas</p>
                    </div>
                </div>
            </div>

            {/* Notificaciones */}
            <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-yellow-100">
                        <Bell className="w-5 h-5 text-yellow-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Notificaciones y Recordatorios</h3>
                </div>

                <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="font-medium text-gray-900">Recordatorios por Email</p>
                                <p className="text-sm text-gray-500">Enviar recordatorios de cobro por email</p>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications.emailReminders}
                            onChange={(e) => setNotifications({ ...notifications, emailReminders: e.target.checked })}
                            className="w-5 h-5 rounded text-blue-600"
                        />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="font-medium text-gray-900">Recordatorios por SMS</p>
                                <p className="text-sm text-gray-500">Enviar SMS recordatorios de cita (coste adicional)</p>
                            </div>
                            <Badge variant="warning">Pro</Badge>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications.smsReminders}
                            onChange={(e) => setNotifications({ ...notifications, smsReminders: e.target.checked })}
                            className="w-5 h-5 rounded text-blue-600"
                        />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="w-5 h-5 text-green-500" />
                            <div>
                                <p className="font-medium text-gray-900">Recordatorios por WhatsApp</p>
                                <p className="text-sm text-gray-500">Enviar recordatorios via WhatsApp Business</p>
                            </div>
                            <Badge variant="warning">Pro</Badge>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications.whatsappReminders}
                            onChange={(e) => setNotifications({ ...notifications, whatsappReminders: e.target.checked })}
                            className="w-5 h-5 rounded text-blue-600"
                        />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="font-medium text-gray-900">Recordatorios automáticos</p>
                                <p className="text-sm text-gray-500">Enviar automáticamente según días configurados</p>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications.autoReminders}
                            onChange={(e) => setNotifications({ ...notifications, autoReminders: e.target.checked })}
                            className="w-5 h-5 rounded text-blue-600"
                        />
                    </label>
                </div>
            </div>

            {/* Plan actual */}
            <div className="card p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-5 h-5" />
                            <span className="text-sm opacity-80">Tu plan actual</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">Plan Gratuito</h3>
                        <p className="opacity-80">50 facturas/mes • Dashboard básico</p>
                    </div>
                    <div className="text-right">
                        <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                            Actualizar a Pro - 29€/mes
                        </button>
                        <p className="text-xs opacity-70 mt-2">Ilimitado + SMS + WhatsApp + Alertas IA</p>
                    </div>
                </div>
            </div>

            {/* Save button */}
            <div className="flex justify-end">
                <button onClick={handleSave} className="btn btn-primary">
                    <Save className="w-5 h-5" />
                    Guardar Cambios
                </button>
            </div>
        </div>
    );
}
