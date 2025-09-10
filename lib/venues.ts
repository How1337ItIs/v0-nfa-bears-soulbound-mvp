import venuesData from '../data/venues.json';

export interface Venue {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  radius: number;
  beaconId: string;
}

export function getVenue(id: string): Venue | undefined {
  return venuesData.venues.find(venue => venue.id === id);
}

export function allVenues(): Venue[] {
  return venuesData.venues;
}

export function validateVenue(venueId: string): boolean {
  return venuesData.venues.some(venue => venue.id === venueId);
}
