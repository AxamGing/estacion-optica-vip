# 🚀 Despliegue Rápido - Estación Óptica v3 Enterprise

## ⚡ Paso 1: MongoDB Atlas (5 minutos)

### 1.1 Crear Cuenta
1. Ve a: https://www.mongodb.com/cloud/atlas/register
2. Sign up con Google (más rápido)
3. Verifica tu email

### 1.2 Crear Cluster GRATIS
1. Click "Build a Database"
2. Selecciona **M0 FREE** (primer opción)
3. Provider: AWS
4. Region: N. Virginia (us-east-1)
5. Click "Create Deployment"

### 1.3 Crear Usuario
1. Username: `admin`
2. Click "Autogenerate Secure Password"
3. **COPIA Y GUARDA LA CONTRASEÑA** ⚠️
4. Click "Create Database User"

### 1.4 Permitir Acceso
1. Scroll abajo
2. Click "Allow Access from Anywhere"
3. Click "Finish and Close"

### 1.5 Obtener Connection String
1. Click "Connect" en tu cluster
2. Click "Drivers"
3. Copia el connection string
4. Reemplaza `<password>` con tu contraseña
5. Agrega `/estacion-optica` antes del `?`

**Ejemplo final:**
```
mongodb+srv://admin:TU_PASSWORD@cluster0.xxxxx.mongodb.net/estacion-optica?retryWrites=true&w=majority
```

**GUARDA ESTA URL** - la necesitarás en el siguiente paso

---

## 🚂 Paso 2: Railway (Backend) - 3 minutos

### 2.1 Ir a Railway
https://railway.app

### 2.2 Login
- Click "Login with GitHub"
- Autoriza Railway

### 2.3 Crear Proyecto
1. Click "New Project"
2. Click "Deploy from GitHub repo"
3. Selecciona `estacion-optica-v3`
4. Railway detectará Node.js automáticamente

### 2.4 Configurar Variables
1. Click en tu proyecto
2. Click "Variables"
3. Agrega estas variables:

```
MONGODB_URI=tu_connection_string_de_atlas
JWT_SECRET=estacion-optica-secret-2024
PORT=5000
NODE_ENV=production
```

4. Click "Deploy"

### 2.5 Obtener URL del Backend
1. Click en "Settings"
2. Click "Generate Domain"
3. Copia la URL (ejemplo: `estacion-optica-production.up.railway.app`)

**GUARDA ESTA URL** - la necesitarás para el frontend

---

## 🌐 Paso 3: Netlify (Frontend) - 2 minutos

### 3.1 Build el Frontend
En tu terminal:
```bash
cd estacion-optica-v3
npm run build
```

### 3.2 Configurar Variables de Entorno
Antes de desplegar, crea archivo `.env.production`:
```
VITE_API_URL=https://TU_URL_DE_RAILWAY
```

### 3.3 Desplegar
1. Ve a Netlify: https://app.netlify.com
2. "Add new site" → "Import an existing project"
3. Selecciona `estacion-optica-v3`
4. Configuración:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. En "Environment variables" agrega:
   - Key: `VITE_API_URL`
   - Value: `https://TU_URL_DE_RAILWAY`
6. Click "Deploy"

---

## ✅ Verificar que Todo Funciona

1. **Abre tu sitio de Netlify**
2. **Ve a** `/admin` (ejemplo: `https://tu-sitio.netlify.app/admin`)
3. **Crea primer admin:**
   - Usa Postman o curl:
   ```bash
   curl -X POST https://TU_URL_RAILWAY/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","email":"admin@estacionoptica.com","password":"admin123"}'
   ```
4. **Login** con esas credenciales
5. **Agrega productos** desde el panel

---

## 🎉 ¡Listo!

Tu cliente ahora puede:
- ✅ Entrar a `/admin`
- ✅ Subir fotos de productos
- ✅ Gestionar inventario
- ✅ Ver pedidos
- ✅ Todo sin programar

**¡Como Canva pero para su óptica!** 🎨
