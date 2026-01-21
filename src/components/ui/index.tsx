// ============================================
// COMPONENTES UI REUTILIZABLES
// ============================================

'use client';

import React, { ReactNode } from 'react';
import {
    TrendingUp, TrendingDown, Minus,
    X, AlertTriangle, CheckCircle, Info, AlertCircle
} from 'lucide-react';

// ============================================
// KPI CARDS
// ============================================

interface KPICardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    change?: number;
    changeLabel?: string;
    type?: 'income' | 'expense' | 'pending' | 'flow' | 'neutral';
    icon?: ReactNode;
    action?: ReactNode;
}

export function KPICard({
    title,
    value,
    subtitle,
    change,
    changeLabel,
    type = 'neutral',
    icon,
    action
}: KPICardProps) {
    const getTrendIcon = () => {
        if (change === undefined || change === 0) return <Minus className="w-4 h-4" />;
        return change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
    };

    const getTrendClass = () => {
        if (change === undefined || change === 0) return 'trend neutral';
        // Para gastos, lo inverso es bueno
        if (type === 'expense') {
            return change > 0 ? 'trend down' : 'trend up';
        }
        return change > 0 ? 'trend up' : 'trend down';
    };

    return (
        <div className={`card kpi-card ${type} animate-fade-in`}>
            <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">{title}</span>
                {icon && (
                    <div className="p-2 rounded-lg bg-gray-50">
                        {icon}
                    </div>
                )}
            </div>

            <div className="text-3xl font-bold text-gray-900 mb-1">
                {typeof value === 'number' ? value.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }) : value}
            </div>

            {subtitle && (
                <p className="text-sm text-gray-500 mb-2">{subtitle}</p>
            )}

            {change !== undefined && (
                <div className="flex items-center gap-2">
                    <span className={getTrendClass()}>
                        {getTrendIcon()}
                        {Math.abs(change).toFixed(1)}%
                    </span>
                    {changeLabel && (
                        <span className="text-xs text-gray-400">{changeLabel}</span>
                    )}
                </div>
            )}

            {action && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    {action}
                </div>
            )}
        </div>
    );
}

// ============================================
// ALERT BANNER
// ============================================

interface AlertBannerProps {
    type: 'success' | 'warning' | 'danger' | 'info';
    title: string;
    message: string;
    onDismiss?: () => void;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function AlertBanner({ type, title, message, onDismiss, action }: AlertBannerProps) {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-600" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
        danger: <AlertCircle className="w-5 h-5 text-red-600" />,
        info: <Info className="w-5 h-5 text-blue-600" />,
    };

    return (
        <div className={`alert alert-${type} animate-slide-in`}>
            <div className="flex-shrink-0 mt-0.5">
                {icons[type]}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-sm opacity-90">{message}</p>
                {action && (
                    <button
                        onClick={action.onClick}
                        className="mt-2 text-sm font-medium underline hover:no-underline"
                    >
                        {action.label} →
                    </button>
                )}
            </div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}

// ============================================
// BADGE
// ============================================

interface BadgeProps {
    variant: 'success' | 'warning' | 'danger' | 'primary' | 'gray';
    children: ReactNode;
    size?: 'sm' | 'md';
}

export function Badge({ variant, children, size = 'md' }: BadgeProps) {
    const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : '';
    return (
        <span className={`badge badge-${variant} ${sizeClasses}`}>
            {children}
        </span>
    );
}

// ============================================
// PROGRESS BAR
// ============================================

interface ProgressBarProps {
    value: number;
    max: number;
    variant?: 'success' | 'warning' | 'danger';
    showLabel?: boolean;
    label?: string;
}

export function ProgressBar({
    value,
    max,
    variant = 'success',
    showLabel = false,
    label
}: ProgressBarProps) {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div>
            {(showLabel || label) && (
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold">{percentage.toFixed(0)}%</span>
                </div>
            )}
            <div className="progress-bar">
                <div
                    className={`progress-bar-fill ${variant}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

// ============================================
// STAT CARD (mini)
// ============================================

interface StatCardProps {
    label: string;
    value: string | number;
    suffix?: string;
    trend?: 'up' | 'down' | 'neutral';
    className?: string;
}

export function StatCard({ label, value, suffix, trend, className = '' }: StatCardProps) {
    const trendColors = {
        up: 'text-green-500',
        down: 'text-red-500',
        neutral: 'text-gray-500'
    };

    return (
        <div className={`text-center p-4 ${className}`}>
            <p className="text-2xl font-bold text-gray-900">
                {value}
                {suffix && <span className="text-lg font-normal text-gray-500">{suffix}</span>}
            </p>
            <p className={`text-sm ${trend ? trendColors[trend] : 'text-gray-500'}`}>
                {label}
            </p>
        </div>
    );
}

// ============================================
// EMPTY STATE
// ============================================

interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="p-4 rounded-full bg-gray-100 mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 max-w-sm mb-6">{description}</p>
            {action}
        </div>
    );
}

// ============================================
// LOADING SPINNER
// ============================================

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className="flex justify-center items-center p-4">
            <div className={`${sizes[size]} border-2 border-gray-200 border-t-primary-500 rounded-full animate-spin`} />
        </div>
    );
}

// ============================================
// SECTION HEADER
// ============================================

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    action?: ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
        </div>
    );
}
