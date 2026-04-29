function registrarPago() {
    // 1. Obtener los valores de los inputs
    const cliente = document.getElementById('cliente').value;
    const fechaInput = document.getElementById('fechaPago').value;
    const planDias = parseInt(document.getElementById('plan').value);
    const mensajeDiv = document.getElementById('mensaje');

    // Validar que los campos no estén vacíos
    if (!cliente || !fechaInput) {
        alert("¡Hey bro! No olvides poner el nombre y la fecha.");
        return;
    }

    // 2. Crear objeto de fecha (ajustando para evitar desfase de zona horaria)
    let fechaPago = new Date(fechaInput + "T00:00:00");

    // 3. Calcular Vencimiento (sumar 15 o 30 días)
    let fechaVencimiento = new Date(fechaPago);
    fechaVencimiento.setDate(fechaVencimiento.getDate() + planDias);

    // 4. Calcular Alerta (2 días antes del vencimiento)
    let fechaNotificacion = new Date(fechaVencimiento);
    fechaNotificacion.setDate(fechaNotificacion.getDate() - 2);

    // 5. Formatear las fechas para que se vean amigables
    const formato = { day: '2-digit', month: 'long', year: 'numeric' };
    const txtVence = fechaVencimiento.toLocaleDateString('es-ES', formato);
    const txtAviso = fechaNotificacion.toLocaleDateString('es-ES', formato);

    // =========================================================
    // NUEVA PARTE: ENVÍO A GOOGLE SHEETS
    // =========================================================
    const urlGoogleScript = "https://script.google.com/a/macros/uma.edu.sv/s/AKfycbxsgypFd2gxX23nClZu6sBoOJK74EOzRkzFlU1ApvUlpTm8_l-1jfsQefFjEW4jpqfd/exec"; 

    const datosParaEnviar = {
        cliente: cliente,
        fechaPago: fechaInput,
        plan: planDias + " días",
        vencimiento: txtVence,
        notificacion: txtAviso
    };

    fetch(urlGoogleScript, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosParaEnviar)
    })
    .then(() => console.log("Datos enviados a la nube"))
    .catch(error => console.error("Error:", error));
    // =========================================================

    // 6. Mostrar el resultado en el Dashboard
    mensajeDiv.style.display = "block";
    mensajeDiv.style.backgroundColor = "#f8f9fa";
    
    mensajeDiv.innerHTML = `
        <div style="font-size: 1.1em;">
            <strong>✅ Registro Exitoso</strong><br>
            <span style="color: #555;">Socio:</span> ${cliente}<br>
            <span style="color: #555;">Plan:</span> ${planDias} días<br><br>
            <strong>📅 Fecha de Vencimiento:</strong><br>
            <span style="font-size: 1.2em; color: #1a73e8;">${txtVence}</span><br><br>
            <span class="alert-bell">🔔 Programar aviso para el: ${txtAviso}</span>
        </div>
    `;
}
