import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAOaqzdSVJaVoIJWvfjs1nNGvTK51dtD3U",
  authDomain: "licencias-bc4c7.firebaseapp.com",
  projectId: "licencias-bc4c7",
  storageBucket: "licencias-bc4c7.firebasestorage.app",
  messagingSenderId: "30627598826",
  appId: "1:30627598826:web:8c29609efe3c1ac8b0e293"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const urlParams = new URLSearchParams(window.location.search);
const cedulaBuscada = urlParams.get('cedula');

const perfilContainer = document.getElementById('perfilContainer');
const mensajeError = document.getElementById('mensajeError');
const btnCambiarEstado = document.getElementById('btnCambiarEstado');
const divEstado = document.getElementById('p_estado');

let estadoActual = "";

async function cargarPerfil() {
    if (!cedulaBuscada) {
        mensajeError.style.display = 'block';
        return;
    }

    try {
        const docRef = doc(db, "licencias", cedulaBuscada);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const datos = docSnap.data();

            document.getElementById('p_foto').src = datos.foto_url;
            document.getElementById('p_nombre').innerText = datos.nombre_completo;
            document.getElementById('p_cedula').innerText = datos.cedula;
            document.getElementById('p_sangre').innerText = datos.tipo_sangre;
            document.getElementById('p_altura').innerText = datos.altura;
            document.getElementById('p_peso').innerText = datos.peso;
            document.getElementById('p_sexo').innerText = datos.sexo;
            document.getElementById('p_nacimiento').innerText = datos.fecha_nacimiento;
            document.getElementById('p_emision').innerText = datos.fecha_emision;
            document.getElementById('p_vencimiento').innerText = datos.fecha_vencimiento;
            
            estadoActual = datos.estado;
            actualizarVistaEstado(estadoActual);

            perfilContainer.style.display = 'block';
        } else {
            mensajeError.style.display = 'block';
        }
    } catch (error) {
        console.error(error);
        mensajeError.style.display = 'block';
    }
}

function actualizarVistaEstado(estado) {
    divEstado.innerText = `Licencia ${estado}`;
    if (estado === "Activa") {
        divEstado.className = "estado activa";
        btnCambiarEstado.innerText = "Desactivar Licencia";
        btnCambiarEstado.style.backgroundColor = "#dc3545"; // Botón rojo para desactivar
    } else {
        divEstado.className = "estado inactiva";
        btnCambiarEstado.innerText = "Activar Licencia";
        btnCambiarEstado.style.backgroundColor = "#28a745"; // Botón verde para activar
    }
}

btnCambiarEstado.addEventListener('click', async () => {
    const nuevoEstado = (estadoActual === "Activa") ? "Inactiva" : "Activa";
    
    btnCambiarEstado.disabled = true;
    btnCambiarEstado.innerText = "Actualizando...";

    try {
        const docRef = doc(db, "licencias", cedulaBuscada);
        await updateDoc(docRef, { estado: nuevoEstado });

        estadoActual = nuevoEstado;
        actualizarVistaEstado(estadoActual);

    } catch (error) {
        console.error(error);
        alert("Hubo un error al cambiar el estado.");
    } finally {
        btnCambiarEstado.disabled = false;
    }
});

cargarPerfil();