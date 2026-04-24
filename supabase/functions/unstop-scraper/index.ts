import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()
    if (!url) throw new Error('URL is required')

    // Fetch the Unstop page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });
    
    if (!response.ok) throw new Error(`Failed to fetch page: ${response.statusText}`)
    
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    // Very basic metadata extraction (Unstop uses specific selectors, checking meta tags is safest)
    const title = doc?.querySelector('meta[property="og:title"]')?.getAttribute('content') || 
                  doc?.querySelector('title')?.textContent || 'Unknown Event';
    
    const description = doc?.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
                  
    // Example: parsing out deadline if they use schemas (Wait for actual site structure)
    // Often it's in a <script type="application/ld+json"> tag
    let eventData = { title, description, url };
    
    const scripts = doc?.querySelectorAll('script[type="application/ld+json"]');
    if (scripts) {
      for (const script of scripts) {
        try {
          const json = JSON.parse(script.textContent);
          if (json['@type'] === 'Event') {
            eventData.deadline = json.endDate || json.startDate;
            eventData.category = typeof json.about === 'string' ? json.about : 'Hackathon';
          }
        } catch (e) {
          // ignore parsing errors
        }
      }
    }

    return new Response(
      JSON.stringify(eventData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
