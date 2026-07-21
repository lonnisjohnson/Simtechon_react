import { Link } from 'react-router-dom'
import { Mail, MapPin, Send } from 'lucide-react'
import './Footer.css'

function Footer() {
  return (
    <footer id="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand & Socials */}
          <div className="footer-brand">
            <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
              <span className="nav-logo-text">Simtech<span>ON</span></span>
            </Link>
            <p>Professional IT solutions for businesses across the world. Keeping your infrastructure secure and efficient.</p>
            <div className="footer-socials">
              <a href="#" className="social-btn" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="#" className="social-btn" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="social-btn" aria-label="X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/jobs">Job Portal</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/login">Employee Portal</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={18} />
                <a href="mailto:info@simtechon.com">info@simtechon.com</a>
              </div>
              <div className="contact-item">
                <MapPin size={18} />
                <span>Dublin, Ireland</span>
              </div>
            </div>

            <div className="footer-newsletter">
              <h5>Newsletter</h5>
              <form className="mini-newsletter" onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder="Your email" />
                <button type="submit">
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 SimtechON IT Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
