# 🍽️ Sistema de Pedidos FAMY

Sistema de pedidos para restaurante con interfaz moderna y base de datos en Firebase.

## 🚀 Características

- ✅ **Interfaz moderna y responsiva** - Optimizada para móviles y tablets
- ✅ **Sistema de pedidos completo** - Caldos, bandejas, combos y bebidas
- ✅ **Base de datos Firebase** - Persistencia de datos en la nube
- ✅ **Configuración dinámica** - Editar tipos de caldos y huevos
- ✅ **Sistema de ventas** - Estadísticas y reportes en tiempo real
- ✅ **Múltiples mesas** - Gestión de 10 mesas diferentes

## 📋 Menú

### 🍲 Caldos
- **Solo:** $8,000
- **Con bebida:** $10,000
- Tipos editables (Costilla, Pescado, Pollo por defecto)

### 🍳 Bandejas
- **Huevos:** $12,000 (tipos editables)
- **Carne Sudada:** $12,000

### 🎯 Combos
- **Desayuno Completo:** $14,000 (Caldo + Bandeja + Bebida)

### 🥤 Bebidas
- **Café:** $3,000
- **Chocolate:** $4,000
- **Limonada:** $3,500

## 🛠️ Instalación

### 1. Clonar repositorio
```bash
git clone https://github.com/tu-usuario/restaurante-famy.git
cd restaurante-famy
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un nuevo proyecto
3. Habilita Firestore Database
4. Copia tu configuración y pégala en `firebase-config.js`

### 3. Configurar reglas de Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 4. Subir a GitHub Pages
1. Sube los archivos a tu repositorio
2. Ve a Settings > Pages
3. Selecciona "Deploy from branch" > "main" > "/ (root)"

## 📁 Estructura de archivos

```
restaurante-famy/
├── index.html          # Estructura principal
├── styles.css          # Estilos y diseño responsivo
├── script.js           # Lógica de la aplicación
├── firebase-config.js  # Configuración de Firebase
└── README.md          # Este archivo
```

## 🔧 Configuración de Firebase

En `firebase-config.js`, reemplaza los valores con los tuyos:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
```

## 📱 Uso

### Para tomar pedidos:
1. Selecciona la mesa
2. Agrega items al pedido
3. Configura opciones (tipos, cantidades)
4. Confirma el pedido

### Para gestionar ventas:
1. Ve a la pestaña "VENTAS"
2. Revisa estadísticas del día
3. Consulta pedidos realizados
4. Genera reportes

### Para configurar menú:
1. Agrega/elimina tipos de caldos
2. Personaliza tipos de huevos
3. Los cambios se guardan automáticamente

## 🔒 Seguridad

⚠️ **Importante:** Las reglas actuales de Firestore permiten acceso completo. Para producción, configura autenticación y reglas más restrictivas.

## 🆘 Soporte

Si tienes problemas:

1. **Revisa la consola del navegador** (F12)
2. **Verifica la configuración de Firebase**
3. **Asegúrate de que Firestore esté habilitado**
4. **Comprueba las reglas de seguridad**

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

Desarrollado para el Restaurante FAMY 🍽️