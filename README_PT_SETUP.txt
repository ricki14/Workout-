LEVEL v48 — Area Personal Trainer

CONTENUTO
- index.html: app LEVEL aggiornata con area PT
- favicon.svg / favicon.png / apple-touch-icon.png / manifest.webmanifest: icone web app
- LEVEL_PT_SETUP.sql: tabelle e funzioni Supabase necessarie per collegare PT e atleti, assegnare schede e leggere i progressi

INSTALLAZIONE
1. Apri il progetto Supabase già usato da LEVEL.
2. Vai su SQL Editor → New query.
3. Apri LEVEL_PT_SETUP.sql, copia tutto il contenuto, incollalo nel SQL Editor e premi Run. Eseguilo una sola volta.
4. Carica tutti i file dello ZIP nella cartella pubblicata su GitHub Pages, sostituendo quelli precedenti.
5. Ricarica LEVEL. Il PT deve accedere con un account creato scegliendo il ruolo PT.
6. Nel pannello PT copia il codice dello studio e invialo all'atleta.
7. L'atleta accede al proprio account, apre Profilo, inserisce il codice in “Codice del tuo PT” e preme Collega.
8. Il PT aggiorna la lista, apre l'atleta, crea/modifica la scheda e la salva. L'atleta la vedrà al successivo accesso/ricaricamento.

FUNZIONI PT INCLUSE
- Dashboard studio con codice personale di collegamento.
- Elenco atleti collegati, scheda assegnata e numero di allenamenti.
- Dettaglio atleta con riepilogo attività, programma e cronologia.
- Creazione/modifica della scheda dell'atleta con giorni, focus, esercizi, serie/ripetizioni, recuperi e video.
- Grafico dei carichi per esercizio con distinzione “totale” / “per lato”.
- Sincronizzazione tramite Supabase fra dispositivi.

NOTE
- Il setup SQL è necessario: senza le funzioni/tabelle aggiunte, il pannello segnala che la configurazione è richiesta.
- La versione non include ancora chat, pagamenti, notifiche push native o strumenti di fatturazione.
- Per sicurezza, condividere il codice solo con i propri atleti. L'accesso ai progressi e alle schede passa attraverso funzioni Supabase che verificano il collegamento PT-atleta.
