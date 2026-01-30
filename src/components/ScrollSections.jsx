import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ScrollSections.css'

gsap.registerPlugin(ScrollTrigger)

const ScrollSections = ({ sections, onSectionChange, currentSection }) => {
  const containerRef = useRef(null)
  const sectionsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create scroll triggers for each section
      sectionsRef.current.forEach((section, index) => {
        if (!section) return

        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => onSectionChange(index),
          onEnterBack: () => onSectionChange(index),
          // markers: true, // Uncomment for debugging
        })

        // Parallax effect for section markers
        gsap.fromTo(section.querySelector('.section-marker'),
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'top 20%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [sections, onSectionChange])

  return (
    <div className="scroll-sections" ref={containerRef}>
      {sections.map((section, index) => (
        <section
          key={section.id}
          ref={el => sectionsRef.current[index] = el}
          className={`story-section ${index === currentSection ? 'active' : ''}`}
          data-section={section.id}
        >
          {/* Visual marker for scroll position */}
          <div className="section-marker">
            <div className="marker-line"></div>
            <div className="marker-dot"></div>
          </div>
          
          {/* Hidden content for scroll trigger - actual content in overlay */}
          <div className="section-trigger-area">
            <span className="trigger-label">{section.title}</span>
          </div>
        </section>
      ))}
      
      {/* End spacer */}
      <div className="scroll-end-spacer">
        <div className="end-message">
          <span className="end-icon">🌍</span>
          <p>Continue exploring India's environmental story</p>
        </div>
      </div>
    </div>
  )
}

export default ScrollSections
