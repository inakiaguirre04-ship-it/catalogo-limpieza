let carrito = {}; 
let esMayorista = false;

// --- FILTRO DE CATEGORÍAS (MENÚ LATERAL) ---
function filtrarCategoria(idCategoria, btnPulsado) {
    // Cambia el color del botón pulsado
    let botones = document.querySelectorAll('.btn-filtro');
    botones.forEach(b => b.classList.remove('activo'));
    btnPulsado.classList.add('activo');

    // Oculta/Muestra las secciones
    let secciones = document.querySelectorAll('.seccion-categoria');
    secciones.forEach(sec => {
        if (idCategoria === 'todas') {
            sec.style.display = "block";
        } else {
            if (sec.id === idCategoria) {
                sec.style.display = "block";
            } else {
                sec.style.display = "none";
            }
        }
    });
}

// --- MINORISTA / MAYORISTA ---
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

// --- CARRITO ---
function agregarProd(btn) {
    let li = btn.closest('.item-producto');
    let nombre = li.getAttribute('data-nombre');
    let pMin = parseFloat(li.getAttribute('data-precio-min'));
    let pMay = parseFloat(li.getAttribute('data-precio-may'));
    
    if(!carrito[nombre]) {
        carrito[nombre] = {cantidad: 0, pMin: pMin, pMay: pMay};
    }
    carrito[nombre].cantidad++;
    
    let contadorUI = btn.parentElement.querySelector('.cantidad-prod, .cantidad-prod-promo');
    if(contadorUI) contadorUI.innerText = carrito[nombre].cantidad;
    actualizarPantalla();
}

function quitarProd(btn) {
    let li = btn.closest('.item-producto');
    let nombre = li.getAttribute('data-nombre');
    
    if(carrito[nombre] && carrito[nombre].cantidad > 0) {
        carrito[nombre].cantidad--;
        let contadorUI = btn.parentElement.querySelector('.cantidad-prod, .cantidad-prod-promo');
        if(contadorUI) contadorUI.innerText = carrito[nombre].cantidad;
        
        if(carrito[nombre].cantidad === 0) delete carrito[nombre];
        actualizarPantalla();
    } else {
        alert("No tenés este producto en el carrito.");
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
    
    document.getElementById('cantidad-items').innerText = totalItems;
    let totalFormateado = totalPrecio % 1 !== 0 ? totalPrecio.toFixed(2) : totalPrecio;
    document.getElementById('total-precio').innerText = totalFormateado;
    document.getElementById('total-modal-precio').innerText = totalFormateado;
    document.getElementById('modo-pedido-modal').innerText = esMayorista ? "(Precios Mayoristas)" : "(Precios Minoristas)";
    actualizarListaModal();
}

// --- VENTANA EMERGENTE ---
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
        
        lista.innerHTML += `<li><span>${item.cantidad}x ${nombre}</span><span style="font-weight: bold;">$${subFormateado}</span></li>`;
    }
    if(vacio) lista.innerHTML = "<li><span style='color: #888;'>Tu pedido está vacío.</span></li>";
}

// --- WHATSAPP ---
function enviarWhatsApp() {
    if (Object.keys(carrito).length === 0) {
        alert("Todavía no agregaste nada al pedido.");
        return; 
    }
    let modoTexto = esMayorista ? "MAYORISTA" : "MINORISTA";
    let texto = `Hola! Quiero hacer el siguiente pedido *${modoTexto}* para envío en Río Cuarto:%0A%0A`;
    let totalPrecio = 0;
    for (let nombre in carrito) {
        let item = carrito[nombre];
        let precio = esMayorista ? item.pMay : item.pMin;
        let subtotal = precio * item.cantidad;
        totalPrecio += subtotal;
        let subFormateado = subtotal % 1 !== 0 ? subtotal.toFixed(2) : subtotal;
        texto += `- ${item.cantidad}x ${nombre} ($${subFormateado})%0A`;
    }
    let totalFormateado = totalPrecio % 1 !== 0 ? totalPrecio.toFixed(2) : totalPrecio;
    texto += `%0ATotal a abonar: $${totalFormateado}`;
    
    window.open(`https://wa.me/5493584866061?text=${texto}`, '_blank');
}

// --- BUSCADOR ---
function filtrarPromos() {
    let input = document.getElementById('buscador').value.toLowerCase();
    let promos = document.getElementsByClassName('promo-item');
    for (let i = 0; i < promos.length; i++) {
        let nombrePromo = promos[i].getAttribute('data-nombre').toLowerCase();
        promos[i].style.display = nombrePromo.includes(input) ? "flex" : "none";
    }
}