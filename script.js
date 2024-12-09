// Dichiarazione degli array globali per gestire i libri e il carrello
let libri = [];  // Array che conterrà tutti i libri caricati dall'API
let carrello = []; // Array che conterrà i libri aggiunti al carrello

// Array contenente le fasce d'età per il menu di navigazione
const ageRanges = [
    '0-3 anni',
    '4-6 anni', 
    '7-9 anni',
    '10-12 anni',
    'Adolescenti',
    'Adulti'
];

// Array contenente i generi letterari per il menu di navigazione
const genres = [
    'Fantasy',
    'Sci-Fi',
    'Romance', 
    'Thriller',
    'Horror',
    'Biography',
    'History',
    'Science',
    'Children',
    'Comics'
];

// Array contenente gli autori per il menu di navigazione
const authors = [
    'J.K. Rowling',
    'Stephen King',
    'Dan Brown',
    'Isabel Allende',
    'Umberto Eco',
    'Italo Calvino',
    'Elena Ferrante',
    'Alessandro Baricco',
    'Andrea Camilleri',
    'Margaret Atwood',
    'George R.R. Martin',
    'Paulo Coelho',
    'Haruki Murakami',
    'Gabriel García Márquez',
    'Agatha Christie'
];


// Funzione che carica i libri dall'API
function caricaLibri() {
    // Effettua una chiamata GET all'API
    fetch('https://striveschool-api.herokuapp.com/books')
        .then(response => response.json()) // Converte la risposta in JSON
        .then(data => {
            libri = data; // Salva i dati nell'array globale
            renderizzaLibri(libri); // Mostra i libri nella pagina
            popolaMenuNavbar(); // Popola i menu di navigazione
        })
        .catch(error => {
            console.error('Errore nel caricamento dei libri:', error);
        });
}

// Funzione che popola i menu dropdown nella navbar
function popolaMenuNavbar() {
    // Popola il menu delle fasce d'età
    const ageMenu = document.getElementById('ageRangeMenu');
    ageRanges.forEach(age => {
        ageMenu.innerHTML += `<li><a class="dropdown-item" href="#">${age}</a></li>`;
    });

    // Popola il menu dei generi
    const genresMenu = document.getElementById('genresMenu');
    genres.forEach(genre => {
        genresMenu.innerHTML += `<li><a class="dropdown-item" href="#">${genre}</a></li>`;
    });

    // Popola il menu degli autori
    const authorsMenu = document.getElementById('authorsMenu');
    authors.forEach(author => {
        authorsMenu.innerHTML += `<li><a class="dropdown-item" href="#">${author}</a></li>`;
    });
}

// Funzione che mostra i libri nella pagina
function renderizzaLibri(libriDaMostrare) {
    const contenitore = document.getElementById('dfBooksList');
    contenitore.innerHTML = ''; // Svuota il contenitore

    // Itera su ogni libro da mostrare
    libriDaMostrare.forEach(libro => {
        // Crea un div per la card del libro
        const schedaLibro = document.createElement('div');
        schedaLibro.className = 'col-12 col-md-6 col-lg-3 mb-4';
        // Verifica se il libro è già nel carrello
        const presenteNelCarrello = carrello.some(item => item.asin === libro.asin);
        
        // Genera l'HTML della card
        schedaLibro.innerHTML = `
            <div class="card h-100 ${presenteNelCarrello ? 'df-card-selected' : ''}" style="cursor: pointer;">
                <img src="${libro.img}" class="card-img-top" alt="${libro.title}" style="height: 300px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">
                        ${libro.title}
                    </h5>
                    <p class="card-text">€${libro.price}</p>
                    <button class="btn btn-primary w-100 dfAddToCart" 
                            data-asin="${libro.asin}"
                            ${presenteNelCarrello ? 'disabled' : ''}>
                        ${presenteNelCarrello ? 'Nel carrello' : 'Aggiungi al carrello'}
                    </button>
                </div>
            </div>
        `;
        
        // Aggiunge l'event listener per aprire i dettagli del libro
        const elementoScheda = schedaLibro.querySelector('.card');
        elementoScheda.addEventListener('click', (evento) => {
            if (!evento.target.classList.contains('dfAddToCart')) {
                apriDettagliLibro(libro);
            }
        });

        contenitore.appendChild(schedaLibro);
    });

    // Aggiunge gli event listener ai pulsanti "Aggiungi al carrello"
    aggiungiEventListeners();

}

// Funzione che apre il modale con i dettagli del libro
function apriDettagliLibro(libro) {
    const modale = new bootstrap.Modal(document.getElementById('dfModaleLibro'));
    
    // Popola il modale con i dati del libro
    document.getElementById('dfTitoloModale').textContent = libro.title;
    document.getElementById('dfImmagineModale').src = libro.img;
    document.getElementById('dfImmagineModale').alt = libro.title;
    
    document.getElementById('dfDescrizioneModale').textContent = 
        'La sinossi di questo libro non è al momento disponibile.';
    
    modale.show();
}

// Funzione che aggiorna la visualizzazione del carrello
function aggiornaCarrello() {
    const cartList = document.getElementById('dfCartList');
    const counter = document.getElementById('dfCartCounter');
    const totalElement = document.getElementById('dfCartTotal');
    
    cartList.innerHTML = ''; // Svuota il carrello
    counter.textContent = carrello.length; // Aggiorna il contatore

    // Se il carrello è vuoto, mostra un messaggio
    if (carrello.length === 0) {
        cartList.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="bi bi-cart-x fs-1"></i>
                <p class="mt-2">Il tuo carrello è vuoto</p>
            </div>
        `;
        totalElement.textContent = '€0.00';
        return;
    }

    // Calcola e mostra il totale
    const totale = carrello.reduce((sum, libro) => sum + libro.price, 0);
    totalElement.textContent = `€${totale.toFixed(2)}`;

    // Mostra ogni libro nel carrello
    carrello.forEach(libro => {
        const item = document.createElement('div');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        item.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${libro.img}" alt="${libro.title}" style="width: 50px; height: 70px; object-fit: cover;" class="me-3">
                <div>
                    <h6 class="mb-0">${libro.title}</h6>
                    <small class="text-muted">€${libro.price}</small>
                </div>
            </div>
            <button class="btn btn-danger btn-sm dfRemoveFromCart" 
                    data-asin="${libro.asin}">
                <i class="bi bi-trash"></i></button>
        `;
        cartList.appendChild(item);

        // Aggiunge l'event listener per rimuovere il libro dal carrello
        const removeButton = item.querySelector('.dfRemoveFromCart');
        removeButton.addEventListener('click', () => {
            const asin = removeButton.dataset.asin;
            carrello = carrello.filter(l => l.asin !== asin);
            aggiornaCarrello();
            renderizzaLibri(libri);
        });
    });
}

// Funzione che aggiunge gli event listener ai pulsanti "Aggiungi al carrello"
function aggiungiEventListeners() {
    document.querySelectorAll('.dfAddToCart').forEach(button => {
        button.addEventListener('click', (e) => {
            const asin = e.target.dataset.asin;
            const libro = libri.find(l => l.asin === asin);
            carrello.push(libro);
            aggiornaCarrello();
            renderizzaLibri(libri);
        });
    });
}

// Event listener per la ricerca dei libri
document.getElementById('dfSearchInput').addEventListener('input', (e) => {
    const searchText = e.target.value.toLowerCase();
    if (searchText.length >= 3) {
        // Filtra i libri se sono stati inseriti almeno 3 caratteri
        const libriFiltrati = libri.filter(libro => 
            libro.title.toLowerCase().includes(searchText)
        );
        renderizzaLibri(libriFiltrati);
    } else if (searchText.length === 0) {
        // Mostra tutti i libri se il campo di ricerca è vuoto
        renderizzaLibri(libri);
    }
});

// Event listener per svuotare il carrello
document.getElementById('dfEmptyCart').addEventListener('click', () => {
    carrello = [];
    aggiornaCarrello();
    renderizzaLibri(libri);
});

// Carica i libri quando la pagina è completamente caricata
window.onload = caricaLibri;
