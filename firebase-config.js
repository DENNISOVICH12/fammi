// firebase-config.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, where, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

// REEMPLAZA ESTA CONFIGURACIÓN CON LA TUYA DE FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyBcsMWc9dBtIhMX64AkKUANsDJc_kw_clU",
  authDomain: "meseros-fc2d4.firebaseapp.com",
  projectId: "meseros-fc2d4",
  storageBucket: "meseros-fc2d4.firebasestorage.app",
  messagingSenderId: "678829675232",
  appId: "1:678829675232:web:18c7754284ea37671cd085",
  measurementId: "G-9R8L1TX7KZ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Funciones para interactuar con la base de datos
export const firebaseDB = {
  // Guardar pedido
  async guardarPedido(pedido) {
    try {
      const docRef = await addDoc(collection(db, "pedidos"), {
        ...pedido,
        timestamp: new Date(),
        fecha: new Date().toISOString().split('T')[0],
        hora: new Date().toTimeString().split(' ')[0].substring(0, 5),
        estado: 'confirmado'
      });
      console.log("✅ Pedido guardado con ID: ", docRef.id);
      return docRef.id;
    } catch (e) {
      console.error("❌ Error guardando pedido: ", e);
      throw e;
    }
  },

  // Obtener pedidos del día
  async obtenerPedidosDelDia() {
    try {
      const hoy = new Date().toISOString().split('T')[0];
      const q = query(
        collection(db, "pedidos"), 
        where("fecha", "==", hoy),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const pedidos = [];
      querySnapshot.forEach((doc) => {
        pedidos.push({ id: doc.id, ...doc.data() });
      });
      console.log(`📊 Obtenidos ${pedidos.length} pedidos del día`);
      return pedidos;
    } catch (e) {
      console.error("❌ Error obteniendo pedidos: ", e);
      return [];
    }
  },

  // Obtener ventas del día (resumen)
  async obtenerVentasDelDia() {
    try {
      const pedidos = await this.obtenerPedidosDelDia();
      const totalVentas = pedidos.reduce((sum, pedido) => sum + pedido.total, 0);
      return {
        totalPedidos: pedidos.length,
        totalVentas: totalVentas,
        pedidos: pedidos
      };
    } catch (e) {
      console.error("❌ Error obteniendo ventas: ", e);
      return { totalPedidos: 0, totalVentas: 0, pedidos: [] };
    }
  },

  // Eliminar pedido
  async eliminarPedido(pedidoId) {
    try {
      await deleteDoc(doc(db, "pedidos", pedidoId));
      console.log("🗑️ Pedido eliminado: ", pedidoId);
    } catch (e) {
      console.error("❌ Error eliminando pedido: ", e);
      throw e;
    }
  },

  // Guardar configuración del menú
  async guardarConfiguracion(config) {
    try {
      await addDoc(collection(db, "configuracion"), {
        ...config,
        timestamp: new Date(),
        fecha: new Date().toISOString().split('T')[0]
      });
      console.log("⚙️ Configuración guardada");
    } catch (e) {
      console.error("❌ Error guardando configuración: ", e);
    }
  },

  // Obtener configuración del menú
  async obtenerConfiguracion() {
    try {
      const q = query(collection(db, "configuracion"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const config = querySnapshot.docs[0].data();
        console.log("⚙️ Configuración cargada");
        return config;
      }
      console.log("⚙️ No hay configuración guardada, usando por defecto");
      return null;
    } catch (e) {
      console.error("❌ Error obteniendo configuración: ", e);
      return null;
    }
  },

  // Obtener estadísticas
  async obtenerEstadisticas(fechaInicio, fechaFin) {
    try {
      const q = query(
        collection(db, "pedidos"),
        where("fecha", ">=", fechaInicio),
        where("fecha", "<=", fechaFin),
        orderBy("fecha", "desc")
      );
      const querySnapshot = await getDocs(q);
      const pedidos = [];
      querySnapshot.forEach((doc) => {
        pedidos.push({ id: doc.id, ...doc.data() });
      });
      
      const totalVentas = pedidos.reduce((sum, pedido) => sum + pedido.total, 0);
      const ventasPorDia = {};
      
      pedidos.forEach(pedido => {
        if (!ventasPorDia[pedido.fecha]) {
          ventasPorDia[pedido.fecha] = { pedidos: 0, total: 0 };
        }
        ventasPorDia[pedido.fecha].pedidos++;
        ventasPorDia[pedido.fecha].total += pedido.total;
      });
      
      return {
        totalPedidos: pedidos.length,
        totalVentas: totalVentas,
        ventasPorDia: ventasPorDia,
        pedidos: pedidos
      };
    } catch (e) {
      console.error("❌ Error obteniendo estadísticas: ", e);
      return null;
    }
  }
};