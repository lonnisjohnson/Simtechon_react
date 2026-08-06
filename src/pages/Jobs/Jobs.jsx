import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock, Briefcase, AlertCircle } from 'lucide-react'
import { API_BASE } from '../../config.js'
import './Jobs.css'

function Jobs() {
  const [jobs, setJobs] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'

  useEffect(() => {
    setStatus('loading')
    fetch(`${API_BASE}/api/jobs`)
      .then(r => r.json())
      .then(data => {
        // Only show Active jobs on the public portal
        setJobs(data.filter(j => j.status === 'Active'))
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [])

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

            {/* Loading skeletons */}
            {status === 'loading' && Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="job-card job-card--skeleton">
                <div className="job-info">
                  <div className="skeleton-line skeleton-title" />
                  <div className="skeleton-meta">
                    <div className="skeleton-line skeleton-chip" />
                    <div className="skeleton-line skeleton-chip" />
                    <div className="skeleton-line skeleton-badge" />
                  </div>
                </div>
                <div className="skeleton-line skeleton-btn" />
              </div>
            ))}

            {/* Error state */}
            {status === 'error' && (
              <div className="jobs-empty">
                <AlertCircle size={40} />
                <h3>Could not load jobs</h3>
                <p>Unable to reach the server. Please try again later.</p>
              </div>
            )}

            {/* Empty state */}
            {status === 'success' && jobs.length === 0 && (
              <div className="jobs-empty">
                <Briefcase size={40} />
                <h3>No openings right now</h3>
                <p>We don't have any active positions at the moment. Check back soon!</p>
              </div>
            )}

            {/* Job cards */}
            {status === 'success' && jobs.map((job, i) => (
              <div
                key={job.job_id}
                className={`job-card fade-up${i === 1 ? ' fade-up-d1' : i === 2 ? ' fade-up-d2' : ''}`}
              >
                <div className="job-info">
                  <h3>{job.title}</h3>
                  <div className="job-meta">
                    {job.location && (
                      <div className="job-meta-item">
                        <MapPin size={16} />
                        <span>{job.location}</span>
                      </div>
                    )}
                    {job.employment_type && (
                      <div className="job-meta-item">
                        <Clock size={16} />
                        <span>{job.employment_type}</span>
                      </div>
                    )}
                    {job.department && (
                      <span className="job-badge">{job.department}</span>
                    )}
                  </div>
                </div>
                <div className="job-apply">
                  <Link to={`/jobs/${job.job_id}`} className="btn-outline">Apply Now →</Link>
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
