export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Fetch the Unstop page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    // Extract metadata from Open Graph and meta tags
    const getMetaContent = (html, property) => {
      // Try og: tags first
      const ogMatch = html.match(new RegExp(`<meta[^>]*property=["']og:${property}["'][^>]*content=["']([^"']*)["']`, 'i'))
        || html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:${property}["']`, 'i'));
      if (ogMatch) return ogMatch[1];

      // Try name= tags  
      const nameMatch = html.match(new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i'))
        || html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${property}["']`, 'i'));
      if (nameMatch) return nameMatch[1];

      return null;
    };

    // Get title
    const title = getMetaContent(html, 'title')
      || (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1]
      || 'Unknown Event';

    // Get description
    const description = getMetaContent(html, 'description') || '';

    // Get image
    const image = getMetaContent(html, 'image') || '';

    // Try to extract JSON-LD structured data for deadlines
    let deadline = null;
    let category = null;
    let organizer = null;

    const jsonLdMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    if (jsonLdMatches) {
      for (const match of jsonLdMatches) {
        try {
          const jsonStr = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
          const json = JSON.parse(jsonStr);
          if (json['@type'] === 'Event' || json['@type'] === 'Hackathon') {
            deadline = json.endDate || json.startDate || null;
            category = json.about || json.eventAttendanceMode || null;
            organizer = json.organizer?.name || null;
          }
        } catch (e) {
          // ignore parse errors
        }
      }
    }

    // Try to extract dates from visible text patterns
    if (!deadline) {
      const datePattern = html.match(/(?:deadline|ends?|last date|registration closes?)[\s:]*([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i);
      if (datePattern) deadline = datePattern[1];
    }

    return res.status(200).json({
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      deadline,
      category,
      organizer,
      url,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Scraping failed' });
  }
}
