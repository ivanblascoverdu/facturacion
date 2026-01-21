// ============================================
// PÁGINA DE GASTOS
// ============================================

'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Expense, ExpenseCategory } from '@/types';
import { SectionHeader, Badge, EmptyState } from '@/components/ui';
import {
    Receipt, Plus, Search, Trash2, Edit2,
    ShoppingBag, Home, Users, Zap, Megaphone, Shield, Wrench, MoreHorizontal
} from 'lucide-react';

const CATEGORY_INFO: Record<ExpenseCategory, { label: string; icon: React.ReactNode; color: string }> = {
    supplies: { label: 'Suministros', icon: <ShoppingBag className="w-4 h-4" />, color: 'bg-blue-100 text-blue-700' },
    rent: { label: 'Alquiler', icon: <Home className="w-4 h-4" />, color: 'bg-purple-100 text-purple-700' },
    salaries: { label: 'Nóminas', icon: <Users className="w-4 h-4" />, color: 'bg-green-100 text-green-700' },
    utilities: { label: 'Servicios', icon: <Zap className="w-4 h-4" />, color: 'bg-yellow-100 text-yellow-700' },
    marketing: { label: 'Marketing', icon: <Megaphone className="w-4 h-4" />, color: 'bg-pink-100 text-pink-700' },
    insurance: { label: 'Seguros', icon: <Shield className="w-4 h-4" />, color: 'bg-indigo-100 text-indigo-700' },
    equipment: { label: 'Equipos', icon: <Wrench className="w-4 h-4" />, color: 'bg-orange-100 text-orange-700' },
    other: { label: 'Otros', icon: <MoreHorizontal className="w-4 h-4" />, color: 'bg-gray-100 text-gray-700' },
};

export default function ExpensesPage() {
    const { expenses, addExpense, deleteExpense } = useStore();
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<ExpenseCategory | 'all'>('all');

    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: 'supplies' as ExpenseCategory,
        date: new Date().toISOString().split('T')[0],
        supplier: '',
        notes: '',
    });

    // Filtrar gastos
    const filteredExpenses = expenses
        .filter(exp => {
            if (filterCategory !== 'all' && exp.category !== filterCategory) return false;
            if (searchTerm) {
                return exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    exp.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return true;
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime());

    // Estadísticas por categoría
    const categoryStats = Object.keys(CATEGORY_INFO).map(cat => {
        const catExpenses = expenses.filter(e => e.category === cat);
        return {
            category: cat as ExpenseCategory,
            total: catExpenses.reduce((sum, e) => sum + e.amount, 0),
            count: catExpenses.length,
        };
    }).sort((a, b) => b.total - a.total);

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addExpense({
            id: '',
            description: formData.description,
            amount: parseFloat(formData.amount),
            category: formData.category,
            date: new Date(formData.date),
            supplier: formData.supplier || undefined,
            notes: formData.notes || undefined,
        });
        setShowModal(false);
        setFormData({
            description: '',
            amount: '',
            category: 'supplies',
            date: new Date().toISOString().split('T')[0],
            supplier: '',
            notes: '',
        });
    };

    return (
        <div className="space-y-6">
            <SectionHeader
                title="Gastos"
                subtitle={`Total: ${totalExpenses.toLocaleString('es-ES')}€ este mes`}
                action={
                    <button onClick={() => setShowModal(true)} className="btn-action-blue">
                        <Plus className="w-4 h-4" />
                        Nuevo Gasto
                    </button>
                }
            />

            {/* Category breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {categoryStats.slice(0, 8).map(stat => {
                    const info = CATEGORY_INFO[stat.category];
                    return (
                        <button
                            key={stat.category}
                            onClick={() => setFilterCategory(prev => prev === stat.category ? 'all' : stat.category)}
                            className={`card p-3 text-left transition-all ${filterCategory === stat.category ? 'ring-2 ring-blue-500' : ''
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-lg ${info.color} flex items-center justify-center mb-2`}>
                                {info.icon}
                            </div>
                            <p className="text-xs text-gray-500">{info.label}</p>
                            <p className="text-lg font-bold">{stat.total.toLocaleString('es-ES')}€</p>
                        </button>
                    );
                })}
            </div>

            {/* Search */}
            <div className="card p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por descripción o proveedor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input pl-10"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                {filteredExpenses.length > 0 ? (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Concepto</th>
                                    <th>Categoría</th>
                                    <th>Fecha</th>
                                    <th>Proveedor</th>
                                    <th>Importe</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExpenses.map(expense => {
                                    const info = CATEGORY_INFO[expense.category];
                                    return (
                                        <tr key={expense.id}>
                                            <td className="font-medium">{expense.description}</td>
                                            <td>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${info.color}`}>
                                                    {info.icon}
                                                    {info.label}
                                                </span>
                                            </td>
                                            <td>{expense.date.toLocaleDateString('es-ES')}</td>
                                            <td className="text-gray-500">{expense.supplier || '-'}</td>
                                            <td className="font-semibold text-red-600">-{expense.amount.toLocaleString('es-ES')}€</td>
                                            <td>
                                                <button
                                                    onClick={() => deleteExpense(expense.id)}
                                                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState
                        icon={<Receipt className="w-12 h-12 text-gray-300" />}
                        title="No hay gastos"
                        description="Añade tu primer gasto para empezar a controlar tus finanzas"
                        action={
                            <button onClick={() => setShowModal(true)} className="btn-action-blue">
                                <Plus className="w-4 h-4" />
                                Añadir Gasto
                            </button>
                        }
                    />
                )}
            </div>

            {/* Modal nuevo gasto */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="text-lg font-semibold">Nuevo Gasto</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="input"
                                        required
                                        placeholder="Ej: Material desechable"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Importe *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            className="input"
                                            required
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="input"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                                        className="input"
                                    >
                                        {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                                            <option key={key} value={key}>{info.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                                    <input
                                        type="text"
                                        value={formData.supplier}
                                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                        className="input"
                                        placeholder="Ej: Suministros Médicos SA"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Guardar Gasto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
