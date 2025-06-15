// Variables globales
let pedidoActual = [];
let ventas = [];
let totalDia = 0;
let cantidades = {};

// Datos del menú
let menuData = {
    bebidas: ['Jugo Natural', 'Gaseosa', 'Café', 'Chocolate'],
    caldos: [],
    sopas: [],
    huevos: ['Revueltos', 'Fritos', 'Pericos'],
    carnesDesayuno: ['Salchicha', 'Tocineta', 'Chorizo'],
    principios: ['Arroz blanco', 'Frijoles', 'Lentejas', 'Pasta'],
    proteinas: ['Pollo asado', 'Carne asada', 'Pescado frito', 'Cerdo'],
    precios: {
        caldoSolo: 8000,
        caldoBebida: 10000,
        sopaSolo: 10000,
        sopaBebida: 12000,
        bandejaDesayunoSolo: 12000,
        bandejaDesayunoBebida: 14000,
        bandejaAlmuerzoSolo: 15000,
        bandejaAlmuerzoBebida: 17000,
        comboDesayuno: 18000,
        comboAlmuerzo: 22000
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
    document.getElementById('hora').value = new Date().toTimeString().split(' ')[0].substring(0, 5);
    
    // Actualizar mesa actual
    document.getElementById('mesaSelect').addEventListener('change', function() {
        document.getElementById('mesaActual').textContent = this.value;
    });

    inicializarMenus();
    actualizarPedido();
    renderizarListas();
    actualizarMenusPrincipales();
});

function inicializarMenus() {
    // Inicializar valores de precios en los inputs
    document.getElementById('precio-caldo-solo').value = menuData.precios.caldoSolo;
    document.getElementById('precio-caldo-bebida').value = menuData.precios.caldoBebida;
    document.getElementById('precio-sopa-solo').value = menuData.precios.sopaSolo;
    document.getElementById('precio-sopa-bebida').value = menuData.precios.sopaBebida;
    document.getElementById('precio-bandeja-desayuno-solo').value = menuData.precios.bandejaDesayunoSolo;
    document.getElementById('precio-bandeja-desayuno-bebida').value = menuData.precios.bandejaDesayunoBebida;
    document.getElementById('precio-bandeja-almuerzo-solo').value = menuData.precios.bandejaAlmuerzoSolo;
    document.getElementById('precio-bandeja-almuerzo-bebida').value = menuData.precios.bandejaAlmuerzoBebida;
    document.getElementById('precio-combo-desayuno').value = menuData.precios.comboDesayuno;
    document.getElementById('precio-combo-almuerzo').value = menuData.precios.comboAlmuerzo;
}

function cambiarTab(tab, event) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    
    event.currentTarget.classList.add('active');
    document.getElementById(tab + '-tab').classList.add('active');
}

function toggleConfig(section) {
    const config = document.getElementById(section + '-config');
    config.classList.toggle('active');
}

function cambiarCantidad(tipo, delta) {
    cantidades[tipo] = Math.max(1, (cantidades[tipo] || 1) + delta);
    document.getElementById('cantidad-' + tipo).textContent = cantidades[tipo];
}

// Funciones para bebidas
function agregarBebida() {
    const nombre = document.getElementById('nueva-bebida').value.trim();
    if (nombre && !menuData.bebidas.includes(nombre)) {
        menuData.bebidas.push(nombre);
        renderizarListaBebidas();
        document.getElementById('nueva-bebida').value = '';
    }
}

function eliminarBebida(index) {
    menuData.bebidas.splice(index, 1);
    renderizarListaBebidas();
}

function renderizarListaBebidas() {
    const container = document.getElementById('bebidas-list');
    container.innerHTML = '';
    
    menuData.bebidas.forEach((bebida, index) => {
        const div = document.createElement('div');
        div.className = 'option-item';
        div.innerHTML = `
            <span>${bebida}</span>
            <button onclick="eliminarBebida(${index})">Eliminar</button>
        `;
        container.appendChild(div);
    });
}

// Funciones para caldos
function agregarCaldo() {
    const nombre = document.getElementById('nuevo-caldo').value.trim();
    
    if (nombre) {
        menuData.caldos.push(nombre);
        renderizarCaldos();
        renderizarListaCaldos();
        renderizarCombosDesayuno();
        document.getElementById('nuevo-caldo').value = '';
    }
}

function eliminarCaldo(index) {
    menuData.caldos.splice(index, 1);
    renderizarCaldos();
    renderizarListaCaldos();
    renderizarCombosDesayuno();
}

function renderizarListaCaldos() {
    const container = document.getElementById('caldos-list');
    container.innerHTML = '';
    
    menuData.caldos.forEach((caldo, index) => {
        const div = document.createElement('div');
        div.className = 'option-item';
        div.innerHTML = `
            <span>${caldo}</span>
            <button onclick="eliminarCaldo(${index})">Eliminar</button>
        `;
        container.appendChild(div);
    });
}

function renderizarCaldos() {
    const container = document.getElementById('caldos-menu');
    container.innerHTML = '';
    
    menuData.caldos.forEach((caldo, index) => {
        // Caldo solo
        const divSolo = document.createElement('div');
        divSolo.className = 'menu-item';
        divSolo.innerHTML = `
            <div class="menu-item-header">
                <h4>${caldo}</h4>
                <div class="price">${menuData.precios.caldoSolo.toLocaleString()}</div>
            </div>
            <div class="cantidad-controls">
                <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('caldo-solo-${index}', -1)">-</button>
                <span class="cantidad-display" id="cantidad-caldo-solo-${index}">1</span>
                <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('caldo-solo-${index}', 1)">+</button>
            </div>
        `;
        divSolo.onclick = () => {
            const cantidad = cantidades['caldo-solo-' + index] || 1;
            agregarItem(`${caldo} (Solo)`, menuData.precios.caldoSolo, 'Caldo', '', cantidad);
            cantidades['caldo-solo-' + index] = 1;
            document.getElementById('cantidad-caldo-solo-' + index).textContent = '1';
        };
        container.appendChild(divSolo);

        // Caldo con bebida
        const divBebida = document.createElement('div');
        divBebida.className = 'menu-item';
        divBebida.innerHTML = `
            <div class="menu-item-header">
                <h4>${caldo} + Bebida</h4>
                <div class="price">${menuData.precios.caldoBebida.toLocaleString()}</div>
            </div>
            <div class="bebidas-section">
                <h5>Seleccionar bebida:</h5>
                <div class="bebida-options" id="bebida-caldo-${index}">
                    ${menuData.bebidas.map((bebida, bIndex) => `
                        <div class="bebida-option" onclick="event.stopPropagation(); seleccionarBebida('caldo-${index}', ${bIndex})">${bebida}</div>
                    `).join('')}
                </div>
            </div>
            <div class="cantidad-controls">
                <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('caldo-bebida-${index}', -1)">-</button>
                <span class="cantidad-display" id="cantidad-caldo-bebida-${index}">1</span>
                <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('caldo-bebida-${index}', 1)">+</button>
            </div>
        `;
        divBebida.onclick = () => agregarCaldoConBebida(caldo, index);
        container.appendChild(divBebida);

        cantidades['caldo-solo-' + index] = 1;
        cantidades['caldo-bebida-' + index] = 1;
    });
}

function seleccionarBebida(tipo, bebidaIndex) {
    const container = document.getElementById(`bebida-${tipo}`);
    container.querySelectorAll('.bebida-option').forEach((opt, index) => {
        if (index === bebidaIndex) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });
    container.dataset.selectedBebida = bebidaIndex;
}

function agregarCaldoConBebida(caldo, index) {
    const container = document.getElementById(`bebida-caldo-${index}`);
    const selectedIndex = container.dataset.selectedBebida;
    
    if (selectedIndex === undefined) {
        alert('Por favor selecciona una bebida');
        return;
    }
    
    const bebida = menuData.bebidas[selectedIndex];
    const cantidad = cantidades['caldo-bebida-' + index] || 1;
    
    agregarItem(
        `${caldo} + Bebida`,
        menuData.precios.caldoBebida,
        'Caldo',
        bebida,
        cantidad
    );
    
    // Resetear
    cantidades['caldo-bebida-' + index] = 1;
    document.getElementById('cantidad-caldo-bebida-' + index).textContent = '1';
    container.dataset.selectedBebida = undefined;
    container.querySelectorAll('.bebida-option').forEach(opt => opt.classList.remove('selected'));
}

// Funciones para sopas
function agregarSopa() {
    const nombre = document.getElementById('nueva-sopa').value.trim();
    
    if (nombre) {
        menuData.sopas.push(nombre);
        renderizarSopas();
        renderizarListaSopas();
        renderizarCombosAlmuerzo();
        document.getElementById('nueva-sopa').value = '';
    }
}

function eliminarSopa(index) {
    menuData.sopas.splice(index, 1);
    renderizarSopas();
    renderizarListaSopas();
    renderizarCombosAlmuerzo();
}

function renderizarListaSopas() {
    const container = document.getElementById('sopas-list');
    container.innerHTML = '';
    
    menuData.sopas.forEach((sopa, index) => {
        const div = document.createElement('div');
        div.className = 'option-item';
        div.innerHTML = `
            <span>${sopa}</span>
            <button onclick="eliminarSopa(${index})">Eliminar</button>
        `;
        container.appendChild(div);
    });
}

function renderizarSopas() {
    const container = document.getElementById('sopas-menu');
    container.innerHTML = '';
    
    menuData.sopas.forEach((sopa, index) => {
        // Sopa sola
        const divSolo = document.createElement('div');
        divSolo.className = 'menu-item';
        divSolo.innerHTML = `
            <div class="menu-item-header">
                <h4>${sopa}</h4>
                <div class="price">${menuData.precios.sopaSolo.toLocaleString()}</div>
            </div>
            <div class="cantidad-controls">
                <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('sopa-solo-${index}', -1)">-</button>
                <span class="cantidad-display" id="cantidad-sopa-solo-${index}">1</span>
                <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('sopa-solo-${index}', 1)">+</button>
            </div>
        `;
        divSolo.onclick = () => {
            const cantidad = cantidades['sopa-solo-' + index] || 1;
            agregarItem(`${sopa} (Solo)`, menuData.precios.sopaSolo, 'Sopa', '', cantidad);
            cantidades['sopa-solo-' + index] = 1;
            document.getElementById('cantidad-sopa-solo-' + index).textContent = '1';
        };
        container.appendChild(divSolo);

        // Sopa con bebida
        const divBebida = document.createElement('div');
        divBebida.className = 'menu-item';
        divBebida.innerHTML = `
            <div class="menu-item-header">
                <h4>${sopa} + Bebida</h4>
                <div class="price">${menuData.precios.sopaBebida.toLocaleString()}</div>
            </div>
            <div class="bebidas-section">
                <h5>Seleccionar bebida:</h5>
                <div class="bebida-options" id="bebida-sopa-${index}">
                    ${menuData.bebidas.map((bebida, bIndex) => `
                        <div class="bebida-option" onclick="event.stopPropagation(); seleccionarBebida('sopa-${index}', ${bIndex})">${bebida}</div>
                    `).join('')}
                </div>
            </div>
            <div class="cantidad-controls">
                <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('sopa-bebida-${index}', -1)">-</button>
                <span class="cantidad-display" id="cantidad-sopa-bebida-${index}">1</span>
                <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('sopa-bebida-${index}', 1)">+</button>
            </div>
        `;
        divBebida.onclick = () => agregarSopaConBebida(sopa, index);
        container.appendChild(divBebida);

        cantidades['sopa-solo-' + index] = 1;
        cantidades['sopa-bebida-' + index] = 1;
    });
}

function agregarSopaConBebida(sopa, index) {
    const container = document.getElementById(`bebida-sopa-${index}`);
    const selectedIndex = container.dataset.selectedBebida;
    
    if (selectedIndex === undefined) {
        alert('Por favor selecciona una bebida');
        return;
    }
    
    const bebida = menuData.bebidas[selectedIndex];
    const cantidad = cantidades['sopa-bebida-' + index] || 1;
    
    agregarItem(
        `${sopa} + Bebida`,
        menuData.precios.sopaBebida,
        'Sopa',
        bebida,
        cantidad
    );
    
    // Resetear
    cantidades['sopa-bebida-' + index] = 1;
    document.getElementById('cantidad-sopa-bebida-' + index).textContent = '1';
    container.dataset.selectedBebida = undefined;
    container.querySelectorAll('.bebida-option').forEach(opt => opt.classList.remove('selected'));
}

// Funciones para opciones de bandejas
function agregarHuevo() {
    const huevo = document.getElementById('nuevo-huevo').value.trim();
    if (huevo && !menuData.huevos.includes(huevo)) {
        menuData.huevos.push(huevo);
        renderizarListaHuevos();
        renderizarBandejasDesayuno();
        renderizarCombosDesayuno();
        document.getElementById('nuevo-huevo').value = '';
    }
}

function eliminarHuevo(index) {
    menuData.huevos.splice(index, 1);
    renderizarListaHuevos();
    renderizarBandejasDesayuno();
    renderizarCombosDesayuno();
}

function renderizarListaHuevos() {
    const container = document.getElementById('huevos-list');
    container.innerHTML = '';
    
    menuData.huevos.forEach((huevo, index) => {
        const div = document.createElement('div');
        div.className = 'option-item';
        div.innerHTML = `
            <span>${huevo}</span>
            <button onclick="eliminarHuevo(${index})">Eliminar</button>
        `;
        container.appendChild(div);
    });
}

function agregarCarneDesayuno() {
    const carne = document.getElementById('nueva-carne-desayuno').value.trim();
    if (carne && !menuData.carnesDesayuno.includes(carne)) {
        menuData.carnesDesayuno.push(carne);
        renderizarListaCarnesDesayuno();
        renderizarBandejasDesayuno();
        renderizarCombosDesayuno();
        document.getElementById('nueva-carne-desayuno').value = '';
    }
}

function eliminarCarneDesayuno(index) {
    menuData.carnesDesayuno.splice(index, 1);
    renderizarListaCarnesDesayuno();
    renderizarBandejasDesayuno();
    renderizarCombosDesayuno();
}

function renderizarListaCarnesDesayuno() {
    const container = document.getElementById('carnes-desayuno-list');
    container.innerHTML = '';
    
    menuData.carnesDesayuno.forEach((carne, index) => {
        const div = document.createElement('div');
        div.className = 'option-item';
        div.innerHTML = `
            <span>${carne}</span>
            <button onclick="eliminarCarneDesayuno(${index})">Eliminar</button>
        `;
        container.appendChild(div);
    });
}

function agregarPrincipio() {
    const principio = document.getElementById('nuevo-principio').value.trim();
    if (principio && !menuData.principios.includes(principio)) {
        menuData.principios.push(principio);
        renderizarListaPrincipios();
        renderizarBandejasAlmuerzo();
        renderizarCombosAlmuerzo();
        document.getElementById('nuevo-principio').value = '';
    }
}

function eliminarPrincipio(index) {
    menuData.principios.splice(index, 1);
    renderizarListaPrincipios();
    renderizarBandejasAlmuerzo();
    renderizarCombosAlmuerzo();
}

function renderizarListaPrincipios() {
    const container = document.getElementById('principios-list');
    container.innerHTML = '';
    
    menuData.principios.forEach((principio, index) => {
        const div = document.createElement('div');
        div.className = 'option-item';
        div.innerHTML = `
            <span>${principio}</span>
            <button onclick="eliminarPrincipio(${index})">Eliminar</button>
        `;
        container.appendChild(div);
    });
}

function agregarProteina() {
    const proteina = document.getElementById('nueva-proteina').value.trim();
    if (proteina && !menuData.proteinas.includes(proteina)) {
        menuData.proteinas.push(proteina);
        renderizarListaProteinas();
        renderizarBandejasAlmuerzo();
        renderizarCombosAlmuerzo();
        document.getElementById('nueva-proteina').value = '';
    }
}

function eliminarProteina(index) {
    menuData.proteinas.splice(index, 1);
    renderizarListaProteinas();
    renderizarBandejasAlmuerzo();
    renderizarCombosAlmuerzo();
}

function renderizarListaProteinas() {
    const container = document.getElementById('proteinas-list');
    container.innerHTML = '';
    
    menuData.proteinas.forEach((proteina, index) => {
        const div = document.createElement('div');
        div.className = 'option-item';
        div.innerHTML = `
            <span>${proteina}</span>
            <button onclick="eliminarProteina(${index})">Eliminar</button>
        `;
        container.appendChild(div);
    });
}

function renderizarListas() {
    renderizarListaBebidas();
    renderizarListaCaldos();
    renderizarListaSopas();
    renderizarListaHuevos();
    renderizarListaCarnesDesayuno();
    renderizarListaPrincipios();
    renderizarListaProteinas();
}

// Funciones de actualización de precios
function actualizarPreciosCaldo() {
    menuData.precios.caldoSolo = parseInt(document.getElementById('precio-caldo-solo').value) || 8000;
    menuData.precios.caldoBebida = parseInt(document.getElementById('precio-caldo-bebida').value) || 10000;
    renderizarCaldos();
    alert('Precios de caldos actualizados');
}

function actualizarPreciosSopa() {
    menuData.precios.sopaSolo = parseInt(document.getElementById('precio-sopa-solo').value) || 10000;
    menuData.precios.sopaBebida = parseInt(document.getElementById('precio-sopa-bebida').value) || 12000;
    renderizarSopas();
    alert('Precios de sopas actualizados');
}

function actualizarPreciosBandejaDesayuno() {
    menuData.precios.bandejaDesayunoSolo = parseInt(document.getElementById('precio-bandeja-desayuno-solo').value) || 12000;
    menuData.precios.bandejaDesayunoBebida = parseInt(document.getElementById('precio-bandeja-desayuno-bebida').value) || 14000;
    renderizarBandejasDesayuno();
    alert('Precios de bandejas de desayuno actualizados');
}

function actualizarPreciosBandejaAlmuerzo() {
    menuData.precios.bandejaAlmuerzoSolo = parseInt(document.getElementById('precio-bandeja-almuerzo-solo').value) || 15000;
    menuData.precios.bandejaAlmuerzoBebida = parseInt(document.getElementById('precio-bandeja-almuerzo-bebida').value) || 17000;
    renderizarBandejasAlmuerzo();
    alert('Precios de bandejas de almuerzo actualizados');
}

function actualizarPrecioComboDesayuno() {
    menuData.precios.comboDesayuno = parseInt(document.getElementById('precio-combo-desayuno').value) || 18000;
    renderizarCombosDesayuno();
    alert('Precio del combo de desayuno actualizado');
}

function actualizarPrecioComboAlmuerzo() {
    menuData.precios.comboAlmuerzo = parseInt(document.getElementById('precio-combo-almuerzo').value) || 22000;
    renderizarCombosAlmuerzo();
    alert('Precio del combo de almuerzo actualizado');
}

// Renderizar bandejas
function renderizarBandejasDesayuno() {
    const container = document.getElementById('bandejas-desayuno-menu');
    container.innerHTML = '';
    
    // Bandeja de Huevos sola
    const divHuevoSolo = document.createElement('div');
    divHuevoSolo.className = 'menu-item';
    divHuevoSolo.innerHTML = `
        <div class="menu-item-header">
            <h4>Bandeja de Huevos</h4>
            <div class="price">${menuData.precios.bandejaDesayunoSolo.toLocaleString()}</div>
        </div>
        <div class="combo-options">
            <select id="huevo-select-solo" class="combo-select" onclick="event.stopPropagation()">
                <option value="">Seleccionar tipo de huevo</option>
                ${menuData.huevos.map(h => `<option value="${h}">${h}</option>`).join('')}
            </select>
        </div>
        <div class="cantidad-controls">
            <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('bandeja-huevo-solo', -1)">-</button>
            <span class="cantidad-display" id="cantidad-bandeja-huevo-solo">1</span>
            <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('bandeja-huevo-solo', 1)">+</button>
        </div>
    `;
    divHuevoSolo.onclick = () => seleccionarBandejaHuevo('solo');
    container.appendChild(divHuevoSolo);

    // Bandeja de Huevos con bebida
    const divHuevoBebida = document.createElement('div');
    divHuevoBebida.className = 'menu-item';
    divHuevoBebida.innerHTML = `
        <div class="menu-item-header">
            <h4>Bandeja de Huevos + Bebida</h4>
            <div class="price">${menuData.precios.bandejaDesayunoBebida.toLocaleString()}</div>
        </div>
        <div class="combo-options">
            <select id="huevo-select-bebida" class="combo-select" onclick="event.stopPropagation()">
                <option value="">Seleccionar tipo de huevo</option>
                ${menuData.huevos.map(h => `<option value="${h}">${h}</option>`).join('')}
            </select>
        </div>
        <div class="bebidas-section">
            <h5>Seleccionar bebida:</h5>
            <div class="bebida-options" id="bebida-bandeja-huevo">
                ${menuData.bebidas.map((bebida, index) => `
                    <div class="bebida-option" onclick="event.stopPropagation(); seleccionarBebida('bandeja-huevo', ${index})">${bebida}</div>
                `).join('')}
            </div>
        </div>
        <div class="cantidad-controls">
            <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('bandeja-huevo-bebida', -1)">-</button>
            <span class="cantidad-display" id="cantidad-bandeja-huevo-bebida">1</span>
            <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('bandeja-huevo-bebida', 1)">+</button>
        </div>
    `;
    divHuevoBebida.onclick = () => seleccionarBandejaHuevo('bebida');
    container.appendChild(divHuevoBebida);

    // Bandeja de Carne sola
    const divCarneSolo = document.createElement('div');
    divCarneSolo.className = 'menu-item';
    divCarneSolo.innerHTML = `
        <div class="menu-item-header">
            <h4>Bandeja de Carne</h4>
            <div class="price">${menuData.precios.bandejaDesayunoSolo.toLocaleString()}</div>
        </div>
        <div class="combo-options">
            <select id="carne-select-solo" class="combo-select" onclick="event.stopPropagation()">
                <option value="">Seleccionar tipo de carne</option>
                ${menuData.carnesDesayuno.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
        </div>
        <div class="cantidad-controls">
            <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('bandeja-carne-solo', -1)">-</button>
            <span class="cantidad-display" id="cantidad-bandeja-carne-solo">1</span>
            <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('bandeja-carne-solo', 1)">+</button>
        </div>
    `;
    divCarneSolo.onclick = () => seleccionarBandejaCarne('solo');
    container.appendChild(divCarneSolo);

    // Bandeja de Carne con bebida
    const divCarneBebida = document.createElement('div');
    divCarneBebida.className = 'menu-item';
    divCarneBebida.innerHTML = `
        <div class="menu-item-header">
            <h4>Bandeja de Carne + Bebida</h4>
            <div class="price">${menuData.precios.bandejaDesayunoBebida.toLocaleString()}</div>
        </div>
        <div class="combo-options">
            <select id="carne-select-bebida" class="combo-select" onclick="event.stopPropagation()">
                <option value="">Seleccionar tipo de carne</option>
                ${menuData.carnesDesayuno.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
        </div>
        <div class="bebidas-section">
            <h5>Seleccionar bebida:</h5>
            <div class="bebida-options" id="bebida-bandeja-carne">
                ${menuData.bebidas.map((bebida, index) => `
                    <div class="bebida-option" onclick="event.stopPropagation(); seleccionarBebida('bandeja-carne', ${index})">${bebida}</div>
                `).join('')}
            </div>
        </div>
        <div class="cantidad-controls">
            <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('bandeja-carne-bebida', -1)">-</button>
            <span class="cantidad-display" id="cantidad-bandeja-carne-bebida">1</span>
            <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('bandeja-carne-bebida', 1)">+</button>
        </div>
    `;
    divCarneBebida.onclick = () => seleccionarBandejaCarne('bebida');
    container.appendChild(divCarneBebida);

    // Bandeja Completa (Huevos + Carne) sola
    const divCompletaSolo = document.createElement('div');
    divCompletaSolo.className = 'menu-item';
    divCompletaSolo.innerHTML = `
        <div class="menu-item-header">
            <h4>Bandeja Completa (Huevos + Carne)</h4>
            <div class="price">${(menuData.precios.bandejaDesayunoSolo * 1.5).toLocaleString()}</div>
        </div>
        <div class="combo-options">
            <select id="huevo-completa-solo" class="combo-select" onclick="event.stopPropagation()">
                <option value="">Seleccionar tipo de huevo</option>
                ${menuData.huevos.map(h => `<option value="${h}">${h}</option>`).join('')}
            </select>
            <select id="carne-completa-solo" class="combo-select" onclick="event.stopPropagation()">
                <option value="">Seleccionar tipo de carne</option>
                ${menuData.carnesDesayuno.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
        </div>
        <div class="cantidad-controls">
            <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('bandeja-completa-solo', -1)">-</button>
            <span class="cantidad-display" id="cantidad-bandeja-completa-solo">1</span>
            <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('bandeja-completa-solo', 1)">+</button>
        </div>
    `;
    divCompletaSolo.onclick = () => seleccionarBandejaCompleta('solo');
    container.appendChild(divCompletaSolo);

    // Bandeja Completa con bebida
    const divCompletaBebida = document.createElement('div');
    divCompletaBebida.className = 'menu-item';
    divCompletaBebida.innerHTML = `
        <div class="menu-item-header">
            <h4>Bandeja Completa + Bebida</h4>
            <div class="price">${(menuData.precios.bandejaDesayunoBebida * 1.5).toLocaleString()}</div>
        </div>
        <div class="combo-options">
            <select id="huevo-completa-bebida" class="combo-select" onclick="event.stopPropagation()">
                <option value="">Seleccionar tipo de huevo</option>
                ${menuData.huevos.map(h => `<option value="${h}">${h}</option>`).join('')}
            </select>
            <select id="carne-completa-bebida" class="combo-select" onclick="event.stopPropagation()">
                <option value="">Seleccionar tipo de carne</option>
                ${menuData.carnesDesayuno.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
        </div>
        <div class="bebidas-section">
            <h5>Seleccionar bebida:</h5>
            <div class="bebida-options" id="bebida-bandeja-completa">
                ${menuData.bebidas.map((bebida, index) => `
                    <div class="bebida-option" onclick="event.stopPropagation(); seleccionarBebida('bandeja-completa', ${index})">${bebida}</div>
                `).join('')}
            </div>
        </div>
        <div class="cantidad-controls">
            <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('bandeja-completa-bebida', -1)">-</button>
            <span class="cantidad-display" id="cantidad-bandeja-completa-bebida">1</span>
            <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('bandeja-completa-bebida', 1)">+</button>
        </div>
    `;
    divCompletaBebida.onclick = () => seleccionarBandejaCompleta('bebida');
    container.appendChild(divCompletaBebida);

    // Inicializar cantidades
    cantidades['bandeja-huevo-solo'] = 1;
    cantidades['bandeja-huevo-bebida'] = 1;
    cantidades['bandeja-carne-solo'] = 1;
    cantidades['bandeja-carne-bebida'] = 1;
    cantidades['bandeja-completa-solo'] = 1;
    cantidades['bandeja-completa-bebida'] = 1;
}

function renderizarBandejasAlmuerzo() {
    const container = document.getElementById('bandejas-almuerzo-menu');
    container.innerHTML = '';
    
    // Bandeja sola
    const divSolo = document.createElement('div');
    divSolo.className = 'menu-item';
    divSolo.innerHTML = `
        <div class="menu-item-header">
            <h4>Bandeja de Almuerzo</h4>
            <div class="price">${menuData.precios.bandejaAlmuerzoSolo.toLocaleString()}</div>
        </div>
        <div class="combo-options">
            <select id="principio-select-solo" class="combo-select" onclick="event.stopPropagation()">
                <option value="">Seleccionar principio</option>
                ${menuData.principios.map(p => `<option value="${p}">${p}</option>`).join('')}
            </select>
            <select id="proteina-select-solo" class="combo-select" onclick="event.stopPropagation()">
                <option value="">Seleccionar proteína</option>
                ${menuData.proteinas.map(p => `<option value="${p}">${p}</option>`).join('')}
            </select>
        </div>
        <div class="cantidad-controls">
            <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('bandeja-almuerzo-solo', -1)">-</button>
            <span class="cantidad-display" id="cantidad-bandeja-almuerzo-solo">1</span>
            <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('bandeja-almuerzo-solo', 1)">+</button>
        </div>
    `;
    divSolo.onclick = () => seleccionarBandejaAlmuerzo('solo');
    container.appendChild(divSolo);

    // Bandeja con bebida
    const divBebida = document.createElement('div');
    divBebida.className = 'menu-item';
    divBebida.innerHTML = `
        <div class="menu-item-header">
            <h4>Bandeja de Almuerzo + Bebida</h4>
            <div class="price">${menuData.precios.bandejaAlmuerzoBebida.toLocaleString()}</div>
        </div>
        <div class="combo-options">
            <select id="principio-select-bebida" class="combo-select" onclick="event.stopPropagation()">
                <option value="">Seleccionar principio</option>
                ${menuData.principios.map(p => `<option value="${p}">${p}</option>`).join('')}
            </select>
            <select id="proteina-select-bebida" class="combo-select" onclick="event.stopPropagation()">
                <option value="">Seleccionar proteína</option>
                ${menuData.proteinas.map(p => `<option value="${p}">${p}</option>`).join('')}
            </select>
        </div>
        <div class="bebidas-section">
            <h5>Seleccionar bebida:</h5>
            <div class="bebida-options" id="bebida-bandeja-almuerzo">
                ${menuData.bebidas.map((bebida, index) => `
                    <div class="bebida-option" onclick="event.stopPropagation(); seleccionarBebida('bandeja-almuerzo', ${index})">${bebida}</div>
                `).join('')}
            </div>
        </div>
        <div class="cantidad-controls">
            <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('bandeja-almuerzo-bebida', -1)">-</button>
            <span class="cantidad-display" id="cantidad-bandeja-almuerzo-bebida">1</span>
            <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('bandeja-almuerzo-bebida', 1)">+</button>
        </div>
    `;
    divBebida.onclick = () => seleccionarBandejaAlmuerzo('bebida');
    container.appendChild(divBebida);

    cantidades['bandeja-almuerzo-solo'] = 1;
    cantidades['bandeja-almuerzo-bebida'] = 1;
}

// Renderizar combos
function renderizarCombosDesayuno() {
    const container = document.getElementById('combos-desayuno-menu');
    container.innerHTML = '';
    
    if (menuData.caldos.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">Agrega caldos para ver los combos disponibles</p>';
        return;
    }
    
    menuData.caldos.forEach((caldo, caldoIndex) => {
        const divCombo = document.createElement('div');
        divCombo.className = 'menu-item combo';
        divCombo.innerHTML = `
            <div class="menu-item-header">
                <h4>${caldo} + Bandeja<span class="combo-badge">COMBO</span></h4>
                <div class="price">${menuData.precios.comboDesayuno.toLocaleString()}</div>
            </div>
            <div style="margin: 10px 0;">
                <strong>Incluye:</strong> ${caldo} + Bandeja de Desayuno completa
            </div>
            <div class="combo-options">
                <select id="huevo-combo-${caldoIndex}" class="combo-select" onclick="event.stopPropagation()">
                    <option value="">Seleccionar huevo</option>
                    ${menuData.huevos.map(h => `<option value="${h}">${h}</option>`).join('')}
                </select>
                <select id="carne-combo-${caldoIndex}" class="combo-select" onclick="event.stopPropagation()">
                    <option value="">Seleccionar carne</option>
                    ${menuData.carnesDesayuno.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
            </div>
            <div class="cantidad-controls">
                <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('combo-desayuno-${caldoIndex}', -1)">-</button>
                <span class="cantidad-display" id="cantidad-combo-desayuno-${caldoIndex}">1</span>
                <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('combo-desayuno-${caldoIndex}', 1)">+</button>
            </div>
        `;
        divCombo.onclick = () => seleccionarComboDesayuno(caldo, caldoIndex);
        container.appendChild(divCombo);
        
        cantidades['combo-desayuno-' + caldoIndex] = 1;
    });
}

function renderizarCombosAlmuerzo() {
    const container = document.getElementById('combos-almuerzo-menu');
    container.innerHTML = '';
    
    if (menuData.sopas.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">Agrega sopas para ver los combos disponibles</p>';
        return;
    }
    
    menuData.sopas.forEach((sopa, sopaIndex) => {
        const divCombo = document.createElement('div');
        divCombo.className = 'menu-item combo';
        divCombo.innerHTML = `
            <div class="menu-item-header">
                <h4>${sopa} + Bandeja<span class="combo-badge">COMBO</span></h4>
                <div class="price">${menuData.precios.comboAlmuerzo.toLocaleString()}</div>
            </div>
            <div style="margin: 10px 0;">
                <strong>Incluye:</strong> ${sopa} + Bandeja de Almuerzo completa
            </div>
            <div class="combo-options">
                <select id="principio-combo-${sopaIndex}" class="combo-select" onclick="event.stopPropagation()">
                    <option value="">Seleccionar principio</option>
                    ${menuData.principios.map(p => `<option value="${p}">${p}</option>`).join('')}
                </select>
                <select id="proteina-combo-${sopaIndex}" class="combo-select" onclick="event.stopPropagation()">
                    <option value="">Seleccionar proteína</option>
                    ${menuData.proteinas.map(p => `<option value="${p}">${p}</option>`).join('')}
                </select>
            </div>
            <div class="cantidad-controls">
                <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('combo-almuerzo-${sopaIndex}', -1)">-</button>
                <span class="cantidad-display" id="cantidad-combo-almuerzo-${sopaIndex}">1</span>
                <button class="cantidad-btn" onclick="event.stopPropagation(); cambiarCantidad('combo-almuerzo-${sopaIndex}', 1)">+</button>
            </div>
        `;
        divCombo.onclick = () => seleccionarComboAlmuerzo(sopa, sopaIndex);
        container.appendChild(divCombo);
        
        cantidades['combo-almuerzo-' + sopaIndex] = 1;
    });
}

// Funciones de selección
function seleccionarBandejaHuevo(tipo) {
    const huevo = document.getElementById(`huevo-select-${tipo}`).value;
    
    if (!huevo) {
        alert('Por favor selecciona el tipo de huevo');
        return;
    }
    
    if (tipo === 'bebida') {
        const container = document.getElementById('bebida-bandeja-huevo');
        const selectedIndex = container.dataset.selectedBebida;
        
        if (selectedIndex === undefined) {
            alert('Por favor selecciona una bebida');
            return;
        }
        
        const bebida = menuData.bebidas[selectedIndex];
        const cantidad = cantidades['bandeja-huevo-bebida'] || 1;
        
        agregarItem(
            'Bandeja de Huevos + Bebida',
            menuData.precios.bandejaDesayunoBebida,
            'Bandeja',
            `${huevo} | Bebida: ${bebida}`,
            cantidad
        );
        
        // Resetear
        container.dataset.selectedBebida = undefined;
        container.querySelectorAll('.bebida-option').forEach(opt => opt.classList.remove('selected'));
    } else {
        const cantidad = cantidades['bandeja-huevo-solo'] || 1;
        agregarItem(
            'Bandeja de Huevos',
            menuData.precios.bandejaDesayunoSolo,
            'Bandeja',
            huevo,
            cantidad
        );
    }
    
    // Resetear selecciones y cantidad
    document.getElementById(`huevo-select-${tipo}`).value = '';
    cantidades[`bandeja-huevo-${tipo}`] = 1;
    document.getElementById(`cantidad-bandeja-huevo-${tipo}`).textContent = '1';
}

function seleccionarBandejaCarne(tipo) {
    const carne = document.getElementById(`carne-select-${tipo}`).value;
    
    if (!carne) {
        alert('Por favor selecciona el tipo de carne');
        return;
    }
    
    if (tipo === 'bebida') {
        const container = document.getElementById('bebida-bandeja-carne');
        const selectedIndex = container.dataset.selectedBebida;
        
        if (selectedIndex === undefined) {
            alert('Por favor selecciona una bebida');
            return;
        }
        
        const bebida = menuData.bebidas[selectedIndex];
        const cantidad = cantidades['bandeja-carne-bebida'] || 1;
        
        agregarItem(
            'Bandeja de Carne + Bebida',
            menuData.precios.bandejaDesayunoBebida,
            'Bandeja',
            `${carne} | Bebida: ${bebida}`,
            cantidad
        );
        
        // Resetear
        container.dataset.selectedBebida = undefined;
        container.querySelectorAll('.bebida-option').forEach(opt => opt.classList.remove('selected'));
    } else {
        const cantidad = cantidades['bandeja-carne-solo'] || 1;
        agregarItem(
            'Bandeja de Carne',
            menuData.precios.bandejaDesayunoSolo,
            'Bandeja',
            carne,
            cantidad
        );
    }
    
    // Resetear selecciones y cantidad
    document.getElementById(`carne-select-${tipo}`).value = '';
    cantidades[`bandeja-carne-${tipo}`] = 1;
    document.getElementById(`cantidad-bandeja-carne-${tipo}`).textContent = '1';
}

function seleccionarBandejaCompleta(tipo) {
    const huevo = document.getElementById(`huevo-completa-${tipo}`).value;
    const carne = document.getElementById(`carne-completa-${tipo}`).value;
    
    if (!huevo || !carne) {
        alert('Por favor selecciona el tipo de huevo y carne');
        return;
    }
    
    const precioCompleta = Math.round(menuData.precios.bandejaDesayunoSolo * 1.5);
    const precioCompletaBebida = Math.round(menuData.precios.bandejaDesayunoBebida * 1.5);
    
    if (tipo === 'bebida') {
        const container = document.getElementById('bebida-bandeja-completa');
        const selectedIndex = container.dataset.selectedBebida;
        
        if (selectedIndex === undefined) {
            alert('Por favor selecciona una bebida');
            return;
        }
        
        const bebida = menuData.bebidas[selectedIndex];
        const cantidad = cantidades['bandeja-completa-bebida'] || 1;
        
        agregarItem(
            'Bandeja Completa + Bebida',
            precioCompletaBebida,
            'Bandeja',
            `${huevo} + ${carne} | Bebida: ${bebida}`,
            cantidad
        );
        
        // Resetear
        container.dataset.selectedBebida = undefined;
        container.querySelectorAll('.bebida-option').forEach(opt => opt.classList.remove('selected'));
    } else {
        const cantidad = cantidades['bandeja-completa-solo'] || 1;
        agregarItem(
            'Bandeja Completa (Huevos + Carne)',
            precioCompleta,
            'Bandeja',
            `${huevo} + ${carne}`,
            cantidad
        );
    }
    
    // Resetear selecciones y cantidad
    document.getElementById(`huevo-completa-${tipo}`).value = '';
    document.getElementById(`carne-completa-${tipo}`).value = '';
    cantidades[`bandeja-completa-${tipo}`] = 1;
    document.getElementById(`cantidad-bandeja-completa-${tipo}`).textContent = '1';
}

function seleccionarBandejaDesayuno(tipo) {
    // Esta función se mantiene para compatibilidad, pero ya no se usa
    // Las nuevas funciones son seleccionarBandejaHuevo, seleccionarBandejaCarne, seleccionarBandejaCompleta
}

function seleccionarBandejaAlmuerzo(tipo) {
    const principio = document.getElementById(`principio-select-${tipo}`).value;
    const proteina = document.getElementById(`proteina-select-${tipo}`).value;
    
    if (!principio || !proteina) {
        alert('Por favor selecciona el principio y la proteína');
        return;
    }
    
    if (tipo === 'bebida') {
        const container = document.getElementById('bebida-bandeja-almuerzo');
        const selectedIndex = container.dataset.selectedBebida;
        
        if (selectedIndex === undefined) {
            alert('Por favor selecciona una bebida');
            return;
        }
        
        const bebida = menuData.bebidas[selectedIndex];
        const cantidad = cantidades['bandeja-almuerzo-bebida'] || 1;
        
        agregarItem(
            'Bandeja de Almuerzo + Bebida',
            menuData.precios.bandejaAlmuerzoBebida,
            'Bandeja',
            `${principio} + ${proteina} | Bebida: ${bebida}`,
            cantidad
        );
        
        // Resetear
        container.dataset.selectedBebida = undefined;
        container.querySelectorAll('.bebida-option').forEach(opt => opt.classList.remove('selected'));
    } else {
        const cantidad = cantidades['bandeja-almuerzo-solo'] || 1;
        agregarItem(
            'Bandeja de Almuerzo',
            menuData.precios.bandejaAlmuerzoSolo,
            'Bandeja',
            `${principio} + ${proteina}`,
            cantidad
        );
    }
    
    // Resetear selecciones y cantidad
    document.getElementById(`principio-select-${tipo}`).value = '';
    document.getElementById(`proteina-select-${tipo}`).value = '';
    cantidades[`bandeja-almuerzo-${tipo}`] = 1;
    document.getElementById(`cantidad-bandeja-almuerzo-${tipo}`).textContent = '1';
}

function seleccionarComboDesayuno(caldo, index) {
    const huevo = document.getElementById(`huevo-combo-${index}`).value;
    const carne = document.getElementById(`carne-combo-${index}`).value;
    
    if (!huevo || !carne) {
        alert('Por favor selecciona el tipo de huevo y carne para la bandeja completa');
        return;
    }
    
    const cantidad = cantidades['combo-desayuno-' + index] || 1;
    
    agregarItem(
        `COMBO: ${caldo} + Bandeja Completa`,
        menuData.precios.comboDesayuno,
        'Combo',
        `Caldo: ${caldo} | Bandeja: ${huevo} + ${carne}`,
        cantidad
    );
    
    // Resetear
    document.getElementById(`huevo-combo-${index}`).value = '';
    document.getElementById(`carne-combo-${index}`).value = '';
    cantidades['combo-desayuno-' + index] = 1;
    document.getElementById('cantidad-combo-desayuno-' + index).textContent = '1';
}

function seleccionarComboAlmuerzo(sopa, index) {
    const principio = document.getElementById(`principio-combo-${index}`).value;
    const proteina = document.getElementById(`proteina-combo-${index}`).value;
    
    if (!principio || !proteina) {
        alert('Por favor selecciona el principio y la proteína para la bandeja');
        return;
    }
    
    const cantidad = cantidades['combo-almuerzo-' + index] || 1;
    
    agregarItem(
        `COMBO: ${sopa} + Bandeja`,
        menuData.precios.comboAlmuerzo,
        'Combo',
        `Sopa: ${sopa} | Bandeja: ${principio} + ${proteina}`,
        cantidad
    );
    
    // Resetear
    document.getElementById(`principio-combo-${index}`).value = '';
    document.getElementById(`proteina-combo-${index}`).value = '';
    cantidades['combo-almuerzo-' + index] = 1;
    document.getElementById('cantidad-combo-almuerzo-' + index).textContent = '1';
}

// Actualizar todos los menús principales
function actualizarMenusPrincipales() {
    renderizarCaldos();
    renderizarSopas();
    renderizarBandejasDesayuno();
    renderizarBandejasAlmuerzo();
    renderizarCombosDesayuno();
    renderizarCombosAlmuerzo();
}

// Funciones principales del pedido
function agregarItem(nombre, precio, categoria = '', descripcion = '', cantidad = 1) {
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
            descripcion: descripcion || ''
        });
    }
    
    actualizarPedido();
}

function actualizarPedido() {
    const container = document.getElementById('pedidoItems');
    container.innerHTML = '';
    
    let total = 0;
    
    pedidoActual.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        
        const div = document.createElement('div');
        div.className = 'pedido-item';
        div.innerHTML = `
            <div class="pedido-info">
                <strong>${item.nombre}</strong>
                ${item.descripcion ? `<br><small style="color: #666;">${item.descripcion}</small>` : ''}
                <br><small>${item.precio.toLocaleString()} x ${item.cantidad}</small>
            </div>
            <div class="pedido-actions">
                <strong>${subtotal.toLocaleString()}</strong>
                <button class="delete-btn" onclick="eliminarItem(${index})">×</button>
            </div>
        `;
        container.appendChild(div);
    });
    
    document.getElementById('totalPedido').textContent = total.toLocaleString();
}

function eliminarItem(index) {
    pedidoActual.splice(index, 1);
    actualizarPedido();
}

function limpiarPedido() {
    if (pedidoActual.length === 0) {
        alert('No hay items en el pedido');
        return;
    }
    
    if (confirm('¿Estás seguro de limpiar el pedido actual?')) {
        pedidoActual = [];
        actualizarPedido();
    }
}

function confirmarPedido() {
    if (pedidoActual.length === 0) {
        alert('No hay items en el pedido');
        return;
    }
    
    const mesa = document.getElementById('mesaSelect').value;
    const mesero = document.getElementById('meseroNombre').value || 'Mesero';
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    
    const total = pedidoActual.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    const venta = {
        id: Date.now(),
        mesa: mesa,
        mesero: mesero,
        fecha: fecha,
        hora: hora,
        items: [...pedidoActual],
        total: total
    };
    
    ventas.push(venta);
    totalDia += total;
    
    actualizarVentas();
    limpiarPedido();
    
    alert(`✅ Pedido confirmado\n\nMesa ${mesa}\nTotal: ${total.toLocaleString()}`);
}

function actualizarVentas() {
    document.getElementById('totalDia').textContent = totalDia.toLocaleString();
    document.getElementById('totalPedidos').textContent = ventas.length;
    
    const container = document.getElementById('listaPedidos');
    container.innerHTML = '';
    
    ventas.forEach((venta, index) => {
        const div = document.createElement('div');
        div.className = 'venta-item';
        div.innerHTML = `
            <div class="venta-info">
                <strong>Mesa ${venta.mesa} - ${venta.total.toLocaleString()}</strong><br>
                <small>${venta.fecha} ${venta.hora} - ${venta.mesero}</small><br>
                <small>${venta.items.map(item => {
                    let texto = `${item.nombre}`;
                    if (item.cantidad > 1) texto += ` x${item.cantidad}`;
                    return texto;
                }).join(', ')}</small>
            </div>
            <div class="venta-actions">
                <button class="btn btn-small btn-secondary" onclick="verDetalle(${index})">Ver</button>
                <button class="btn btn-small btn-danger" onclick="eliminarVenta(${index})">Eliminar</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function verDetalle(index) {
    const venta = ventas[index];
    let detalle = `DETALLE DEL PEDIDO\n${'='.repeat(30)}\n\n`;
    detalle += `Mesa: ${venta.mesa}\n`;
    detalle += `Mesero: ${venta.mesero}\n`;
    detalle += `Fecha: ${venta.fecha} ${venta.hora}\n\n`;
    detalle += `ITEMS:\n${'-'.repeat(30)}\n`;
    
    venta.items.forEach(item => {
        detalle += `• ${item.nombre}`;
        if (item.descripcion) detalle += `\n  (${item.descripcion})`;
        detalle += `\n  ${item.cantidad} x ${item.precio.toLocaleString()} = ${(item.precio * item.cantidad).toLocaleString()}\n\n`;
    });
    
    detalle += `${'='.repeat(30)}\n`;
    detalle += `TOTAL: ${venta.total.toLocaleString()}`;
    
    alert(detalle);
}

function eliminarVenta(index) {
    if (confirm('¿Estás seguro de eliminar esta venta?')) {
        totalDia -= ventas[index].total;
        ventas.splice(index, 1);
        actualizarVentas();
    }
}

function limpiarVentas() {
    if (ventas.length === 0) {
        alert('No hay ventas para limpiar');
        return;
    }
    
    if (confirm('¿Estás seguro de limpiar TODAS las ventas del día?\n\nEsta acción no se puede deshacer.')) {
        ventas = [];
        totalDia = 0;
        actualizarVentas();
        alert('Todas las ventas han sido eliminadas');
    }
}

// Actualizar hora cada minuto
setInterval(() => {
    document.getElementById('hora').value = new Date().toTimeString().split(' ')[0].substring(0, 5);
}, 60000);
