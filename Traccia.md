Creare un marketplace di libri online con i seguenti requisiti:
- home page che mostri tutti i libri con delle card (usare bootstrap 5.3)
- usare queesto API per ottenere la lista di libri: @https://striveschool-api.herokuapp.com/books 
- aggiungi un input di testo che funzioni come una barra di ricerca: quando l'utente scrive più di tre caratteri, filtra il riulstato dell'API per renderizzare solo i libri con un titolo che corrisponda, anche parzialmente, al contenuto dell'input (usare .filter())
- Ogni card deve avere un pulsante per poter aggiungere il libro al carrello
- quando i pulsante viene cliccato:
    1. aggiungi il libro alla lista del carrello
    2. cambia lo stile delle card per mostrare che è stata aggiunta al carrello
- dai possibilità all'utente di cancellare lbri dal carrello
- conta gli elementi nel carrello e mostra un counter nella sezione carrello
- crea un pulsante nella sezione carrello per svuotare tutto il carrello