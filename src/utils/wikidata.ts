import { Painting } from '../types';

const WIKIDATA_QUERY = `
SELECT DISTINCT ?painting ?paintingLabel ?image ?artist ?artistLabel ?year
WHERE {
  ?painting wdt:P31 wd:Q3305213;  # Instance of: painting
           wdt:P18 ?image;        # Image
           wdt:P170 ?artist.      # Creator
  OPTIONAL { ?painting wdt:P571 ?year. }
  
  # Only get paintings with images
  FILTER(BOUND(?image))
  
  # Get labels
  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". 
    ?painting rdfs:label ?paintingLabel.
    ?artist rdfs:label ?artistLabel.
  }
} 
LIMIT 100`;

export async function fetchRandomPainting(): Promise<Painting> {
  const endpoint = 'https://query.wikidata.org/sparql';
  const url = `${endpoint}?query=${encodeURIComponent(WIKIDATA_QUERY)}&format=json`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/sparql-results+json',
        'User-Agent': 'GuessThePainter/1.0'
      }
    });
    
    const data = await response.json();
    const results = data.results.bindings;
    const randomIndex = Math.floor(Math.random() * results.length);
    const painting = results[randomIndex];

    return {
      title: painting.paintingLabel.value,
      artist: painting.artistLabel.value,
      imageUrl: painting.image.value,
      year: painting.year?.value ? new Date(painting.year.value).getFullYear().toString() : undefined
    };
  } catch (error) {
    console.error('Error fetching painting:', error);
    throw error;
  }
}