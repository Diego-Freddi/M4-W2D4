// Dichiarazione degli array globali per gestire i libri e il carrello
let libri = [];  // Array che conterrà tutti i libri caricati dall'API
let carrello = []; // Array che conterrà i libri aggiunti al carrello

// Array contenente le fasce d'età per il menu di navigazione
// Definisce le diverse fasce d'età dei lettori target
const fasceEta = [
    '0-3 anni',    
    '4-6 anni',    
    '7-9 anni',    
    '10-12 anni',  
    'Adolescenti', 
    'Adulti'       
];

// Array contenente i generi letterari per il menu di navigazione
// Definisce i principali generi letterari disponibili
const generi = [
    'Biography',  
    'Children',   
    'Comics',     
    'Fantasy',    
    'History',    
    'Horror',     
    'Romance',    
    'Sci-Fi',     
    'Science',    
    'Thriller'    
];

// Array contenente gli autori per il menu di navigazione
// Lista degli autori più popolari e significativi
const autori = [
    'Agatha Christie',         
    'Alessandro Baricco',      
    'Andrea Camilleri',        
    'Dan Brown',               
    'Elena Ferrante',          
    'Gabriel García Márquez',  
    'George R.R. Martin',      
    'Haruki Murakami',         
    'Isabel Allende',          
    'Italo Calvino',           
    'J.K. Rowling',            
    'Margaret Atwood',         
    'Paulo Coelho',            
    'Stephen King',            
    'Umberto Eco'              
];

// Funzione che carica i libri dall'API
// Recupera i dati dei libri dal server e li visualizza
function caricaLibri() {
    fetch('https://striveschool-api.herokuapp.com/books')  // Richiesta GET all'API
        .then(risposta => risposta.json())                 // Converte la risposta in JSON
        .then(dati => {
            libri = dati;                                  // Salva i libri nell'array globale
            renderizzaLibri(libri);                        // Mostra i libri nella pagina
            popolaMenuNavbar();                            // Popola i menu di navigazione
        })
        .catch(errore => {
            console.error('Errore nel caricamento dei libri:', errore); // Gestisce eventuali errori
        });
}

// Funzione che popola i menu dropdown nella navbar
// Inserisce le opzioni nei menu a tendina
function popolaMenuNavbar() {
    const menuEta = document.getElementById('ageRangeMenu');        // Menu fasce d'età
    fasceEta.forEach(eta => {
        menuEta.innerHTML += `<li><a class="dropdown-item" href="#">${eta}</a></li>`;
    });

    const menuGeneri = document.getElementById('genresMenu');       // Menu generi
    generi.forEach(genere => {
        menuGeneri.innerHTML += `<li><a class="dropdown-item" href="#">${genere}</a></li>`;
    });

    const menuAutori = document.getElementById('authorsMenu');      // Menu autori
    autori.forEach(autore => {
        menuAutori.innerHTML += `<li><a class="dropdown-item" href="#">${autore}</a></li>`;
    });
}

// Funzione che mostra i libri nella pagina
// Crea e visualizza le card dei libri
function renderizzaLibri(libriDaMostrare) {
    const contenitore = document.getElementById('dfBooksList');     // Contenitore principale
    contenitore.innerHTML = '';                                     // Pulisce il contenuto esistente

    libriDaMostrare.forEach(libro => {
        const schedaLibro = document.createElement('div');          // Crea il contenitore della card
        schedaLibro.className = 'col-12 col-md-6 col-lg-3 mb-4';   // Imposta le classi responsive
        const presenteNelCarrello = carrello.some(item => item.asin === libro.asin); // Verifica se il libro è nel carrello
        
        // Crea la struttura HTML della card del libro
        schedaLibro.innerHTML = `
            <div class="card h-100 ${presenteNelCarrello ? 'df-card-selected' : ''}" style="cursor: pointer;">
                <img src="${libro.img}" class="card-img-top" alt="${libro.title}" style="height: 300px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">
                        ${libro.title}
                    </h5>
                    <p class="card-text">€${libro.price}</p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-primary flex-grow-1 dfAggiungiAlCarrello" 
                                data-asin="${libro.asin}"
                                ${presenteNelCarrello ? 'disabled' : ''}>
                            ${presenteNelCarrello ? 'Nel carrello' : 'Aggiungi al carrello'}
                        </button>
                        <button class="btn btn-danger dfSaltaLibro" data-asin="${libro.asin}">
                            Salta
                        </button>
                        <a href="dettagli.html?id=${libro.asin}" class="btn btn-info text-white d-flex align-items-center">
                            Dettagli
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        contenitore.appendChild(schedaLibro);                      // Aggiunge la card al contenitore

        // Aggiunge l'event listener per aprire il modale al click sulla card
        const elementoScheda = schedaLibro.querySelector('.card');
        elementoScheda.addEventListener('click', (evento) => {
            if (!evento.target.closest('button') && !evento.target.closest('a')) {
                apriModaleLibro(libro);
            }
        });
    });

    // Aggiunge gli event listener per il pulsante "Salta"
    document.querySelectorAll('.dfSaltaLibro').forEach(pulsante => {
        pulsante.addEventListener('click', (evento) => {
            evento.stopPropagation();                              // Previene la propagazione dell'evento
            const scheda = evento.target.closest('.col-12');       // Trova la card del libro
            scheda.remove();                                       // Rimuove la card dalla pagina
        });
    });

    // Aggiunge gli event listener ai pulsanti "Aggiungi al carrello"
    aggiungiEventListeners();
}

// Funzione per ottenere la sinossi da Google Books API
// Recupera la descrizione del libro usando l'API di Google Books
async function ottieneSinossiLibro(titolo) {
    try {
        // await new Promise(resolve => setTimeout(resolve, 2000));
        const risposta = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(titolo)}&key=AIzaSyA09Pqc0z7yIGXenCxUUGLQrlXc2Z7jWNw`);
        const dati = await risposta.json();
        
        if (dati?.items?.[0]?.volumeInfo?.description) {
            return dati.items[0].volumeInfo.description;           // Restituisce la descrizione se disponibile
        }
        return 'Sinossi non disponibile';                         // Messaggio di fallback
    } catch (errore) {
        console.error('Errore nel recupero della sinossi:', errore);
        return 'Sinossi non disponibile';                         // Gestione degli errori
    }
}

// Funzione che apre il modale con i dettagli del libro
async function apriModaleLibro(libro) {
    const modale = new bootstrap.Modal(document.getElementById('dfModaleLibro')); // Crea l'istanza del modale
    
    // Popola i campi del modale con i dettagli del libro
    document.getElementById('dfTitoloModale').textContent = libro.title;
    document.getElementById('dfImmagineModale').src = libro.img;
    document.getElementById('dfImmagineModale').alt = libro.title;
    document.getElementById('dfPrezzoModale').textContent = `€${libro.price}`;
    document.getElementById('dfCategoriaModale').textContent = libro.category;
    document.getElementById('dfAsinModale').textContent = libro.asin;
    
    // Mostra lo spinner durante il caricamento
    document.getElementById('dfSinossiModale').innerHTML = `
        <div class="d-flex align-items-center gap-2">
            <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Caricamento...</span>
            </div>
            <span>Caricamento sinossi...</span>
        </div>
    `;
    
    modale.show();
    
    // Recupera e mostra la sinossi
    const sinossi = await ottieneSinossiLibro(libro.title);
    document.getElementById('dfSinossiModale').textContent = sinossi;
}

// Funzione che aggiorna la visualizzazione del carrello
function aggiornaCarrello() {
    const listaCarrello = document.getElementById('dfCartList');   // Contenitore degli elementi del carrello
    const contatore = document.getElementById('dfCartCounter');     // Contatore degli elementi
    const elementoTotale = document.getElementById('dfCartTotal');  // Elemento per il totale
    
    listaCarrello.innerHTML = '';                                  // Pulisce il contenuto esistente
    contatore.textContent = carrello.length;                       // Aggiorna il contatore

    // Mostra un messaggio se il carrello è vuoto
    if (carrello.length === 0) {
        listaCarrello.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="bi bi-cart-x fs-1"></i>
                <p class="mt-2">Il tuo carrello è vuoto</p>
            </div>
        `;
        elementoTotale.textContent = '€0.00';
        return;
    }

    // Calcola e mostra il totale
    const totale = carrello.reduce((somma, libro) => somma + libro.price, 0);
    elementoTotale.textContent = `€${totale.toFixed(2)}`;

    // Crea gli elementi del carrello
    carrello.forEach(libro => {
        const elemento = document.createElement('div');
        elemento.className = 'list-group-item d-flex justify-content-between align-items-center';
        elemento.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${libro.img}" alt="${libro.title}" style="width: 50px; height: 70px; object-fit: cover;" class="me-3">
                <div>
                    <h6 class="mb-0">${libro.title}</h6>
                    <small class="text-muted">€${libro.price}</small>
                </div>
            </div>
            <button class="btn btn-danger btn-sm dfRimuoviDalCarrello" 
                    data-asin="${libro.asin}">
                <i class="bi bi-trash"></i>
            </button>
        `;
        listaCarrello.appendChild(elemento);

        // Aggiunge l'event listener per rimuovere l'elemento dal carrello
        const pulsanteRimuovi = elemento.querySelector('.dfRimuoviDalCarrello');
        pulsanteRimuovi.addEventListener('click', () => {
            const asin = pulsanteRimuovi.dataset.asin;
            carrello = carrello.filter(libro => libro.asin !== asin);    // Rimuove il libro
            aggiornaCarrello();                                            // Aggiorna la visualizzazione
            renderizzaLibri(libri);                                         // Aggiorna la visualizzazione dei libri
        });
    });
}

// Funzione che aggiunge gli event listener ai pulsanti "Aggiungi al carrello"
function aggiungiEventListeners() {
    document.querySelectorAll('.dfAggiungiAlCarrello').forEach(pulsante => {
        pulsante.addEventListener('click', (evento) => {
            const asin = evento.target.dataset.asin;                                        // Ottiene l'ASIN del libro
            const libro = libri.find(libroDisponibile => libroDisponibile.asin === asin);   // Trova il libro nell'array
            carrello.push(libro);                                                           // Aggiunge il libro al carrello
            aggiornaCarrello();                                                             // Aggiorna la visualizzazione del carrello
            renderizzaLibri(libri);                                                        // Aggiorna la visualizzazione dei libri
        });
    });
}

// Event listener per la ricerca dei libri
document.getElementById('dfSearchInput').addEventListener('input', (evento) => {
    const testoRicerca = evento.target.value.toLowerCase();        // Ottiene il testo di ricerca
    if (testoRicerca.length >= 3) {                               // Cerca solo se ci sono almeno 3 caratteri
        const libriFiltrati = libri.filter(libro => 
            libro.title.toLowerCase().includes(testoRicerca)
        );
        renderizzaLibri(libriFiltrati);                           // Mostra i risultati filtrati
    } else if (testoRicerca.length === 0) {
        renderizzaLibri(libri);                                    // Mostra tutti i libri se non c'è testo
    }
});

// Event listener per svuotare il carrello
document.getElementById('dfEmptyCart').addEventListener('click', () => {
    carrello = [];                                                // Svuota l'array del carrello
    aggiornaCarrello();                                          // Aggiorna la visualizzazione del carrello
    renderizzaLibri(libri);                                      // Aggiorna la visualizzazione dei libri
});

// Carica i libri quando la pagina è completamente caricata
window.onload = caricaLibri;
