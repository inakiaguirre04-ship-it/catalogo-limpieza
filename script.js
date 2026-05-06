let carrito = {}; 

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
    let precio = parseFloat(li.getAttribute('data-precio'));
    
    if(!carrito[nombre]) {
        carrito[nombre] = {cantidad: 0, precio: precio};
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
        totalItems += item.cantidad;
        totalPrecio += item.precio * item.cantidad;
    }
    let totalFormateado = totalPrecio % 1 !== 0 ? totalPrecio.toFixed(2) : totalPrecio;
    document.getElementById('total-precio').innerText = totalFormateado;
    document.getElementById('total-modal-precio').innerText = totalFormateado;
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

function enviarWhatsApp() {
    if (Object.keys(carrito).length === 0) {
        alert("Todavía no agregaste nada al pedido.");
        return; 
    }

    let texto = `Hola! Quiero hacer el siguiente pedido para envío en Río Cuarto:%0A%0A`;
    let totalFinal = 0;

    for (let nombre in carrito) {
        let item = carrito[nombre];
        let subtotal = item.precio * item.cantidad;
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
    let secciones = document.querySelectorAll('.seccion-categoria');

    secciones.forEach(sec => {
        let productos = sec.querySelectorAll('.promo-item');
        let seccionVisible = false; // Variable para saber si quedó algo visible en esta sección

        productos.forEach(prod => {
            let nombreProd = prod.getAttribute('data-nombre').toLowerCase();
            // Si el nombre incluye lo que busco, lo muestro y marco la sección como visible
            if (nombreProd.includes(input)) {
                prod.style.display = "flex";
                seccionVisible = true;
            } else {
                prod.style.display = "none";
            }
        });

        // Si la sección tiene al menos un producto que coincide, mostramos todo el bloque (con su título)
        // Si no tiene ninguno, ocultamos la sección entera para que no moleste
        if (seccionVisible) {
            sec.style.display = "block";
        } else {
            sec.style.display = "none";
        }
    });
}