import { Link } from 'react-router-dom'
import { MapPin, Package, TrendingUp, ShieldCheck, CheckCircle, Headphones, PenTool } from 'lucide-react'
import './About.css'

function About() {
  return (
    <div>
      {/* ─── HERO ─── */}
      <section id="about-hero">
        <div className="hero-bg"></div>
        <div className="container hero-content">
          <div className="hero-text fade-up">
            <h1 className="hero-title">
              Reliable IT Support for<br />
              <span className="accent">Growing Businesses</span>
            </h1>
            <p className="hero-sub">Your partner in Ireland for easy and efficient IT solutions.</p>
          </div>
        </div>
      </section>

      {/* ─── ABOUT SIMTECHON ─── */}
      <section id="about-story">
        <div className="container">
          <div className="wcu-header fade-up">
            <h2 className="wcu-title">About <span className="text-blue">SimtechON</span></h2>
          </div>
          <div className="about-body fade-up">
            <p>SimtechON delivers practical IT support to businesses that want reliability and results. Our Irish-based support team is dedicated to helping SMEs and growing organisations overcome their technology challenges.</p>
            <p>We focus on customer outcomes, offering hardware, network, software, IT staffing, and remote assistance services whenever and wherever you need them.</p>
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section id="why-choose-us">
        <div className="container">
          <div className="wcu-header fade-up">
            <h2 className="wcu-title">Why <span className="text-blue">SimtechON</span> is The Right Choice</h2>
          </div>

          <div className="wcu-bento-grid">
            <div className="wcu-box wcu-box--light fade-up">
              <div className="wcu-icon-circle">
                <MapPin size={24} />
              </div>
              <h3>Local Expertise</h3>
              <p>Our support team is based in Ireland, ready to respond quickly and understand your business needs with personalized local support.</p>
            </div>

            <div className="wcu-box wcu-box--light fade-up fade-up-d1">
              <div className="wcu-icon-circle">
                <Package size={24} />
              </div>
              <h3>Comprehensive Solutions</h3>
              <p>We cover all aspects of IT, so you get one trusted partner for everything from hardware to staffing and managed services.</p>
            </div>

            <div className="wcu-box wcu-box--light fade-up fade-up-d2">
              <div className="wcu-icon-circle">
                <TrendingUp size={24} />
              </div>
              <h3>Outcome-Focused Service</h3>
              <p>Your results matter most. We work with you to achieve practical improvements that support your long-term growth.</p>
            </div>

            <div className="wcu-box wcu-box--light wcu-box--wide fade-up fade-up-d3">
              <div className="wcu-icon-circle">
                <ShieldCheck size={24} />
              </div>
              <div className="wcu-content-wrap">
                <h3>Trust &amp; Reassurance</h3>
                <p>Since 2008, organisations have relied on SimtechON for dependable IT support. Our Irish-based team is always on hand, responding quickly and working with care. We put customer outcomes at the centre of everything we do, so you can focus on your business with confidence.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHAT WE DELIVER ─── */}
      <section id="our-services-list" className="alt-bg">
        <div className="container">
          <div className="wcu-header fade-up">
            <h2 className="wcu-title">What We <span className="text-blue">Deliver</span></h2>
          </div>

          <div className="services-list-grid">
            {[
              'Hardware supply, installation, and maintenance',
              'Network setup, monitoring, and security',
              'Software deployment and ongoing support',
              'IT staffing and employment solutions',
              'Remote technical assistance',
              'Managed IT services for SMEs',
            ].map((item, i) => (
              <div key={i} className={`service-item fade-up${i % 3 === 1 ? ' fade-up-d1' : i % 3 === 2 ? ' fade-up-d2' : ''}`}>
                <CheckCircle size={24} />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OUR PROCESS ─── */}
      <section id="how-we-work">
        <div className="container">
          <div className="wcu-header fade-up">
            <h2 className="wcu-title">Our <span className="text-blue">Process</span></h2>
          </div>

          <div className="process-steps">
            <div className="step-card fade-up">
              <div className="step-icon-wrap">
                <div className="step-icon">
                  <Headphones size={24} />
                </div>
              </div>
              <h3>Consultation</h3>
              <p>We listen carefully to your needs and assess your current IT setup to find the best path forward.</p>
            </div>

            <div className="step-connector fade-up fade-up-d1"></div>

            <div className="step-card fade-up fade-up-d1">
              <div className="step-icon-wrap">
                <div className="step-icon">
                  <PenTool size={24} />
                </div>
              </div>
              <h3>Solution Design</h3>
              <p>Our experts design and deliver tailored solutions that fit your unique business goals and budget.</p>
            </div>

            <div className="step-connector fade-up fade-up-d2"></div>

            <div className="step-card fade-up fade-up-d2">
              <div className="step-icon-wrap">
                <div className="step-icon">
                  <Headphones size={24} />
                </div>
              </div>
              <h3>Ongoing Support</h3>
              <p>We provide continuous monitoring and rapid support, ensuring your IT runs smoothly as you grow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section id="about-cta">
        <div className="cta-card fade-up">
          <div className="cta-glow"></div>
          <div className="cta-content">
            <h2 className="wcu-title" style={{ color: 'black', marginBottom: '1.5rem', marginTop: '1.5rem' }}>
              Ready to <span style={{ color: 'var(--blue-400)' }}>Transform</span> Your IT?
            </h2>
            <p style={{ color: 'black', marginBottom: '3rem', fontSize: '1.15rem', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
              Let's make your IT simple and reliable. Contact SimtechON today and see how we help businesses thrive.
            </p>
            <div className="cta-actions">
              <Link to="/contact" className="btn-white">Contact SimtechON</Link>
              <Link to="/services" className="btn-ghost-white">View Services</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
