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

  // Canvas particle effect - matching Landing page
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []
    let mountains = []
    let currentMouseX = window.innerWidth / 2
    let currentMouseY = window.innerHeight / 2
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initMountains()
      initParticles()
    }
    
    // Initialize mountain layers - darker theme
    const initMountains = () => {
      mountains = [
        { color: 'rgba(15, 25, 40, 0.5)', offset: 0.6, amplitude: 80, speed: 0.0002 },
        { color: 'rgba(12, 22, 38, 0.6)', offset: 0.65, amplitude: 100, speed: 0.0003 },
        { color: 'rgba(10, 18, 32, 0.7)', offset: 0.7, amplitude: 120, speed: 0.0004 },
        { color: 'rgba(8, 15, 28, 0.85)', offset: 0.75, amplitude: 90, speed: 0.0005 },
        { color: 'rgba(5, 10, 20, 1)', offset: 0.82, amplitude: 60, speed: 0.0006 },
      ]
    }
    
    // Particle class
    class Particle {
      constructor() {
        this.reset()
      }
      
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height * 0.7
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.3
        this.opacity = Math.random() * 0.5 + 0.2
        this.pulse = Math.random() * Math.PI * 2
      }
      
      update(mouseX, mouseY) {
        // Mouse interaction
        const dx = mouseX - this.x
        const dy = mouseY - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < 150) {
          const force = (150 - dist) / 150
          this.x -= dx * force * 0.02
          this.y -= dy * force * 0.02
        }
        
        this.x += this.speedX
        this.y += this.speedY
        this.pulse += 0.02
        
        // Wrap around
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height * 0.7
        if (this.y > canvas.height * 0.7) this.y = 0
      }
      
      draw(ctx) {
        const glow = Math.sin(this.pulse) * 0.3 + 0.7
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180, 220, 255, ${this.opacity * glow})`
        ctx.fill()
        
        // Glow effect
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(150, 200, 255, ${this.opacity * glow * 0.2})`
        ctx.fill()
      }
    }
    
    // Initialize particles
    const initParticles = () => {
      particles = []
      const count = Math.floor((canvas.width * canvas.height) / 8000)
      for (let i = 0; i < count; i++) {
        particles.push(new Particle())
      }
    }
    
    // Draw mountain layer
    const drawMountain = (mountain, time, mouseX) => {
      const { color, offset, amplitude, speed } = mountain
      const mouseInfluence = (mouseX / canvas.width - 0.5) * 30
      
      ctx.beginPath()
      ctx.moveTo(0, canvas.height)
      
      for (let x = 0; x <= canvas.width; x += 5) {
        const noise1 = Math.sin(x * 0.003 + time * speed) * amplitude
        const noise2 = Math.sin(x * 0.007 + time * speed * 1.5) * (amplitude * 0.5)
        const noise3 = Math.sin(x * 0.001 + time * speed * 0.5) * (amplitude * 0.3)
        const parallax = (x / canvas.width - 0.5) * mouseInfluence * (1 - offset)
        
        const y = canvas.height * offset + noise1 + noise2 + noise3 + parallax
        ctx.lineTo(x, y)
      }
      
      ctx.lineTo(canvas.width, canvas.height)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
    }
    
    // Draw fog/mist - darker
    const drawFog = (time) => {
      const gradient = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height)
      gradient.addColorStop(0, 'rgba(5, 10, 20, 0)')
      gradient.addColorStop(0.5, 'rgba(8, 15, 28, 0.4)')
      gradient.addColorStop(1, 'rgba(3, 8, 15, 0.7)')
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4)
      
      // Animated mist layers
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        const yBase = canvas.height * (0.7 + i * 0.08)
        ctx.moveTo(0, yBase)
        
        for (let x = 0; x <= canvas.width; x += 10) {
          const wave = Math.sin(x * 0.005 + time * 0.0003 + i) * 20
          ctx.lineTo(x, yBase + wave)
        }
        
        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()
        ctx.fillStyle = `rgba(10, 20, 35, ${0.15 - i * 0.03})`
        ctx.fill()
      }
    }
    
    // Main animation loop
    let time = 0
    
    const animate = () => {
      time++
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Sky gradient - ultra dark
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      skyGradient.addColorStop(0, '#030508')
      skyGradient.addColorStop(0.3, '#050a12')
      skyGradient.addColorStop(0.6, '#08101c')
      skyGradient.addColorStop(1, '#040810')
      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Stars/particles
      particles.forEach(p => {
        p.update(currentMouseX, currentMouseY)
        p.draw(ctx)
      })
      
      // Draw mountains with parallax
      mountains.forEach(m => drawMountain(m, time, currentMouseX))
      
      // Draw fog
      drawFog(time)
      
      animationId = requestAnimationFrame(animate)
    }
    
    const handleMouseMove = (e) => {
      currentMouseX = e.clientX
      currentMouseY = e.clientY
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    
    resize()
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
