let carrito = {}; 

// =========================================
// 1. CONTROL DE VISTAS (SPA)
// =========================================
function mostrarVista(vista) {
    // Ocultamos todas primero
    document.getElementById('vista-inicio').style.display = 'none';
    document.getElementById('vista-productos').style.display = 'none';
    document.getElementById('vista-promociones').style.display = 'none';

    // Mostramos solo la que corresponde
    if (vista === 'inicio') document.getElementById('vista-inicio').style.display = 'block';
    if (vista === 'productos') document.getElementById('vista-productos').style.display = 'block';
    if (vista === 'promociones') document.getElementById('vista-promociones').style.display = 'block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function irASeccion(idElemento, idVista) {
    document.getElementById('vista-inicio').style.display = 'none';
    document.getElementById('vista-productos').style.display = 'none';
    document.getElementById('vista-promociones').style.display = 'none';
    
    document.getElementById(idVista).style.display = 'block';
    
    setTimeout(() => {
        let elemento = document.getElementById(idElemento);
        if (elemento) {
            elemento.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
}

// =========================================
// 2. LÓGICA DEL CARRITO
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
    
    let headerTotalItems = document.getElementById('header-total-items');
    let headerTotalPrecio = document.getElementById('header-total-precio');
    if(headerTotalItems) headerTotalItems.innerText = totalItems;
    if(headerTotalPrecio) headerTotalPrecio.innerText = totalFormateado;

    let modalPrecio = document.getElementById('total-modal-precio');
    if(modalPrecio) modalPrecio.innerText = totalFormateado;
    
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
// 3. CONTROL DE MODALES
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
// 5. BUSCADOR SUPERIOR (INTELIGENTE)
// =========================================
function filtrarPromos() {
    let input = document.getElementById('buscador').value.toLowerCase();
    
    // Si escribe algo, abrimos AMBOS catálogos para buscar ahí adentro
    if(input.length > 0) {
        document.getElementById('vista-inicio').style.display = 'none';
        document.getElementById('vista-productos').style.display = 'block';
        document.getElementById('vista-promociones').style.display = 'block';
    }

    let productos = document.querySelectorAll('.item-producto');

    productos.forEach(prod => {
        let nombreProd = prod.getAttribute('data-nombre').toLowerCase();
        if (nombreProd.includes(input)) {
            prod.style.display = "flex"; 
        } else {
            prod.style.display = "none";
        }
    });

    // Ocultar títulos de categorías que quedan vacías después de filtrar
    let categorias = document.querySelectorAll('.titulo-categoria');
    
    categorias.forEach(titulo => {
        let grilla = titulo.nextElementSibling; 
        if(!grilla) return;
        
        let productosVisibles = Array.from(grilla.querySelectorAll('.item-producto')).filter(p => p.style.display !== 'none');
        
        if (productosVisibles.length === 0) {
            titulo.style.display = 'none';
            grilla.style.display = 'none';
        } else {
            titulo.style.display = ''; 
            grilla.style.display = ''; 
        }
    });
}