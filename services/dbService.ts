
import { ScanRecord, UserStats, BinCategory, Achievement } from '../types';

const STORAGE_USERS = 'sortify_users';
const STORAGE_SCANS = 'sortify_scans';
const STORAGE_SESSION = 'sortify_session';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_scan', title: 'Recruit', icon: '🌱', description: 'Complete your first scan.' },
  { id: 'streak_3', title: 'Consistent', icon: '🔥', description: 'Maintain a 3-day sorting streak.' },
  { id: 'recycle_pro', title: 'Plastic Punisher', icon: '♻️', description: 'Sort 10 recyclable items.' },
];

export const dbService = {
  // --- AUTH ---
  signup: async (username: string): Promise<UserStats> => {
    const users = JSON.parse(localStorage.getItem(STORAGE_USERS) || '{}');
    if (users[username]) throw new Error('Username already taken, Operative.');
    
    const newUser: UserStats = {
      uid: 'u_' + Math.random().toString(36).substr(2, 9),
      username,
      displayName: username,
      photoURL: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`,
      points: 0,
      scansCount: 0,
      level: 1,
      rank: 0,
      streak: 0,
      achievements: INITIAL_ACHIEVEMENTS,
    };
    
    users[username] = newUser;
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_SESSION, username);
    return newUser;
  },

  login: async (username: string): Promise<UserStats> => {
    const users = JSON.parse(localStorage.getItem(STORAGE_USERS) || '{}');
    if (!users[username]) throw new Error('User not found in database.');
    localStorage.setItem(STORAGE_SESSION, username);
    return users[username];
  },

  logout: () => {
    localStorage.removeItem(STORAGE_SESSION);
  },

  getCurrentSessionUser: async (): Promise<UserStats | null> => {
    const username = localStorage.getItem(STORAGE_SESSION);
    if (!username) return null;
    const users = JSON.parse(localStorage.getItem(STORAGE_USERS) || '{}');
    return users[username] || null;
  },

  // --- SCANS & PROGRESSION ---
  saveScan: async (userId: string, imageUrl: string, result: any): Promise<{scan: ScanRecord, user: UserStats}> => {
    const scans = JSON.parse(localStorage.getItem(STORAGE_SCANS) || '[]');
    const xpBase = 10;
    const xpBonus = Math.floor(result.confidence * 5);
    const xpAwarded = xpBase + xpBonus;

    const scan: ScanRecord = {
      id: 's_' + Date.now(),
      userId,
      imageUrl,
      timestamp: Date.now(),
      result,
      xpAwarded
    };

    scans.unshift(scan);
    localStorage.setItem(STORAGE_SCANS, JSON.stringify(scans.slice(0, 100)));

    // Update User
    const users = JSON.parse(localStorage.getItem(STORAGE_USERS) || '{}');
    const username = localStorage.getItem(STORAGE_SESSION);
    if (!username || !users[username]) throw new Error('Session lost.');

    const user = users[username] as UserStats;
    user.points += xpAwarded;
    user.scansCount += 1;
    user.level = Math.floor(user.points / 100) + 1;

    // Handle Streaks
    const today = new Date().toISOString().split('T')[0];
    if (user.lastScanDate !== today) {
      user.streak = (user.lastScanDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]) 
        ? user.streak + 1 
        : 1;
      user.lastScanDate = today;
    }

    // Unlocking achievements
    if (user.scansCount === 1) user.achievements[0].unlockedAt = Date.now();
    if (user.streak >= 3) user.achievements[1].unlockedAt = Date.now();

    users[username] = user;
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
    
    return { scan, user };
  },

  getScans: async (userId: string): Promise<ScanRecord[]> => {
    const scans = JSON.parse(localStorage.getItem(STORAGE_SCANS) || '[]');
    return scans.filter((s: any) => s.userId === userId);
  },

  getLeaderboard: async (): Promise<UserStats[]> => {
    const usersObj = JSON.parse(localStorage.getItem(STORAGE_USERS) || '{}');
    return Object.values(usersObj)
      .sort((a: any, b: any) => b.points - a.points)
      .map((u: any, i) => ({ ...u, rank: i + 1 }));
  }
};
