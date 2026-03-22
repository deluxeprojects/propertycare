'use client';

interface AreaMapProps {
  latitude: number;
  longitude: number;
  areaName: string;
}

export function AreaMap({ latitude, longitude, areaName }: AreaMapProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!mapboxToken || !latitude || !longitude) {
    // Static map placeholder
    return (
      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-muted">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-2 text-2xl">📍</div>
            <p className="text-sm font-medium text-foreground">{areaName}, Dubai</p>
            <p className="text-xs text-muted-foreground">UAE</p>
          </div>
        </div>
      </div>
    );
  }

  // Mapbox static image (no JS SDK needed)
  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-s+4ECDC4(${longitude},${latitude})/${longitude},${latitude},13,0/600x300@2x?access_token=${mapboxToken}`;

  return (
    <div className="overflow-hidden rounded-xl">
      <img
        src={staticMapUrl}
        alt={`Map of ${areaName}, Dubai`}
        className="h-48 w-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
