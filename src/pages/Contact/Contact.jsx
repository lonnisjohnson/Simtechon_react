import { useState, useRef } from 'react'
import { ChevronDown, MapPin, Mail, CheckCircle, AlertTriangle } from 'lucide-react'
import './Contact.css'

const W3F_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY

const serviceOptions = [
  { value: 'hardware', label: 'Hardware Support' },
  { value: 'network', label: 'Network Support' },
  { value: 'software', label: 'Software Support' },
  { value: 'manpower', label: 'IT Manpower Supply' },
  { value: 'projects', label: 'Project Undertaking' },
  { value: 'remote', label: 'Remote Support' },
  { value: 'onsite', label: 'Onsite Support' },
  { value: 'career', label: 'Career' }
]

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [selectedService, setSelectedService] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [popup, setPopup] = useState(null) // null | 'loading' | 'success' | 'error'
  const triggerRef = useRef(null)

  const handleSelect = (val, label) => {
    setSelectedService(val)
    setDropdownOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedService) {
      if (triggerRef.current) {
        triggerRef.current.style.borderColor = '#ef4444'
        triggerRef.current.style.boxShadow = '0 0 0 4px rgba(239,68,68,0.15)'
        setTimeout(() => {
          triggerRef.current.style.borderColor = ''
          triggerRef.current.style.boxShadow = ''
        }, 3000)
      }
      return
    }

    setPopup('loading')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: W3F_KEY,
          name:       form.name,
          email:      form.email,
          subject:    form.subject,
          service:    selectedService,
          message:    form.message,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setPopup('success')
        setForm({ name: '', email: '', subject: '', message: '' })
        setSelectedService('')
      } else {
        console.error('Web3Forms error:', data)
        setPopup('error')
      }
    } catch (error) {
      console.error('Web3Forms fetch error:', error)
      setPopup('error')
    }
  }

  const closePopup = () => setPopup(null)

  const selectedLabel = serviceOptions.find(o => o.value === selectedService)?.label || 'Select a service'

  return (
    <div>
      {/* ─── HERO + CONTACT FORM ─── */}
      <section id="hero-contact">
        <div className="hero-banner-shapes">
          <div className="shape s1"></div>
          <div className="shape s2"></div>
        </div>
        <div className="container hero-contact-inner">
          <div className="hero-contact-text">
            <h1>Let's Build Your<br /><span>Digital Future</span></h1>
            <p>Whether you have a quick question or a complex project in mind, our team of experts is ready to help
              you scale and secure your IT infrastructure.</p>
          </div>

          <div className="contact-card" id="contact-form">
            <form id="contactForm" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <input
                    type="text"
                    id="cf-name"
                    placeholder="Enter your name"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    id="cf-email"
                    placeholder="Enter your email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>

              {/* Custom Select */}
              <div className="form-group">
                <div className="custom-select-wrapper">
                  <div className={`custom-select${dropdownOpen ? ' open' : ''}`}>
                    <div
                      ref={triggerRef}
                      className={`custom-select-trigger${selectedService ? ' has-value' : ''}`}
                      onClick={() => setDropdownOpen(o => !o)}
                    >
                      <span>{selectedLabel}</span>
                      <ChevronDown size={20} />
                    </div>
                    {dropdownOpen && (
                      <div className="custom-options">
                        {serviceOptions.map(opt => (
                          <span
                            key={opt.value}
                            className={`custom-option${selectedService === opt.value ? ' selected' : ''}`}
                            onClick={() => handleSelect(opt.value, opt.label)}
                          >
                            {opt.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  id="cf-subject"
                  placeholder="Enter subject"
                  required
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <textarea
                  id="cf-message"
                  placeholder="Write your message here"
                  required
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                ></textarea>
              </div>
              <button type="submit" className="btn-submit" id="cf-send">Send Message →</button>
            </form>
          </div>
        </div>
      </section>

      {/* ─── OUR LOCATION ─── */}
      <section id="location">
        <div className="container">
          <div className="location-grid">
            <div className="location-info">
              <span className="section-label">Where to find us</span>
              <h2>Our Location</h2>
              <p>Find us in the heart of Ireland, ready to support your IT needs wherever you are.</p>

              <div className="loc-detail">
                <div className="loc-detail-icon">
                  <MapPin size={22} />
                </div>
                <div className="loc-detail-body">
                  <strong>Address</strong>
                  <span>Dublin 15, Ireland</span>
                </div>
              </div>

              <div className="loc-detail">
                <div className="loc-detail-icon">
                  <Mail size={22} />
                </div>
                <div className="loc-detail-body">
                  <strong>Email</strong>
                  <span>info@simtechon.com</span>
                </div>
              </div>

              <div className="social-links-wrap">
                <strong>Follow Us</strong>
                <div className="social-grid">
                  <a href="#" className="social-link" title="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a href="#" className="social-link" title="Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a href="#" className="social-link" title="Twitter">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a href="#" className="social-link" title="Instagram">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="map-wrap">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d38126.34610765784!2d-6.440168!3d53.39505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48670e8b8ac3cbe1%3A0xa00c7a9973171a0!2sDublin%2015%2C%20Dublin%2C%20Ireland!5e0!3m2!1sen!2sie!4v1680000000000"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SimtechON Office Location - Dublin 15"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SUBMISSION POPUP ─── */}
      {popup && (
        <div className={`popup-overlay${popup ? ' active' : ''}`} onClick={e => { if (e.target.classList.contains('popup-overlay')) closePopup() }}>
          <div className="popup-card">
            <button className="popup-close" onClick={closePopup}>&times;</button>
            <div className="popup-content">
              {popup === 'loading' && (
                <div className="popup-state active">
                  <div className="popup-spinner"></div>
                  <h3>Sending Message</h3>
                  <p>Please wait while we secure your request and send it to our team.</p>
                </div>
              )}
              {popup === 'success' && (
                <div className="popup-state active">
                  <div className="success-icon-wrap">
                    <CheckCircle size={48} />
                  </div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We have received your enquiry and will reply shortly.</p>
                  <button className="btn-popup-action" onClick={closePopup}>Done</button>
                </div>
              )}
              {popup === 'error' && (
                <div className="popup-state active">
                  <div className="error-icon-wrap">
                    <AlertTriangle size={48} />
                  </div>
                  <h3>Failed to Send</h3>
                  <p>There was a problem delivering your message. Please try again or email us directly.</p>
                  <button className="btn-popup-action btn-popup-error" onClick={closePopup}>Try Again</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Contact
