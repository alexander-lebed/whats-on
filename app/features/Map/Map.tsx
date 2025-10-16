'use client';

import { FC, useMemo } from 'react';
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { DEFAULT_CENTER, GOOGLE_MAP_ID, GOOGLE_MAPS_API_KEY } from './constants';
import type { MapProps, MarkerProps } from './types';

const Map: FC<MapProps> = ({ places = [], className, ...mapsProps }) => {
  const markers: MarkerProps[] = useMemo(
    () =>
      places
        .filter(p => p && p.location?.lat && p.location?.lng)
        .map(p => ({
          title: p!.name,
          position: {
            lat: p!.location!.lat!,
            lng: p!.location!.lng!,
          },
        })),
    [places]
  );

  if (!GOOGLE_MAPS_API_KEY) {
    return null;
  }

  const center = markers.length > 0 ? markers[0].position : DEFAULT_CENTER;

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} onError={console.error} onLoad={() => {}}>
      <div className={className} style={{ width: '100%', height: 360 }}>
        <GoogleMap
          mapId={GOOGLE_MAP_ID}
          style={{ width: '100%', height: '100%' }}
          defaultCenter={center}
          defaultZoom={15}
          gestureHandling="greedy"
          disableDefaultUI
          {...mapsProps}
        >
          {markers.map(m => (
            <AdvancedMarker key={m.title} position={m.position} title={m.title}>
              <Pin
                background="var(--color-stone-900)"
                borderColor="var(--color-stone-900)"
                glyphColor="var(--color-stone-50)"
              />
            </AdvancedMarker>
          ))}
        </GoogleMap>
      </div>
    </APIProvider>
  );
};

export default Map;
