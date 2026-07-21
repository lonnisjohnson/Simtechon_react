import { Link } from 'react-router-dom'
import { CheckCircle, ArrowRight } from 'lucide-react'
import './Services.css'

const services = [
  {
    id: 'hardware',
    title: 'Hardware Support',
    img: '/assets/hardware.jpg',
    alt: 'Hardware Support',
    desc: 'Expert troubleshooting, installation, and repairs for all your IT hardware. We ensure your devices are performing at their peak with minimal downtime, providing reliable fixes and proactive maintenance.',
    features: ['Troubleshooting & Repairs', 'Component Upgrades', 'New System Installation'],
    reverse: false,
  },
  {
    id: 'network',
    title: 'Network Support',
    img: '/assets/network.jpg',
    alt: 'Network Support',
    desc: 'Comprehensive network setup, maintenance, and troubleshooting. We cater to both small businesses and large enterprises with secure, scalable solutions that keep your team connected and productive.',
    features: ['Secure Network Design', 'VPN & Remote Access', 'WiFi Optimization'],
    reverse: true,
  },
  {
    id: 'software',
    title: 'Software Support',
    img: '/assets/software.jpg',
    alt: 'Software Support',
    desc: 'Professional assistance for operating systems, office suites, and essential business software. We help you stay updated, secure, and fully optimized for your daily workflows.',
    features: ['OS Installation & Updates', 'Office Suite Support', 'Malware Protection'],
    reverse: false,
  },
  {
    id: 'manpower',
    title: 'IT Manpower Supply',
    img: '/assets/ITmanpower.jpg',
    alt: 'IT Manpower Supply',
    desc: 'Skilled IT professionals for short and long-term assignments. We provide the expertise you need to scale your team quickly and efficiently, matching the right talent to your specific project needs.',
    features: ['Specialized IT Experts', 'Short & Long-term Contracts', 'Rapid Team Scaling'],
    reverse: true,
  },
  {
    id: 'project',
    title: 'Project Undertaking',
    img: '/assets/project.jpg',
    alt: 'Project Undertaking',
    desc: 'Strategic project management and IT consultancy for complex IT projects. We deliver customized solutions from planning to execution, ensuring your digital transformation is seamless.',
    features: ['End-to-end Management', 'Strategic Consultancy', 'Digital Transformation'],
    reverse: false,
  },
  {
    id: 'remote',
    title: 'Remote Support',
    img: '/assets/remote_support.jpg',
    alt: 'Remote Support',
    desc: 'Quick and effective resolution of diverse IT issues via secure remote access. Get expert help instantly without waiting for an onsite visit, saving time and costs.',
    features: ['Instant Connectivity', '24/7 Availability', 'Secure Connections'],
    reverse: true,
  },
  {
    id: 'onsite',
    title: 'Onsite Support',
    img: '/assets/onsite_support.jpg',
    alt: 'Onsite Support',
    desc: 'Physical IT presence for complex setups and emergency call-outs. Our experts come to you to resolve challenges that require hands-on attention and deep technical knowledge.',
    features: ['Emergency Call-outs', 'Physical Infrastructure', 'On-site Maintenance'],
    reverse: false,
  },
]

function Services() {
  return (
    <div>
      {/* ─── PAGE HERO BANNER ─── */}
      <div className="services-hero-banner">
        <div className="hero-banner-overlay"></div>
        <div className="hero-banner-shapes">
          <div className="shape s1"></div>
          <div className="shape s2"></div>
        </div>
        <div className="container hero-banner-content">
          <h1 className="fade-up">
            World-Class IT Support<br />
            <span>Built for Your Success</span>
          </h1>
          <p className="fade-up">
            Explore our comprehensive range of services designed to secure, scale, and optimize your
            business infrastructure worldwide.
          </p>
        </div>
      </div>

      {/* ─── OUR SERVICES ─── */}
      <section id="services">
        <div className="container">
          <div className="section-header fade-up">
            <h2 className="section-title"><span className="text-blue">Services</span> that we provide</h2>
          </div>

          <div className="services-list">
            {services.map(svc => (
              <div key={svc.id} className={`svc-row${svc.reverse ? ' svc-reverse' : ''} fade-up`}>
                <div className="svc-image">
                  <img src={svc.img} alt={svc.alt} />
                </div>
                <div className="svc-content">
                  <h3>{svc.title}</h3>
                  <p>{svc.desc}</p>
                  <ul className="svc-features">
                    {svc.features.map((f, i) => (
                      <li key={i}>
                        <CheckCircle size={18} /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact" className="btn-svc-quote">
                     Request a Quote
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services
