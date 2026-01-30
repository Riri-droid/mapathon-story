/**
 * Story.jsx
 * Interactive scroll-driven story about the Aravalli Hills
 * 6 sections with map animations using GSAP ScrollTrigger + Mapbox GL
 */

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MapController from '../components/MapController'
import './Story.css'

gsap.registerPlugin(ScrollTrigger)

// Story sections with Aravalli coordinates
const STORY_SECTIONS = [
  {
    id: 'india',
    title: 'India',
    heading: 'India',
    subtitle: 'The Subcontinent',
    description: 'From the Himalayas to the Indian Ocean, India\'s diverse landscape holds ancient secrets.',
    mapConfig: {
      center: [78.9629, 22.0], // India center (adjusted)
      zoom: 4.2,
      pitch: 0,
      bearing: 0
    },
    style: 'mapbox://styles/mapbox/satellite-v9',
    showAravalli: false,
  },
  {
    id: 'aravalli',
    title: 'Aravalli Hills',
    heading: 'The Aravalli Range',
    subtitle: 'Ancient Mountains in Crisis',
    description: 'Stretching 692 km across northwestern India, the Aravalli Range is one of the world\'s oldest mountain ranges. For 1.8 billion years, these hills have protected the land—but now they face collapse.',
    mapConfig: {
      center: [73.7125, 26.0], // Aravalli center
      zoom: 6.5,
      pitch: 20,
      bearing: 0
    },
    style: 'mapbox://styles/mapbox/satellite-v9',
    showAravalli: true,
    terrain: false,
  },
  {
    id: 'elevation',
    title: 'Elevation',
    heading: 'Elevation Profile',
    subtitle: 'The Peaks and Valleys',
    description: 'The Aravalli Hills reach heights of up to 1,722 meters at Guru Shikhar peak. This 3D terrain visualization shows the dramatic elevation changes across the range.',
    mapConfig: {
      center: [73.7125, 26.0], // Same as Aravalli view
      zoom: 6.5,
      pitch: 20,
      bearing: 0
    },
    style: 'mapbox://styles/mapbox/satellite-v9',
    showAravalli: true,
    terrain: true,
    showElevationColors: true,
  },
  {
    id: 'ecology',
    title: 'Natural Barrier',
    heading: 'Stopping the Desert',
    subtitle: 'Aravalli as Climate Shield',
    description: 'For millions of years, the Aravalli Hills have acted as a critical natural barrier preventing the Thar Desert from spreading eastward. This green belt blocks hot desert winds, traps moisture, and protects fertile plains of northern India.',
    mapConfig: {
      center: [72.5, 26.5],
      zoom: 6.5,
      pitch: 20,
      bearing: 0
    },
    style: 'mapbox://styles/mapbox/satellite-v9',
    showAravalli: true,
    showDesertBarrier: true,
  },
  {
    id: 'destruction',
    title: 'Destruction',
    heading: 'Mining & Deforestation',
    subtitle: 'The Scars on the Land',
    description: 'Decades of illegal mining for marble, granite, and limestone have devastated the Aravalli landscape. Over 31% of the forest cover has been lost since 1980.',
    mapConfig: {
      center: [74.8, 26.5],
      zoom: 6.5,
      pitch: 20,
      bearing: 0
    },
    style: 'mapbox://styles/mapbox/satellite-v9',
    showAravalli: true,
    showMiningZones: true,
  },
  {
    id: 'desert-spread',
    title: 'Desert Expansion',
    heading: 'The Advancing Thar',
    subtitle: 'Desertification Simulation',
    description: 'As the Aravalli barrier weakens, the Thar Desert is spreading eastward at an alarming rate. This simulation shows projected desert expansion over the next 50 years.',
    mapConfig: {
      center: [74.0, 27.0],
      zoom: 5.5,
      pitch: 0,
      bearing: 0
    },
    style: 'mapbox://styles/mapbox/satellite-v9',
    showDesertExpansion: true,
  },
  {
    id: 'future',
    title: 'AI Future Prediction',
    heading: 'The Path Forward',
    subtitle: 'Conservation or Collapse?',
    description: 'AI models predict that without immediate conservation efforts, the Aravalli region could lose 60% of its remaining vegetation by 2070, turning Delhi into a dust bowl.',
    mapConfig: {
      center: [75.0, 26.5],
      zoom: 6.5,
      pitch: 30,
      bearing: 0
    },
    style: 'mapbox://styles/mapbox/satellite-v9',
    showFutureScenarios: true,
  },
]

const Story = () => {
  const containerRef = useRef(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [mapConfig, setMapConfig] = useState(STORY_SECTIONS[0].mapConfig)
  const [mapStyle, setMapStyle] = useState(STORY_SECTIONS[0].style)
  const [showTerrain, setShowTerrain] = useState(false)
  const [showAravalliHighlight, setShowAravalliHighlight] = useState(false)
  
  const sectionRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create ScrollTrigger for each section
      STORY_SECTIONS.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: sectionRefs.current[index],
          start: 'top center',
          end: 'bottom center',
          onEnter: () => {
            console.log('Entering section:', index, section.id)
            setCurrentSection(index)
            setMapConfig(section.mapConfig)
            setMapStyle(section.style)
            setShowTerrain(section.terrain || false)
            setShowAravalliHighlight(section.showAravalli || false)
          },
          onEnterBack: () => {
            console.log('Entering back section:', index, section.id)
            setCurrentSection(index)
            setMapConfig(section.mapConfig)
            setMapStyle(section.style)
            setShowTerrain(section.terrain || false)
            setShowAravalliHighlight(section.showAravalli || false)
          },
        })

        // Animate section content
        if (sectionRefs.current[index]) {
          gsap.fromTo(
            sectionRefs.current[index].querySelector('.section-content'),
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              scrollTrigger: {
                trigger: sectionRefs.current[index],
                start: 'top 80%',
                end: 'top 50%',
                scrub: 1,
              }
            }
          )

          // Fade out as scrolling away
          gsap.to(sectionRefs.current[index].querySelector('.section-content'), {
            opacity: 0,
            y: -50,
            scrollTrigger: {
              trigger: sectionRefs.current[index],
              start: 'center 30%',
              end: 'center top',
              scrub: 1,
            }
          })
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="story" ref={containerRef}>
      {/* Fixed Map Background */}
      <div className="map-background">
        <MapController
          config={mapConfig}
          style={mapStyle}
          showTerrain={showTerrain}
          showAravalliHighlight={showAravalliHighlight}
          showElevationColors={STORY_SECTIONS[currentSection]?.showElevationColors || false}
          showDesertBarrier={STORY_SECTIONS[currentSection]?.showDesertBarrier || false}
          showMiningZones={STORY_SECTIONS[currentSection]?.showMiningZones || false}
          showDesertExpansion={STORY_SECTIONS[currentSection]?.showDesertExpansion || false}
          showFutureScenarios={STORY_SECTIONS[currentSection]?.showFutureScenarios || false}
          interactive={false}
        />
        <div className="map-overlay"></div>
      </div>

      {/* Scroll Sections */}
      <div className="story-sections">
        {STORY_SECTIONS.map((section, index) => (
          <section
            key={section.id}
            ref={(el) => (sectionRefs.current[index] = el)}
            className={`story-section ${currentSection === index ? 'active' : ''}`}
          >
            <div className="section-content">
              <div className="section-number">{String(index + 1).padStart(2, '0')}</div>
              <h2 className="section-heading">{section.heading}</h2>
              <h3 className="section-subtitle">{section.subtitle}</h3>
              <p className="section-description">{section.description}</p>
              
              {/* Elevation Legend */}
              {section.showElevationColors && currentSection === index && (
                <div className="elevation-legend">
                  <h4>Elevation (meters)</h4>
                  <div className="legend-items">
                    <div className="legend-item">
                      <span className="legend-color" style={{backgroundColor: '#8B0000'}}></span>
                      <span>1,500 - 1,722m (Peaks)</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{backgroundColor: '#DC143C'}}></span>
                      <span>1,000 - 1,500m (High)</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{backgroundColor: '#FF6347'}}></span>
                      <span>700 - 1,000m (Medium)</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{backgroundColor: '#FFA500'}}></span>
                      <span>400 - 700m (Low)</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{backgroundColor: '#FFD700'}}></span>
                      <span>200 - 400m (Plains)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="progress-indicator">
        {STORY_SECTIONS.map((section, index) => (
          <div
            key={section.id}
            className={`progress-dot ${currentSection === index ? 'active' : ''} ${currentSection > index ? 'completed' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Story
