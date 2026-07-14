export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

export type GeocodeSuggestion = {
  id: string;
  placeName: string;
  lat: number;
  lng: number;
};

type MapboxGeocodeFeature = {
  id: string;
  properties: { full_address?: string; name?: string };
  geometry: { coordinates: [number, number] };
};

type MapboxGeocodeResponse = {
  features: MapboxGeocodeFeature[];
};

export async function geocodeAddress(query: string): Promise<GeocodeSuggestion[]> {
  if (!query.trim() || !MAPBOX_TOKEN) {
    return [];
  }

  const url = new URL("https://api.mapbox.com/search/geocode/v6/forward");
  url.searchParams.set("q", query);
  url.searchParams.set("access_token", MAPBOX_TOKEN);
  url.searchParams.set("limit", "5");

  const response = await fetch(url.toString());
  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as MapboxGeocodeResponse;
  return data.features.map((feature) => ({
    id: feature.id,
    placeName: feature.properties.full_address ?? feature.properties.name ?? query,
    lng: feature.geometry.coordinates[0],
    lat: feature.geometry.coordinates[1],
  }));
}

export async function reverseGeocode(lng: number, lat: number): Promise<string | null> {
  if (!MAPBOX_TOKEN) {
    return null;
  }

  const url = new URL("https://api.mapbox.com/search/geocode/v6/reverse");
  url.searchParams.set("longitude", String(lng));
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("access_token", MAPBOX_TOKEN);

  const response = await fetch(url.toString());
  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as MapboxGeocodeResponse;
  const [first] = data.features;
  return first?.properties.full_address ?? first?.properties.name ?? null;
}
