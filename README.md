# 🧾 FacturaPYME - Sistema de Facturación para Clínicas

Sistema de facturación y análisis financiero diseñado para clínicas y pequeñas empresas. Genera facturas profesionales, controla cobros pendientes y visualiza KPIs en tiempo real.

## 🚀 Características

### 📊 Dashboard
- **Resumen financiero en tiempo real**: Ingresos, gastos, flujo de caja
- **Indicadores clave**: Tasa de no-shows, margen operativo, facturas pendientes
- **Alertas inteligentes**: Notificaciones sobre pagos vencidos, no-shows elevados
- **Gráficos interactivos**: Evolución de ingresos vs gastos, servicios más rentables

### 📄 Facturación
- **Generación de facturas**: Crea facturas profesionales en PDF
- **Gestión de estados**: Pendiente, Pagada, Vencida
- **Envío de recordatorios**: Notifica a pacientes sobre pagos pendientes
- **Filtrado avanzado**: Busca por número, paciente o estado

### 📅 Agenda de Citas
- **Gestión de citas**: Programa, confirma y completa citas
- **Facturación automática**: Al completar una cita, se genera la factura
- **Control de no-shows**: Registra ausencias para estadísticas
- **Vista de estado**: Programadas, completadas, no-shows

### 👥 Pacientes
- **Base de datos de pacientes**: Gestiona información de contacto
- **Historial de visitas**: Consulta visitas y gastos por paciente
- **Estadísticas individuales**: Valor medio por paciente

### 💰 Gastos
- **Registro de gastos**: Categoriza y controla todos los gastos
- **Categorías**: Suministros, alquiler, nóminas, marketing, seguros
- **Análisis de costes**: Visualiza distribución de gastos

### 📈 Análisis
- **Informes financieros**: Gráficos de tendencias y comparativas
- **Métricas de rendimiento**: KPIs del negocio
- **Exportación de datos**: Descarga informes

### 📥 Importar Datos
- **Importación CSV**: Sube datos desde Excel/CSV
- **Detección automática**: El sistema identifica columnas automáticamente
- **Vista previa**: Revisa antes de importar

### ⚙️ Configuración
- **Datos de la clínica**: Nombre, dirección, NIF, cuenta bancaria
- **Profesionales**: Gestiona el equipo
- **Servicios**: Configura precios y duración
- **Preferencias**: Personaliza el sistema

---

## 🛠️ Tecnologías

- **Frontend**: Next.js 16, React 19, TypeScript
- **Estilos**: Tailwind CSS 4
- **Estado**: Zustand
- **Gráficos**: Chart.js + react-chartjs-2
- **PDFs**: @react-pdf/renderer
- **Iconos**: Lucide React
- **Fechas**: date-fns

---

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/ivanblascoverdu/facturacion.git
cd facturacion

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example.txt .env.local
# Edita .env.local con tus datos

# Iniciar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🌐 Despliegue en Vercel

1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com) e importa tu repositorio
3. Configura las variables de entorno (opcional)
4. ¡Despliega!

---

## ⌨️ Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `⌘/Ctrl + K` | Abrir buscador global |
| `⌘/Ctrl + N` | Nueva factura |
| `⌘/Ctrl + P` | Ir a pacientes |
| `ESC` | Cerrar modal |

---

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas de Next.js (App Router)
│   ├── page.tsx           # Dashboard
│   ├── invoices/          # Facturación
│   ├── appointments/      # Citas
│   ├── patients/          # Pacientes
│   ├── expenses/          # Gastos
│   ├── analytics/         # Análisis
│   ├── import/            # Importar datos
│   └── settings/          # Configuración
├── components/            # Componentes React
│   ├── dashboard/         # Dashboard principal
│   ├── invoice/           # Facturas y PDF
│   ├── layout/            # Header y Sidebar
│   ├── charts/            # Gráficos
│   ├── ui/                # Componentes UI reutilizables
│   └── import/            # Importación de datos
├── store/                 # Estado global (Zustand)
├── data/                  # Datos iniciales/mock
└── types/                 # Tipos TypeScript
```

---

## ⚠️ Nota Importante

Esta versión usa **almacenamiento en memoria**. Los datos se reinician al refrescar la página. Para uso en producción, considera integrar:

- **Supabase**: Base de datos PostgreSQL + autenticación
- **Prisma**: ORM para bases de datos
- **NextAuth**: Sistema de autenticación

---

## 📄 Licencia

MIT © 2026 Iván Blasco

---

## 👨‍💻 Autor

Desarrollado por **Iván Blasco**
- GitHub: [@ivanblascoverdu](https://github.com/ivanblascoverdu)
