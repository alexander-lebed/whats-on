export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
export const GOOGLE_MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID;

export const CASTELLON_CENTER: google.maps.LatLngLiteral = { lat: 39.985, lng: -0.037 }; // Plaza Mayor, Castellon

// Approximate bounding box for Castellón de la Plana (Benicàssim, Castellon, Villarreal)
export const CASTELLON_BOUNDS: google.maps.LatLngBoundsLiteral = {
  south: 39.75, // near Nules / Almenara
  west: -0.45, // near Villafranca del Cid / Ares del Maestrat
  north: 40.65, // near Morella / Forcall
  east: 0.35, // Mediterranean coast near Vinaròs
};
