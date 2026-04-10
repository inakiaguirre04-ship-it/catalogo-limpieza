let carrito = [];
let total = 0;

// --- FUNCIONALIDAD DEL CARRITO ---
// Esta función se activa cuando tocan "Añadir al carrito"
function agregar(nombre, precio) {
    carrito.push({ nombre: nombre, precio: precio });
    total += precio;
    
    // Actualiza los números en la pantalla
    document.getElementById('cantidad-items').innerText = carrito.length;
    document.getElementById('total-precio').innerText = total;
}

// --- FUNCIONALIDAD DE WHATSAPP ---
// Esta función se activa cuando tocan "Pedir por WhatsApp"
function enviarWhatsApp() {
    if (carrito.length === 0) {
        alert("Todavía no agregaste nada al pedido.");
        return; // Corta la función acá si está vacío
    }
    
    // Arma el texto renglón por renglón (%0A es un "Enter" para WhatsApp)
    let texto = "Hola! Quiero hacer el siguiente pedido para envío en Río Cuarto:%0A%0A";
    
    carrito.forEach(producto => {
        texto += `- ${producto.nombre} ($${producto.precio})%0A`;
    });
    
    texto += `%0ATotal a abonar: $${total}`;
    
    // ACÁ PONÉS TU NÚMERO (Con el 549 adelante y el 358)
    let miNumero = "5493584866061"; 
    
    // Abre la app de WhatsApp
    let url = `https://wa.me/${miNumero}?text=${texto}`;
    window.open(url, '_blank');
}

// --- FUNCIONALIDAD DEL BUSCADOR ---
function filtrarPromos() {
    // Toma lo que escribió el usuario y lo pasa a minúsculas
    let input = document.getElementById('buscador').value.toLowerCase();
    
    // Agarra todas las tarjetas de promociones
    let promos = document.getElementsByClassName('promo-item');

    // Recorre tarjeta por tarjeta
    for (let i = 0; i < promos.length; i++) {
        // Busca el nombre de la promo (que guardamos en el HTML en data-nombre)
        let nombrePromo = promos[i].getAttribute('data-nombre').toLowerCase();
        
        // Si el nombre incluye lo que el usuario escribió, la muestra. Si no, la oculta.
        if (nombrePromo.includes(input)) {
            promos[i].style.display = "flex";
        } else {
            promos[i].style.display = "none";
        }
    }
}