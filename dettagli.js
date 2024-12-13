window.onload = () => {
    const parametri = new URLSearchParams(location.search);
    const idLibro = parametri.get('id');
    
    fetch(`https://striveschool-api.herokuapp.com/books/${idLibro}`)
        .then(risposta => risposta.json())
        .then(libro => {
            document.getElementById('dfDettagliLibro').innerHTML = `
                <div class="col-md-4">
                    <img src="${libro.img}" alt="${libro.title}" class="img-fluid">
                </div>
                <div class="col-md-8">
                    <h2>${libro.title}</h2>
                    <p class="lead">Prezzo: €${libro.price}</p>
                    <p>ASIN: ${libro.asin}</p>
                    <p>Categoria: ${libro.category}</p>
                    <h3>Sinossi:</h3>
                    <div id="dfSinossiContenuto" class="d-flex align-items-center gap-2">
                        <div class="spinner-border spinner-border-sm text-primary" role="status">
                            <span class="visually-hidden">Caricamento...</span>
                        </div>
                        <span>Caricamento sinossi...</span>
                    </div>
                </div>
            `;
            return ottieneSinossiLibro1(libro.title);
        })
        .then(sinossi => {
            document.getElementById('dfSinossiContenuto').textContent = sinossi;
        })
        .catch(errore => {
            console.error('Errore nel caricamento dei dettagli:', errore);
            document.getElementById('dfDettagliLibro').innerHTML = 
                '<div class="col-12 text-center"><h2>Errore nel caricamento dei dettagli</h2></div>';
        });
};

function ottieneSinossiLibro1(titolo) {
    return fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(titolo)}&key=AIzaSyA09Pqc0z7yIGXenCxUUGLQrlXc2Z7jWNw`)
        .then(risposta => risposta.json())
        .then(dati => {
            if (dati?.items?.[0]?.volumeInfo?.description) {
                return dati.items[0].volumeInfo.description;
            }
            return 'Sinossi non disponibile';
        })
        .catch(errore => {
            console.error('Errore nel caricamento dei dettagli:', errore);
            return 'Sinossi non disponibile';
        });
}
