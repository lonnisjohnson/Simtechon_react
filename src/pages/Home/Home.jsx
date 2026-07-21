import { Link } from 'react-router-dom'
import { Cpu, Network, Settings, BadgeCheck, PenTool, MonitorSmartphone, MapPin, Globe, Timer, Headphones, Award, Quote } from 'lucide-react'
import './Home.css'

function Home() {
  return (
    <div>
      {/* ─── HERO ─── */}
      <section id="hero">
        <div className="hero-bg"></div>
        <div className="container hero-content">
          <h1 className="hero-title">
            Expert IT Support Solutions<br />
            <span className="accent">for Businesses Worldwide</span>
          </h1>
          <p className="hero-sub">
            We provide hardware, network, software support, and more to help
            your business thrive
          </p>
          <div className="hero-actions">
            <Link to="/contact" className="btn-primary" id="hero-get-help">
              Request a Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* ─── OUR SERVICES ─── */}
      <section id="services">
        <div className="container">
          <div className="wcu-header fade-up">
            <h2 className="wcu-title">Our <span className="text-blue">Services</span></h2>
          </div>

          <div className="services-grid">
            <div className="service-card fade-up" id="service-hardware">
              <div className="service-card-icon">
                <Cpu size={32} />
              </div>
              <h3>Hardware Support</h3>
              <p>Reliable IT hardware troubleshooting and repairs to keep your business running smoothly.</p>
            </div>

            <div className="service-card fade-up fade-up-d1" id="service-network">
              <div className="service-card-icon">
                <Network size={32} />
              </div>
              <h3>Network Support</h3>
              <p>Robust network architecture and support for secure, high-speed business connectivity.</p>
            </div>

            <div className="service-card fade-up fade-up-d2" id="service-software">
              <div className="service-card-icon">
                <Settings size={32} />
              </div>
              <h3>Software Support</h3>
              <p>Expert assistance with software installation, configuration, and critical updates.</p>
            </div>

            <div className="service-card fade-up" id="service-manpower">
              <div className="service-card-icon">
                <BadgeCheck size={32} />
              </div>
              <h3>IT Manpower Supply</h3>
              <p>Scale your team with top-tier IT professionals tailored to your specific project needs.</p>
            </div>

            <div className="service-card fade-up fade-up-d1" id="service-projects">
              <div className="service-card-icon">
                <PenTool size={32} />
              </div>
              <h3>Project Undertaking</h3>
              <p>End-to-end management of complex IT projects from initial planning to final delivery.</p>
            </div>

            <div className="service-card fade-up fade-up-d2" id="service-remote">
              <div className="service-card-icon">
                <MonitorSmartphone size={32} />
              </div>
              <h3>Remote Support</h3>
              <p>Instant, secure remote troubleshooting to resolve IT issues without the need for travel.</p>
            </div>

            <div className="service-card fade-up" id="service-onsite">
              <div className="service-card-icon">
                <MapPin size={32} />
              </div>
              <h3>Onsite Support</h3>
              <p>Our experts come directly to your location to handle hardware installations, complex networking,
                and physical IT infrastructure maintenance with minimal disruption.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section id="why-choose-us">
        <div className="container">
          <div className="wcu-header fade-up">
            <h2 className="wcu-title">Why <span className="text-blue">SimtechON</span> is The Right Choice for You</h2>
          </div>

          <div className="wcu-bento-grid">
            <div className="wcu-box wcu-box--light fade-up">
              <div className="wcu-icon-circle">
                <Globe size={24} />
              </div>
              <h3>Global Expertise</h3>
              <p>Based in Ireland, we serve clients across the globe with professional IT solutions. We bridge the
                gap between world-class standards and personalized local support.</p>
            </div>

            <div className="wcu-box wcu-box--light fade-up fade-up-d1">
              <div className="wcu-icon-circle">
                <Timer size={24} />
              </div>
              <h3>Timely Solutions</h3>
              <p>We understand that downtime is costly. Our team is committed to providing rapid response and
                efficient resolutions for businesses of all sizes.</p>
            </div>

            <div className="wcu-box wcu-box--light fade-up fade-up-d2">
              <div className="wcu-icon-circle">
                <Headphones size={24} />
              </div>
              <h3>Tailored Solutions</h3>
              <p>Whether you need on-site presence or rapid remote assistance, we offer flexible support models
                that adapt to your specific workflow and business objectives.</p>
            </div>

            <div className="wcu-box wcu-box--light wcu-box--wide fade-up fade-up-d3">
              <div className="wcu-icon-circle">
                <Award size={24} />
              </div>
              <div className="wcu-content-wrap">
                <h3>Expert Team</h3>
                <p>Our professionals bring years of industry expertise and certifications, delivering quality
                  you can trust for your critical IT infrastructure. We provide practical, hands-on solutions
                  to keep your business competitive in today's tech landscape.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials">
        <div className="container">
          <div className="wcu-header fade-up">
            <h2 className="wcu-title">What our <span className="text-blue">clients</span> say</h2>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card fade-up">
              <div className="testimonial-quote">
                <Quote size={28} />
              </div>
              <p className="testimonial-text">"SimtechON has been a game-changer for our IT infrastructure. Their
                remote support is incredibly fast and reliable. Highly recommended!"</p>
              <div className="testimonial-author">
                <img src="https://i.pravatar.cc/150?u=sarah" alt="Sarah Jenkins" />
                <div className="author-info">
                  <h4>Sarah Jenkins</h4>
                  <span>CEO, TechFlow</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card fade-up fade-up-d1">
              <div className="testimonial-quote">
                <Quote size={28} />
              </div>
              <p className="testimonial-text">"The onsite support team is professional and highly skilled. They
                resolved our complex network issues within hours. Truly experts."</p>
              <div className="testimonial-author">
                <img src="https://i.pravatar.cc/150?u=david" alt="David Chen" />
                <div className="author-info">
                  <h4>David Chen</h4>
                  <span>Operations Manager</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card fade-up fade-up-d2">
              <div className="testimonial-quote">
                <Quote size={28} />
              </div>
              <p className="testimonial-text">"We've been using their IT manpower supply for 6 months. The quality of
                professionals they provide is top-notch and fits our culture perfectly."</p>
              <div className="testimonial-author">
                <img src="https://i.pravatar.cc/150?u=elena" alt="Elena Rodriguez" />
                <div className="author-info">
                  <h4>Elena Rodriguez</h4>
                  <span>HR Director, GlobalScale</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
export default Home