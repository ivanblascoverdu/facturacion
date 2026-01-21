// ============================================
// IMPORTADOR CSV/EXCEL
// ============================================

'use client';

import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { Upload, FileSpreadsheet, Check, AlertCircle, X, ArrowRight, RefreshCw } from 'lucide-react';
import { SectionHeader, Badge } from '@/components/ui';
import { useStore } from '@/store/useStore';
import { Patient, Expense, Appointment } from '@/types';

type ImportType = 'patients' | 'expenses' | 'appointments';

interface ImportPreview {
    headers: string[];
    rows: Record<string, string>[];
    mapping: Record<string, string>;
    type: ImportType;
}

const FIELD_MAPPINGS: Record<ImportType, { required: string[]; optional: string[] }> = {
    patients: {
        required: ['name', 'email', 'phone'],
        optional: ['address', 'nif'],
    },
    expenses: {
        required: ['description', 'amount', 'category', 'date'],
        optional: ['supplier', 'invoiceNumber', 'notes'],
    },
    appointments: {
        required: ['patientId', 'professionalId', 'serviceId', 'date', 'startTime', 'price'],
        optional: ['endTime', 'notes'],
    },
};

export function ImportPage() {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<ImportPreview | null>(null);
    const [importType, setImportType] = useState<ImportType>('patients');
    const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');
    const [importedCount, setImportedCount] = useState(0);
    const [errors, setErrors] = useState<string[]>([]);

    const { addPatient, addExpense, addAppointment } = useStore();

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            parseFile(file);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            parseFile(file);
        }
    };

    const parseFile = (file: File) => {
        setErrors([]);
        setImportStatus('idle');

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const headers = results.meta.fields || [];
                const rows = results.data as Record<string, string>[];

                // Auto-detectar tipo basado en columnas
                let detectedType: ImportType = importType;
                if (headers.some(h => h.toLowerCase().includes('email'))) {
                    detectedType = 'patients';
                } else if (headers.some(h => h.toLowerCase().includes('amount') || h.toLowerCase().includes('importe'))) {
                    detectedType = 'expenses';
                }

                // Auto-mapeo de columnas
                const mapping = autoMapColumns(headers, detectedType);

                setPreview({
                    headers,
                    rows: rows.slice(0, 10), // Preview de 10 filas
                    mapping,
                    type: detectedType,
                });
                setImportType(detectedType);
            },
            error: (error) => {
                setErrors([`Error al leer archivo: ${error.message}`]);
            },
        });
    };

    const autoMapColumns = (headers: string[], type: ImportType): Record<string, string> => {
        const mapping: Record<string, string> = {};
        const fieldDefs = FIELD_MAPPINGS[type];
        const allFields = [...fieldDefs.required, ...fieldDefs.optional];

        const synonyms: Record<string, string[]> = {
            name: ['nombre', 'name', 'cliente', 'paciente'],
            email: ['email', 'correo', 'mail', 'e-mail'],
            phone: ['phone', 'telefono', 'teléfono', 'tel', 'móvil', 'movil'],
            address: ['address', 'direccion', 'dirección', 'domicilio'],
            nif: ['nif', 'dni', 'cif', 'documento'],
            description: ['description', 'descripcion', 'descripción', 'concepto'],
            amount: ['amount', 'importe', 'cantidad', 'total', 'precio'],
            category: ['category', 'categoria', 'categoría', 'tipo'],
            date: ['date', 'fecha'],
            supplier: ['supplier', 'proveedor', 'vendedor'],
        };

        allFields.forEach(field => {
            const syns = synonyms[field] || [field];
            const matchedHeader = headers.find(h =>
                syns.some(s => h.toLowerCase().includes(s.toLowerCase()))
            );
            if (matchedHeader) {
                mapping[field] = matchedHeader;
            }
        });

        return mapping;
    };

    const updateMapping = (field: string, header: string) => {
        if (!preview) return;
        setPreview({
            ...preview,
            mapping: { ...preview.mapping, [field]: header },
        });
    };

    const handleImport = async () => {
        if (!preview) return;

        setImportStatus('importing');
        setErrors([]);
        let count = 0;
        const newErrors: string[] = [];

        for (let i = 0; i < preview.rows.length; i++) {
            const row = preview.rows[i];

            try {
                if (preview.type === 'patients') {
                    const patient: Patient = {
                        id: '',
                        name: row[preview.mapping.name] || '',
                        email: row[preview.mapping.email] || '',
                        phone: row[preview.mapping.phone] || '',
                        address: row[preview.mapping.address],
                        nif: row[preview.mapping.nif],
                        createdAt: new Date(),
                        totalVisits: 0,
                        totalSpent: 0,
                    };

                    if (!patient.name || !patient.email) {
                        throw new Error('Nombre y email son obligatorios');
                    }

                    addPatient(patient);
                    count++;
                } else if (preview.type === 'expenses') {
                    const expense: Expense = {
                        id: '',
                        description: row[preview.mapping.description] || '',
                        amount: parseFloat(row[preview.mapping.amount]?.replace(',', '.') || '0'),
                        category: (row[preview.mapping.category] as Expense['category']) || 'other',
                        date: new Date(row[preview.mapping.date] || new Date()),
                        supplier: row[preview.mapping.supplier],
                    };

                    if (!expense.description || expense.amount <= 0) {
                        throw new Error('Descripción y cantidad son obligatorios');
                    }

                    addExpense(expense);
                    count++;
                }
            } catch (err) {
                newErrors.push(`Fila ${i + 2}: ${err instanceof Error ? err.message : 'Error desconocido'}`);
            }
        }

        setImportedCount(count);
        setErrors(newErrors);
        setImportStatus(newErrors.length > 0 ? 'error' : 'success');
    };

    const resetImport = () => {
        setPreview(null);
        setImportStatus('idle');
        setImportedCount(0);
        setErrors([]);
    };

    return (
        <div className="space-y-6">
            <SectionHeader
                title="Importar Datos"
                subtitle="Sube archivos CSV o Excel para importar pacientes, gastos o citas"
            />

            {/* Type selector */}
            <div className="card p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Tipo de datos a importar:</p>
                <div className="flex gap-3">
                    {(['patients', 'expenses', 'appointments'] as ImportType[]).map(type => (
                        <button
                            key={type}
                            onClick={() => setImportType(type)}
                            className={`px-4 py-2 rounded-lg border transition-all ${importType === type
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {type === 'patients' && '👥 Pacientes'}
                            {type === 'expenses' && '💸 Gastos'}
                            {type === 'appointments' && '📅 Citas'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dropzone */}
            {!preview && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`dropzone ${isDragging ? 'active' : ''}`}
                >
                    <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-input"
                    />
                    <label htmlFor="file-input" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                            <div className="p-4 rounded-full bg-blue-100 mb-4">
                                <Upload className="w-8 h-8 text-blue-600" />
                            </div>
                            <p className="text-lg font-medium text-gray-900 mb-1">
                                Arrastra tu archivo aquí
                            </p>
                            <p className="text-gray-500 mb-4">
                                o haz clic para seleccionar
                            </p>
                            <div className="flex gap-2">
                                <Badge variant="gray">CSV</Badge>
                                <Badge variant="gray">Excel</Badge>
                            </div>
                        </div>
                    </label>
                </div>
            )}

            {/* Preview */}
            {preview && importStatus === 'idle' && (
                <div className="space-y-6">
                    {/* Field mapping */}
                    <div className="card p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Mapeo de Columnas</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Asocia las columnas de tu archivo con los campos del sistema
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...FIELD_MAPPINGS[preview.type].required, ...FIELD_MAPPINGS[preview.type].optional].map(field => {
                                const isRequired = FIELD_MAPPINGS[preview.type].required.includes(field);
                                const isMapped = !!preview.mapping[field];

                                return (
                                    <div key={field} className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                {field}
                                                {isRequired && <span className="text-red-500">*</span>}
                                                {isMapped && <Check className="w-4 h-4 text-green-500" />}
                                            </label>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-400" />
                                        <select
                                            value={preview.mapping[field] || ''}
                                            onChange={(e) => updateMapping(field, e.target.value)}
                                            className="input !w-48"
                                        >
                                            <option value="">-- Seleccionar --</option>
                                            {preview.headers.map(header => (
                                                <option key={header} value={header}>{header}</option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Data preview */}
                    <div className="card overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b">
                            <h3 className="font-semibold text-gray-900">
                                Vista previa ({preview.rows.length} de las primeras filas)
                            </h3>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        {preview.headers.map(header => (
                                            <th key={header}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {preview.rows.map((row, i) => (
                                        <tr key={i}>
                                            {preview.headers.map(header => (
                                                <td key={header}>{row[header]}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <button onClick={resetImport} className="btn btn-ghost">
                            <X className="w-4 h-4" />
                            Cancelar
                        </button>
                        <button onClick={handleImport} className="btn btn-primary">
                            <FileSpreadsheet className="w-4 h-4" />
                            Importar {preview.rows.length} registros
                        </button>
                    </div>
                </div>
            )}

            {/* Import status */}
            {importStatus === 'importing' && (
                <div className="card p-12 text-center">
                    <RefreshCw className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
                    <p className="text-lg font-medium">Importando datos...</p>
                </div>
            )}

            {importStatus === 'success' && (
                <div className="card p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mb-2">
                        ¡Importación completada!
                    </p>
                    <p className="text-gray-500 mb-6">
                        Se importaron {importedCount} registros correctamente
                    </p>
                    <button onClick={resetImport} className="btn btn-primary">
                        Importar más datos
                    </button>
                </div>
            )}

            {importStatus === 'error' && errors.length > 0 && (
                <div className="card p-6">
                    <div className="flex items-start gap-3 mb-4">
                        <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-gray-900">
                                Importación parcial: {importedCount} registros importados
                            </p>
                            <p className="text-sm text-gray-500">
                                Algunos registros no pudieron importarse:
                            </p>
                        </div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 max-h-48 overflow-auto">
                        {errors.map((error, i) => (
                            <p key={i} className="text-sm text-yellow-800">{error}</p>
                        ))}
                    </div>
                    <div className="mt-4">
                        <button onClick={resetImport} className="btn btn-primary">
                            Intentar de nuevo
                        </button>
                    </div>
                </div>
            )}

            {/* Help */}
            <div className="card p-6 bg-blue-50 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Consejos para importar</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Usa la primera fila como encabezados de columna</li>
                    <li>• Las fechas deben estar en formato DD/MM/YYYY o YYYY-MM-DD</li>
                    <li>• Los importes pueden usar punto o coma como separador decimal</li>
                    <li>• Puedes exportar desde Excel guardando como CSV (UTF-8)</li>
                </ul>
            </div>
        </div>
    );
}
