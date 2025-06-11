document.addEventListener('DOMContentLoaded', () => {
    let appData = {
        nextPilotoId: 1,
        pilotos: [],
        nextNoticiaId: 1,
        noticias: []
    };

    // --- Referencias a elementos del DOM de Pilotos ---
    const pilotoForm = document.getElementById('piloto-form');
    const pilotoIdInput = document.getElementById('piloto-id');
    const pilotoNombreInput = document.getElementById('piloto-nombre');
    const pilotoEquipoInput = document.getElementById('piloto-equipo');
    const pilotoPuntosInput = document.getElementById('piloto-puntos');
    const pilotoImagenInput = document.getElementById('piloto-imagen');
    const pilotoPosterInput = document.getElementById('piloto-poster'); // Nuevo campo para poster
    const pilotoDestacadoInput = document.getElementById('piloto-destacado');
    const pilotosList = document.getElementById('pilotos-list');
    const btnAddPiloto = document.getElementById('btn-add-piloto');
    const btnUpdatePiloto = document.getElementById('btn-update-piloto');
    const btnCancelPiloto = document.getElementById('btn-cancel-piloto');

    // --- Referencias a elementos del DOM de Noticias ---
    const noticiaForm = document.getElementById('noticia-form');
    const noticiaIdInput = document.getElementById('noticia-id');
    const noticiaTituloInput = document.getElementById('noticia-titulo');
    const noticiaFechaInput = document.getElementById('noticia-fecha');
    const noticiaAutorInput = document.getElementById('noticia-autor');
    const noticiaContenidoCortoInput = document.getElementById('noticia-contenido-corto');
    const noticiaContenidoCompletoInput = document.getElementById('noticia-contenido-completo');
    const noticiasList = document.getElementById('noticias-list');
    const btnAddNoticia = document.getElementById('btn-add-noticia');
    const btnUpdateNoticia = document.getElementById('btn-update-noticia');
    const btnCancelNoticia = document.getElementById('btn-cancel-noticia');

    // --- Elementos para Generar/Copiar JSON ---
    const generateAndDownloadJsonBtn = document.getElementById('generateAndDownloadJsonBtn');
    const jsonOutputContainer = document.getElementById('json-output-container');
    const jsonOutput = document.getElementById('json-output');
    const copyJsonBtn = document.getElementById('copyJsonBtn');
    const messageDiv = document.getElementById('message');

    // --- Cargar datos iniciales del data.json si existe ---
    async function cargarDatosIniciales() {
        try {
            // Intentar cargar data.json desde la misma carpeta que editor.html
            const response = await fetch('data.json'); 
            if (response.ok) {
                const jsonData = await response.json();
                appData.pilotos = jsonData.pilotos || [];
                appData.noticias = jsonData.noticias || [];
                appData.nextPilotoId = jsonData.nextPilotoId || 1;
                appData.nextNoticiaId = jsonData.nextNoticiaId || 1;
            } else {
                console.warn('data.json no encontrado o error al cargarlo. Iniciando con datos vacíos.');
            }
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            console.warn('Iniciando con datos vacíos.');
        }
        renderPilotos();
        renderNoticias();
    }

    // --- Funciones para Pilotos ---
    function renderPilotos() {
        pilotosList.innerHTML = ''; // Limpiar lista
        appData.pilotos.sort((a, b) => a.id - b.id); // Ordenar por ID
        appData.pilotos.forEach(piloto => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span><strong>${piloto.nombre}</strong> (${piloto.equipo}) - Puntos: ${piloto.puntos} - Destacado: ${piloto.destacado ? 'Sí' : 'No'}</span>
                <div class="item-actions">
                    <button class="btn-edit" data-id="${piloto.id}" data-type="piloto">Editar</button>
                    <button class="btn-delete" data-id="${piloto.id}" data-type="piloto">Eliminar</button>
                </div>
            `;
            pilotosList.appendChild(li);
        });
        updateNextPilotoId();
    }

    function addPiloto(event) {
        event.preventDefault();
        const nuevoPiloto = {
            id: appData.nextPilotoId,
            nombre: pilotoNombreInput.value,
            equipo: pilotoEquipoInput.value,
            puntos: parseInt(pilotoPuntosInput.value),
            imagen: pilotoImagenInput.value,
            poster: pilotoPosterInput.value, // Guardar URL del poster
            destacado: pilotoDestacadoInput.checked
        };
        appData.pilotos.push(nuevoPiloto);
        clearPilotoForm();
        renderPilotos();
        mostrarMensaje('Piloto agregado exitosamente!', 'success');
    }

    function editPiloto(id) {
        const piloto = appData.pilotos.find(p => p.id === id);
        if (piloto) {
            pilotoIdInput.value = piloto.id;
            pilotoNombreInput.value = piloto.nombre;
            pilotoEquipoInput.value = piloto.equipo;
            pilotoPuntosInput.value = piloto.puntos;
            pilotoImagenInput.value = piloto.imagen;
            pilotoPosterInput.value = piloto.poster; // Cargar URL del poster para edición
            pilotoDestacadoInput.checked = piloto.destacado;

            btnAddPiloto.style.display = 'none';
            btnUpdatePiloto.style.display = 'inline-block';
            btnCancelPiloto.style.display = 'inline-block';
        }
    }

    function updatePiloto(event) {
        event.preventDefault();
        const id = parseInt(pilotoIdInput.value);
        const pilotoIndex = appData.pilotos.findIndex(p => p.id === id);

        if (pilotoIndex > -1) {
            appData.pilotos[pilotoIndex] = {
                id: id,
                nombre: pilotoNombreInput.value,
                equipo: pilotoEquipoInput.value,
                puntos: parseInt(pilotoPuntosInput.value),
                imagen: pilotoImagenInput.value,
                poster: pilotoPosterInput.value, // Actualizar URL del poster
                destacado: pilotoDestacadoInput.checked
            };
            clearPilotoForm();
            renderPilotos();
            btnAddPiloto.style.display = 'inline-block';
            btnUpdatePiloto.style.display = 'none';
            btnCancelPiloto.style.display = 'none';
            mostrarMensaje('Piloto actualizado exitosamente!', 'success');
        }
    }

    function deletePiloto(id) {
        appData.pilotos = appData.pilotos.filter(p => p.id !== id);
        renderPilotos();
        mostrarMensaje('Piloto eliminado.', 'info');
    }

    function clearPilotoForm() {
        pilotoForm.reset();
        pilotoIdInput.value = '';
        pilotoDestacadoInput.checked = false; // Resetear checkbox explícitamente
        btnAddPiloto.style.display = 'inline-block';
        btnUpdatePiloto.style.display = 'none';
        btnCancelPiloto.style.display = 'none';
    }

    function updateNextPilotoId() {
        const maxId = appData.pilotos.reduce((max, p) => Math.max(max, p.id), 0);
        appData.nextPilotoId = maxId + 1;
    }

    // --- Funciones para Noticias ---
    function renderNoticias() {
        noticiasList.innerHTML = ''; // Limpiar lista
        appData.noticias.sort((a, b) => b.id - a.id); // Ordenar por ID, más reciente primero
        appData.noticias.forEach(noticia => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span><strong>${noticia.titulo}</strong> - ${noticia.fecha}</span>
                <div class="item-actions">
                    <button class="btn-edit" data-id="${noticia.id}" data-type="noticia">Editar</button>
                    <button class="btn-delete" data-id="${noticia.id}" data-type="noticia">Eliminar</button>
                </div>
            `;
            noticiasList.appendChild(li);
        });
        updateNextNoticiaId();
    }

    function addNoticia(event) {
        event.preventDefault();
        const nuevaNoticia = {
            id: appData.nextNoticiaId,
            titulo: noticiaTituloInput.value,
            fecha: noticiaFechaInput.value,
            autor: noticiaAutorInput.value,
            contenidoCorto: noticiaContenidoCortoInput.value,
            contenidoCompleto: noticiaContenidoCompletoInput.value
        };
        appData.noticias.push(nuevaNoticia);
        clearNoticiaForm();
        renderNoticias();
        mostrarMensaje('Noticia agregada exitosamente!', 'success');
    }

    function editNoticia(id) {
        const noticia = appData.noticias.find(n => n.id === id);
        if (noticia) {
            noticiaIdInput.value = noticia.id;
            noticiaTituloInput.value = noticia.titulo;
            noticiaFechaInput.value = noticia.fecha;
            noticiaAutorInput.value = noticia.autor;
            noticiaContenidoCortoInput.value = noticia.contenidoCorto;
            noticiaContenidoCompletoInput.value = noticia.contenidoCompleto;

            btnAddNoticia.style.display = 'none';
            btnUpdateNoticia.style.display = 'inline-block';
            btnCancelNoticia.style.display = 'inline-block';
        }
    }

    function updateNoticia(event) {
        event.preventDefault();
        const id = parseInt(noticiaIdInput.value);
        const noticiaIndex = appData.noticias.findIndex(n => n.id === id);

        if (noticiaIndex > -1) {
            appData.noticias[noticiaIndex] = {
                id: id,
                titulo: noticiaTituloInput.value,
                fecha: noticiaFechaInput.value,
                autor: noticiaAutorInput.value,
                contenidoCorto: noticiaContenidoCortoInput.value,
                contenidoCompleto: noticiaContenidoCompletoInput.value
            };
            clearNoticiaForm();
            renderNoticias();
            btnAddNoticia.style.display = 'inline-block';
            btnUpdateNoticia.style.display = 'none';
            btnCancelNoticia.style.display = 'none';
            mostrarMensaje('Noticia actualizada exitosamente!', 'success');
        }
    }

    function deleteNoticia(id) {
        appData.noticias = appData.noticias.filter(n => n.id !== id);
        renderNoticias();
        mostrarMensaje('Noticia eliminada.', 'info');
    }

    function clearNoticiaForm() {
        noticiaForm.reset();
        noticiaIdInput.value = '';
        btnAddNoticia.style.display = 'inline-block';
        btnUpdateNoticia.style.display = 'none';
        btnCancelNoticia.style.display = 'none';
    }

    function updateNextNoticiaId() {
        const maxId = appData.noticias.reduce((max, n) => Math.max(max, n.id), 0);
        appData.nextNoticiaId = maxId + 1;
    }

    // --- Manejo de eventos generales ---
    pilotoForm.addEventListener('submit', (event) => {
        if (pilotoIdInput.value) { // Si hay un ID, es una actualización
            updatePiloto(event);
        } else { // Si no hay ID, es una adición
            addPiloto(event);
        }
    });

    noticiaForm.addEventListener('submit', (event) => {
        if (noticiaIdInput.value) { // Si hay un ID, es una actualización
            updateNoticia(event);
        } else { // Si no hay ID, es una adición
            addNoticia(event);
        }
    });

    pilotosList.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-edit') && event.target.dataset.type === 'piloto') {
            editPiloto(parseInt(event.target.dataset.id));
        } else if (event.target.classList.contains('btn-delete') && event.target.dataset.type === 'piloto') {
            if (confirm('¿Estás seguro de que quieres eliminar este piloto?')) {
                deletePiloto(parseInt(event.target.dataset.id));
            }
        }
    });

    noticiasList.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-edit') && event.target.dataset.type === 'noticia') {
            editNoticia(parseInt(event.target.dataset.id));
        } else if (event.target.classList.contains('btn-delete') && event.target.dataset.type === 'noticia') {
            if (confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
                deleteNoticia(parseInt(event.target.dataset.id));
            }
        }
    });

    btnCancelPiloto.addEventListener('click', clearPilotoForm);
    btnCancelNoticia.addEventListener('click', clearNoticiaForm);

    // --- Generación y Copia/Descarga de JSON ---
    generateAndDownloadJsonBtn.addEventListener('click', () => {
        const jsonString = JSON.stringify(appData, null, 2);
        jsonOutput.value = jsonString; // Muestra el JSON también en el textarea
        jsonOutputContainer.style.display = 'block'; // Asegura que el contenedor del textarea esté visible
        jsonOutput.select(); // Selecciona el texto para que sea fácil de copiar

        // Crear un Blob (Binary Large Object) con el contenido JSON
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Crear un enlace de descarga y simular un clic
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json'; // Nombre del archivo que se descargará
        document.body.appendChild(a); // Es necesario agregarlo al DOM para Firefox
        a.click(); // Simular clic
        document.body.removeChild(a); // Limpiar
        URL.revokeObjectURL(url); // Liberar la URL del objeto Blob

        mostrarMensaje('¡Archivo data.json generado y descargado! No olvides reemplazar el anterior en tu proyecto principal.', 'success');
    });

    copyJsonBtn.addEventListener('click', () => {
        jsonOutput.select();
        document.execCommand('copy');
        mostrarMensaje('¡Código JSON copiado al portapapeles!', 'success');
    });

    // --- Función para mostrar mensajes de estado ---
    function mostrarMensaje(msg, type) {
        messageDiv.textContent = msg;
        messageDiv.className = 'message ' + type; // Añade la clase 'success', 'error', 'info'
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000); // Ocultar después de 5 segundos
    }

    // Cargar datos al iniciar el editor
    cargarDatosIniciales();
});