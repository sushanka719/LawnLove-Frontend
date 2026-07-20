export type LatLng = { lat: number; lng: number };

// Hard cap on the lawn boundary a user is allowed to draw. Corners that would
// push the polygon past this are rejected, so it's impossible to "select the
// whole world". 43,560 sq ft = 1 acre — a generous residential ceiling; adjust
// here if the business needs to serve larger properties.
export const MAX_LAWN_AREA_SQ_FT = 43_560;

const EARTH_RADIUS_METERS = 6378137;
const SQ_METERS_PER_SQ_FOOT = 0.09290304;

function toLocalMeters(point: LatLng, origin: LatLng) {
  const latRad = (origin.lat * Math.PI) / 180;
  const x =
    ((point.lng - origin.lng) * Math.PI * EARTH_RADIUS_METERS * Math.cos(latRad)) / 180;
  const y = ((point.lat - origin.lat) * Math.PI * EARTH_RADIUS_METERS) / 180;
  return { x, y };
}

export function polygonAreaSqFt(points: LatLng[]): number {
  if (points.length < 3) {
    return 0;
  }

  const origin = points[0];
  const projected = points.map((point) => toLocalMeters(point, origin));

  let areaMeters = 0;
  for (let i = 0; i < projected.length; i++) {
    const current = projected[i];
    const next = projected[(i + 1) % projected.length];
    areaMeters += current.x * next.y - next.x * current.y;
  }
  areaMeters = Math.abs(areaMeters) / 2;

  return areaMeters / SQ_METERS_PER_SQ_FOOT;
}
