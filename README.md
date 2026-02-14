
# RecycleXP ♻️

RecycleXP is a high-fidelity hackathon project built to revolutionize domestic waste management through AI and gamification.

## Features
- **AI Classification**: Instantly identify waste types (Recycle, Compost, Waste) using Gemini 3 Flash.
- **Gamification**: Earn +1 XP per scan, level up, and climb the leaderboard.
- **Bin Finder**: Locate nearby specialized waste disposal bins based on geolocation.
- **User Profiles**: Track your environmental impact over time.

## Setup Instructions

### Environment Variables
To enable AI classification, you must provide a valid Gemini API Key:
```env
API_KEY=your_gemini_api_key_here
```

### Production Implementation Plan
1. **Authentication**: Swap the mock `firebaseService` auth with `Firebase Auth` (Anonymous or Social).
2. **Database**: Implement `Firestore` for storing `ScanRecord` collections.
3. **Storage**: Use `Firebase Storage` for the `base64Image` uploads.
4. **Maps**: Replace the mock map with `Google Maps React` and query `OpenStreetMap` for real bin data.

## Tech Stack
- **Framework**: React 18 (SPA with custom view routing)
- **AI**: Google GenAI SDK (Gemini 3 Flash)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Persistence**: LocalStorage (Mock for demo)
