let carrito = {}; 

// =========================================
// 1. CONTROL DE VISTAS (SPA)
// =========================================
function mostrarVista(vista) {
    // 1. Limpiamos el buscador y restauramos la visibilidad
    document.getElementById('buscador').value = '';
    document.querySelectorAll('.item-producto').forEach(p => p.style.display = "flex");
    document.querySelectorAll('.titulo-categoria').forEach(t => t.style.display = '');
    document.querySelectorAll('.grilla-catalogo').forEach(g => g.style.display = '');
    document.getElementById('vista-productos').style.display = 'block'; // Aseguramos visibilidad
    document.getElementById('vista-promociones').style.display = 'block'; // Aseguramos visibilidad

    // 2. Ocultamos todo primero
    document.getElementById('vista-inicio').style.display = 'none';
    document.getElementById('vista-productos').style.display = 'none';
    document.getElementById('vista-promociones').style.display = 'none';

    // 3. Mostramos solo la que elegimos
    if (vista === 'inicio') document.getElementById('vista-inicio').style.display = 'block';
    if (vista === 'productos') document.getElementById('vista-productos').style.display = 'block';
    if (vista === 'promociones') document.getElementById('vista-promociones').style.display = 'block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function irASeccion(idElemento, idVista) {
    // 1. Limpiamos el buscador y restauramos todos los productos
    document.getElementById('buscador').value = '';
    document.querySelectorAll('.item-producto').forEach(p => p.style.display = "flex");
    document.querySelectorAll('.titulo-categoria').forEach(t => t.style.display = '');
    document.querySelectorAll('.grilla-catalogo').forEach(g => g.style.display = '');
    document.getElementById('vista-productos').style.display = 'block';
    document.getElementById('vista-promociones').style.display = 'block';

    // 2. Apagamos todas las vistas
    document.getElementById('vista-inicio').style.display = 'none';
    document.getElementById('vista-productos').style.display = 'none';
    document.getElementById('vista-promociones').style.display = 'none';
    
    // 3. Prendemos la que nos pasaron por parámetro
    document.getElementById(idVista).style.display = 'block';
    
    // 4. Saltamos al título de la categoría
    setTimeout(() => {
        let elemento = document.getElementById(idElemento);
        if (elemento) { 
            let offset = 80; 
            let bodyRect = document.body.getBoundingClientRect().top;
            let elementRect = elemento.getBoundingClientRect().top;
            let elementPosition = elementRect - bodyRect;
            let offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, 100);
}

// =========================================
// 2. LÓGICA DEL CARRITO (AROMAS Y LITROS)
// =========================================
function agregarProd(btn) {
    let articulo = btn.closest('.item-producto');
    let baseNombre = articulo.getAttribute('data-nombre');
    let precio = parseFloat(articulo.getAttribute('data-precio'));
    
    let nombreFinal = baseNombre;
    
    // Buscamos todos los selectores que tenga el producto
    let selectores = articulo.querySelectorAll('.select-aroma');
    selectores.forEach(select => {
        // Si el selector NO tiene la orden "cambiarLitros", entonces es el de Aroma
        if (!select.hasAttribute('onchange')) {
            nombreFinal = `${baseNombre} (${select.value})`;
        }
    });
    
    if(!carrito[nombreFinal]) {
        carrito[nombreFinal] = {cantidad: 0, precio: precio, baseNombre: baseNombre};
    }
    carrito[nombreFinal].cantidad++;
    actualizarPantalla();
}

function quitarProd(btn) {
    let articulo = btn.closest('.item-producto');
    let baseNombre = articulo.getAttribute('data-nombre');
    
    let nombreFinal = baseNombre;
    
    let selectores = articulo.querySelectorAll('.select-aroma');
    selectores.forEach(select => {
        if (!select.hasAttribute('onchange')) {
            nombreFinal = `${baseNombre} (${select.value})`;
        }
    });
    
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
        
        // TRUCO ANTI-BUG: Limpiamos las comillas para que no rompan el botón HTML
        let nombreSeguro = nombre.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        
        lista.innerHTML += `
            <li class="item-modal">
                <div class="info-item-modal">
                    <button class="btn-quitar-modal" onclick="quitarPorNombre('${nombreSeguro}')">-</button>
                    <span>${item.cantidad}x ${nombre}</span>
                </div>
                <span style="font-weight: bold;">$${subFormateado}</span>
            </li>
        `;
    }
    if(vacio) lista.innerHTML = "<li><span style='color: #888;'>Tu pedido está vacío.</span></li>";
}
function abrirModalPromo(elemento) {
    // Buscamos la tarjeta padre
    let tarjeta = elemento.closest('.tarjeta-destacado');
    
    // Sacamos el título de la promo
    let titulo = tarjeta.querySelector('h3').innerText;
    
    // Sacamos la lista de productos ocultos (el HTML)
    let listaHTML = tarjeta.querySelector('.detalle-promo').innerHTML;
    
    // Lo inyectamos en el modal
    document.getElementById('titulo-modal-promo').innerText = titulo;
    document.getElementById('contenido-modal-promo').innerHTML = listaHTML;
    
    // Hacemos aparecer el modal
    document.getElementById('modal-promo').style.display = "flex";
}

function cerrarModalPromo() {
    document.getElementById('modal-promo').style.display = "none";
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

// CERRAR MENÚ DE CATEGORÍAS AL TOCAR AFUERA
document.addEventListener('click', function(event) {
    let menu = document.querySelector('.dropdown-contenido');
    let botonCategoria = document.querySelector('.nav-cat');

    // Revisamos si el menú existe y si actualmente está abierto
    if (menu && menu.classList.contains('mostrar-menu-celular')) {
        // Si el cliente NO tocó adentro del menú y TAMPOCO tocó el botón de "Categorías"...
        if (!menu.contains(event.target) && !botonCategoria.contains(event.target)) {
            // ...entonces lo cerramos
            menu.classList.remove('mostrar-menu-celular');
        }
    }
});

// =========================================
// 7. CAMBIAR PRECIO Y DATOS SEGÚN LITROS
// =========================================
function cambiarLitros(selector) {
    // 1. Agarramos la opción que el cliente eligió (ej: 5L) y su precio
    let opcionElegida = selector.options[selector.selectedIndex];
    let nuevoPrecio = opcionElegida.getAttribute('data-precio');
    let tamaño = opcionElegida.value;
    
    // 2. Buscamos la tarjeta del producto completo
    let tarjeta = selector.closest('.item-producto');
    
    // 3. Cambiamos el texto del precio para que el cliente lo vea
    let etiquetaPrecio = tarjeta.querySelector('.precio-nuevo');
    etiquetaPrecio.innerText = "$" + nuevoPrecio + ",00";
    
    // 4. ¡CLAVE! Actualizamos los datos ocultos para que el carrito cobre bien
    tarjeta.setAttribute('data-precio', nuevoPrecio);
    
    // 5. Armamos el nombre nuevo (Ej: "Lavandina" + " 5L")
    let nombreBase = tarjeta.querySelector('h3').innerText;
    tarjeta.setAttribute('data-nombre', nombreBase + " " + tamaño);
    
    // 6. Reseteamos el contador a 0 para evitar mezclar productos si ya había sumado de 1L
    let cantidadProd = tarjeta.querySelector('.cantidad-prod');
    if(cantidadProd) cantidadProd.innerText = "0";
}

// =========================================
// 8. ENCABEZADO INTELIGENTE (SMART HEADER)
// =========================================
let ubicacionAnterior = window.pageYOffset;
let header = document.querySelector('.header-principal');

window.addEventListener('scroll', function() {
    let ubicacionActual = window.pageYOffset;
    
    // Si el usuario está bien arriba de todo, siempre mostramos el menú
    if (ubicacionActual < 50) {
        header.classList.remove('header-oculto');
    } 
    // Si desliza para ABAJO, le agregamos la clase que lo oculta
    else if (ubicacionAnterior < ubicacionActual) {
        header.classList.add('header-oculto');
    } 
    // Si desliza para ARRIBA, le sacamos la clase y vuelve a aparecer
    else {
        header.classList.remove('header-oculto');
    }
    
    // Actualizamos la posición para el próximo movimiento
    ubicacionAnterior = ubicacionActual;
});