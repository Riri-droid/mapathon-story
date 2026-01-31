/**
 * Navbar.jsx
 * Minimal glassmorphic navigation bar
 */

import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Professional Logo */}
          <Link to="/" className="navbar-logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 20L7 16L10 18L13 13L16 15L19 10L21 12V20H3Z" fill="#4ade80" opacity="0.8"/>
              <path d="M3 20L7 16L10 18L13 13L16 15L19 10L21 12" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 2L9 8L12 10L15 6L12 2Z" fill="#22c55e"/>
            </svg>
            <span className="logo-text">Aravalli Watch</span>
          </Link>

          {/* Navigation Links */}
          <div className="navbar-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/story"
              className={`nav-link ${location.pathname === '/story' ? 'active' : ''}`}
            >
              Story
            </Link>
            <Link
              to="/about"
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              About
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
