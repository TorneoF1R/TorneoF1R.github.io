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
        if (document.getElementById('driver-list') && document.getElementById('highlighted-driver')) {
            renderTablaPuntajes();
        }

    } catch (error) {
        console.error('Error al cargar los datos:', error);
        document.querySelectorAll('main section').forEach(section => {
            if (section.querySelector('p')) {
                section.querySelector('p').textContent = 'Error al cargar los datos. Por favor, verifica el archivo data.json.';
            }
        });
    }
}

// Función para renderizar el piloto destacado en la página de inicio
function renderPilotoDestacado() {
    const pilotoDestacadoCard = document.getElementById('piloto-destacado-card');
    if (!pilotoDestacadoCard) return;

    const pilotoDestacado = appData.pilotos.find(p => p.destacado);

    if (pilotoDestacado) {
        pilotoDestacadoCard.innerHTML = `
            <img src="${pilotoDestacado.imagen}" alt="${pilotoDestacado.nombre}">
            <div class="piloto-info">
                <h3>${pilotoDestacado.nombre}</h3>
                <p>Equipo: ${pilotoDestacado.equipo}</p>
                <p>Puntos: ${pilotoDestacado.puntos}</p>
            </div>
        `;
    } else {
        pilotoDestacadoCard.innerHTML = '<p>No se encontró un piloto destacado.</p>';
    }
}

// Función para renderizar las últimas noticias en la página de inicio
function renderUltimasNoticias() {
    const noticiasGrid = document.getElementById('noticias-grid');
    if (!noticiasGrid) return;

    noticiasGrid.innerHTML = ''; // Limpiar contenido existente

    if (!appData.noticias || appData.noticias.length === 0) {
        noticiasGrid.innerHTML = '<p>No hay noticias para mostrar.</p>';
        return;
    }

    const noticiasAMostrar = appData.noticias.slice(0, 2);

    noticiasAMostrar.forEach(noticia => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        newsCard.innerHTML = `
            <h3>${noticia.titulo}</h3>
            <p class="news-meta">Fecha: ${noticia.fecha} | Autor: ${noticia.autor}</p>
            <div class="news-content-wrapper">
                <p class="short-content">
                    ${noticia.contenidoCorto}
                </p>
                <p class="full-content hidden">
                    ${noticia.contenidoCompleto}
                </p>
                <button class="toggle-content-btn">Ver más</button>
            </div>
        `;
        noticiasGrid.appendChild(newsCard);
    });

    addToggleContentListeners(noticiasGrid);
}

// Función para renderizar TODAS las noticias en la página de noticias
function renderAllNoticias() {
    const allNewsContainer = document.getElementById('all-news-container');
    if (!allNewsContainer) return;

    allNewsContainer.innerHTML = ''; // Limpiar contenido existente

    if (!appData.noticias || appData.noticias.length === 0) {
        allNewsContainer.innerHTML = '<p>No hay noticias para mostrar.</p>';
        return;
    }

    const todasLasNoticias = [...appData.noticias].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    todasLasNoticias.forEach(noticia => {
        const newsArticle = document.createElement('div');
        newsArticle.className = 'news-article';
        newsArticle.innerHTML = `
            <h3>${noticia.titulo}</h3>
            <p class="news-meta">Fecha: ${noticia.fecha} | Autor: ${noticia.autor}</p>
            <div class="news-content-wrapper">
                <p class="short-content">
                    ${noticia.contenidoCorto}
                </p>
                <p class="full-content hidden">
                    ${noticia.contenidoCompleto}
                </p>
                <button class="toggle-content-btn">Ver más</button>
            </div>
        `;
        allNewsContainer.appendChild(newsArticle);
    });

    addToggleContentListeners(allNewsContainer);
}

// NUEVA FUNCIÓN: para renderizar las FOTOS DE PERFIL de los pilotos en corredores.html
function renderAllPilotosProfileCards() {
    const racersGallery = document.getElementById('racers-gallery');
    if (!racersGallery) return;

    racersGallery.innerHTML = ''; // Limpiar contenido existente

    if (!appData.pilotos || appData.pilotos.length === 0) {
        racersGallery.innerHTML = '<p>No hay corredores para mostrar.</p>';
        return;
    }

    const pilotosOrdenados = [...appData.pilotos].sort((a, b) => a.nombre.localeCompare(b.nombre));

    pilotosOrdenados.forEach(piloto => {
        const racerCard = document.createElement('div');
        racerCard.className = 'racer-profile-card'; // Clase diferente para los perfiles
        racerCard.innerHTML = `
            <img src="${piloto.imagen}" alt="${piloto.nombre} perfil">
            <h3>${piloto.nombre}</h3>
            <p>Equipo: ${piloto.equipo}</p>
        `;
        racersGallery.appendChild(racerCard);
    });
}

// NUEVA FUNCIÓN: para renderizar los POSTERS en galeria_posters.html
function renderGaleriaPosters() {
    const postersGallery = document.getElementById('posters-gallery');
    if (!postersGallery) return;

    postersGallery.innerHTML = ''; // Limpiar contenido existente

    if (!appData.pilotos || appData.pilotos.length === 0) {
        postersGallery.innerHTML = '<p>No hay posters para mostrar.</p>';
        return;
    }

    // Filtramos solo los pilotos que tienen un 'poster' definido en data.json
    const pilotosConPoster = appData.pilotos.filter(piloto => piloto.poster);
    const pilotosOrdenados = [...pilotosConPoster].sort((a, b) => a.nombre.localeCompare(b.nombre));


    if (pilotosConPoster.length === 0) {
        postersGallery.innerHTML = '<p>Todavía no hay posters disponibles. ¡Volvé pronto!</p>';
        return;
    }

    pilotosOrdenados.forEach(piloto => {
        const posterItem = document.createElement('div');
        posterItem.className = 'poster-item'; // Clase para cada poster
        posterItem.innerHTML = `
            <img src="${piloto.poster}" alt="Poster de ${piloto.nombre}">
            <p class="poster-title">${piloto.nombre}</p>
        `;
        postersGallery.appendChild(posterItem);
    });
}


// Función para renderizar la tabla de puntajes
function renderTablaPuntajes() {
    const driverList = document.getElementById('driver-list');
    const highlightedDriver = document.getElementById('highlighted-driver');
    if (!driverList || !highlightedDriver) return;

    driverList.innerHTML = ''; // Limpiar contenido existente
    highlightedDriver.innerHTML = ''; // Limpiar contenido existente

    if (!appData.pilotos || appData.pilotos.length === 0) {
        driverList.innerHTML = '<p>No hay pilotos para mostrar en la tabla.</p>';
        highlightedDriver.innerHTML = '<p>No se encontró un piloto destacado.</p>';
        return;
    }

    const pilotosOrdenados = [...appData.pilotos].sort((a, b) => b.puntos - a.puntos);

    const topPiloto = pilotosOrdenados[0];
    if (topPiloto) {
        highlightedDriver.innerHTML = `
            <span class="pos">${1}°</span>
            <div class="content">
                <img src="${topPiloto.imagen}" alt="${topPiloto.nombre}" class="driver-highlight-img"> <span class="name">${topPiloto.nombre}</span>
                <span class="team">${topPiloto.equipo}</span>
                <span class="points">${topPiloto.puntos} PTS</span>
            </div>
        `;
    }

    pilotosOrdenados.forEach((piloto, index) => {
        const li = document.createElement('li');
        if (index === 0) {
            li.classList.add('top-driver');
        }
        li.innerHTML = `
            <span class="pos">${index + 1}°</span>
            <div class="info">
                <img src="${piloto.imagen}" alt="${piloto.nombre}" class="driver-list-img"> <span class="name">${piloto.nombre}</span>
                <span class="team">${piloto.equipo}</span>
            </div>
            <span class="points">${piloto.puntos} PTS</span>
        `;
        driverList.appendChild(li);
    });
}

// --- Función común para los botones "Ver más/menos" ---
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