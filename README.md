# Estación Óptica v3.0 - Enterprise Edition

**Aplicación web full-stack profesional para gestión de óptica con panel administrativo, inventario dinámico y sistema de pedidos.**

---

## 🚀 Stack Tecnológico

### Frontend
- **React 18** + **Vite** - Framework moderno y ultra-rápido
- **Tailwind CSS** - Styling profesional y responsive
- **Framer Motion** - Animaciones suaves y profesionales
- **React Router** - Navegación SPA
- **Zustand** - State management ligero
- **Lucide React** - Iconos modernos
- **Axios** - HTTP client

### Backend
- **Node.js** + **Express** - Servidor API RESTful
- **MongoDB** + **Mongoose** - Base de datos NoSQL
- **JWT** - Autenticación segura
- **bcrypt** - Encriptación de contraseñas
- **Multer** - Manejo de archivos

---

## 📦 Instalación

### Requisitos Previos
- Node.js v18+ instalado
- MongoDB instalado y corriendo localmente (o MongoDB Atlas)
- Git instalado

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/AxamGing/estacion-optica-vip.git
cd estacion-optica-v3
```

### Paso 2: Instalar Dependencias
```bash
npm install
```

### Paso 3: Configurar Variables de Entorno
Copia el archivo `.env.example` en el directorio `server/`:
```bash
cp server/.env.example server/.env
```

Edita `server/.env` con tus configuraciones:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/estacion-optica
JWT_SECRET=tu-secret-key-aqui
FRONTEND_URL=http://localhost:5174
```

### Paso 4: Iniciar MongoDB
Asegúrate de que MongoDB esté corriendo:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

---

## 🎯 Uso

### Desarrollo (Frontend + Backend simultáneamente)
```bash
npm start
```

Esto iniciará:
- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:5000

### Solo Frontend
```bash
npm run dev
```

### Solo Backend
```bash
npm run server:dev
```

### Producción
```bash
# Build frontend
npm run build

# Start backend
npm run server
```

---

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar admin
- `POST /api/auth/login` - Login admin
- `GET /api/auth/me` - Obtener perfil (protegido)

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:id` - Actualizar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)

### Pedidos
- `POST /api/orders` - Crear pedido (público)
- `GET /api/orders` - Listar pedidos (admin)
- `GET /api/orders/:id` - Obtener pedido (admin)
- `PUT /api/orders/:id` - Actualizar pedido (admin)

### Health Check
- `GET /api/health` - Estado del servidor

---

## 🗂️ Estructura del Proyecto

```
estacion-optica-v3/
├── src/                          # Frontend React
│   ├── components/
│   │   ├── layout/              # Header, Footer
│   │   ├── sections/            # Hero, Services, Gallery, etc.
│   │   └── common/              # Componentes reutilizables
│   ├── pages/                   # Páginas principales
│   ├── hooks/                   # Custom hooks
│   ├── store/                   # Zustand stores
│   ├── services/                # API calls
│   └── utils/                   # Helpers
│
├── server/                      # Backend Node.js
│   ├── src/
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # API routes
│   │   ├── controllers/        # Business logic
│   │   ├── middleware/         # Auth, validation
│   │   ├── config/             # Database config
│   │   └── utils/              # Helpers
│   ├── server.js               # Entry point
│   └── .env                    # Environment variables
│
├── public/                      # Assets estáticos
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🔐 Primer Uso - Crear Admin

Para crear el primer usuario administrador, usa Postman o curl:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@estacionoptica.com",
    "password": "admin123"
  }'
```

Respuesta:
```json
{
  "_id": "...",
  "username": "admin",
  "email": "admin@estacionoptica.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Guarda el `token` para usarlo en requests protegidos.

---

## 🛠️ Desarrollo

### Agregar Nuevo Producto (Ejemplo)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "name": "Ray-Ban Aviator",
    "category": "monturas",
    "price": 150,
    "description": "Monturas clásicas de aviador",
    "stock": 10,
    "featured": true,
    "specifications": {
      "material": "Metal",
      "color": "Dorado",
      "size": "Medium"
    }
  }'
```

---

## 🚢 Deployment

### Frontend (Netlify)
1. Build el proyecto:
```bash
npm run build
```

2. Deploy la carpeta `dist/` a Netlify

3. Configura redirects en `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Backend (Railway/Render)
1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno
3. Deploy automático desde `main` branch

---

## 📝 Características

### Frontend
✅ Diseño responsive y mobile-first  
✅ Animaciones profesionales con Framer Motion  
✅ Navegación suave con scroll effects  
✅ Integración WhatsApp Business  
✅ Google Maps embebido  
✅ Optimizado para SEO  

### Backend
✅ API RESTful completa  
✅ Autenticación JWT segura  
✅ CRUD completo de productos  
✅ Sistema de pedidos  
✅ Validación de datos  
✅ Manejo de errores robusto  

---

## 🎨 Personalización

### Colores de Marca
Edita `tailwind.config.js`:
```javascript
colors: {
  'eo-primary': '#106AA5',    // Azul principal
  'eo-accent': '#046A80',     // Azul oscuro
  'eo-dark': '#1A1C1E',       // Texto oscuro
  'eo-light': '#F8FAFC',      // Fondo claro
}
```

---

## 📞 Soporte

- **Email**: estacionoptica22@gmail.com
- **WhatsApp**: +58 424-7448728
- **Instagram**: [@estacion_optica_](https://instagram.com/estacion_optica_)

---

## 📄 Licencia

© 2024 Estación Óptica. Todos los derechos reservados.  
Desarrollado por **Isaron Studio**

---

## 🔄 Versiones

- **v1.0** - Sitio HTML estático
- **v2.0** - Realineación estética formal
- **v3.0** - Aplicación full-stack enterprise (actual)

---

**¡Listo para producción!** 🚀
