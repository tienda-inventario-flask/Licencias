import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

const formulario = document.getElementById('registroForm');
const btnSubmit = document.getElementById('btnSubmit');

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    btnSubmit.innerText = "Subiendo foto y registrando...";
    btnSubmit.disabled = true;

    const cedula = document.getElementById('cedula').value;
    const nombre = document.getElementById('nombre_completo').value;
    const sangre = document.getElementById('tipo_sangre').value;
    const altura = document.getElementById('altura').value;
    const sexo = document.getElementById('sexo').value;
    const peso = document.getElementById('peso').value;
    const nacimiento = document.getElementById('fecha_nacimiento').value;
    const emision = document.getElementById('fecha_emision').value;
    const vencimiento = document.getElementById('fecha_vencimiento').value;
    const archivoFoto = document.getElementById('foto').files[0];

    try {
        // 1. Subir a ImgBB
        const formData = new FormData();
        formData.append('image', archivoFoto);

        const imgbbAPIKey = 'dc1d6c82082c9c38c22b906cc3cfe203'; 
        const respuestaImgbb = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
            method: 'POST',
            body: formData
        });
        
        const datosImgbb = await respuestaImgbb.json();
        
        if (!datosImgbb.success) throw new Error("Error al subir imagen");
        const fotoURL = datosImgbb.data.url;

        // 2. Guardar en Firebase
        await setDoc(doc(db, "licencias", cedula), {
            nombre_completo: nombre,
            cedula: cedula,
            tipo_sangre: sangre,
            altura: altura,
            sexo: sexo,
            peso: peso,
            fecha_nacimiento: nacimiento,
            fecha_emision: emision,
            fecha_vencimiento: vencimiento,
            foto_url: fotoURL, 
            estado: "Activa"
        });

// 3. Generar QR
        const urlPerfil = `https://intrant-usuarios.onrender.com/perfil.html?cedula=${cedula}`;
        const urlQR = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(urlPerfil)}`;

        document.getElementById('qrImage').src = urlQR;
        document.getElementById('qrContainer').style.display = 'block';
        
        formulario.reset();
        btnSubmit.innerText = "Registrar Usuario";
        btnSubmit.disabled = false;
        alert("¡Usuario registrado con éxito!");

    } catch (error) {
        console.error(error);
        alert("Error al registrar. Revisa tu conexión.");
        btnSubmit.innerText = "Registrar Usuario";
        btnSubmit.disabled = false;
    }
});