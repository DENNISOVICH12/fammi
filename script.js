// Variables globales
let pedidoActual = [];
let cantidades = {};
let seleccionesActuales = {};
let tiposCaldos = ['Costilla', 'Pescado', 'Pollo'];
let tiposHuevos = ['Revueltos', 'Fritos', 'Pericos'];

// Inicializar cantidades
const items = ['costilla', 'pescado', 'pollo', 'huevos', 'carne', 'cafe', 'chocolate', 'limonada', 'combo-completo'];
items.forEach(item => {
    cantidades[item] = 1;
});

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    renderizarCaldos();
    renderizarTiposHuevos();
    renderizarOpcionesHuevos();
    renderizarCaldosCombo();
    renderizarHuevosCombo();
});

// Cambiar tabs (actualizado para incluir ventas)
function cambiarTab(tab, element) {
    // Remover active de todos los tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    
    // Activar tab actual
    element.classList.add('active');
    document.getElementById(tab + '-content').classList.add('active');
    
    // Si se abre la pestaña de ventas, cargar datos
    if (tab === 'ventas') {
        cargarVentasDelDia();
    }
}

// Cambiar cantidad
function cambiarCantidad(item, delta) {
    cantidades[item] = Math.max(1, (cantidades[item] || 1) + delta);
    document.getElementById('qty-' + item).textContent = cantidades[item];
}

// Seleccionar opción de radio
function seleccionarOpcion(grupo, valor, element) {
    // Remover selección previa
    document.querySelectorAll(`input[name="${grupo}"]`).forEach(input => {
        input.checked = false;
        input.closest('.radio-option').classList.remove('selected');
    });
    
    // Agregar selección actual
    element.classList.add('selected');
    element.querySelector('input').checked = true;
    seleccionesActuales[grupo] = valor;
}

// Actualizar funciones de renderizado para incluir los combos
function renderizarCaldos() {
    const container = document.getElementById('caldos-grid');
    container.innerHTML = '';
    
    tiposCaldos.forEach(caldo => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
            <div class="item-header">
                <div class="item-name">${caldo}</div>
                <div class="item-price">$8,000 / $10,000</div>
            </div>
            <div style="text-align: center; font-size: 0.9rem; color: #7f8c8d; margin-bottom: 10px;">
                Solo: $8,000 | Con bebida: $10,000
            </div>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="cambiarCantidad('${caldo.toLowerCase()}', -1)">-</button>
                <span class="qty-display" id="qty-${caldo.toLowerCase()}">${cantidades[caldo.toLowerCase()] || 1}</span>
                <button class="qty-btn" onclick="cambiarCantidad('${caldo.toLowerCase()}', 1)">+</button>
            </div>
            <button class="add-btn" onclick="agregarCaldo('${caldo}')">Agregar</button>
        `;
        container.appendChild(div);
        
        // Inicializar cantidad si no existe
        if (!cantidades[caldo.toLowerCase()]) {
            cantidades[caldo.toLowerCase()] = 1;
        }
    });
    
    renderizarTiposCaldos();
    renderizarCaldosCombo(); // Actualizar también el combo
}

// Renderizar tipos de caldos para edición
function renderizarTiposCaldos() {
    const container = document.getElementById('tipos-caldos');
    container.innerHTML = '';
    
    tiposCaldos.forEach((caldo, index) => {
        const span = document.createElement('span');
        span.style.cssText = `
            background: #3498db; color: white; padding: 4px 8px; border-radius: 15px; 
            font-size: 0.8rem; display: flex; align-items: center; gap: 5px;
        `;
        span.innerHTML = `
            ${caldo}
            <button onclick="eliminarCaldo(${index})" 
                    style="background: #e74c3c; color: white; border: none; border-radius: 50%; 
                           width: 16px; height: 16px; font-size: 10px; cursor: pointer;">×</button>
        `;
        container.appendChild(span);
    });
}

// Agregar nuevo tipo de caldo
function agregarCaldoTipo() {
    const input = document.getElementById('nuevo-caldo');
    const caldo = input.value.trim();
    
    if (caldo && !tiposCaldos.includes(caldo)) {
        tiposCaldos.push(caldo);
        input.value = '';
        renderizarCaldos();
        guardarConfiguracion(); // Guardar automáticamente
    }
}

// Eliminar tipo de caldo
function eliminarCaldo(index) {
    if (confirm('¿Eliminar este tipo de caldo?')) {
        tiposCaldos.splice(index, 1);
        renderizarCaldos();
        guardarConfiguracion(); // Guardar automáticamente
    }
}

// Renderizar tipos de huevos para edición
function renderizarTiposHuevos() {
    const container = document.getElementById('tipos-huevos');
    container.innerHTML = '';
    
    tiposHuevos.forEach((huevo, index) => {
        const span = document.createElement('span');
        span.style.cssText = `
            background: #f39c12; color: white; padding: 3px 6px; border-radius: 12px; 
            font-size: 0.7rem; display: flex; align-items: center; gap: 4px;
        `;
        span.innerHTML = `
            ${huevo}
            <button onclick="eliminarTipoHuevo(${index})" 
                    style="background: #e74c3c; color: white; border: none; border-radius: 50%; 
                           width: 14px; height: 14px; font-size: 9px; cursor: pointer;">×</button>
        `;
        container.appendChild(span);
    });
}

// Agregar nuevo tipo de huevo
function agregarTipoHuevo() {
    const input = document.getElementById('nuevo-huevo');
    const huevo = input.value.trim();
    
    if (huevo && !tiposHuevos.includes(huevo)) {
        tiposHuevos.push(huevo);
        input.value = '';
        renderizarTiposHuevos();
        renderizarOpcionesHuevos();
        guardarConfiguracion(); // Guardar automáticamente
    }
}

// Eliminar tipo de huevo
function eliminarTipoHuevo(index) {
    if (confirm('¿Eliminar este tipo de huevo?')) {
        tiposHuevos.splice(index, 1);
        renderizarTiposHuevos();
        renderizarOpcionesHuevos();
        guardarConfiguracion(); // Guardar automáticamente
    }
}

// Actualizar función de renderizar opciones de huevos para incluir combo
function renderizarOpcionesHuevos() {
    const container = document.getElementById('huevos-options');
    container.innerHTML = '';
    
    tiposHuevos.forEach(huevo => {
        const div = document.createElement('div');
        div.className = 'radio-option';
        div.onclick = () => seleccionarOpcion('huevos', huevo.toLowerCase(), div);
        div.innerHTML = `
            <input type="radio" name="huevos" value="${huevo.toLowerCase()}">
            ${huevo}
        `;
        container.appendChild(div);
    });
    
    // Actualizar también las opciones del combo
    renderizarHuevosCombo();
}

// Renderizar caldos para combo
function renderizarCaldosCombo() {
    const select = document.getElementById('caldo-combo');
    select.innerHTML = '<option value="">Elegir caldo</option>';
    
    tiposCaldos.forEach(caldo => {
        const option = document.createElement('option');
        option.value = caldo.toLowerCase();
        option.textContent = caldo;
        select.appendChild(option);
    });
}

// Renderizar huevos para combo
function renderizarHuevosCombo() {
    const container = document.getElementById('huevos-combo');
    container.innerHTML = '';
    
    tiposHuevos.forEach(huevo => {
        const div = document.createElement('div');
        div.className = 'radio-option';
        div.onclick = () => seleccionarOpcion('huevos-combo', huevo.toLowerCase(), div);
        div.innerHTML = `
            <input type="radio" name="huevos-combo" value="${huevo.toLowerCase()}">
            ${huevo}
        `;
        container.appendChild(div);
    });
}

// Modificar la función de agregar caldo para manejar precios con bebida
function agregarCaldo(nombre) {
    const cantidad = cantidades[nombre.toLowerCase()] || 1;
    
    // Preguntar si quiere bebida
    const conBebida = confirm(`¿Quieres agregar bebida al ${nombre}?\n\nCaldo solo: $8,000\nCaldo + Bebida: $10,000`);
    
    if (conBebida) {
        // Mostrar opciones de bebida
        const bebidas = ['Café', 'Chocolate', 'Limonada'];
        let bebidaSeleccionada = '';
        
        while (!bebidaSeleccionada) {
            const opcion = prompt(`Selecciona la bebida:\n1. Café\n2. Chocolate\n3. Limonada\n\nEscribe el número (1, 2 o 3):`);
            
            if (opcion === '1') bebidaSeleccionada = 'Café';
            else if (opcion === '2') bebidaSeleccionada = 'Chocolate';
            else if (opcion === '3') bebidaSeleccionada = 'Limonada';
            else if (opcion === null) return; // Usuario canceló
            else alert('Por favor selecciona una opción válida (1, 2 o 3)');
        }
        
        agregarItem(`${nombre} + Bebida`, 10000, cantidad, 'Caldo', bebidaSeleccionada);
    } else {
        agregarItem(nombre, 8000, cantidad, 'Caldo');
    }
    
    // Resetear cantidad
    cantidades[nombre.toLowerCase()] = 1;
    document.getElementById('qty-' + nombre.toLowerCase()).textContent = '1';
}

// Agregar bandeja
function agregarBandeja(tipo) {
    if (!seleccionesActuales[tipo]) {
        alert(`Por favor selecciona el tipo de ${tipo}`);
        return;
    }
    
    const cantidad = cantidades[tipo] || 1;
    const nombre = `Bandeja de ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
    const descripcion = seleccionesActuales[tipo];
    
    agregarItem(nombre, 12000, cantidad, 'Bandeja', descripcion);
    
    // Resetear
    cantidades[tipo] = 1;
    document.getElementById('qty-' + tipo).textContent = '1';
    
    // Limpiar selección
    document.querySelectorAll(`#${tipo}-options .radio-option`).forEach(opt => {
        opt.classList.remove('selected');
        opt.querySelector('input').checked = false;
    });
    delete seleccionesActuales[tipo];
}

// Agregar carne sudada
function agregarCarneSudada() {
    const cantidad = cantidades['carne'] || 1;
    agregarItem('Carne Sudada', 12000, cantidad, 'Bandeja');
    
    // Resetear cantidad
    cantidades['carne'] = 1;
    document.getElementById('qty-carne').textContent = '1';
}

// Agregar bebida
function agregarBebida(nombre, precio) {
    const cantidad = cantidades[nombre.toLowerCase()] || 1;
    agregarItem(nombre, precio, cantidad, 'Bebida');
    
    // Resetear cantidad
    cantidades[nombre.toLowerCase()] = 1;
    document.getElementById('qty-' + nombre.toLowerCase()).textContent = '1';
}

// Agregar desayuno completo
function agregarDesayunoCompleto() {
    const caldo = document.getElementById('caldo-combo').value;
    const huevo = seleccionesActuales['huevos-combo'];
    const conCarne = seleccionesActuales['carne-combo'];
    const bebida = seleccionesActuales['bebida-combo'];
    
    if (!caldo || !huevo || !conCarne || !bebida) {
        alert('Por favor completa todas las selecciones del combo');
        return;
    }
    
    const cantidad = cantidades['combo-completo'] || 1;
    let descripcion = `Caldo de ${caldo} + Huevos ${huevo}`;
    
    if (conCarne === 'si') {
        descripcion += ' + Carne sudada';
    }
    
    descripcion += ` + ${bebida.charAt(0).toUpperCase() + bebida.slice(1)}`;
    
    agregarItem('Desayuno Completo', 14000, cantidad, 'Combo', descripcion);
    
    // Resetear selecciones
    document.getElementById('caldo-combo').value = '';
    limpiarSeleccionesCombo();
    cantidades['combo-completo'] = 1;
    document.getElementById('qty-combo-completo').textContent = '1';
}

// Limpiar selecciones del combo
function limpiarSeleccionesCombo() {
    // Limpiar huevos combo
    document.querySelectorAll('#huevos-combo .radio-option').forEach(opt => {
        opt.classList.remove('selected');
        opt.querySelector('input').checked = false;
    });
    
    // Limpiar carne combo
    document.querySelectorAll('input[name="carne-combo"]').forEach(input => {
        input.checked = false;
        input.closest('.radio-option').classList.remove('selected');
    });
    
    // Limpiar bebida combo
    document.querySelectorAll('input[name="bebida-combo"]').forEach(input => {
        input.checked = false;
        input.closest('.radio-option').classList.remove('selected');
    });
    
    // Limpiar selecciones actuales
    delete seleccionesActuales['huevos-combo'];
    delete seleccionesActuales['carne-combo'];
    delete seleccionesActuales['bebida-combo'];
}

// Agregar item al pedido
function agregarItem(nombre, precio, cantidad, categoria, descripcion = '') {
    const itemExistente = pedidoActual.find(item => 
        item.nombre === nombre && item.descripcion === descripcion
    );
    
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        pedidoActual.push({
            nombre: nombre,
            precio: precio,
            cantidad: cantidad,
            categoria: categoria,
            descripcion: descripcion
        });
    }
    
    actualizarPedido();
}

// Actualizar display del pedido
function actualizarPedido() {
    const container = document.getElementById('order-items');
    container.innerHTML = '';
    
    let total = 0;
    
    pedidoActual.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        
        const div = document.createElement('div');
        div.className = 'order-item';
        div.innerHTML = `
            <div class="order-item-info">
                <div class="order-item-name">${item.nombre}</div>
                ${item.descripcion ? `<div class="order-item-details">${item.descripcion}</div>` : ''}
                <div class="order-item-details">${item.precio.toLocaleString()} x ${item.cantidad}</div>
            </div>
            <div class="order-item-price">$${subtotal.toLocaleString()}</div>
            <button class="delete-item" onclick="eliminarItem(${index})">×</button>
        `;
        container.appendChild(div);
    });
    
    document.getElementById('total-amount').textContent = total.toLocaleString();
}

// Eliminar item
function eliminarItem(index) {
    pedidoActual.splice(index, 1);
    actualizarPedido();
}

// Limpiar pedido
function limpiarPedido() {
    if (pedidoActual.length === 0) {
        alert('No hay items en el pedido');
        return;
    }
    
    if (confirm('¿Estás seguro de limpiar el pedido?')) {
        pedidoActual = [];
        actualizarPedido();
    }
}

// Confirmar pedido con base de datos
async function confirmarPedido() {
    if (pedidoActual.length === 0) {
        alert('No hay items en el pedido');
        return;
    }
    
    const mesa = document.getElementById('mesaSelect').value;
    const total = pedidoActual.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    const pedido = {
        mesa: parseInt(mesa),
        items: [...pedidoActual],
        total: total,
        mesero: 'Sistema' // Puedes agregar campo de mesero si lo necesitas
    };
    
    try {
        // Guardar en Firebase si está disponible
        if (window.firebaseDB) {
            const pedidoId = await window.firebaseDB.guardarPedido(pedido);
            alert(`✅ Pedido confirmado y guardado\nID: ${pedidoId}\nMesa ${mesa}\nTotal: $${total.toLocaleString()}`);
        } else {
            alert(`✅ Pedido confirmado para Mesa ${mesa}\nTotal: $${total.toLocaleString()}`);
        }
        
        // Limpiar pedido después de confirmar
        pedidoActual = [];
        actualizarPedido();
        
    } catch (error) {
        console.error('Error guardando pedido:', error);
        alert(`✅ Pedido confirmado para Mesa ${mesa}\nTotal: $${total.toLocaleString()}\n\n⚠️ No se pudo guardar en la base de datos`);
        pedidoActual = [];
        actualizarPedido();
    }
}

// Actualizar mesa
function actualizarMesa() {
    const mesa = document.getElementById('mesaSelect').value;
    document.getElementById('mesa-numero').textContent = mesa;
}

// Mostrar cuenta del pedido actual
function mostrarCuenta() {
    if (pedidoActual.length === 0) {
        alert('No hay items en el pedido actual');
        return;
    }
    
    let cuenta = 'CUENTA - MESA ' + document.getElementById('mesaSelect').value + '\n';
    cuenta += '='.repeat(40) + '\n\n';
    
    let total = 0;
    pedidoActual.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        cuenta += `${item.nombre}\n`;
        if (item.descripcion) {
            cuenta += `  (${item.descripcion})\n`;
        }
        cuenta += `  ${item.cantidad} x $${item.precio.toLocaleString()} = $${subtotal.toLocaleString()}\n\n`;
    });
    
    cuenta += '='.repeat(40) + '\n';
    cuenta += `TOTAL: $${total.toLocaleString()}`;
    
    alert(cuenta);
}

// Guardar configuración del menú
async function guardarConfiguracion() {
    try {
        if (window.firebaseDB) {
            await window.firebaseDB.guardarConfiguracion({
                tiposCaldos: tiposCaldos,
                tiposHuevos: tiposHuevos
            });
            console.log('Configuración guardada en Firebase');
        }
    } catch (error) {
        console.error('Error guardando configuración:', error);
    }
}

// Cargar ventas del día desde Firebase
async function cargarVentasDelDia() {
    try {
        if (!window.firebaseDB) {
            alert('Firebase no está configurado');
            return;
        }
        
        const ventas = await window.firebaseDB.obtenerVentasDelDia();
        
        // Actualizar estadísticas
        document.getElementById('total-dia-firebase').textContent = `$${ventas.totalVentas.toLocaleString()}`;
        document.getElementById('total-pedidos-firebase').textContent = ventas.totalPedidos;
        
        const promedio = ventas.totalPedidos > 0 ? Math.round(ventas.totalVentas / ventas.totalPedidos) : 0;
        document.getElementById('promedio-pedido').textContent = `$${promedio.toLocaleString()}`;
        
        // Mostrar lista de pedidos
        const container = document.getElementById('pedidos-firebase-list');
        container.innerHTML = '';
        
        if (ventas.pedidos.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No hay pedidos registrados hoy</p>';
            return;
        }
        
        ventas.pedidos.forEach(pedido => {
            const div = document.createElement('div');
            div.className = 'order-item';
            div.style.marginBottom = '10px';
            
            const itemsList = pedido.items.map(item => {
                let texto = `${item.nombre}`;
                if (item.descripcion) texto += ` (${item.descripcion})`;
                if (item.cantidad > 1) texto += ` x${item.cantidad}`;
                return texto;
            }).join(', ');
            
            div.innerHTML = `
                <div class="order-item-info">
                    <div class="order-item-name">Mesa ${pedido.mesa} - ${pedido.hora}</div>
                    <div class="order-item-details">${itemsList}</div>
                    <div class="order-item-details">ID: ${pedido.id}</div>
                </div>
                <div class="order-item-price">$${pedido.total.toLocaleString()}</div>
                <button class="delete-item" onclick="eliminarPedidoFirebase('${pedido.id}')" title="Eliminar pedido">×</button>
            `;
            container.appendChild(div);
        });
        
    } catch (error) {
        console.error('Error cargando ventas:', error);
        alert('Error cargando las ventas. Revisa la consola.');
    }
}

// Eliminar pedido de Firebase
async function eliminarPedidoFirebase(pedidoId) {
    if (!confirm('¿Estás seguro de eliminar este pedido?')) {
        return;
    }
    
    try {
        await window.firebaseDB.eliminarPedido(pedidoId);
        alert('Pedido eliminado correctamente');
        cargarVentasDelDia(); // Recargar la lista
    } catch (error) {
        console.error('Error eliminando pedido:', error);
        alert('Error eliminando el pedido');
    }
}

// Mostrar estadísticas avanzadas
async function mostrarEstadisticas() {
    try {
        if (!window.firebaseDB) {
            alert('Firebase no está configurado');
            return;
        }
        
        const fechaHoy = new Date().toISOString().split('T')[0];
        const fechaHace7Dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const stats = await window.firebaseDB.obtenerEstadisticas(fechaHace7Dias, fechaHoy);
        
        let mensaje = `📊 ESTADÍSTICAS (Últimos 7 días)\n${'='.repeat(40)}\n\n`;
        mensaje += `📈 Total de pedidos: ${stats.totalPedidos}\n`;
        mensaje += `💰 Total de ventas: ${stats.totalVentas.toLocaleString()}\n`;
        mensaje += `📊 Promedio por pedido: ${Math.round(stats.totalVentas / stats.totalPedidos || 0).toLocaleString()}\n\n`;
        
        mensaje += `📅 VENTAS POR DÍA:\n${'-'.repeat(30)}\n`;
        Object.entries(stats.ventasPorDia).forEach(([fecha, data]) => {
            mensaje += `${fecha}: ${data.pedidos} pedidos - ${data.total.toLocaleString()}\n`;
        });
        
        alert(mensaje);
        
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        alert('Error obteniendo estadísticas');
    }
}
