/**
 * About.jsx
 * Immersive interactive About page with particle effects
 */

import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './About.css'

gsap.registerPlugin(ScrollTrigger)

const About = () => {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  const techCardsRef = useRef([])
  const cardAnimationsRef = useRef([])
  const cursorPosRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 })
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [activeSection, setActiveSection] = useState(0)

  // Canvas particle effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []
    let mouseX = 0
    let mouseY = 0
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 5 // Full page height
    }
    
    class Particle {
      constructor() {
        this.reset()
      }
      
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 1.5 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.3
        this.speedY = (Math.random() - 0.5) * 0.3
        this.opacity = Math.random() * 0.4 + 0.1
      }
      
      update() {
        this.x += this.speedX
        this.y += this.speedY
        
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1
      }
      
      draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(120, 180, 255, ${this.opacity * 1.5})`
        ctx.fill()
      }
    }
    
    const initParticles = () => {
      particles = []
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle())
      }
    }
    
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(120, 180, 255, ${0.2 * (1 - dist / 150)})`
            ctx.stroke()
          }
        }
      }
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(p => {
        p.update()
        p.draw(ctx)
      })
      
      drawConnections()
      
      animationId = requestAnimationFrame(animate)
    }
    
    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY + window.scrollY
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    
    resize()
    initParticles()
    animate()
    
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  // Custom cursor
  useEffect(() => {
    const moveCursor = (e) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out'
      })
      gsap.to(cursorDotRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1
      })
    }
    
    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [])

  // Scroll animations
  useEffect(() => {
    // Hero section - set to visible first, then animate
    gsap.set('.hero-content > *', { opacity: 1, y: 0 })
    gsap.from('.hero-content > *', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.2
    })
    
    // Stats cards - ensure visible
    gsap.set('.stat-card', { opacity: 1, y: 0 })
    gsap.from('.stat-card', {
      scrollTrigger: {
        trigger: '.stats-section',
        start: 'top 90%'
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out'
    })
    
    // Timeline items - ensure visible
    gsap.set('.timeline-item', { opacity: 1, x: 0 })
    gsap.from('.timeline-item', {
      scrollTrigger: {
        trigger: '.timeline-section',
        start: 'top 90%'
      },
      opacity: 0,
      x: -40,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power3.out'
    })
    
    // Feature cards - ensure visible
    gsap.set('.feature-card', { opacity: 1, scale: 1 })
    gsap.from('.feature-card', {
      scrollTrigger: {
        trigger: '.features-section',
        start: 'top 90%'
      },
      opacity: 0,
      scale: 0.95,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power3.out'
    })
    
    // Tech cards - no scroll trigger needed for carousel
    // Animation handled by CSS keyframes

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const stats = [
    { value: '1.5B', label: 'Years Old', sublabel: 'Ancient Range' },
    { value: '692', label: 'Kilometers', sublabel: 'Total Length' },
    { value: '80%', label: 'Forest Lost', sublabel: 'Since 1970' },
    { value: '60M+', label: 'People', sublabel: 'Water Dependent' }
  ]

  const timeline = [
    { year: '1970s', title: 'Peak Biodiversity', desc: 'Dense forests covering 80% of the range, home to leopards and diverse wildlife.' },
    { year: '1992', title: 'Mining Begins', desc: 'Industrial mining operations start, marking the beginning of systematic destruction.' },
    { year: '2002', title: 'Court Ban', desc: 'Supreme Court bans mining, but illegal activities continue unchecked.' },
    { year: '2015', title: 'Urbanization', desc: 'Delhi-NCR expansion accelerates, consuming forests at alarming rates.' },
    { year: '2026', title: 'Present Crisis', desc: 'Only 20% forest remains. Desert expansion threatens millions.' }
  ]

  const features = [
    { icon: '🛡️', title: 'Desert Barrier', desc: 'Only natural barrier preventing Thar Desert expansion into fertile plains.' },
    { icon: '💧', title: 'Water Source', desc: 'Critical watershed feeding rivers and groundwater for 60 million people.' },
    { icon: '🌬️', title: 'Air Shield', desc: 'Natural filter against dust storms that plague Delhi-NCR region.' },
    { icon: '🐆', title: 'Wildlife Habitat', desc: 'Home to endangered leopards, wolves, and 400+ unique species.' }
  ]

  const techStack = [
    { name: 'Mapbox GL', category: 'Interactive Mapping' },
    { name: 'React 18', category: 'User Interface' },
    { name: 'GSAP', category: 'Animation Engine' },
    { name: 'Vite', category: 'Build Tool' },
    { name: 'GeoJSON', category: 'Spatial Data' },
    { name: 'WebGL', category: '3D Rendering' }
  ]

  return (
    <div className="about-page" ref={containerRef}>
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="bg-canvas" />
      
      {/* Ambient Light */}
      <div 
        className="ambient-glow"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(74, 158, 255, 0.08), transparent 60%)`
        }}
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Mapathon 2026
          </div>
          <h1 className="hero-title">
            <span className="title-line">The Silent</span>
            <span className="title-line gradient">Collapse</span>
            <span className="title-line small">of the Aravalli Hills</span>
          </h1>
          <p className="hero-desc">
            An immersive data-driven journey through India's oldest mountain range,
            revealing the environmental crisis threatening 60 million lives.
          </p>
          <div className="hero-actions">
            <Link 
              to="/story" 
              className="primary-btn"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <span>Begin Journey</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link 
              to="/" 
              className="secondary-btn"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="section-header">
          <span className="section-label">The Numbers</span>
          <h2 className="section-title">A Crisis in Data</h2>
        </div>
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="stat-card"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-sublabel">{stat.sublabel}</div>
              <div className="stat-glow" />
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="section-header">
          <span className="section-label">The Journey</span>
          <h2 className="section-title">From Paradise to Crisis</h2>
        </div>
        <div className="timeline">
          {timeline.map((item, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-marker">
                <div className="marker-dot" />
                <div className="marker-line" />
              </div>
              <div className="timeline-content">
                <span className="timeline-year">{item.year}</span>
                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-label">Why It Matters</span>
          <h2 className="section-title">Critical Importance</h2>
        </div>
        <div className="features-grid">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="feature-card"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
              <div className="feature-border" />
            </div>
          ))}
        </div>
      </section>

      {/* Tech Section */}
      <section className="tech-section">
        <div className="tech-header">
          <h2 className="tech-main-title">Build With</h2>
          <p className="tech-subtitle">
            Combining advanced geospatial technology with modern web architecture
            to create immersive environmental storytelling.
          </p>
        </div>
        <div className="tech-carousel">
          <div className="tech-track">
            {[...techStack, ...techStack, ...techStack].map((tech, i) => (
              <div 
                key={i} 
                className="tech-card"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <h3 className="tech-name">{tech.name}</h3>
                <p className="tech-category">{tech.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Full Screen Centered */}
      <section className="cta-section">
        <div className="cta-overlay">
          <h2 className="cta-title">Experience the Story</h2>
          <p className="cta-desc">
            Navigate through interactive maps, AI predictions, and data visualizations
            to understand the full scope of this environmental crisis.
          </p>
          <Link 
            to="/story" 
            className="cta-btn"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <span>Launch Interactive Experience</span>
            <div className="btn-shine" />
          </Link>
        </div>
      </section>

      {/* Custom Cursor */}
      <div ref={cursorRef} className={`custom-cursor ${isHovering ? 'hovering' : ''}`}>
        <div className="cursor-ring" />
        <div className="cursor-ring ring-2" />
      </div>
      <div ref={cursorDotRef} className="cursor-dot">
        <div className="dot-core" />
      </div>
    </div>
  )
}

export default About
