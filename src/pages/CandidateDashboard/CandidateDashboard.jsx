import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API_BASE } from '../../config.js'
import './CandidateDashboard.css'

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmt(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtTime(t) {
  if (!t) return '—'
  const [h, m] = t.split(':')
  const hour = parseInt(h, 10)
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`
}

const STATUS_META = {
  Pending: { class: 'cd-status--pending', label: 'Pending' },
  Shortlisted: { class: 'cd-status--shortlisted', label: 'Shortlisted' },
  Selected: { class: 'cd-status--selected', label: 'Selected' },
  Rejected: { class: 'cd-status--rejected', label: 'Rejected' },
}

// ── Main Component ───────────────────────────────────────────────────────────
function CandidateDashboard() {
  const navigate = useNavigate()
  const [candidate, setCandidate] = useState(null)
  const [activeView, setActiveView] = useState('applications')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Auth guard
  useEffect(() => {
    const stored = sessionStorage.getItem('candidate')
    if (!stored) { navigate('/candidate-login'); return }
    setCandidate(JSON.parse(stored))
  }, [navigate])

  // Refresh candidate data from API
  const refresh = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/candidates/${id}`)
      if (res.ok) {
        const fresh = await res.json()
        sessionStorage.setItem('candidate', JSON.stringify(fresh))
        setCandidate(fresh)
      }
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    if (candidate?.id) refresh(candidate.id)
  }, [candidate?.id, refresh])

  const handleLogout = () => {
    sessionStorage.removeItem('candidate')
    navigate('/candidate-login')
  }

  if (!candidate) return null

  const statusMeta = STATUS_META[candidate.status] || STATUS_META['Pending']
  const qualifications = (() => {
    try { return Array.isArray(candidate.qualifications) ? candidate.qualifications : JSON.parse(candidate.qualifications || '[]') }
    catch { return [] }
  })()

  const navItems = [
    { id: 'applications', icon: 'description',    label: 'Applications' },
    { id: 'profile',      icon: 'person',          label: 'My Profile' },
  ]

  return (
    <div className="cd-root">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      {sidebarOpen && <div className="cd-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`cd-sidebar${sidebarOpen ? ' cd-sidebar--open' : ''}`}>
        <div className="cd-sidebar-brand">
          <Link to="/" className="cd-brand-link">Simtech<span>ON</span></Link>
        </div>

        {/* Avatar */}
        <div className="cd-sidebar-avatar">
          <div className="cd-avatar-circle">
            {candidate.first_name?.[0]}{candidate.last_name?.[0]}
          </div>
          <div className="cd-avatar-info">
            <strong>{candidate.first_name} {candidate.last_name}</strong>
          </div>
        </div>

        {/* Nav */}
        <nav className="cd-sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`cd-nav-btn${activeView === item.id ? ' active' : ''}`}
              onClick={() => { setActiveView(item.id); setSidebarOpen(false) }}
            >
              <span className="material-symbols-rounded">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout at bottom */}
        <div className="cd-sidebar-footer">
          <button className="cd-logout-btn" onClick={handleLogout}>
            <span className="material-symbols-rounded">logout</span>
            Log Out
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────── */}
      <div className="cd-main">
        {/* Topbar */}
        <header className="cd-topbar">
          <button className="cd-hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
          <h1 className="cd-topbar-title">
            {activeView === 'applications' ? 'My Applications' : 'My Profile'}
          </h1>
        </header>

        <div className="cd-content">
          {activeView === 'applications' && (
            <ApplicationsView candidate={candidate} statusMeta={statusMeta} qualifications={qualifications} />
          )}
          {activeView === 'profile' && (
            <ProfileView candidate={candidate} qualifications={qualifications} onSave={() => refresh(candidate.id)} />
          )}
        </div>
      </div>
    </div>
  )
}

// ── Applications View ─────────────────────────────────────────────────────────
function ApplicationsView({ candidate, statusMeta }) {
  return (
    <div className="cd-view">
      {/* Application card */}
      <h2 className="cd-section-title">Application Details</h2>
      <div className="cd-app-card">
        <div className="cd-app-card-row">
          <div className="cd-app-field">
            <span className="material-symbols-rounded">work</span>
            <div>
              <label>Applied For</label>
              <strong>{candidate.applied_for || '—'}</strong>
            </div>
          </div>
          <div className="cd-app-field">
            <span className="material-symbols-rounded">badge</span>
            <div>
              <label>Candidate ID</label>
              <strong>{candidate.id}</strong>
            </div>
          </div>
          <div className="cd-app-field">
            <span className="material-symbols-rounded">calendar_today</span>
            <div>
              <label>Submitted</label>
              <strong>{fmt(candidate.submitted_at)}</strong>
            </div>
          </div>
          <div className="cd-app-field">
            <span className="material-symbols-rounded">info</span>
            <div>
              <label>Status</label>
              <span className={`cd-badge ${statusMeta.class}`}>{statusMeta.label}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Profile View ──────────────────────────────────────────────────────────────
function ProfileView({ candidate, qualifications, onSave }) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [form, setForm] = useState({
    available_from: candidate.available_from?.slice(0, 10) || '',
    available_to: candidate.available_to?.slice(0, 10) || '',
    time_from: candidate.time_from || '',
    time_to: candidate.time_to || '',
    hours_per_day: candidate.hours_per_day || '',
    hours_per_week: candidate.hours_per_week || '',
    hours_per_month: candidate.hours_per_month || '',
    work_skills: candidate.work_skills || '',
    completed_courses: candidate.completed_courses || '',
    valid_certificates: candidate.valid_certificates || '',
    expected_hourly_rate: candidate.expected_hourly_rate || '',
    expected_weekly_rate: candidate.expected_weekly_rate || '',
    qualifications: qualifications,
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch(`${API_BASE}/api/candidates/${candidate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSaveMsg('✓ Profile saved successfully!')
        setEditing(false)
        onSave()
      } else {
        setSaveMsg('⚠ Save failed. Please try again.')
      }
    } catch {
      setSaveMsg('⚠ Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="cd-view">
      <div className="cd-profile-header">
        <h2 className="cd-section-title" style={{ margin: 0 }}>My Profile</h2>
        {!editing ? (
          <button className="cd-edit-btn" onClick={() => setEditing(true)}>
            <span className="material-symbols-rounded">edit</span> Edit Profile
          </button>
        ) : (
          <div className="cd-edit-actions">
            <button className="cd-cancel-btn" onClick={() => { setEditing(false); setSaveMsg('') }}>Cancel</button>
            <button className="cd-save-btn" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : '✓ Save Changes'}
            </button>
          </div>
        )}
      </div>
      {saveMsg && <div className={`cd-save-msg ${saveMsg.startsWith('✓') ? 'cd-save-msg--ok' : 'cd-save-msg--err'}`}>{saveMsg}</div>}

      {/* Personal Info (read-only) */}
      <div className="cd-profile-section">
        <h3>Personal Information <span className="cd-locked-badge"></span></h3>
        <div className="cd-grid-2">
          <div className="cd-info-row"><label>First Name</label><span>{candidate.first_name}</span></div>
          <div className="cd-info-row"><label>Last Name</label><span>{candidate.last_name}</span></div>
          <div className="cd-info-row"><label>Personal Email</label><span>{candidate.personal_email}</span></div>
          <div className="cd-info-row"><label>Phone</label><span>{candidate.phone || '—'}</span></div>
          <div className="cd-info-row"><label>Company Email</label><span>{candidate.company_email || '—'}</span></div>
          <div className="cd-info-row"><label>Applied For</label><span>{candidate.applied_for || '—'}</span></div>
        </div>
      </div>

      {/* Availability */}
      <div className="cd-profile-section">
        <h3>Availability</h3>
        <div className="cd-grid-2">
          <div className="cd-info-row">
            <label>Available From</label>
            {editing
              ? <input className="cd-field-input" type="date" value={form.available_from} onChange={e => set('available_from', e.target.value)} />
              : <span>{fmt(candidate.available_from)}</span>}
          </div>
          <div className="cd-info-row">
            <label>Available To</label>
            {editing
              ? <input className="cd-field-input" type="date" value={form.available_to} onChange={e => set('available_to', e.target.value)} />
              : <span>{fmt(candidate.available_to)}</span>}
          </div>
          <div className="cd-info-row">
            <label>Time From</label>
            {editing
              ? <input className="cd-field-input" type="time" value={form.time_from} onChange={e => set('time_from', e.target.value)} />
              : <span>{fmtTime(candidate.time_from)}</span>}
          </div>
          <div className="cd-info-row">
            <label>Time To</label>
            {editing
              ? <input className="cd-field-input" type="time" value={form.time_to} onChange={e => set('time_to', e.target.value)} />
              : <span>{fmtTime(candidate.time_to)}</span>}
          </div>
          <div className="cd-info-row">
            <label>Hours / Day</label>
            {editing
              ? <input className="cd-field-input" type="number" value={form.hours_per_day} onChange={e => set('hours_per_day', e.target.value)} />
              : <span>{candidate.hours_per_day ?? '—'}</span>}
          </div>
          <div className="cd-info-row">
            <label>Hours / Week</label>
            {editing
              ? <input className="cd-field-input" type="number" value={form.hours_per_week} onChange={e => set('hours_per_week', e.target.value)} />
              : <span>{candidate.hours_per_week ?? '—'}</span>}
          </div>
          <div className="cd-info-row">
            <label>Hours / Month</label>
            {editing
              ? <input className="cd-field-input" type="number" value={form.hours_per_month} onChange={e => set('hours_per_month', e.target.value)} />
              : <span>{candidate.hours_per_month ?? '—'}</span>}
          </div>
        </div>
      </div>

      {/* Skills & Rates */}
      <div className="cd-profile-section">
        <h3>Skills &amp; Rates</h3>
        <div className="cd-info-row cd-info-row--full">
          <label>Work Skills</label>
          {editing
            ? <textarea className="cd-field-textarea" value={form.work_skills} onChange={e => set('work_skills', e.target.value)} rows={3} />
            : <span className="cd-skills-text">{candidate.work_skills || '—'}</span>}
        </div>
        <div className="cd-grid-2" style={{ marginTop: '1rem' }}>
          <div className="cd-info-row">
            <label>Expected Hourly Rate</label>
            {editing
              ? <input className="cd-field-input" type="number" step="0.01" value={form.expected_hourly_rate} onChange={e => set('expected_hourly_rate', e.target.value)} />
              : <span>{candidate.expected_hourly_rate ? `€${candidate.expected_hourly_rate}/hr` : '—'}</span>}
          </div>
          <div className="cd-info-row">
            <label>Expected Weekly Rate</label>
            {editing
              ? <input className="cd-field-input" type="number" step="0.01" value={form.expected_weekly_rate} onChange={e => set('expected_weekly_rate', e.target.value)} />
              : <span>{candidate.expected_weekly_rate ? `€${candidate.expected_weekly_rate}/wk` : '—'}</span>}
          </div>
        </div>
      </div>

      {/* Qualifications */}
      <div className="cd-profile-section">
        <h3>Qualifications &amp; Certifications</h3>
        {qualifications.length > 0 ? (
          <div className="cd-qual-list">
            {qualifications.map((q, i) => (
              <div key={i} className="cd-qual-item">
                <span className="material-symbols-rounded">school</span>
                <div>
                  <strong>{q.degree || q.name || `Qualification ${i + 1}`}</strong>
                  {q.institution && <span>{q.institution}</span>}
                  {q.year && <span>{q.year}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="cd-empty-field">No qualifications on record.</p>
        )}
        <div className="cd-grid-2" style={{ marginTop: '1.25rem' }}>
          <div className="cd-info-row cd-info-row--full">
            <label>Completed Courses</label>
            {editing
              ? <textarea className="cd-field-textarea" value={form.completed_courses} onChange={e => set('completed_courses', e.target.value)} rows={2} />
              : <span className="cd-skills-text">{candidate.completed_courses || '—'}</span>}
          </div>
          <div className="cd-info-row cd-info-row--full">
            <label>Valid Certificates</label>
            {editing
              ? <textarea className="cd-field-textarea" value={form.valid_certificates} onChange={e => set('valid_certificates', e.target.value)} rows={2} />
              : <span className="cd-skills-text">{candidate.valid_certificates || '—'}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateDashboard
