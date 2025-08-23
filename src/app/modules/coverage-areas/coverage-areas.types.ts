export interface Zone {
  name: string; // Added name property
  color: string; // Added color property
  zoneData: Coordinate[];
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface ZonesResponse {
  status: string;
  message: string;
  zones: Zone[];
}
