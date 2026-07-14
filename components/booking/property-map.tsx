"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { MAPBOX_TOKEN } from "@/lib/mapbox";
import type { LatLng } from "@/lib/geo";

const DEFAULT_CENTER: [number, number] = [-98.5795, 39.8283];
const DEFAULT_ZOOM = 3.5;
const FOCUS_ZOOM = 19;
const BOUNDARY_SOURCE_ID = "lawn-boundary";

type PropertyMapProps = {
  center: LatLng | null;
  points: LatLng[];
  onAddPoint: (point: LatLng) => void;
  onMovePoint: (index: number, point: LatLng) => void;
  onRemovePoint: (index: number) => void;
  className?: string;
};

function toFeatureCollection(points: LatLng[]) {
  const ring = points.map((point) => [point.lng, point.lat]);
  if (ring.length >= 3) {
    ring.push(ring[0]);
  }

  return {
    type: "FeatureCollection" as const,
    features:
      ring.length >= 2
        ? [
            {
              type: "Feature" as const,
              properties: {},
              geometry:
                ring.length >= 3
                  ? { type: "Polygon" as const, coordinates: [ring] }
                  : { type: "LineString" as const, coordinates: ring },
            },
          ]
        : [],
  };
}

export function PropertyMap({
  center,
  points,
  onAddPoint,
  onMovePoint,
  onRemovePoint,
  className,
}: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const hasFocusedRef = useRef(false);

  const onAddPointRef = useRef(onAddPoint);
  const onMovePointRef = useRef(onMovePoint);
  const onRemovePointRef = useRef(onRemovePoint);
  useEffect(() => {
    onAddPointRef.current = onAddPoint;
    onMovePointRef.current = onMovePoint;
    onRemovePointRef.current = onRemovePoint;
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !MAPBOX_TOKEN) {
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    map.on("load", () => {
      map.addSource(BOUNDARY_SOURCE_ID, {
        type: "geojson",
        data: toFeatureCollection([]),
      });
      map.addLayer({
        id: `${BOUNDARY_SOURCE_ID}-fill`,
        type: "fill",
        source: BOUNDARY_SOURCE_ID,
        filter: ["==", "$type", "Polygon"],
        paint: { "fill-color": "#f6b93b", "fill-opacity": 0.3 },
      });
      map.addLayer({
        id: `${BOUNDARY_SOURCE_ID}-line`,
        type: "line",
        source: BOUNDARY_SOURCE_ID,
        paint: { "line-color": "#f6b93b", "line-width": 2 },
      });
    });

    map.on("click", (event) => {
      onAddPointRef.current({ lat: event.lngLat.lat, lng: event.lngLat.lng });
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !center || hasFocusedRef.current) {
      return;
    }
    hasFocusedRef.current = true;
    map.jumpTo({ center: [center.lng, center.lat], zoom: FOCUS_ZOOM });
  }, [center]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const source = map.getSource(BOUNDARY_SOURCE_ID) as
      mapboxgl.GeoJSONSource | undefined;
    source?.setData(toFeatureCollection(points));

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = points.map((point, index) => {
      const marker = new mapboxgl.Marker({ color: "#f6b93b", draggable: true })
        .setLngLat([point.lng, point.lat])
        .addTo(map);

      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        onMovePointRef.current(index, { lat: lngLat.lat, lng: lngLat.lng });
      });

      marker.getElement().addEventListener("dblclick", (event) => {
        event.stopPropagation();
        onRemovePointRef.current(index);
      });

      return marker;
    });
  }, [points]);

  if (!MAPBOX_TOKEN) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--lawn-bg-2, #eee)",
        }}
      >
        <p className="text-lawn-text-secondary p-4 text-center text-sm">
          Set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local to enable the map.
        </p>
      </div>
    );
  }

  return <div ref={containerRef} className={className} />;
}
