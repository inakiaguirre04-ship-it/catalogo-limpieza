let carrito = [];
let total = 0;

// --- FUNCIONALIDAD PARA SUMAR ---
function agregar(nombre, precio) {
    carrito.push({ nombre: nombre, precio: precio });
    total += precio;
    actualizarPantalla();
}

// --- FUNCIONALIDAD PARA RESTAR ---
function quitar(nombre, precio) {
    // Busca en la memoria si ya habías agregado este producto
    let indice = carrito.findIndex(producto => producto.nombre === nombre);
    
    if (indice !== -1) {
        // Si lo encuentra, borra 1 unidad y resta la plata
        carrito.splice(indice, 1);
        total -= precio;
        
        // Evita que el total quede en negativo por error
        if (total < 0) total = 0; 
        
        actualizarPantalla();
    } else {
        alert("No tenés este producto en el carrito.");
    }
}

// --- ACTUALIZAR LOS NÚMEROS EN PANTALLA ---
function actualizarPantalla() {
    document.getElementById('cantidad-items').innerText = carrito.length;
    document.getElementById('total-precio').innerText = total;
}

// --- FUNCIONALIDAD DE WHATSAPP ---
function enviarWhatsApp() {
    if (carrito.length === 0) {
        alert("Todavía no agregaste nada al pedido.");
        return; 
    }
    
    let texto = "Hola! Quiero hacer el siguiente pedido para envío en Río Cuarto:%0A%0A";
    
    carrito.forEach(producto => {
        texto += `- ${producto.nombre} ($${producto.precio})%0A`;
    });
    
    texto += `%0ATotal a abonar: $${total}`;
    
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