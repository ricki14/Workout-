# Importazione PDF con AI

La web app usa una Supabase Edge Function per analizzare il PDF senza esporre la chiave OpenAI nel browser.

## 1. Configura la funzione

Dal progetto Supabase, installa/configura la CLI Supabase e dalla cartella che contiene `supabase/functions` esegui:

```bash
supabase functions deploy parse-workout-pdf
```

## 2. Imposta il segreto OpenAI

```bash
supabase secrets set OPENAI_API_KEY="LA_TUA_CHIAVE_OPENAI"
```

La chiave **non deve mai essere inserita nell'HTML** o in GitHub.

## 3. Come funziona

1. L'atleta seleziona un PDF.
2. Il browser invia il PDF alla Edge Function con il token della sessione Supabase.
3. La funzione verifica che l'utente sia autenticato.
4. Il PDF viene passato al modello tramite Responses API.
5. L'AI restituisce una struttura JSON della scheda.
6. L'app apre automaticamente l'editor della scheda.
7. L'utente controlla/modifica i dati e solo dopo preme **Salva scheda**.

Il PDF non viene salvato come file permanente dall'app.
