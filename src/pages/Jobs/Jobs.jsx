import { Link } from 'react-router-dom'
import { MapPin, Clock } from 'lucide-react'
import './Jobs.css'

const jobs = [
  { id: 'it-support-specialist', title: 'IT Support Specialist', location: 'Dublin (On-site)', type: 'Full-time', badge: 'Technical' },
  { id: 'network-engineer', title: 'Network Engineer', location: 'Remote / Hybrid', type: 'Full-time', badge: 'Network' },
  { id: 'help-desk-analyst', title: 'Help Desk Analyst', location: 'London (Hybrid)', type: 'Contract', badge: 'Support' },
]

function Jobs() {
  return (
    <div>
      {/* ─── PAGE HERO BANNER ─── */}
      <div className="page-hero-banner">
        <div className="hero-banner-overlay"></div>
        <div className="hero-banner-shapes">
          <div className="shape s1"></div>
          <div className="shape s2"></div>
        </div>
        <div className="container hero-banner-content">
          <h1 className="fade-up">
            Job Portal<br />
            <span>Hire or Get Hired</span>
          </h1>
          <p className="fade-up">
            Find the right IT talent or showcase your skills to potential employers. Join a team
            dedicated to excellence.
          </p>
        </div>
      </div>

      {/* ─── CURRENT OPENINGS ─── */}
      <section id="openings">
        <div className="container">
          <div className="section-header fade-up">
            <h2 className="section-title">Explore <span className="text-blue">Opportunities</span></h2>
            <p className="section-sub">Find the role that matches your skills and passions.</p>
          </div>

          <div className="jobs-container">
            {jobs.map((job, i) => (
              <div key={i} className={`job-card fade-up${i === 1 ? ' fade-up-d1' : i === 2 ? ' fade-up-d2' : ''}`}>
                <div className="job-info">
                  <h3>{job.title}</h3>
                  <div className="job-meta">
                    <div className="job-meta-item">
                       <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                    <div className="job-meta-item">
                       <Clock size={16} />
                      <span>{job.type}</span>
                    </div>
                    <span className="job-badge">{job.badge}</span>
                  </div>
                </div>
                <div className="job-apply">
                  <Link to={`/jobs/${job.id}`} className="btn-outline">Apply Now →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Jobs
