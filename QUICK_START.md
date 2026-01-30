# 🚀 Quick Start Guide

## Your Website is Running!
**URL:** http://localhost:5173/

## ✅ Immediate Steps

### 1. Add Mapbox Token (Required)
```bash
# In project root, create .env file
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```
**Get Free Token:** https://account.mapbox.com/

### 2. Add Video Files (Optional but Recommended)
Place these in `/public` folder:
- `scroll.mp4` - Your forest fly-through video
- `scroll animation47.mp4` - Alternative/fallback

**Note:** Website works without videos (black background fallback)

### 3. Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

## 📖 What You Have Now

### Landing Page (/)
- Scroll-driven video background
- "The Silent Collapse of the Aravalli Hills" hero title
- "Start Journey" button (appears after scrolling)
- Scroll indicator

### Story Mode (/story)
6 scroll-triggered sections:
1. Introduction - India to Aravalli zoom
2. Terrain - 3D elevation visualization  
3. Ecology - Forest cover importance
4. Destruction - Mining & deforestation
5. Desert Spread - Thar expansion simulation
6. Future - AI predictions

## 🎨 Design Features

- Dark cinematic theme
- Glassmorphic UI cards
- Green accent color (#4ade80)
- Smooth GSAP animations
- Interactive Mapbox maps
- Progress indicator
- Fully responsive

## 🛠️ Quick Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Install new packages
npm install package-name
```

## 📁 Key Files to Know

```
Landing Page:
- src/pages/Landing.jsx
- src/pages/Landing.css

Story Mode:
- src/pages/Story.jsx
- src/pages/Story.css

Map Component:
- src/components/MapController.jsx

Navigation:
- src/components/Navbar.jsx

Global Styles:
- src/styles/index.css
```

## 🎯 Testing Checklist

- [ ] Mapbox token added to .env
- [ ] Website loads at localhost:5173
- [ ] Landing page video scrubs on scroll
- [ ] "Start Journey" button appears and works
- [ ] Story page loads with 6 sections
- [ ] Map transitions smoothly between sections
- [ ] Progress indicator shows on right side
- [ ] Navbar links work
- [ ] Responsive on mobile (resize browser)

## 🐛 Troubleshooting

**Maps not loading?**
- Check `.env` file has Mapbox token
- Restart dev server after adding token

**Video not playing?**
- Check video files in `/public` folder
- Videos must be MP4 format
- Website still works without videos

**Animations jerky?**
- Close other apps
- Try different browser (Chrome recommended)

## 📱 Test on Mobile

**Option 1: Browser DevTools**
- Press F12
- Click device icon (phone/tablet)
- Select device size

**Option 2: Real Device**
- Find your IP: `ipconfig` (Windows)
- Access: `http://YOUR_IP:5173`
- On same WiFi network

## 🎓 Learn More

- **React**: https://react.dev
- **Mapbox GL JS**: https://docs.mapbox.com/mapbox-gl-js
- **GSAP**: https://gsap.com/docs
- **Vite**: https://vitejs.dev

## 💡 Quick Tips

1. **Edit Content**: Change text in `STORY_SECTIONS` array (Story.jsx)
2. **Change Colors**: Replace `#4ade80` with your accent color
3. **Add Sections**: Copy existing section structure in Story.jsx
4. **Adjust Speed**: Modify `duration` values in GSAP configs

## 🏆 You're Ready!

Your professional GIS storytelling website is complete. Time to prepare your hackathon presentation!

**Next Steps:**
1. Add Mapbox token
2. Test all features
3. Customize content (optional)
4. Practice demo
5. Deploy (optional)

Good luck! 🎉
