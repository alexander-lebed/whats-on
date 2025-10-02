import { AdvancedMarkerProps, MapProps as GoogleMapProps } from '@vis.gl/react-google-maps';
import { Event } from '@/app/types';

export type MapProps = Omit<GoogleMapProps, 'mapId'> & {
  places: Event['place'][];
};

export type MarkerProps = AdvancedMarkerProps & {
  position: google.maps.LatLngLiteral;
};
