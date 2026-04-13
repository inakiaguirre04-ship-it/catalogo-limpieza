let carrito = {}; // Ahora guarda las cantidades de cada producto
let esMayorista = false;

// --- FUNCIÓN PARA CAMBIAR ENTRE MINORISTA Y MAYORISTA ---
function setModo(modo) {
    esMayorista = (modo === 'mayorista');
    
    // Cambia los colores de los botones de arriba
    document.getElementById('btn-minorista').classList.toggle('activo', !esMayorista);
    document.getElementById('btn-mayorista').classList.toggle('activo', esMayorista);
    
    // Recorre todos los productos y les cambia el precio en la pantalla
    let items = document.querySelectorAll('.item-producto');
    items.forEach(item => {
        let precioDisplay = item.querySelector('.precio-display');
        if(precioDisplay) {
            let pMin = parseFloat(item.getAttribute('data-precio-min'));
            let pMay = parseFloat(item.getAttribute('data-precio-may'));
            let precioActual = esMayorista ? pMay : pMin;
            
            // Si el precio tiene decimales, le pone la coma. Si no, lo deja entero.
            if(precioActual % 1 !== 0) {
                precioDisplay.innerText = '$' + precioActual.toFixed(2);
            } else {
                precioDisplay.innerText = '$' + precioActual;
            }
        }
    });
    
    // Si tenían cosas en el carrito, se recalcula el total con los nuevos precios
    actualizarPantalla();
}

// --- FUNCIONES DEL CARRITO ---
function agregarProd(btn) {
    let li = btn.closest('.item-producto');
    let nombre = li.getAttribute('data-nombre');
    let pMin = parseFloat(li.getAttribute('data-precio-min'));
    let pMay = parseFloat(li.getAttribute('data-precio-may'));
    
    // Si no estaba en el carrito, lo crea
    if(!carrito[nombre]) {
        carrito[nombre] = {cantidad: 0, pMin: pMin, pMay: pMay};
    }
    // Le suma uno
    carrito[nombre].cantidad++;
    
    actualizarPantalla();
}

function quitarProd(btn) {
    let li = btn.closest('.item-producto');
    let nombre = li.getAttribute('data-nombre');
    
    // Si está en el carrito y hay más de 0, le resta
    if(carrito[nombre] && carrito[nombre].cantidad > 0) {
        carrito[nombre].cantidad--;
        
        // Si llegó a 0, lo borra de la memoria para que no moleste
        if(carrito[nombre].cantidad === 0) {
            delete carrito[nombre];
        }
        actualizarPantalla();
    } else {
        alert("No tenés este producto en el carrito.");
    }
}

// --- ACTUALIZAR LOS NÚMEROS EN PANTALLA ---
function actualizarPantalla() {
    let totalItems = 0;
    let totalPrecio = 0;
    
    // Calcula todo recorriendo el carrito
    for (let nombre in carrito) {
        let item = carrito[nombre];
        let precio = esMayorista ? item.pMay : item.pMin;
        totalItems += item.cantidad;
        totalPrecio += precio * item.cantidad;
    }
    
    document.getElementById('cantidad-items').innerText = totalItems;
    
    // Formatear decimales si hacen falta
    let totalFormateado = totalPrecio % 1 !== 0 ? totalPrecio.toFixed(2) : totalPrecio;
    document.getElementById('total-precio').innerText = totalFormateado;
    document.getElementById('total-modal-precio').innerText = totalFormateado;
    
    // Actualiza el texto que dice "(Minorista)" o "(Mayorista)" en la ventanita
    document.getElementById('modo-pedido-modal').innerText = esMayorista ? "(Precios Mayoristas)" : "(Precios Minoristas)";
    
    // Dibuja la lista por si la ventanita está abierta
    actualizarListaModal();
}

// --- FUNCIONES DE LA VENTANA EMERGENTE (MODAL) ---
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
        
        lista.innerHTML += `
            <li>
                <span>${item.cantidad}x ${nombre}</span>
                <span style="font-weight: bold;">$${subFormateado}</span>
            </li>
        `;
    }
    
    if(vacio) {
        lista.innerHTML = "<li><span style='color: #888;'>Tu pedido está vacío.</span></li>";
    }
}

// --- FUNCIONALIDAD DE WHATSAPP ---
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
    
    let miNumero = "5493584866061"; 
    let url = `https://wa.me/${miNumero}?text=${texto}`;
    window.open(url, '_blank');
}

// --- FUNCIONALIDAD DEL BUSCADOR ---
function filtrarPromos() {
    let input = document.getElementById('buscador').value.toLowerCase();
    let promos = document.getElementsByClassName('promo-item');

    for (let i = 0; i < promos.length; i++) {
        let nombrePromo = promos[i].getAttribute('data-nombre').toLowerCase();
        if (nombrePromo.includes(input)) {
            promos[i].style.display = "flex";
        } else {
            promos[i].style.display = "none";
        }
    }
}