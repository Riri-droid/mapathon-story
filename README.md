# The Silent Collapse of the Aravalli Hills

🏔️ **A Cinematic GIS Storytelling Experience**

An interactive scroll-driven React website that tells the environmental story of India's Aravalli Hills using maps, animations, and data visualization.

## 🎯 Project Overview

This project was built for a national-level hackathon, combining cutting-edge web technologies to create an immersive storytelling experience about one of the world's oldest mountain ranges and its ecological crisis.

## ✨ Features

### Landing Page
- **Scroll-driven video**: Forest fly-through video that scrubs forward as you scroll
- **Cinematic animations**: GSAP-powered smooth transitions
- **Call-to-action**: "Start Journey" button appears after scrolling

### Story Mode (6 Interactive Sections)
1. **Introduction** - Zoom from India to Aravalli Range
2. **Terrain & Elevation** - 3D terrain visualization with Mapbox
3. **Ecological Importance** - Forest cover and vegetation layers
4. **Destruction** - Mining zones and deforestation visualization
5. **Desert Spread Simulation** - Animated Thar Desert expansion
6. **AI Future Prediction** - Simulated vegetation loss scenarios

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Mapbox GL JS** - Interactive maps with 3D terrain
- **GSAP + ScrollTrigger** - Scroll-based animations
- **React Router** - Navigation
- **CSS3** - Custom styling with glassmorphism

## 📦 Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Create .env file in root directory
echo "VITE_MAPBOX_TOKEN=your_mapbox_token_here" > .env

# Start development server
npm run dev
```

## 🗺️ Mapbox Setup

1. Get a free Mapbox access token at [mapbox.com](https://account.mapbox.com/)
2. Add to `.env` file:
   ```
   VITE_MAPBOX_TOKEN=your_actual_token
   ```

## 📁 Project Structure

```
mapathon/
├── src/
│   ├── components/
│   │   ├── MapController.jsx      # Mapbox GL controller
│   │   ├── Navbar.jsx              # Navigation component
│   │   ├── LoadingScreen.jsx      # Loading state
│   │   └── ScrollSections.jsx     # Scroll section wrapper
│   ├── pages/
│   │   ├── Landing.jsx             # Landing page with video
│   │   └── Story.jsx               # Interactive story mode
│   ├── styles/
│   │   └── index.css               # Global styles
│   ├── App.jsx                     # Root component
│   └── main.jsx                    # Entry point
├── public/
│   ├── scroll.mp4                  # Forest video
│   └── scroll animation47.mp4     # Alternative video
├── package.json
└── vite.config.js
```

## 🚀 Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

## 📱 Responsive Design

- **Desktop**: Full experience with all features
- **Tablet**: Adapted layouts and touch-friendly
- **Mobile**: Optimized performance and simplified UI

## 🎨 Customization

### Adding New Story Sections

Edit `STORY_SECTIONS` array in [Story.jsx](src/pages/Story.jsx):

```javascript
{
  id: 'new-section',
  heading: 'Section Title',
  subtitle: 'Subtitle',
  description: 'Your content...',
  mapConfig: {
    center: [lon, lat],
    zoom: 10,
    pitch: 45,
    bearing: 0
  },
  terrain: true,
}
```

## 📄 License

This project is open source and available under the MIT License.

---

**Made with ❤️ for environmental awareness**
