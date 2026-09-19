# Importazione PDF con AI — configurazione una tantum

L'app è già predisposta: l'utente finale deve solo scegliere il PDF. La chiave OpenAI NON va mai inserita nell'HTML.

## 1. Crea la funzione in Supabase
Nel progetto Supabase apri **Edge Functions** e crea una funzione chiamata:

`parse-workout-pdf`

Copia il contenuto di:

`supabase/functions/parse-workout-pdf/index.ts`

## 2. Aggiungi la chiave OpenAI come Secret
In Supabase vai in **Edge Functions → Secrets** e aggiungi:

`OPENAI_API_KEY`

come valore inserisci la tua chiave API OpenAI.

Non inserirla mai in `index.html` o in GitHub.

## 3. Deploy
Pubblica/deploya la funzione `parse-workout-pdf`.

L'app la chiama automaticamente a:

`/functions/v1/parse-workout-pdf`

## 4. Uso per l'utente
Dopo il deploy non serve configurare nulla sul telefono/computer:

**Home → Importa PDF con AI → Scegli PDF → Analisi → Controlla → Salva scheda**

L'AI restituisce una scheda modificabile prima del salvataggio. I video restano facoltativi e possono essere aggiunti successivamente dall'esercizio.
