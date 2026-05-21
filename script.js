let carrito = {}; 

// =========================================
// 1. CONTROL DE VISTAS (SPA)
// =========================================
function mostrarVista(vista) {
    document.getElementById('vista-inicio').style.display = 'none';
    document.getElementById('vista-productos').style.display = 'none';
    document.getElementById('vista-promociones').style.display = 'none';

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
        if (element) {
            elemento.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
}

// =========================================
// 2. LÓGICA DEL CARRITO (CON SOPORTE DE AROMAS)
// =========================================
function agregarProd(btn) {
    let articulo = btn.closest('.item-producto');
    let baseNombre = articulo.getAttribute('data-nombre');
    let precio = parseFloat(articulo.getAttribute('data-precio'));
    
    // Verificamos si este producto específico tiene un selector de aromas activo
    let selectAroma = articulo.querySelector('.select-aroma');
    let nombreFinal = baseNombre;
    
    if (selectAroma) {
        let aromaElegido = selectAroma.value;
        nombreFinal = `${baseNombre} (${aromaElegido})`;
    }
    
    if(!carrito[nombreFinal]) {
        carrito[nombreFinal] = {cantidad: 0, precio: precio, baseNombre: baseNombre};
    }
    carrito[nombreFinal].cantidad++;
    actualizarPantalla();
}

function quitarProd(btn) {
    let articulo = btn.closest('.item-producto');
    let baseNombre = articulo.getAttribute('data-nombre');
    
    // Buscamos si tiene selector para restar de la variante exacta
    let selectAroma = articulo.querySelector('.select-aroma');
    let nombreFinal = baseNombre;
    
    if (selectAroma) {
        nombreFinal = `${baseNombre} (${selectAroma.value})`;
    }
    
    if(carrito[nombreFinal] && carrito[nombreFinal].cantidad > 0) {
        carrito[nombreFinal].cantidad--;
        if(carrito[nombreFinal].cantidad === 0) delete carrito[nombreFinal];
        actualizarPantalla();
    }
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
    
    // Sincronizar los contadores visuales sumando todas las variantes de aroma del mismo producto
    let items = document.querySelectorAll('.item-producto');
    items.forEach(item => {
        let baseNombre = item.getAttribute('data-nombre');
        let totalUnidades = 0;
        
        for (let nombre in carrito) {
            if (nombre === baseNombre || nombre.startsWith(baseNombre + " (")) {
                totalUnidades += carrito[nombre].cantidad;
            }
        }
        
        let contador = item.querySelector('.cantidad-prod');
        if(contador) contador.innerText = totalUnidades;
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

function abrirCheckout() {
    if (Object.keys(carrito).length === 0) {
        alert("Todavía no agregaste nada al pedido.");
        return; 
    }
    cerrarCarrito();
    document.getElementById('modal-checkout').style.display = "flex";
}

function cerrarCheckout() {
    document.getElementById('modal-checkout').style.display = "none";
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
// 4. ENVÍO A WHATSAPP CON DATOS COMPLETOS
// =========================================
function procesarPedido(event) {
    event.preventDefault(); 

    let vendedorNum = document.getElementById('vendedor').value;
    let nombre = document.getElementById('cliente-nombre').value;
    let telefono = document.getElementById('cliente-telefono').value;
    let direccion = document.getElementById('cliente-direccion').value;
    let horario = document.getElementById('cliente-horario').value;
    let notas = document.getElementById('cliente-notes') ? document.getElementById('cliente-notes').value : document.getElementById('cliente-notas').value;

    let texto = `*NUEVO PEDIDO - BUBBLE CLEANING*\n\n`;
    texto += `*Datos de Entrega:*\n`;
    texto += `- Nombre: ${nombre}\n`;
    texto += `- Teléfono: ${telefono}\n`;
    texto += `- Dirección: ${direccion}\n`;
    texto += `- Horario: ${horario}\n\n`;
    
    if (notas && notas.trim() !== "") {
        texto += `*Aclaraciones:*\n_${notas}_\n\n`;
    }

    texto += `*Detalle del Pedido:*\n`;
    let totalFinal = 0;

    for (let nombreProd in carrito) {
        let item = carrito[nombreProd];
        let subtotal = item.precio * item.cantidad;
        totalFinal += subtotal;
        let subFormateado = subtotal % 1 !== 0 ? subtotal.toFixed(2) : subtotal;
        texto += `- ${item.cantidad}x ${nombreProd} ($${subFormateado})\n`;
    }
    
    let totalFormateado = totalFinal % 1 !== 0 ? totalFinal.toFixed(2) : totalFinal;
    texto += `\n*TOTAL A ABONAR: $${totalFormateado}*`;
    
    let url = `https://wa.me/${vendedorNum}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
    cerrarCheckout();
}

// =========================================
// 5. BUSCADOR INTELIGENTE
// =========================================
function filtrarPromos() {
    let input = document.getElementById('buscador').value.toLowerCase();
    
    if(input.length > 0) {
        document.getElementById('vista-inicio').style.display = 'none';
        document.getElementById('vista-productos').style.display = 'block';
        document.getElementById('vista-promociones').style.display = 'block';
    } else {
        mostrarVista('inicio');
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

    if(input.length > 0) {
        let vistaPromos = document.getElementById('vista-promociones');
        let visiblesEnPromos = Array.from(vistaPromos.querySelectorAll('.item-producto')).filter(p => p.style.display !== 'none');
        if (visiblesEnPromos.length === 0) vistaPromos.style.display = 'none';

        let vistaProds = document.getElementById('vista-productos');
        let visiblesEnProds = Array.from(vistaProds.querySelectorAll('.item-producto')).filter(p => p.style.display !== 'none');
        if (visiblesEnProds.length === 0) vistaProds.style.display = 'none';
    }
}

// =========================================
// 6. TOQUES EN CELULAR (PROMOS Y MENÚ)
// =========================================

// Función para abrir y cerrar el menú de categorías en celular
function toggleMenuCelular() {
    let menu = document.querySelector('.dropdown-contenido');
    menu.classList.toggle('mostrar-menu-celular');
}

// Lógica para que al tocar las promos se fije la información (sin tener que mantener)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tarjeta-destacado').forEach(tarjeta => {
        tarjeta.addEventListener('click', (e) => {
            // Si el cliente tocó el botón de "+" o "-" o el menú de Aromas, no hacemos nada
            if(e.target.tagName.toLowerCase() === 'button' || e.target.tagName.toLowerCase() === 'select') return;
            
            let yaEstaActiva = tarjeta.classList.contains('activo-touch');
            
            // Apagamos todas las demás promos primero
            document.querySelectorAll('.tarjeta-destacado').forEach(t => t.classList.remove('activo-touch'));
            
            // Y si esta no estaba prendida, la prendemos
            if (!yaEstaActiva) {
                tarjeta.classList.add('activo-touch');
            }
        });
    });
});