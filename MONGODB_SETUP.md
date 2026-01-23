# 🍃 Guía MongoDB Atlas para Principiantes

**¡No necesitas instalar NADA en tu computadora!** Vamos a usar MongoDB en la nube (gratis).

---

## 📋 Paso 1: Crear Cuenta en MongoDB Atlas

1. **Ve a**: https://www.mongodb.com/cloud/atlas/register

2. **Completa el formulario:**
   - Email: tu email
   - Password: crea una contraseña segura
   - First Name: tu nombre
   - Last Name: tu apellido

3. **Click en "Create your Atlas account"**

4. **Verifica tu email** (revisa tu bandeja de entrada)

---

## 🎯 Paso 2: Crear tu Primer Cluster (Base de Datos)

Después de iniciar sesión verás una pantalla de bienvenida:

1. **Click en "Build a Database"** (botón verde)

2. **Selecciona el plan GRATIS:**
   - Click en **"M0 FREE"** (el primero)
   - Dice "Shared" y "FREE"
   - ✅ **NO NECESITAS TARJETA DE CRÉDITO**

3. **Configuración del Cluster:**
   - **Provider**: Deja "AWS" (Amazon)
   - **Region**: Selecciona la más cercana a ti:
     - Para Venezuela: "N. Virginia (us-east-1)" o "São Paulo (sa-east-1)"
   - **Cluster Name**: Puedes dejarlo como "Cluster0" o cambiarlo a "EstacionOptica"

4. **Click en "Create Deployment"** (botón verde abajo)

⏳ **Espera 1-3 minutos** mientras se crea tu base de datos...

---

## 🔐 Paso 3: Crear Usuario de Base de Datos

Aparecerá un modal de "Security Quickstart":

1. **Username**: Escribe `admin` (o el nombre que quieras)

2. **Password**: 
   - Click en "Autogenerate Secure Password" (recomendado)
   - **⚠️ IMPORTANTE: COPIA Y GUARDA ESTA CONTRASEÑA** en un lugar seguro
   - O escribe tu propia contraseña (mínimo 8 caracteres)

3. **Click en "Create Database User"**

---

## 🌐 Paso 4: Configurar Acceso desde Cualquier IP

En la misma pantalla:

1. **Scroll hacia abajo** hasta "Where would you like to connect from?"

2. **Click en "My Local Environment"**

3. **En "IP Access List":**
   - Click en "Add My Current IP Address"
   - O mejor aún: Click en "Allow Access from Anywhere"
     - Esto agrega `0.0.0.0/0` (permite desde cualquier IP)
     - ✅ **Más fácil para desarrollo**

4. **Click en "Finish and Close"**

5. **Click en "Go to Database"** en el modal que aparece

---

## 🔗 Paso 5: Obtener tu Connection String

¡Ya casi terminas! Ahora necesitas la URL de conexión:

1. **En tu Dashboard**, verás tu cluster "Cluster0"

2. **Click en el botón "Connect"** (a la derecha del nombre del cluster)

3. **Selecciona "Drivers"** (segunda opción)

4. **Configuración:**
   - Driver: "Node.js"
   - Version: Deja la que está seleccionada (5.5 o superior)

5. **Copia el Connection String:**
   - Verás algo como:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **⚠️ IMPORTANTE**: Reemplaza `<password>` con la contraseña que creaste en el Paso 3

   **Ejemplo:**
   - Si tu contraseña es: `MiPass123`
   - Tu string final será:
   ```
   mongodb+srv://admin:MiPass123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

7. **COPIA ESTA URL COMPLETA** - la necesitarás en el siguiente paso

---

## ⚙️ Paso 6: Configurar tu Proyecto

Ahora vamos a conectar tu aplicación a MongoDB Atlas:

### Opción A: Editar Manualmente

1. **Abre el archivo**: `estacion-optica-v3/server/.env`

2. **Pega tu Connection String:**
   ```env
   MONGODB_URI=mongodb+srv://admin:TU_PASSWORD@cluster0.xxxxx.mongodb.net/estacion-optica?retryWrites=true&w=majority
   ```
   
   **⚠️ NOTA**: Agrega `/estacion-optica` antes del `?` para nombrar tu base de datos

3. **Guarda el archivo**

### Opción B: Yo lo hago por ti

**Dime tu Connection String** (el que copiaste) y yo actualizo el archivo automáticamente.

---

## ✅ Paso 7: Verificar que Funciona

1. **Abre una terminal** en `estacion-optica-v3`

2. **Ejecuta:**
   ```bash
   npm run server:dev
   ```

3. **Deberías ver:**
   ```
   🚀 Server running on port 5000
   ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
   ```

4. **Si ves "MongoDB Connected"** = ¡ÉXITO! 🎉

---

## 🆘 Problemas Comunes

### Error: "Authentication failed"
- ✅ Verifica que reemplazaste `<password>` con tu contraseña real
- ✅ La contraseña NO debe tener caracteres especiales como `@`, `#`, `%`
- ✅ Si tiene caracteres especiales, usa URL encoding

### Error: "Network timeout"
- ✅ Verifica que agregaste tu IP en "Network Access"
- ✅ Intenta con "Allow Access from Anywhere" (0.0.0.0/0)

### Error: "MongoServerError: bad auth"
- ✅ El usuario/contraseña están mal
- ✅ Crea un nuevo usuario en Atlas

---

## 📊 Ver tus Datos en MongoDB Atlas

1. **Ve a tu Dashboard de Atlas**
2. **Click en "Browse Collections"**
3. **Aquí verás:**
   - Base de datos: `estacion-optica`
   - Colecciones: `products`, `orders`, `admins`, `contents`
4. **Puedes ver, editar y eliminar datos** directamente desde aquí

---

## 💡 Resumen Rápido

1. ✅ Crear cuenta en MongoDB Atlas
2. ✅ Crear cluster GRATIS (M0)
3. ✅ Crear usuario de base de datos
4. ✅ Permitir acceso desde cualquier IP
5. ✅ Copiar Connection String
6. ✅ Pegar en `server/.env`
7. ✅ Iniciar servidor y verificar conexión

---

## 🎯 ¿Necesitas Ayuda?

**Dime en qué paso estás** y te ayudo específicamente con eso.

**O si prefieres**, dame tu Connection String y yo configuro todo automáticamente.

---

**¡Es más fácil de lo que parece!** 🚀
