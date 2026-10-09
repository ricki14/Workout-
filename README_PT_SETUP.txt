LEVEL — CONFIGURAZIONE INIZIALE (SOLO TITOLARE DELLA PIATTAFORMA)

Questo passaggio si esegue UNA SOLA VOLTA per il progetto Supabase di LEVEL.
Non va chiesto ai personal trainer o agli atleti e non va ripetuto per ogni account.

1. Accedi al progetto Supabase collegato a LEVEL con l'account proprietario.
2. Apri SQL Editor e crea una nuova query.
3. Apri il file LEVEL_PT_SETUP.sql, copia tutto il contenuto nella query e premi Run.
4. Apri LEVEL e verifica con un account PT che venga mostrato il codice dello studio.

Dopo questo passaggio, PT e atleti usano solo l'interfaccia di LEVEL: il PT condivide il codice, l'atleta lo inserisce in Profilo → Collega il PT.

SICUREZZA
- Non inserire mai chiavi Supabase service_role nel codice della web app.
- Il file SQL crea funzioni/tabelle e policy per il collegamento PT-atleta. Eseguilo solo nel progetto Supabase corretto e controlla gli eventuali errori mostrati da Supabase.
- Se le funzioni PT sono già configurate e funzionano, non eseguire nuovamente il setup senza prima controllare il contenuto SQL.
