import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  MapPin, Clock, ArrowLeft, CheckCircle, Users,
  Star, MessageSquare, DollarSign, Calendar, AlertCircle,
} from 'lucide-react'
import { API_BASE } from '../../config.js'
import './JobDetail.css'

// Split a newline-separated string from the DB into a clean array
function parseLines(str) {
  if (!str) return []
  return str.split('\n').map(s => s.trim()).filter(Boolean)
}

function JobDetail() {
  const { jobId } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error' | 'not-found'

  useEffect(() => {
    setStatus('loading')
    fetch(`${API_BASE}/api/jobs`)
      .then(r => r.json())
      .then(data => {
        const found = data.find(j => j.job_id === jobId)
        if (!found) {
          setStatus('not-found')
        } else {
          setJob(found)
          setStatus('success')
        }
      })
      .catch(() => setStatus('error'))
  }, [jobId])

  // ── Loading ──────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div>
        <div className="jd-hero-banner">
          <div className="jd-hero-overlay" />
          <div className="jd-hero-shapes"><div className="shape s1" /><div className="shape s2" /></div>
          <div className="container jd-hero-content">
            <button className="jd-back-pill fade-up" onClick={() => navigate('/jobs')}>
              <ArrowLeft size={15} /> All Openings
            </button>
            <div className="jd-skeleton-hero">
              <div className="skeleton-line" style={{ width: '60%', height: '3rem', marginBottom: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.2)' }} />
              <div className="skeleton-line" style={{ width: '35%', height: '1.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.15)' }} />
            </div>
          </div>
        </div>
        <section><div className="container" style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>Loading job details…</div></section>
      </div>
    )
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="jd-not-found">
        <AlertCircle size={40} style={{ color: 'var(--blue-400)' }} />
        <h2>Could not load job</h2>
        <p>Unable to reach the server. Please try again later.</p>
        <button className="jd-back-btn-plain" onClick={() => navigate('/jobs')}>
          <ArrowLeft size={16} /> Back to Jobs
        </button>
      </div>
    )
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (status === 'not-found') {
    return (
      <div className="jd-not-found">
        <h2>Job Not Found</h2>
        <button className="jd-back-btn-plain" onClick={() => navigate('/jobs')}>
          <ArrowLeft size={16} /> Back to Jobs
        </button>
      </div>
    )
  }

  // ── Parse text fields from DB (newline-separated strings) ─────────────────
  const responsibilities = parseLines(job.key_responsibilities)
  const requirements     = parseLines(job.looking_for)
  const niceToHave       = parseLines(job.nice_to_have)
  const perks            = parseLines(job.what_we_offer)

  // Format the posted date
  const postedDate = job.created_at
    ? new Date(job.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div>
      {/* ─── HERO ─── */}
      <div className="jd-hero-banner">
        <div className="jd-hero-overlay" />
        <div className="jd-hero-shapes">
          <div className="shape s1" />
          <div className="shape s2" />
        </div>
        <div className="container jd-hero-content">
          <button className="jd-back-pill fade-up" onClick={() => navigate('/jobs')}>
            <ArrowLeft size={15} /> All Openings
          </button>
          <h1 className="fade-up">
            {job.title}<br />
            {job.department && <span>{job.department}</span>}
          </h1>
          <div className="jd-hero-meta fade-up">
            {job.location      && <span className="jd-meta-chip"><MapPin size={14} /> {job.location}</span>}
            {job.employment_type && <span className="jd-meta-chip"><Clock size={14} /> {job.employment_type}</span>}
            {job.experience    && <span className="jd-meta-chip"><Users size={14} /> {job.experience}</span>}
            {job.payment_range && <span className="jd-meta-chip jd-salary-chip"><DollarSign size={14} /> {job.payment_range}</span>}
          </div>
        </div>
      </div>

      {/* ─── ABOUT THE ROLE ─── */}
      {job.about_role && (
        <section id="jd-about">
          <div className="container">
            <div className="wcu-header fade-up">
              <h2 className="wcu-title">About the <span className="text-blue">Role</span></h2>
            </div>
            <div className="jd-about-body fade-up">
              <p>{job.about_role}</p>
            </div>
          </div>
        </section>
      )}

      {/* ─── RESPONSIBILITIES ─── */}
      {responsibilities.length > 0 && (
        <section id="jd-responsibilities" className="jd-alt-bg">
          <div className="container">
            <div className="wcu-header fade-up">
              <h2 className="wcu-title">Key <span className="text-blue">Responsibilities</span></h2>
            </div>
            <div className="jd-bento-grid fade-up">
              {responsibilities.map((r, i) => (
                <div key={i} className="jd-resp-card">
                  <div className="wcu-icon-circle"><CheckCircle size={22} /></div>
                  <p>{r}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── REQUIREMENTS ─── */}
      {requirements.length > 0 && (
        <section id="jd-requirements">
          <div className="container">
            <div className="wcu-header fade-up">
              <h2 className="wcu-title">What We're <span className="text-blue">Looking For</span></h2>
            </div>
            <div className="jd-req-list fade-up">
              {requirements.map((r, i) => (
                <div key={i} className="jd-req-item">
                  <CheckCircle size={20} className="jd-check-icon" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── NICE TO HAVE ─── */}
      {niceToHave.length > 0 && (
        <section id="jd-nice" className="jd-alt-bg">
          <div className="container">
            <div className="wcu-header fade-up">
              <h2 className="wcu-title">Nice to <span className="text-blue">Have</span></h2>
            </div>
            <div className="jd-req-list fade-up">
              {niceToHave.map((r, i) => (
                <div key={i} className="jd-req-item jd-req-item--star">
                  <Star size={18} className="jd-star-icon" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── PERKS ─── */}
      {perks.length > 0 && (
        <section id="jd-perks">
          <div className="container">
            <div className="wcu-header fade-up">
              <h2 className="wcu-title">What We <span className="text-blue">Offer</span></h2>
            </div>
            <div className="jd-perks-grid fade-up">
              {perks.map((p, i) => (
                <div key={i} className="jd-perk-card">
                  <div className="wcu-icon-circle"><CheckCircle size={22} /></div>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── APPLY CTA ─── */}
      <section id="jd-apply-cta">
        <div className="cta-card fade-up">
          <div className="cta-glow" />
          <div className="cta-content">
            <div className="jd-apply-icon-wrap">
              <MessageSquare size={32} />
            </div>
            <h2 className="wcu-title" style={{ color: 'black', marginBottom: '1rem', marginTop: '1rem' }}>
              Interested in this <span style={{ color: 'var(--blue-400)' }}>Position?</span>
            </h2>
            <p className="jd-apply-desc">
              To register your interest for the <strong>{job.title}</strong> role, send us a message
              through our <strong>Contact page</strong>. Our HR team will respond within{' '}
              <strong>2–3 business days</strong>.
            </p>
            {postedDate && (
              <div className="jd-posted-row">
                <Calendar size={14} />
                <span>Posted: {postedDate}</span>
              </div>
            )}
            <div className="cta-actions">
              <Link to="/contact" className="btn-white">
                <MessageSquare size={16} /> Apply via Contact Page
              </Link>
              <button className="btn-ghost-white" onClick={() => navigate('/jobs')}>
                <ArrowLeft size={16} /> View All Jobs
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default JobDetail
