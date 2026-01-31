/**
 * Landing.jsx
 * Sophisticated interactive landing page
 * Mouse-reactive particles, terrain, and atmospheric effects
 */

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import './Landing.css'

const Landing = () => {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const buttonRef = useRef(null)
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  
  // Particle system
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []
    let mountains = []
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initMountains()
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
    let currentMouseX = canvas.width / 2
    let currentMouseY = canvas.height / 2
    
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
      
      // Stars
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
    
    // Mouse tracking
    const handleMouseMove = (e) => {
      currentMouseX = e.clientX
      currentMouseY = e.clientY
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
  
  // Entry animations
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 })
    
    tl.fromTo(titleRef.current,
      { opacity: 0, y: 60, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' }
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
      '-=0.6'
    )
    .fromTo(buttonRef.current,
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' },
      '-=0.4'
    )
  }, [])
  
  const handleStartJourney = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.1,
      duration: 0.8,
      ease: 'power2.in',
      onComplete: () => navigate('/story')
    })
  }

  return (
    <div className="landing" ref={containerRef}>
      {/* Interactive Canvas Background */}
      <canvas ref={canvasRef} className="background-canvas" />
      
      {/* Ambient Light Effect */}
      <div 
        className="ambient-light"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(74, 158, 255, 0.08), transparent 60%)`
        }}
      />
      
      {/* Grid Overlay */}
      <div className="grid-overlay" />
      
      {/* Content */}
      <div className="content">
        <div className="title-container">
          <h1 ref={titleRef} className="title">
            <span className="title-line">The Silent</span>
            <span className="title-line highlight">Collapse</span>
            <span className="title-line small">of the Aravalli Hills</span>
          </h1>
        </div>
        
        <p ref={subtitleRef} className="subtitle">
          An immersive journey through India's ancient mountains<br />
          and the environmental crisis threatening their existence
        </p>
        
        <button 
          ref={buttonRef}
          className={`explore-btn ${isHovering ? 'hovering' : ''}`}
          onClick={handleStartJourney}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <span className="btn-text">Begin Exploration</span>
          <span className="btn-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="btn-glow" />
        </button>
        
        {/* Info Cards */}
        <div className="info-cards">
          <div className="info-card">
            <span className="card-number">1.5B</span>
            <span className="card-label">Years Old</span>
          </div>
          <div className="info-card">
            <span className="card-number">692</span>
            <span className="card-label">Km Range</span>
          </div>
          <div className="info-card">
            <span className="card-number">80%</span>
            <span className="card-label">Forest Lost</span>
          </div>
        </div>
      </div>
      
      {/* Custom Cursor */}
      <div ref={cursorRef} className={`custom-cursor ${isHovering ? 'hovering' : ''}`}>
        <div className="cursor-ring" />
        <div className="cursor-ring ring-2" />
      </div>
      <div ref={cursorDotRef} className="cursor-dot">
        <div className="dot-core" />
      </div>
      
      {/* Corner Decorations */}
      <div className="corner-decor top-left" />
      <div className="corner-decor top-right" />
      <div className="corner-decor bottom-left" />
      <div className="corner-decor bottom-right" />
    </div>
  )
}

export default Landing
