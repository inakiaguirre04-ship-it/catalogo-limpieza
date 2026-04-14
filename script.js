let carrito = {}; 
let esMayorista = false;
const MINIMO_MAYORISTA = 100000;

function mostrarTodo() {
    let secciones = document.querySelectorAll('.seccion-categoria');
    secciones.forEach(sec => sec.style.display = "block");
    let botones = document.querySelectorAll('.btn-filtro');
    botones.forEach(b => b.classList.remove('activo'));
    if(botones.length > 0) botones[0].classList.add('activo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filtrarCategoria(idCategoria, btnPulsado) {
    let botones = document.querySelectorAll('.btn-filtro');
    botones.forEach(b => b.classList.remove('activo'));
    btnPulsado.classList.add('activo');
    let secciones = document.querySelectorAll('.seccion-categoria');
    secciones.forEach(sec => {
        sec.style.display = (idCategoria === 'todas' || sec.id === idCategoria) ? "block" : "none";
    });
}

function setModo(modo) {
    esMayorista = (modo === 'mayorista');
    document.getElementById('btn-minorista').classList.toggle('activo', !esMayorista);
    document.getElementById('btn-mayorista').classList.toggle('activo', esMayorista);
    
    let items = document.querySelectorAll('.item-producto');
    items.forEach(item => {
        let precioDisplay = item.querySelector('.precio-display');
        if(precioDisplay) {
            let pMin = parseFloat(item.getAttribute('data-precio-min'));
            let pMay = parseFloat(item.getAttribute('data-precio-may'));
            let precioActual = esMayorista ? pMay : pMin;
            precioDisplay.innerText = '$' + (precioActual % 1 !== 0 ? precioActual.toFixed(2) : precioActual);
        }
    });
    actualizarPantalla();
}

// Función genérica para actualizar el contador visual en la lista principal
function actualizarContadorPrincipal(nombre, cantidad) {
    let items = document.querySelectorAll('.item-producto');
    items.forEach(item => {
        if(item.getAttribute('data-nombre') === nombre) {
            let contador = item.querySelector('.cantidad-prod, .cantidad-prod-promo');
            if(contador) contador.innerText = cantidad;
        }
    });
}

function agregarProd(btn) {
    let li = btn.closest('.item-producto');
    let nombre = li.getAttribute('data-nombre');
    let pMin = parseFloat(li.getAttribute('data-precio-min'));
    let pMay = parseFloat(li.getAttribute('data-precio-may'));
    
    if(!carrito[nombre]) {
        carrito[nombre] = {cantidad: 0, pMin: pMin, pMay: pMay};
    }
    carrito[nombre].cantidad++;
    actualizarContadorPrincipal(nombre, carrito[nombre].cantidad);
    actualizarPantalla();
}

function quitarProd(btn) {
    let li = btn.closest('.item-producto');
    let nombre = li.getAttribute('data-nombre');
    quitarPorNombre(nombre);
}

// Nueva función para poder quitar desde el modal también
function quitarPorNombre(nombre) {
    if(carrito[nombre] && carrito[nombre].cantidad > 0) {
        carrito[nombre].cantidad--;
        let nuevaCant = carrito[nombre].cantidad;
        actualizarContadorPrincipal(nombre, nuevaCant);
        if(nuevaCant === 0) delete carrito[nombre];
        actualizarPantalla();
    }
}

function actualizarPantalla() {
    let totalItems = 0;
    let totalPrecio = 0;
    for (let nombre in carrito) {
        let item = carrito[nombre];
        let precio = esMayorista ? item.pMay : item.pMin;
        totalItems += item.cantidad;
        totalPrecio += precio * item.cantidad;
    }
    let totalFormateado = totalPrecio % 1 !== 0 ? totalPrecio.toFixed(2) : totalPrecio;
    document.getElementById('total-precio').innerText = totalFormateado;
    document.getElementById('total-modal-precio').innerText = totalFormateado;
    document.getElementById('modo-pedido-modal').innerText = esMayorista ? "(Precios Mayoristas)" : "(Precios Minoristas)";
    actualizarListaModal();
}

function abrirCarrito() {
    actualizarListaModal();
    document.getElementById('modal-carrito').style.display = "flex"; 
}

function cerrarCarrito() {
    document.getElementById('modal-carrito').style.display = "none";
}

function actualizarListaModal() {
    let lista = document.getElementById('lista-pedido-modal');
    lista.innerHTML = "";
    let vacio = true;
    for (let nombre in carrito) {
        vacio = false;
        let item = carrito[nombre];
        let precio = esMayorista ? item.pMay : item.pMin;
        let subtotal = precio * item.cantidad;
        let subFormateado = subtotal % 1 !== 0 ? subtotal.toFixed(2) : subtotal;
        
        // Agregamos el botón de menos en el modal
        lista.innerHTML += `
            <li class="item-modal">
                <div class="info-item-modal">
                    <button class="btn-quitar-modal" onclick="quitarPorNombre('${nombre}')">-</button>
                    <span>${item.cantidad}x ${nombre}</span>
                </div>
                <span style="font-weight: bold;">$${subFormateado}</span>
            </li>
        `;
    }
    if(vacio) lista.innerHTML = "<li><span style='color: #888;'>Tu pedido está vacío.</span></li>";
}

function enviarWhatsApp() {
    let totalActual = parseFloat(document.getElementById('total-modal-precio').innerText);

    if (Object.keys(carrito).length === 0) {
        alert("Todavía no agregaste nada al pedido.");
        return; 
    }

    // --- LÓGICA DE VALIDACIÓN MAYORISTA ---
    if (esMayorista && totalActual < MINIMO_MAYORISTA) {
        alert(`Atención: El mínimo para compra mayorista es $${MINIMO_MAYORISTA}. Tu pedido se cambiará automáticamente a precios minoristas.`);
        setModo('minorista');
        return; // Detenemos el envío para que el cliente vea el nuevo total
    }

    let modoTexto = esMayorista ? "MAYORISTA" : "MINORISTA";
    let texto = `Hola! Quiero hacer el siguiente pedido *${modoTexto}* para envío en Río Cuarto:%0A%0A`;
    let totalFinal = 0;

    for (let nombre in carrito) {
        let item = carrito[nombre];
        let precio = esMayorista ? item.pMay : item.pMin;
        let subtotal = precio * item.cantidad;
        totalFinal += subtotal;
        let subFormateado = subtotal % 1 !== 0 ? subtotal.toFixed(2) : subtotal;
        texto += `- ${item.cantidad}x ${nombre} ($${subFormateado})%0A`;
    }
    
    let totalFormateado = totalFinal % 1 !== 0 ? totalFinal.toFixed(2) : totalFinal;
    texto += `%0ATotal a abonar: $${totalFormateado}`;
    window.open(`https://wa.me/5493584866061?text=${texto}`, '_blank');
}

function filtrarPromos() {
    let input = document.getElementById('buscador').value.toLowerCase();
    let promos = document.getElementsByClassName('promo-item');
    for (let i = 0; i < promos.length; i++) {
        let nombrePromo = promos[i].getAttribute('data-nombre').toLowerCase();
        promos[i].style.display = nombrePromo.includes(input) ? "flex" : "none";
    }
}