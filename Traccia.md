TRACCIA M4-W2D4

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

TRACCIA M4-W3D1

• Aggiungi un pulsante "salta" su tutte le card. Al click, dovrebbe far scomparire la card.
• Crea una pagina "dettagli". Cliccando su un terzo pulsante sulla card, l'utente deve essere portato ad una pagina html separata dove visualizzerai i dettagli del libro.
Per farlo, usa gli URLSearchParams in questo modo:
Il link alla pagina dettagli dovrebbe avere una struttura simile:
/dettagli.html **?id-1940026091**
Dove 1940026091è l'asin del libro su cui l'utente ha cliccato
La parte evidenziata si chiama "search param".
Nella pagina dettagli, puoi recuperare l'asin usando
const params = new URLSearchParams (location.search)
const id = params.get ("id")
Esegui quindi la fetch usando l'id:
https://striveschool-api.herokuapp.com/books/INSERISCI ASIN QUI