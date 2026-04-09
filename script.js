let carrito = [];
let total = 0;

// Esta función se activa cuando tocan "Añadir al carrito"
function agregar(nombre, precio) {
    carrito.push({ nombre: nombre, precio: precio });
    total += precio;
    
    // Actualiza los números en la pantalla
    document.getElementById('cantidad-items').innerText = carrito.length;
    document.getElementById('total-precio').innerText = total;
}

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
    let miNumero = "54935815000000"; 
    
    // Abre la app de WhatsApp
    let url = `https://wa.me/${miNumero}?text=${texto}`;
    window.open(url, '_blank');
}