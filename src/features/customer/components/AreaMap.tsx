'use client';

interface AreaMapProps {
  latitude: number;
  longitude: number;
  areaName: string;
}

export function AreaMap({ latitude, longitude, areaName }: AreaMapProps) {
  const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  if (!googleKey || !latitude || !longitude || latitude === 0) {
    return (
      <div className="relative h-56 w-full overflow-hidden rounded-xl bg-muted">
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

  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=800x400&scale=2&maptype=roadmap&markers=color:0x4ECDC4%7C${latitude},${longitude}&style=feature:poi%7Cvisibility:off&key=${googleKey}`;

  return (
    <div className="overflow-hidden rounded-xl">
      <img
        src={staticMapUrl}
        alt={`Map of ${areaName}, Dubai`}
        className="h-56 w-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
