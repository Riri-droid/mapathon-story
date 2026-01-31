/**
 * Story.jsx
 * Interactive scroll-driven story about the Aravalli Hills
 * 7 chapters with strict scroll snapping - one scroll = one chapter
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import MapController from '../components/MapController'
import './Story.css'

// Story sections with Aravalli coordinates
const STORY_SECTIONS = [
  {
    id: 'india',
    title: 'India',
    heading: 'India',
    subtitle: 'The Big Picture',
    description: 'India sits between oceans and high mountains. Over millions of years, water and wind shaped this land into something complex and alive. The rivers that flow down from the north carry more than water. They carry soil, history, and the promise of harvest. Mountains do more than stand tall. They catch rain. They slow wind. They guide rivers and shape weather patterns in ways we rarely notice. Most of the country\'s green belt exists because something holds back the dry air from the west. Something keeps the desert from spreading east. There is an old range of hills that does this work quietly. Very few people know its name.',
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
    heading: 'The Aravalli Hills',
    subtitle: 'Ancient and Quiet',
    description: 'The Aravalli Hills run for nearly seven hundred kilometers across northwestern India. They begin near the edge of Gujarat and stretch all the way up to Delhi. These hills are among the oldest mountain ranges on Earth. They have been standing for more than a billion years. They do not rise dramatically like the Himalayas. They do not announce themselves. People drive past them. Cities have grown around them. Life continues as if they are just part of the background. But they are not decoration. They are structure. They hold something in place.',
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
    heading: 'Mountains You Don\'t Notice',
    subtitle: 'Ordinary But Essential',
    description: 'No one writes poems about the Aravallis. No one plans pilgrimages to their peaks. They are not famous. When people think of Indian mountains, they think of snow and altitude. The Aravallis are not that kind of mountain. They are the kind you see from a highway and forget about. The kind that exist in between things. The kind that feel ordinary. But ordinary things can be essential. A wall does not need to be beautiful to hold up a roof. The Aravallis have been holding something back for longer than we have had cities. We overlook them because they do their work without asking for recognition.',
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
    subtitle: 'A Quiet Shield',
    description: 'To the west of the Aravallis lies the Thar Desert. Dry wind moves across it constantly, carrying heat and sand. Without something in the way, that wind would keep moving east. It would dry the land. It would turn green fields into dust. The Aravallis stand in the path of this wind. They are not tall enough to stop it completely, but they slow it down. They break its force. This is why there are farms to the east of the hills. This is why rivers still flow. The hills act like a shield. Not a dramatic one. A quiet, old shield that no one remembers forging.',
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
    heading: 'What Is Going Wrong',
    subtitle: 'Little by Little',
    description: 'For decades, people have been taking stone from the Aravallis. There is marble and granite beneath the surface. Mining happens in small cuts at first. Then larger ones. Trees are cleared to reach the rock. Roads are built to carry it away. Each quarry feels small on its own. But the hills are not endless. When you take away rock, you take away the structure that holds water. When you remove trees, you remove the roots that keep soil in place. The shield is being chipped away. Not all at once. Not with intention to harm. But the effect is the same.',
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
    heading: 'If Things Continue Like This',
    subtitle: 'Slow Changes, Large Outcomes',
    description: 'If the Aravallis continue to shrink, the land to their east will begin to change. Not tomorrow. Not in a single season. But slowly. The wind will carry more dust. The air will grow hotter. Rivers that depend on the hills to trap monsoon rains will carry less water each year. Fields will need more irrigation. Cities will face longer droughts. People will not connect the change to the hills at first. It will feel like bad luck. Like the weather has turned. But the weather has not turned. The structure that shaped the weather has been removed.',
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
    heading: 'Two Possible Futures',
    subtitle: 'What Comes Next',
    description: 'There are two ways this story could unfold. In one version, the Aravallis are given space to recover. Mining is controlled. Trees are replanted. The shield holds. The green belt remains. In the other version, the hills are slowly erased. The quarries expand. The forest disappears. The wind moves east without resistance. The desert grows. Water becomes scarce. Both futures are still possible. The decision is not dramatic. It is quiet. It is made in permits and policies. Understanding that the hills matter is the first step. Everything else follows from there.',
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
  const isAnimating = useRef(false)
  
  const sectionRefs = useRef([])
  const progressDotsRef = useRef([])

  // Navigate to specific chapter with animation - wrapped in useCallback to fix dependency warnings
  const goToChapter = useCallback((targetIndex) => {
    if (isAnimating.current) return
    if (targetIndex < 0 || targetIndex >= STORY_SECTIONS.length) return
    if (targetIndex === currentSection) return

    isAnimating.current = true
    const section = STORY_SECTIONS[targetIndex]
    const isMovingForward = targetIndex > currentSection

    // Create master timeline for cinematic, slow transitions
    const tl = gsap.timeline({
      defaults: { ease: 'expo.inOut' },
      onComplete: () => {
        // Pause before unlocking to let user absorb the chapter
        gsap.delayedCall(0.4, () => {
          isAnimating.current = false
        })
      }
    })

    // Phase 1: Fade out current content slowly (0.7s)
    const currentContent = sectionRefs.current[currentSection]?.querySelector('.section-content')
    if (currentContent) {
      tl.to(currentContent, {
        opacity: 0,
        y: isMovingForward ? -50 : 50,
        scale: 0.92,
        duration: 0.7,
        ease: 'power3.in'
      }, 0)
    }

    // Phase 2: Update React state and trigger map transition (at 0.2s - map moves first)
    tl.add(() => {
      setCurrentSection(targetIndex)
      setMapConfig(section.mapConfig)
      setMapStyle(section.style)
      setShowTerrain(section.terrain || false)
      setShowAravalliHighlight(section.showAravalli || false)
    }, 0.2)

    // Phase 3: Fade in new content slowly (0.9s, starts at 1.1s - staggered after map)
    const newContent = sectionRefs.current[targetIndex]?.querySelector('.section-content')
    if (newContent) {
      tl.fromTo(newContent,
        {
          opacity: 0,
          y: isMovingForward ? 50 : -50,
          scale: 0.92
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out'
        },
        1.1
      )
    }

    // Phase 4: Animate progress dots smoothly
    const currentDot = progressDotsRef.current[currentSection]
    const targetDot = progressDotsRef.current[targetIndex]
    
    if (currentDot) {
      tl.to(currentDot, {
        scale: 0.8,
        duration: 0.6,
        ease: 'power2.inOut'
      }, 0)
    }

    if (targetDot) {
      tl.fromTo(targetDot,
        { scale: 0.8 },
        { 
          scale: 1.2,
          duration: 0.7,
          ease: 'elastic.out(1.2, 0.5)'
        },
        1.3
      )
    }
  }, [currentSection]) // Dependencies for useCallback

  // Wheel event handler for chapter snapping
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault()

      if (isAnimating.current) return

      // Determine direction
      if (e.deltaY > 0) {
        // Scroll down → next chapter
        goToChapter(currentSection + 1)
      } else if (e.deltaY < 0) {
        // Scroll up → previous chapter
        goToChapter(currentSection - 1)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel)
      }
    }
  }, [currentSection, goToChapter]) // Include goToChapter in dependencies

  // Initialize first chapter
  useEffect(() => {
    const section = STORY_SECTIONS[0]
    setMapConfig(section.mapConfig)
    setMapStyle(section.style)
    setShowTerrain(section.terrain || false)
    setShowAravalliHighlight(section.showAravalli || false)

    // Initial content animation
    const firstContent = sectionRefs.current[0]?.querySelector('.section-content')
    if (firstContent) {
      gsap.fromTo(firstContent,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 }
      )
    }
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
            ref={(el) => (progressDotsRef.current[index] = el)}
            className={`progress-dot ${currentSection === index ? 'active' : ''} ${currentSection > index ? 'completed' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Story
