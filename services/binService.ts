
import { BinLocation, BinCategory } from '../types';

export const binService = {
  getNearbyBins: async (lat: number, lng: number, radius: number): Promise<BinLocation[]> => {
    // In a real app, this would query OSM Overpass API or a custom backend
    // For the hackathon, we generate mock bins around the user's location
    return [
      {
        id: '1',
        name: 'Main St Recycle Center',
        lat: lat + 0.002,
        lng: lng + 0.001,
        type: BinCategory.RECYCLE,
      },
      {
        id: '2',
        name: 'City Park Compost',
        lat: lat - 0.001,
        lng: lng + 0.003,
        type: BinCategory.COMPOST,
      },
      {
        id: '3',
        name: 'Downtown Public Waste',
        lat: lat + 0.003,
        lng: lng - 0.002,
        type: BinCategory.WASTE,
      },
      {
        id: '4',
        name: 'Community Sorting Hub',
        lat: lat - 0.004,
        lng: lng - 0.001,
        type: BinCategory.RECYCLE,
      },
    ].map(bin => ({
      ...bin,
      distance: Math.sqrt(Math.pow(bin.lat - lat, 2) + Math.pow(bin.lng - lng, 2)) * 111, // Rough km
    }));
  }
};
