// ============================================
// PÁGINA DE PACIENTES
// ============================================

'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { SectionHeader, Badge, EmptyState } from '@/components/ui';
import {
    Users, Plus, Search, Mail, Phone, MapPin,
    Calendar, Euro, MoreVertical
} from 'lucide-react';

export default function PatientsPage() {
    const { patients, addPatient } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        nif: '',
    });

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm)
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addPatient({
            id: '',
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address || undefined,
            nif: formData.nif || undefined,
            createdAt: new Date(),
            totalVisits: 0,
            totalSpent: 0,
        });
        setShowModal(false);
        setFormData({ name: '', email: '', phone: '', address: '', nif: '' });
    };

    return (
        <div className="space-y-6">
            <SectionHeader
                title="Pacientes"
                subtitle={`${patients.length} pacientes registrados`}
                action={
                    <button onClick={() => setShowModal(true)} className="btn btn-primary">
                        <Plus className="w-5 h-5" />
                        Nuevo Paciente
                    </button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-5">
                    <p className="text-sm text-gray-500">Total Pacientes</p>
                    <p className="text-3xl font-bold mt-1">{patients.length}</p>
                </div>
                <div className="card p-5">
                    <p className="text-sm text-gray-500">Valor Medio</p>
                    <p className="text-3xl font-bold mt-1">
                        {patients.length > 0
                            ? Math.round(patients.reduce((sum, p) => sum + p.totalSpent, 0) / patients.length)
                            : 0}€
                    </p>
                </div>
                <div className="card p-5">
                    <p className="text-sm text-gray-500">Visitas Totales</p>
                    <p className="text-3xl font-bold mt-1">
                        {patients.reduce((sum, p) => sum + p.totalVisits, 0)}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="card p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o teléfono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input pl-10"
                    />
                </div>
            </div>

            {/* Grid de pacientes */}
            {filteredPatients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPatients.map(patient => (
                        <div key={patient.id} className="card p-5 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                    {patient.name.charAt(0).toUpperCase()}
                                </div>
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                    <MoreVertical className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>

                            <h3 className="font-semibold text-gray-900 mb-1">{patient.name}</h3>
                            {patient.nif && <p className="text-xs text-gray-500 mb-3">NIF: {patient.nif}</p>}

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="truncate">{patient.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span>{patient.phone}</span>
                                </div>
                                {patient.address && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="truncate">{patient.address}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-1.5 text-sm">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium">{patient.totalVisits}</span>
                                    <span className="text-gray-500">visitas</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm">
                                    <Euro className="w-4 h-4 text-green-500" />
                                    <span className="font-medium">{patient.totalSpent}€</span>
                                    <span className="text-gray-500">total</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card">
                    <EmptyState
                        icon={<Users className="w-12 h-12 text-gray-300" />}
                        title="No hay pacientes"
                        description="Añade tu primer paciente para empezar a gestionar tu clínica"
                        action={
                            <button onClick={() => setShowModal(true)} className="btn btn-primary">
                                Añadir paciente
                            </button>
                        }
                    />
                </div>
            )}

            {/* Modal nuevo paciente */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="text-lg font-semibold">Nuevo Paciente</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="input"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="input"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">NIF/DNI</label>
                                    <input
                                        type="text"
                                        value={formData.nif}
                                        onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                                        className="input"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancelar</button>
                                <button type="submit" className="btn btn-primary">Guardar Paciente</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
