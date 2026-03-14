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
