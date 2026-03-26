// === SESION USUARIO ===

let usuario = localStorage.getItem("usuario")

if (!usuario) {
    usuario = prompt("Ingrese su nombre")
    localStorage.setItem("usuario", usuario)
}

console.log("Usuario activo:", usuario)

// === HISTORIAL ===

let historial = JSON.parse(localStorage.getItem("historial")) || []

// === REGISTRAR VISITAS ===

const botones = document.querySelectorAll(".proyecto")

botones.forEach(boton => {
    boton.addEventListener("click", () => {

        const nombreProyecto = boton.dataset.proyecto

        historial.push(nombreProyecto)

        localStorage.setItem("historial", JSON.stringify(historial))

        console.log("Historial actualizado:", historial)
    })
})

// === Cargar Acciones Mercado Bursatil ===
let activos = [];

const formulario = document.getElementById('formulario-datos');
const cuerpoTabla = document.getElementById('cuerpo-tabla');
const mensajeError = document.getElementById('mensaje-error');
const mensajeVacio = document.getElementById('mensaje-vacio');


const cargarActivosDesdeAPI = async () => {
    try {
        const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1';
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error("Error en la red");
        
        const datosAPI = await respuesta.json();

        activos = datosAPI.map(({ id, name, current_price, symbol }) => ({
            id: id,
            nombre: name,
            valor: current_price.toFixed(2),
            simbolo: symbol.toUpperCase()
        }));

        renderizarTabla();
    } catch (error) {
        console.error("Falla al cargar:", error);
        mensajeError.textContent = "Error al conectar con la API.";
        mensajeError.classList.remove('oculto');
    }
};

const renderizarTabla = () => {
    cuerpoTabla.innerHTML = ''; 

    mensajeVacio.style.display = activos.length === 0 ? 'block' : 'none';

    activos.forEach(({ id, nombre, valor, simbolo }) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${nombre}</td>
            <td>${simbolo}</td>
            <td>$${valor}</td>
            <td>
                <button onclick="eliminarActivo('${id}')" class="boton-eliminar">Eliminar</button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });
};

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const simbolo = document.getElementById('simbolo').value.trim().toUpperCase();
    const valor = document.getElementById('precio').value.trim();

    if (!nombre || !simbolo || !valor) {
        mensajeError.classList.remove('oculto');
        return;
    }

    mensajeError.classList.add('oculto');

    const nuevoActivo = { 
        id: Date.now().toString(), 
        nombre, 
        simbolo, 
        valor: parseFloat(valor).toFixed(2) 
    };
    
    activos = [nuevoActivo, ...activos];

    renderizarTabla();
    formulario.reset();
});

window.eliminarActivo = (id) => {
    activos = activos.filter(item => item.id !== id); 
    renderizarTabla();
};

cargarActivosDesdeAPI();