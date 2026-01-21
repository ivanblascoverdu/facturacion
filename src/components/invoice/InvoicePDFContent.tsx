// ============================================
// GENERADOR DE FACTURAS PDF (Client-side only)
// ============================================

'use client';

import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFDownloadLink,
    pdf,
} from '@react-pdf/renderer';
import { Invoice, Patient, ClinicConfig } from '@/types';

// Estilos del PDF
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff',
    },
    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        paddingBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#3b82f6',
    },
    logoSection: {
        width: '50%',
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginBottom: 4,
    },
    clinicInfo: {
        fontSize: 9,
        color: '#6b7280',
        lineHeight: 1.4,
    },
    invoiceSection: {
        width: '40%',
        textAlign: 'right',
    },
    invoiceTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginBottom: 8,
    },
    invoiceNumber: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 4,
    },
    invoiceDate: {
        fontSize: 10,
        color: '#6b7280',
    },
    // Status badge
    statusBadge: {
        marginTop: 10,
        padding: '4 12',
        borderRadius: 12,
        alignSelf: 'flex-end',
    },
    statusPaid: {
        backgroundColor: '#d1fae5',
        color: '#065f46',
    },
    statusPending: {
        backgroundColor: '#fef3c7',
        color: '#92400e',
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    // Billing info
    billingSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    billingBox: {
        width: '45%',
        padding: 15,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
    },
    billingLabel: {
        fontSize: 8,
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    billingName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    billingDetails: {
        fontSize: 9,
        color: '#6b7280',
        lineHeight: 1.5,
    },
    // Table
    table: {
        marginBottom: 30,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#1e3a8a',
        padding: '10 12',
        borderRadius: 6,
    },
    tableHeaderCell: {
        color: '#ffffff',
        fontSize: 9,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        padding: '12 12',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    tableCell: {
        fontSize: 10,
        color: '#374151',
    },
    colDescription: { width: '40%' },
    colQuantity: { width: '15%', textAlign: 'center' },
    colPrice: { width: '20%', textAlign: 'right' },
    colVat: { width: '10%', textAlign: 'right' },
    colTotal: { width: '15%', textAlign: 'right' },
    // Totals
    totalsSection: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 30,
    },
    totalsBox: {
        width: '40%',
    },
    totalsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '6 0',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    totalsLabel: {
        fontSize: 10,
        color: '#6b7280',
    },
    totalsValue: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#374151',
    },
    totalsFinal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '12 0',
        marginTop: 8,
        backgroundColor: '#1e3a8a',
        borderRadius: 6,
        paddingHorizontal: 12,
    },
    totalsFinalLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    totalsFinalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    // Payment info
    paymentSection: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 30,
    },
    paymentBox: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
    },
    paymentTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 8,
    },
    paymentText: {
        fontSize: 9,
        color: '#6b7280',
        lineHeight: 1.5,
    },
    // QR Section (placeholder)
    qrSection: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0fdf4',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#86efac',
    },
    qrText: {
        fontSize: 10,
        color: '#166534',
        textAlign: 'center',
        marginTop: 8,
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    footerText: {
        fontSize: 8,
        color: '#9ca3af',
        lineHeight: 1.5,
    },
    // Notes
    notesSection: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#fefce8',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#fbbf24',
    },
    notesTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#92400e',
        marginBottom: 4,
    },
    notesText: {
        fontSize: 9,
        color: '#78350f',
    },
});

// ============================================
// COMPONENTE DE FACTURA PDF
// ============================================

interface InvoicePDFProps {
    invoice: Invoice;
    patient: Patient;
    clinic: ClinicConfig;
}

function InvoicePDF({ invoice, patient, clinic }: InvoicePDFProps) {
    const isPaid = invoice.status === 'paid';

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoSection}>
                        <Text style={styles.logoText}>{clinic.name}</Text>
                        <Text style={styles.clinicInfo}>
                            {clinic.address}{'\n'}
                            Tel: {clinic.phone}{'\n'}
                            Email: {clinic.email}{'\n'}
                            NIF: {clinic.nif}
                        </Text>
                    </View>
                    <View style={styles.invoiceSection}>
                        <Text style={styles.invoiceTitle}>FACTURA</Text>
                        <Text style={styles.invoiceNumber}>{invoice.number}</Text>
                        <Text style={styles.invoiceDate}>
                            Fecha: {invoice.issueDate.toLocaleDateString('es-ES')}
                        </Text>
                        <Text style={styles.invoiceDate}>
                            Vencimiento: {invoice.dueDate.toLocaleDateString('es-ES')}
                        </Text>
                        <View style={[styles.statusBadge, isPaid ? styles.statusPaid : styles.statusPending]}>
                            <Text style={styles.statusText}>
                                {isPaid ? '✓ PAGADA' : 'PENDIENTE'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Billing Info */}
                <View style={styles.billingSection}>
                    <View style={styles.billingBox}>
                        <Text style={styles.billingLabel}>Facturar a</Text>
                        <Text style={styles.billingName}>{patient.name}</Text>
                        <Text style={styles.billingDetails}>
                            {patient.address && `${patient.address}\n`}
                            {patient.nif && `NIF: ${patient.nif}\n`}
                            Email: {patient.email}{'\n'}
                            Tel: {patient.phone}
                        </Text>
                    </View>
                    <View style={styles.billingBox}>
                        <Text style={styles.billingLabel}>Detalles de Pago</Text>
                        <Text style={styles.billingDetails}>
                            Banco: {clinic.bankAccount || 'Consultar'}{'\n'}
                            {invoice.paymentMethod && `Método: ${invoice.paymentMethod}\n`}
                            {invoice.paidDate && `Fecha pago: ${invoice.paidDate.toLocaleDateString('es-ES')}`}
                        </Text>
                    </View>
                </View>

                {/* Items Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, styles.colDescription]}>Descripción</Text>
                        <Text style={[styles.tableHeaderCell, styles.colQuantity]}>Cantidad</Text>
                        <Text style={[styles.tableHeaderCell, styles.colPrice]}>Precio Unit.</Text>
                        <Text style={[styles.tableHeaderCell, styles.colVat]}>IVA</Text>
                        <Text style={[styles.tableHeaderCell, styles.colTotal]}>Total</Text>
                    </View>

                    {invoice.items.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.colDescription]}>{item.description}</Text>
                            <Text style={[styles.tableCell, styles.colQuantity]}>{item.quantity}</Text>
                            <Text style={[styles.tableCell, styles.colPrice]}>
                                {item.unitPrice.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
                            </Text>
                            <Text style={[styles.tableCell, styles.colVat]}>{item.vatRate}%</Text>
                            <Text style={[styles.tableCell, styles.colTotal]}>
                                {item.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Totals */}
                <View style={styles.totalsSection}>
                    <View style={styles.totalsBox}>
                        <View style={styles.totalsRow}>
                            <Text style={styles.totalsLabel}>Subtotal</Text>
                            <Text style={styles.totalsValue}>
                                {invoice.subtotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
                            </Text>
                        </View>
                        <View style={styles.totalsRow}>
                            <Text style={styles.totalsLabel}>IVA ({invoice.vatRate}%)</Text>
                            <Text style={styles.totalsValue}>
                                {invoice.vatAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
                            </Text>
                        </View>
                        <View style={styles.totalsFinal}>
                            <Text style={styles.totalsFinalLabel}>TOTAL</Text>
                            <Text style={styles.totalsFinalValue}>
                                {invoice.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Notes */}
                {invoice.notes && (
                    <View style={styles.notesSection}>
                        <Text style={styles.notesTitle}>Notas:</Text>
                        <Text style={styles.notesText}>{invoice.notes}</Text>
                    </View>
                )}

                {/* Payment Info */}
                <View style={styles.paymentSection}>
                    <View style={styles.paymentBox}>
                        <Text style={styles.paymentTitle}>💳 Formas de Pago</Text>
                        <Text style={styles.paymentText}>
                            • Efectivo en clínica{'\n'}
                            • Tarjeta de crédito/débito{'\n'}
                            • Transferencia bancaria{'\n'}
                            • Bizum al {clinic.phone}
                        </Text>
                    </View>
                    <View style={styles.qrSection}>
                        <Text style={{ fontSize: 32 }}>📱</Text>
                        <Text style={styles.qrText}>
                            Escanea para pagar{'\n'}con Bizum o PayPal
                        </Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        {clinic.name} • {clinic.address} • NIF: {clinic.nif}{'\n'}
                        Tel: {clinic.phone} • Email: {clinic.email}
                        {clinic.website && ` • ${clinic.website}`}
                    </Text>
                </View>
            </Page>
        </Document>
    );
}

// ============================================
// BOTÓN DE DESCARGA PDF
// ============================================

interface DownloadInvoicePDFProps {
    invoice: Invoice;
    patient: Patient;
    clinic: ClinicConfig;
    className?: string;
    children?: React.ReactNode;
}

export function DownloadInvoicePDFButton({
    invoice,
    patient,
    clinic,
    className = 'btn btn-primary',
    children
}: DownloadInvoicePDFProps) {
    return (
        <PDFDownloadLink
            document={<InvoicePDF invoice={invoice} patient={patient} clinic={clinic} />}
            fileName={`${invoice.number}.pdf`}
            className={className}
        >
            {({ loading }) => (loading ? 'Generando PDF...' : children || 'Descargar PDF')}
        </PDFDownloadLink>
    );
}

// ============================================
// GENERAR PDF BLOB (para envío por email/WhatsApp)
// ============================================

export async function generateInvoicePDFBlob(
    invoice: Invoice,
    patient: Patient,
    clinic: ClinicConfig
): Promise<Blob> {
    const doc = <InvoicePDF invoice={invoice} patient={patient} clinic={clinic} />;
    const blob = await pdf(doc).toBlob();
    return blob;
}
