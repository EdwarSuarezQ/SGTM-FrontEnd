# SGTM-CRUD Frontend

Interfaz de usuario para el sistema de gestión de transporte marítimo.

---

## 📋 Requisitos Previos

### 1. Node.js (v18 o superior)

**Verificar:**
```bash
node --version
npm --version
```

**Instalar:**
- Descarga desde [https://nodejs.org/](https://nodejs.org/) (versión LTS)

### 2. Backend corriendo

- El backend debe estar corriendo en `http://localhost:4000`
- Ver [backend/README.md](../backend/README.md) para instrucciones

---

## 🛠️ Tecnologías Utilizadas

### Core
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | ^18.2.0 | Biblioteca de UI |
| **Vite** | ^5.0.8 | Build tool |
| **React Router** | ^6.30.2 | Navegación |
| **Axios** | ^1.13.2 | Cliente HTTP |

### Estilos y UI
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Tailwind CSS** | ^3.4.18 | Framework de estilos |
| **Lucide React** | ^0.554.0 | Iconos |
| **@heroicons/react** | ^2.2.0 | Iconos adicionales |
| **Font Awesome** | ^7.1.0 | Iconos Font Awesome |

### Formularios y Validación
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React Hook Form** | ^7.49.2 | Manejo de formularios |
| **React Select** | ^5.10.2 | Selectores avanzados |

### Utilidades
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React Hot Toast** | ^2.6.0 | Notificaciones |
| **XLSX** | ^0.18.5 | Exportación a Excel |
| **Date-fns** | ^4.1.0 | Manipulación de fechas |
| **Country State City** | ^3.2.1 | Datos geográficos |

---

## 🚀 Instalación

### 1. Navega a la carpeta del frontend

```bash
cd frontEnd
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. (Opcional) Configura variables de entorno

Solo si tu backend NO está en `http://localhost:4000`, crea un archivo `.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

### 4. Inicia la aplicación

```bash
# Modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build
npm run preview
```

---

## 📂 Estructura del Proyecto

```
frontEnd/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── common/       # Componentes comunes
│   │   ├── dashboard/    # Dashboard
│   │   ├── tareas/       # Tareas
│   │   ├── embarques/    # Embarques
│   │   ├── personal/     # Personal
│   │   ├── almacenes/    # Almacenes
│   │   ├── embarcaciones/# Embarcaciones
│   │   ├── facturas/     # Facturas
│   │   └── rutas/        # Rutas
│   │
│   ├── pages/            # Páginas principales
│   ├── context/          # Context API (Auth)
│   ├── api/              # Configuración Axios
│   ├── utils/            # Utilidades
│   ├── App.jsx           # Componente raíz
│   ├── main.jsx          # Punto de entrada
│   └── index.css         # Estilos globales
│
├── public/               # Archivos estáticos
├── .env                  # Variables de entorno (opcional)
├── package.json          # Dependencias
├── tailwind.config.js    # Configuración Tailwind
└── vite.config.js        # Configuración Vite
```

---

## 🎨 Características

- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Autenticación con JWT
- ✅ CRUD completo para todos los recursos
- ✅ Dashboard con estadísticas
- ✅ Exportación de datos (JSON, CSV, Excel)
- ✅ Validación de formularios
- ✅ Notificaciones elegantes
- ✅ Búsqueda y filtros
- ✅ Paginación

---

## ❓ Solución de Problemas

| Error | Solución |
|-------|----------|
| "Cannot find module" | `rm -rf node_modules && npm install` |
| "Network Error" | Verifica que el backend esté en `http://localhost:4000` |
| "Unexpected token '<'" | Problema de CORS, verifica configuración del backend |
| Estilos no cargan | `rm -rf node_modules/.vite && npm run dev` |

--------------------------------

[Ver](sgtm.vercel.app)