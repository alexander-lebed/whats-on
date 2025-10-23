export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
export const GOOGLE_MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID;

export const CASTELLON_CENTER: google.maps.LatLngLiteral = { lat: 39.985, lng: -0.037 }; // Plaza Mayor, Castellon

// Approximate bounding box for Castellón de la Plana (Benicàssim, Castellon, Villarreal)
export const CASTELLON_BOUNDS: google.maps.LatLngBoundsLiteral = {
  south: 39.91,
  west: -0.14,
  north: 40.06,
  east: 0.09,
};
