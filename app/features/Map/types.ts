import { AdvancedMarkerProps, MapProps as GoogleMapProps } from '@vis.gl/react-google-maps';
import type { EventPlace } from '@/app/types';

export type MapProps = Omit<GoogleMapProps, 'mapId'> & {
  places: EventPlace[];
};

export type MarkerProps = AdvancedMarkerProps & {
  position: google.maps.LatLngLiteral;
};
