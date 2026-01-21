// ============================================
// SIDEBAR NAVIGATION
// ============================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    Calendar,
    Users,
    Receipt,
    TrendingUp,
    Settings,
    Menu,
    X,
    CreditCard,
    Upload
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Facturación', href: '/invoices', icon: FileText },
    { name: 'Citas', href: '/appointments', icon: Calendar },
    { name: 'Pacientes', href: '/patients', icon: Users },
    { name: 'Gastos', href: '/expenses', icon: Receipt },
    { name: 'Análisis', href: '/analytics', icon: TrendingUp },
    { name: 'Importar', href: '/import', icon: Upload },
    { name: 'Configuración', href: '/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white shadow-md"
            >
                <Menu className="w-6 h-6 text-gray-700" />
            </button>

            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
                {/* Close button mobile */}
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Logo */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">FacturaPYME</h1>
                            <p className="text-xs text-white/60">Gestión Inteligente</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={`sidebar-link ${isActive ? 'active' : ''}`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom section */}
                <div className="pt-6 border-t border-white/10">
                    <div className="bg-white/10 rounded-xl p-4">
                        <p className="text-sm font-medium mb-1">Plan Pro</p>
                        <p className="text-xs text-white/60 mb-3">29€/mes • Ilimitado</p>
                        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-green-400 rounded-full" />
                        </div>
                        <p className="text-xs text-white/60 mt-2">75% del mes usado</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
