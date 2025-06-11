// script.js (anteriormente main.js o script.js para F1 Roblox)

let appData = {
    pilotos: [],
    noticias: []
};

// Función para cargar todos los datos desde data.json
async function cargarDatos() {
    try {
        const response = await fetch('data.json'); // Ruta correcta del data.json
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();

        appData.pilotos = jsonData.pilotos || [];
        appData.noticias = jsonData.noticias || [];

        // Determinar qué función de renderizado ejecutar según la página actual
        if (document.getElementById('piloto-destacado-card') && document.getElementById('noticias-grid')) {
            renderPilotoDestacado();
            renderUltimasNoticias();
        }
        if (document.getElementById('all-news-container')) {
            renderAllNoticias();
        }
        if (document.getElementById('racers-gallery')) { // Este ID es para la página de 'corredores.html'
            renderAllPilotosProfileCards(); // Nueva función para las fotos de perfil
        }
        if (document.getElementById('posters-gallery')) { // Este ID es para la nueva página de 'galeria_posters.html'
            renderGaleriaPosters(); // Nueva función para los posters
        }
        if (document.getElementById('driver-list')) { // Este ID es para la página de 'puntajes.html'
            renderDriverStandings(); // <--- Llamamos a la función de renderizado de puntajes aquí
        }

    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

// Función para renderizar el piloto destacado en index.html
function renderPilotoDestacado() {
    const destacadoCard = document.getElementById('piloto-destacado-card');
    if (!destacadoCard) return;

    const piloto = appData.pilotos.find(p => p.destacado);

    if (piloto) {
        destacadoCard.innerHTML = `
            <img src="${piloto.imagen}" alt="${piloto.nombre}" class="driver-img">
            <div class="driver-info">
                <h3>${piloto.nombre}</h3>
                <p>Equipo: ${piloto.equipo}</p>
                <p>Puntos: ${piloto.puntos}</p>
            </div>
        `;
    } else {
        destacadoCard.innerHTML = '<p>No hay piloto destacado en este momento.</p>';
    }
}

// Función para renderizar las últimas noticias en index.html
function renderUltimasNoticias() {
    const noticiasGrid = document.getElementById('noticias-grid');
    if (!noticiasGrid) return;

    noticiasGrid.innerHTML = '';
    const ultimas3Noticias = appData.noticias.slice(0, 3); // Muestra las 3 primeras noticias

    ultimas3Noticias.forEach(noticia => {
        const newsCard = document.createElement('div');
        newsCard.classList.add('news-card');
        newsCard.innerHTML = `
            <h3>${noticia.titulo}</h3>
            <p class="news-meta">Por ${noticia.autor} | ${noticia.fecha}</p>
            <div class="news-content-wrapper">
                <p class="short-content">${noticia.contenidoCorto}</p>
                <p class="full-content hidden">${noticia.contenidoCompleto}</p>
                <button class="toggle-content-btn">Ver más</button>
            </div>
        `;
        noticiasGrid.appendChild(newsCard);
    });
    addToggleContentListeners(noticiasGrid); // Añadir listeners para los botones "Ver más"
}

// Función para renderizar todas las noticias en noticias.html
function renderAllNoticias() {
    const allNewsContainer = document.getElementById('all-news-container');
    if (!allNewsContainer) return;

    allNewsContainer.innerHTML = '';
    appData.noticias.forEach(noticia => {
        const newsCard = document.createElement('div');
        newsCard.classList.add('news-card');
        newsCard.innerHTML = `
            <h3>${noticia.titulo}</h3>
            <p class="news-meta">Por ${noticia.autor} | ${noticia.fecha}</p>
            <div class="news-content-wrapper">
                <p class="short-content">${noticia.contenidoCorto}</p>
                <p class="full-content hidden">${noticia.contenidoCompleto}</p>
                <button class="toggle-content-btn">Ver más</button>
            </div>
        `;
        allNewsContainer.appendChild(newsCard);
    });
    addToggleContentListeners(allNewsContainer); // Añadir listeners para los botones "Ver más"
}

// Función para renderizar las tarjetas de perfil de corredores en corredores.html
function renderAllPilotosProfileCards() {
    const racersGallery = document.getElementById('racers-gallery');
    if (!racersGallery) return;

    racersGallery.innerHTML = '';
    appData.pilotos.forEach(piloto => {
        const racerCard = document.createElement('div');
        racerCard.classList.add('racer-card');
        racerCard.innerHTML = `
            <img src="${piloto.imagen}" alt="${piloto.nombre}">
            <h3>${piloto.nombre}</h3>
            <p>${piloto.equipo}</p>
            <p>${piloto.puntos} Puntos</p>
        `;
        racersGallery.appendChild(racerCard);
    });
}

// Función para renderizar la galería de posters en galeria_posters.html
function renderGaleriaPosters() {
    const postersGallery = document.getElementById('posters-gallery');
    if (!postersGallery) return;

    postersGallery.innerHTML = '';
    appData.pilotos.forEach(piloto => {
        if (piloto.poster) { // Solo mostrar si tiene poster
            const posterItem = document.createElement('div');
            posterItem.classList.add('poster-item');
            posterItem.innerHTML = `
                <img src="${piloto.poster}" alt="Poster de ${piloto.nombre}">
                <div class="poster-title">${piloto.nombre} - ${piloto.equipo}</div>
            `;
            postersGallery.appendChild(posterItem);
        }
    });
}


// --- Función para renderizar la tabla de posiciones en puntajes.html ---
function renderDriverStandings() {
    const driverList = document.getElementById('driver-list');
    const highlightedDriver = document.getElementById('highlighted-driver');
    if (!driverList || !highlightedDriver) return;

    driverList.innerHTML = '';
    highlightedDriver.innerHTML = ''; // Limpiar el piloto destacado de la página de puntajes

    // Separar pilotos activos y DEF
    const activePilotos = appData.pilotos.filter(piloto => piloto.estado === 'activo');
    const defPilotos = appData.pilotos.filter(piloto => piloto.estado === 'def');

    // Ordenar pilotos activos por puntos de mayor a menor
    activePilotos.sort((a, b) => b.puntos - a.puntos);

    // Los pilotos DEF se ordenan alfabéticamente y se añaden al final
    const sortedPilotos = activePilotos.concat(defPilotos.sort((a, b) => a.nombre.localeCompare(b.nombre)));

    // Renderizar el piloto destacado (el primero de los activos si existe)
    if (activePilotos.length > 0) {
        const topPiloto = activePilotos[0];
        highlightedDriver.innerHTML = `
            <img src="${topPiloto.imagen}" alt="${topPiloto.nombre}" class="driver-highlight-img">
            <div class="content">
                <h3>Líder Actual: ${topPiloto.nombre}</h3>
                <p>Equipo: ${topPiloto.equipo}</p>
                <p>Puntos: <span class="highlight-points">${topPiloto.puntos}</span></p>
            </div>
        `;
    } else {
        highlightedDriver.innerHTML = '<p>No hay pilotos activos para destacar en este momento.</p>';
    }


    // Renderizar la lista completa de pilotos
    sortedPilotos.forEach((piloto, index) => {
        const li = document.createElement('li');
        // Añadir una clase si el piloto está en estado 'def'
        if (piloto.estado === 'def') {
            li.classList.add('def-driver');
        }

        li.innerHTML = `
            <span class="pos">${piloto.estado === 'def' ? '-' : (activePilotos.indexOf(piloto) !== -1 ? activePilotos.indexOf(piloto) + 1 : '-') }°</span>
            <div class="info">
                <img src="${piloto.imagen}" alt="${piloto.nombre}" class="driver-list-img">
                <span class="name">${piloto.nombre}</span>
                <span class="team">${piloto.equipo}</span>
            </div>
            <span class="points">${piloto.estado === 'def' ? 'DEF' : `${piloto.puntos} PTS`}</span>
        `;
        driverList.appendChild(li);
    });
}


// --- Función común para los botones "Ver más/menos" ---\
function addToggleContentListeners(container) {
    container.querySelectorAll('.toggle-content-btn').forEach(button => {
        button.addEventListener('click', function() {
            const contentWrapper = this.closest('.news-content-wrapper');
            if (!contentWrapper) return;

            const fullContent = contentWrapper.querySelector('.full-content');
            const shortContent = contentWrapper.querySelector('.short-content');

            if (fullContent.classList.contains('hidden')) {
                fullContent.classList.remove('hidden');
                if (shortContent) shortContent.classList.add('hidden');
                this.textContent = 'Ver menos';
            } else {
                fullContent.classList.add('hidden');
                if (shortContent) shortContent.classList.remove('hidden');
                this.textContent = 'Ver más';
            }
        });
    });
}

// Cargar datos al cargar la página
document.addEventListener('DOMContentLoaded', cargarDatos);
