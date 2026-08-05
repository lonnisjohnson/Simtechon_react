import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import './Header.css'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const toggleMenu = () => setMenuOpen(prev => !prev)

  return (
    <nav id="navbar" className={`nav-header${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <span className="nav-logo-text">Simtech<span>ON</span></span>
        </Link>

        <ul className={`nav-links${menuOpen ? ' nav-active' : ''}`}>
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/about">About Us</NavLink></li>
          <li><NavLink to="/services">Services</NavLink></li>
          <li><NavLink to="/jobs">Job Portal</NavLink></li>
          <li><NavLink to="/contact">Contact Us</NavLink></li>
          <li className="mobile-only"><NavLink to="/login">Login</NavLink></li>
        </ul>

        <button
          className="nav-hamburger"
          aria-label="Menu"
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  )
}

export default Header
