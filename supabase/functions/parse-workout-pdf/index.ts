import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PLAN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    version: { type: "integer" },
    name: { type: "string" },
    startDate: { type: "string" },
    endDate: { type: "string" },
    days: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          focus: { type: "string" },
          exercises: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                scheme: { type: "string" },
                rest: { type: "string" },
                video: { type: "string" },
              },
              required: ["id", "name", "scheme", "rest", "video"],
            },
          },
        },
        required: ["id", "name", "focus", "exercises"],
      },
    },
  },
  required: ["version", "name", "startDate", "endDate", "days"],
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Metodo non consentito" });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) return json(401, { error: "Autenticazione richiesta" });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: auth } } },
    );
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) return json(401, { error: "Sessione non valida" });

    const openAIKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIKey) return json(503, { error: "AI non configurata: manca OPENAI_API_KEY" });

    const body = await req.json();
    const fileData = String(body?.fileData || "");
    const filename = String(body?.filename || "scheda.pdf");
    if (!fileData) return json(400, { error: "PDF mancante" });
    if (fileData.length > 22_000_000) return json(413, { error: "PDF troppo grande" });

    const prompt = `Leggi questo PDF di una scheda di allenamento e trasformalo in una struttura dati per una web app.

Regole importanti:
- Mantieni fedelmente nomi degli esercizi, numero di serie, ripetizioni, recuperi e giorni presenti nel PDF.
- Non inventare esercizi, carichi, recuperi o video che non sono presenti.
- Se un campo non è presente, usa una stringa vuota.
- Se il PDF contiene un titolo della scheda o un intervallo di date, riportalo; altrimenti usa una stringa vuota.
- Raggruppa gli esercizi per giorno nell'ordine in cui compaiono.
- Il campo scheme deve contenere la prescrizione così come appare, ad esempio 4x8, 3xmax, 4x10/12.
- Il campo rest deve contenere il recupero così come appare, ad esempio 1’30’’, 1’/1’30’’. Se il PDF indica un recupero generale tra esercizi, non copiarlo in ogni esercizio a meno che sia esplicitamente associato agli esercizi.
- I video non sono obbligatori: lascia video vuoto se non è presente un link.
- Non trasformare il contenuto in consigli: devi solo estrarre la scheda.
- Restituisci esclusivamente il JSON conforme allo schema richiesto.`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        store: false,
        input: [{
          role: "user",
          content: [
            { type: "input_text", text: prompt },
            { type: "input_file", filename, file_data: `data:application/pdf;base64,${fileData}` },
          ],
        }],
        text: {
          format: {
            type: "json_schema",
            name: "workout_plan",
            strict: true,
            schema: PLAN_SCHEMA,
          },
        },
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("OpenAI error", result);
      return json(502, { error: "L'AI non ha potuto analizzare il PDF" });
    }

    const raw = result.output_text;
    if (!raw) return json(502, { error: "Risposta AI vuota" });
    const plan = JSON.parse(raw);
    return json(200, { plan });
  } catch (error) {
    console.error(error);
    return json(500, { error: "Errore durante l'analisi del PDF" });
  }
});
