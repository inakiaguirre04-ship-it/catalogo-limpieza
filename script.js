let carrito = {}; 

// =========================================
// 1. CONTROL DE VISTAS (CAMBIAR DE PÁGINA)
// =========================================
function mostrarVista(vista) {
    if (vista === 'inicio') {
        document.getElementById('vista-inicio').style.display = 'block';
        document.getElementById('vista-productos').style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (vista === 'productos') {
        document.getElementById('vista-inicio').style.display = 'none';
        document.getElementById('vista-productos').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function irACategoria(idCat) {
    // Primero mostramos la vista de productos
    document.getElementById('vista-inicio').style.display = 'none';
    document.getElementById('vista-productos').style.display = 'block';
    
    // Le damos un microsegundo a la página para que se dibuje y después bajamos a la categoría
    setTimeout(() => {
        let elemento = document.getElementById(idCat);
        if (elemento) {
            elemento.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
}


// =========================================
// 2. LÓGICA DEL CARRITO (SUMAR Y RESTAR)
// =========================================
function agregarProd(btn) {
    let articulo = btn.closest('.item-producto');
    let baseNombre = articulo.getAttribute('data-nombre');
    let precio = parseFloat(articulo.getAttribute('data-precio'));
    
    if(!carrito[baseNombre]) {
        carrito[baseNombre] = {cantidad: 0, precio: precio};
    }
    carrito[baseNombre].cantidad++;
    actualizarPantalla();
}

function quitarProd(btn) {
    let articulo = btn.closest('.item-producto');
    let baseNombre = articulo.getAttribute('data-nombre');
    quitarPorNombre(baseNombre);
}

function quitarPorNombre(nombre) {
    if(carrito[nombre] && carrito[nombre].cantidad > 0) {
        carrito[nombre].cantidad--;
        if(carrito[nombre].cantidad === 0) delete carrito[nombre];
        actualizarPantalla();
    }
}

function actualizarPantalla() {
    let totalItems = 0;
    let totalPrecio = 0;
    
    for (let nombre in carrito) {
        totalPrecio += carrito[nombre].precio * carrito[nombre].cantidad;
        totalItems += carrito[nombre].cantidad;
    }
    
    let totalFormateado = totalPrecio % 1 !== 0 ? totalPrecio.toFixed(2) : totalPrecio;
    
    // Actualizar encabezado
    let headerTotalItems = document.getElementById('header-total-items');
    let headerTotalPrecio = document.getElementById('header-total-precio');
    if(headerTotalItems) headerTotalItems.innerText = totalItems;
    if(headerTotalPrecio) headerTotalPrecio.innerText = totalFormateado;

    // Actualizar modal
    let modalPrecio = document.getElementById('total-modal-precio');
    if(modalPrecio) modalPrecio.innerText = totalFormateado;
    
    // Sincronizar todos los botones en pantalla (Inicio y Productos a la vez)
    let items = document.querySelectorAll('.item-producto');
    items.forEach(item => {
        let baseNombre = item.getAttribute('data-nombre');
        let sum = carrito[baseNombre] ? carrito[baseNombre].cantidad : 0;
        let contador = item.querySelector('.cantidad-prod');
        if(contador) contador.innerText = sum;
    });

    actualizarListaModal();
}


// =========================================
// 3. CONTROL DE MODALES (VENTANAS FLOTANTES)
// =========================================
function abrirCarrito() {
    actualizarListaModal();
    document.getElementById('modal-carrito').style.display = "flex"; 
}

function cerrarCarrito() {
    document.getElementById('modal-carrito').style.display = "none";
}

function abrirComoComprar() {
    document.getElementById('modal-como-comprar').style.display = "flex";
}

function cerrarComoComprar() {
    document.getElementById('modal-como-comprar').style.display = "none";
}

function actualizarListaModal() {
    let lista = document.getElementById('lista-pedido-modal');
    if(!lista) return;
    lista.innerHTML = "";
    let vacio = true;
    
    for (let nombre in carrito) {
        vacio = false;
        let item = carrito[nombre];
        let subtotal = item.precio * item.cantidad;
        let subFormateado = subtotal % 1 !== 0 ? subtotal.toFixed(2) : subtotal;
        
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


// =========================================
// 4. ENVÍO A WHATSAPP
// =========================================
function enviarWhatsApp() {
    if (Object.keys(carrito).length === 0) {
        alert("Todavía no agregaste nada al pedido.");
        return; 
    }

    let texto = "Hola! Quiero hacer el siguiente pedido para envío en Río Cuarto:\n\n";
    let totalFinal = 0;

    for (let nombre in carrito) {
        let item = carrito[nombre];
        let subtotal = item.precio * item.cantidad;
        totalFinal += subtotal;
        let subFormateado = subtotal % 1 !== 0 ? subtotal.toFixed(2) : subtotal;
        texto += `- ${item.cantidad}x ${nombre} ($${subFormateado})\n`;
    }
    
    let totalFormateado = totalFinal % 1 !== 0 ? totalFinal.toFixed(2) : totalFinal;
    texto += `\nTotal a abonar: $${totalFormateado}`;
    
    let url = `https://wa.me/5493584866061?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}


// =========================================
// 5. BUSCADOR SUPERIOR
// =========================================
function filtrarPromos() {
    let input = document.getElementById('buscador').value.toLowerCase();
    
    // Si la persona empieza a escribir, lo llevamos automáticamente al catálogo completo
    if(input.length > 0) {
        document.getElementById('vista-inicio').style.display = 'none';
        document.getElementById('vista-productos').style.display = 'block';
    }

    // Filtramos solo los productos que están dentro del catálogo
    let productos = document.querySelectorAll('#vista-productos .item-producto');

    productos.forEach(prod => {
        let nombreProd = prod.getAttribute('data-nombre').toLowerCase();
        if (nombreProd.includes(input)) {
            prod.style.display = "flex"; 
        } else {
            prod.style.display = "none";
        }
    });
}