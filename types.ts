
export enum BinCategory {
  WASTE = 'waste',
  COMPOST = 'compost',
  RECYCLE = 'recycle'
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlockedAt?: number;
}

export interface ScanResult {
  detectedItem: string;
  binCategory: BinCategory;
  confidence: number;
  explanation: string;
  disposalTips: string[];
}

export interface UserStats {
  uid: string;
  username: string;
  displayName: string;
  photoURL: string;
  points: number;
  scansCount: number;
  level: number;
  rank: number;
  streak: number;
  lastScanDate?: string;
  achievements: Achievement[];
}

export interface ScanRecord {
  id: string;
  userId: string;
  imageUrl: string;
  timestamp: number;
  result: ScanResult;
  xpAwarded: number;
}

export interface BinLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: BinCategory;
  distance?: number;
}
