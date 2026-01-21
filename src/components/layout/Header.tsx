// ============================================
// HEADER GLOBAL CON BUSCADOR Y AYUDA
// ============================================

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search, HelpCircle, Bell, User, X, Command,
    FileText, Calendar, Users, Receipt, TrendingUp,
    Upload, Settings, Plus, ArrowRight, Sparkles,
    Keyboard, BookOpen, MessageCircle, ExternalLink
} from 'lucide-react';

// Estructura de acciones rápidas
const quickActions = [
    { id: 'new-invoice', label: 'Nueva Factura', description: 'Crear factura rápida', icon: FileText, href: '/invoices/new', shortcut: '⌘N' },
    { id: 'invoices', label: 'Ver Facturas', description: 'Lista de facturas', icon: FileText, href: '/invoices', shortcut: '⌘I' },
    { id: 'appointments', label: 'Agenda de Citas', description: 'Ver y gestionar citas', icon: Calendar, href: '/appointments', shortcut: '⌘A' },
    { id: 'patients', label: 'Pacientes', description: 'Gestión de pacientes', icon: Users, href: '/patients', shortcut: '⌘P' },
    { id: 'expenses', label: 'Gastos', description: 'Control de gastos', icon: Receipt, href: '/expenses', shortcut: '⌘E' },
    { id: 'analytics', label: 'Análisis', description: 'Informes financieros', icon: TrendingUp, href: '/analytics', shortcut: '⌘L' },
    { id: 'import', label: 'Importar Datos', description: 'Subir CSV/Excel', icon: Upload, href: '/import', shortcut: '⌘U' },
    { id: 'settings', label: 'Configuración', description: 'Ajustes de la clínica', icon: Settings, href: '/settings', shortcut: '⌘,' },
];

// Tips de ayuda
const helpTips = [
    { icon: '💡', title: 'Factura en 1 click', description: 'Desde Citas, haz click en "Facturar" para generar automáticamente la factura PDF.' },
    { icon: '🔔', title: 'Recordatorios automáticos', description: 'Activa en Configuración > Notificaciones los recordatorios de cobro por email.' },
    { icon: '📊', title: 'Alertas inteligentes', description: 'El Dashboard te avisará de no-shows elevados o facturas pendientes.' },
    { icon: '📥', title: 'Importar desde Excel', description: 'En Importar, arrastra tu archivo CSV y el sistema detecta las columnas automáticamente.' },
    { icon: '⌨️', title: 'Atajo rápido', description: 'Pulsa Ctrl+K (o ⌘K en Mac) para abrir el buscador global desde cualquier página.' },
];

export function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showTip, setShowTip] = useState(false);
    const [currentTip, setCurrentTip] = useState(0);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Atajo de teclado Ctrl+K / Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
                setIsHelpOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus en input cuando se abre
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    // Mostrar tip al cargar primera vez
    useEffect(() => {
        const hasSeenTips = localStorage.getItem('hasSeenTips');
        if (!hasSeenTips) {
            setTimeout(() => setShowTip(true), 2000);
        }
    }, []);

    const dismissTip = () => {
        setShowTip(false);
        if (currentTip < helpTips.length - 1) {
            setCurrentTip(prev => prev + 1);
            setTimeout(() => setShowTip(true), 500);
        } else {
            localStorage.setItem('hasSeenTips', 'true');
        }
    };

    const filteredActions = quickActions.filter(action =>
        action.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleActionClick = (href: string) => {
        router.push(href);
        setIsSearchOpen(false);
        setSearchQuery('');
    };

    return (
        <>
            {/* Header bar */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="flex items-center justify-between h-16 px-6">
                    {/* Search trigger */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all group w-80 max-w-md"
                    >
                        <Search className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                        <span className="text-sm text-gray-400 group-hover:text-gray-600">Buscar o ir a...</span>
                        <kbd className="ml-auto hidden sm:flex items-center gap-1 px-2 py-1 bg-white rounded-md border border-gray-200 text-xs text-gray-400">
                            <Command className="w-3 h-3" />K
                        </kbd>
                    </button>

                    {/* Right actions */}
                    <div className="flex items-center gap-2">
                        {/* Help button */}
                        <button
                            onClick={() => setIsHelpOpen(true)}
                            className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors relative group"
                            title="Ayuda y guías"
                        >
                            <HelpCircle className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                        </button>

                        {/* Notifications */}
                        <button className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors relative">
                            <Bell className="w-5 h-5 text-gray-500" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                        </button>

                        {/* User menu */}
                        <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Search/Command Palette Modal */}
            {isSearchOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-[10vh]"
                    onClick={() => setIsSearchOpen(false)}
                >
                    <div
                        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Search input */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="¿Qué quieres hacer?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 text-lg outline-none placeholder:text-gray-400"
                            />
                            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">ESC</kbd>
                        </div>

                        {/* Quick actions */}
                        <div className="max-h-[400px] overflow-y-auto">
                            <div className="px-3 py-2">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-2 mb-2">
                                    Acciones rápidas
                                </p>
                                {filteredActions.map((action, index) => (
                                    <button
                                        key={action.id}
                                        onClick={() => handleActionClick(action.href)}
                                        className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-blue-50 transition-colors group ${index === 0 && !searchQuery ? 'bg-blue-50' : ''
                                            }`}
                                    >
                                        <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors">
                                            <action.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="font-medium text-gray-900 group-hover:text-blue-700">{action.label}</p>
                                            <p className="text-sm text-gray-500">{action.description}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400 font-mono">{action.shortcut}</span>
                                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* No results */}
                            {filteredActions.length === 0 && searchQuery && (
                                <div className="px-5 py-8 text-center">
                                    <p className="text-gray-500">No se encontró "{searchQuery}"</p>
                                    <p className="text-sm text-gray-400 mt-1">Prueba con otra búsqueda</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-3 bg-gray-50 border-t flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-white rounded border">↑</kbd>
                                    <kbd className="px-1.5 py-0.5 bg-white rounded border">↓</kbd>
                                    navegar
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-white rounded border">↵</kbd>
                                    seleccionar
                                </span>
                            </div>
                            <span className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Pulsa <kbd className="px-1.5 py-0.5 bg-white rounded border mx-1">?</kbd> para ayuda
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Help Panel */}
            {isHelpOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 flex justify-end"
                    onClick={() => setIsHelpOpen(false)}
                >
                    <div
                        className="w-full max-w-md bg-white h-full overflow-y-auto animate-slide-in shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-blue-100">
                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-lg font-semibold">Centro de Ayuda</h2>
                            </div>
                            <button
                                onClick={() => setIsHelpOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Quick start guide */}
                            <section>
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-yellow-500" />
                                    Guía rápida
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { step: 1, title: 'Añade tus pacientes', desc: 'Ve a Pacientes y crea tu base de clientes' },
                                        { step: 2, title: 'Registra una cita', desc: 'Programa citas desde la Agenda' },
                                        { step: 3, title: 'Factura en 1 click', desc: 'Al completar la cita, genera la factura automática' },
                                        { step: 4, title: 'Controla tus finanzas', desc: 'El Dashboard muestra todo en tiempo real' },
                                    ].map(item => (
                                        <div key={item.step} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                                            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                {item.step}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{item.title}</p>
                                                <p className="text-sm text-gray-500">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Tips */}
                            <section>
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <HelpCircle className="w-4 h-4 text-green-500" />
                                    Consejos útiles
                                </h3>
                                <div className="space-y-2">
                                    {helpTips.map((tip, i) => (
                                        <div key={i} className="p-3 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
                                            <p className="font-medium flex items-center gap-2">
                                                <span>{tip.icon}</span>
                                                {tip.title}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">{tip.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Keyboard shortcuts */}
                            <section>
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Keyboard className="w-4 h-4 text-purple-500" />
                                    Atajos de teclado
                                </h3>
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                    {[
                                        { keys: ['⌘', 'K'], desc: 'Abrir buscador' },
                                        { keys: ['⌘', 'N'], desc: 'Nueva factura' },
                                        { keys: ['⌘', 'P'], desc: 'Ir a pacientes' },
                                        { keys: ['ESC'], desc: 'Cerrar modal' },
                                    ].map((shortcut, i) => (
                                        <div key={i} className="flex items-center justify-between py-1">
                                            <span className="text-sm text-gray-600">{shortcut.desc}</span>
                                            <div className="flex gap-1">
                                                {shortcut.keys.map((key, j) => (
                                                    <kbd key={j} className="px-2 py-1 bg-white rounded border text-xs font-mono">
                                                        {key}
                                                    </kbd>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Contact support */}
                            <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                                <h3 className="font-semibold text-gray-900 mb-2">¿Necesitas más ayuda?</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Nuestro equipo de soporte está disponible para resolver tus dudas.
                                </p>
                                <div className="flex gap-2">
                                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white rounded-xl text-sm font-medium hover:bg-gray-50 border border-gray-200 transition-colors">
                                        <MessageCircle className="w-4 h-4" />
                                        Chat
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                                        <ExternalLink className="w-4 h-4" />
                                        Documentación
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Tip */}
            {showTip && (
                <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-slide-in">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 flex items-center justify-between">
                            <span className="text-white text-sm font-medium flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Tip del día ({currentTip + 1}/{helpTips.length})
                            </span>
                            <button onClick={dismissTip} className="text-white/80 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4">
                            <p className="font-medium text-gray-900 flex items-center gap-2">
                                <span className="text-xl">{helpTips[currentTip].icon}</span>
                                {helpTips[currentTip].title}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">{helpTips[currentTip].description}</p>
                            <button
                                onClick={dismissTip}
                                className="mt-3 text-sm text-blue-600 font-medium hover:underline"
                            >
                                {currentTip < helpTips.length - 1 ? 'Siguiente tip →' : 'Entendido ✓'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
