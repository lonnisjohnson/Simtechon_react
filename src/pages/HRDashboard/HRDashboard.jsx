import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE } from '../../config'
import { jsPDF } from 'jspdf'
import './HRDashboard.css'

const navItems = [
  {
    group: 'Recruitment',
    links: [
      { icon: 'dashboard', label: 'Dashboard', view: 'dashboard' },
      { icon: 'work', label: 'My Job Posts', view: 'jobs', badgeColor: 'green' },
      { icon: 'person_search', label: 'Applications', view: 'candidates', badge: true },
    ],
  },
  {
    group: 'Pipeline',
    links: [
      { icon: 'groups', label: 'Interviews', badge: '5', badgeColor: 'gold' },
      { icon: 'history_edu', label: 'Offers Sent' },
    ],
  },
  {
    group: 'Talent',
    links: [
      { icon: 'business', label: 'Employer List' },
      { icon: 'group', label: 'Employee Pool' },
      { icon: 'folder_shared', label: 'Documents' },
    ],
  },
]

const statCards = [
  { color: 'green', icon: 'work', value: '12', label: 'Active Job Posts', change: '▲ 2 this week', changeUp: true },
  { color: 'blue', icon: 'description', value: '84', label: 'New Applications', change: '▲ 15% increase', changeUp: true },
  { color: 'gold', icon: 'groups', value: '5', label: 'Pending Interviews', change: 'Today: 2 scheduled', changeUp: false },
  { color: 'purple', icon: 'history_edu', value: '3', label: 'Offers Pending', change: '1 expiring soon', changeUp: false },
]

const applications = [
  { name: 'Suresh Raina', position: 'Frontend Dev', applied: 'Today', status: 'New', statusClass: 'badge-gold', action: 'Review', actionClass: 'btn-primary' },
  { name: 'Meera Iyer', position: 'HR Executive', applied: 'Yesterday', status: 'Shortlisted', statusClass: 'badge-blue', action: 'Schedule', actionClass: 'btn-ghost' },
  { name: 'Vikram Seth', position: 'Cloud Architect', applied: '2 days ago', status: 'Approved', statusClass: 'badge-green', action: 'View', actionClass: 'btn-ghost' },
  { name: 'Kavita Singh', position: 'IT Support', applied: '3 days ago', status: 'Rejected', statusClass: 'badge-red', action: 'View', actionClass: 'btn-ghost' },
]

const interviews = [
  {
    icon: 'video_camera_front',
    iconStyle: { background: 'var(--accent-glow)', color: 'var(--accent)' },
    title: 'Meera Iyer — HR Executive',
    sub: 'Today, 2:00 PM · Video Call',
    action: 'Join',
    actionClass: 'btn-primary',
  },
  {
    icon: 'meeting_room',
    iconStyle: { background: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
    title: 'Rahul Dravid — Senior Architect',
    sub: 'Tomorrow, 11:00 AM · Office',
    action: 'Details',
    actionClass: 'btn-ghost',
  },
]

/* ── Status badge helper (candidates) ───────────────────────────────────── */
function CandStatusBadge({ status, id, onStatusChange }) {
  const cls =
    status === 'Shortlisted' ? 'badge badge-green' :
      status === 'Rejected' ? 'badge badge-red' : 'badge badge-yellow'
  return (
    <select
      className={`cand-status-select ${cls}`}
      value={status}
      onChange={(e) => onStatusChange(id, e.target.value)}
    >
      <option value="Pending" className="opt-pending">Pending</option>
      <option value="Shortlisted" className="opt-approved">Shortlisted</option>
      <option value="Rejected" className="opt-rejected">Rejected</option>
    </select>
  )
}

/* ── Format date helper ──────────────────────────────────────────────────── */
function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

/* ── ATS-friendly PDF export ─────────────────────────────────────────────── */
function exportCandidatePDF(c) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210, marginL = 18, marginR = 18, contentW = W - marginL - marginR
  let y = 20

  const safeArr = (val) => {
    try { return Array.isArray(val) ? val : JSON.parse(val || '[]') }
    catch { return [] }
  }

  const line = (text, opts = {}) => {
    const { size = 10, bold = false, color = [30, 30, 30], indent = 0, gap = 5 } = opts
    doc.setFontSize(size)
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(text, contentW - indent)
    lines.forEach(l => {
      if (y > 270) { doc.addPage(); y = 20 }
      doc.text(l, marginL + indent, y)
      y += gap
    })
  }

  const divider = (color = [210, 215, 225]) => {
    if (y > 270) { doc.addPage(); y = 20 }
    doc.setDrawColor(...color)
    doc.setLineWidth(0.3)
    doc.line(marginL, y, W - marginR, y)
    y += 4
  }

  const sectionTitle = (title) => {
    y += 2
    doc.setFillColor(37, 99, 235)
    doc.rect(marginL, y, 3, 4.5, 'F')
    line(title.toUpperCase(), { size: 9, bold: true, color: [37, 99, 235], indent: 6, gap: 6 })
    divider([200, 220, 255])
  }

  // ── HEADER ──
  // Company Brand (Top Right)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(37, 99, 235) // brand blue
  doc.text('SimtechON', W - marginR, y, { align: 'right' })
  doc.setTextColor(15, 23, 42)

  // Candidate Info (Top Left)
  line(`${c.first_name} ${c.last_name}`, { size: 20, bold: true, color: [15, 23, 42], gap: 7 })
  if (c.applied_for) line(`Applying for: ${c.applied_for}`, { size: 9, color: [100, 116, 139], gap: 5 })
  y += 2
  divider([180, 195, 215])

  // ── EXPERIENCE LEVEL ──
  if (c.experience_level) {
    sectionTitle('Experience Level')
    line(c.experience_level, { size: 10, gap: 5 })
  }

  // ── WORK EXPERIENCE ──
  const exps = safeArr(c.experiences)
  if (exps.length > 0) {
    sectionTitle('Work Experience')
    exps.forEach((e, i) => {
      const dateRange = `${e.startDate || ''}${e.endDate ? ' – ' + e.endDate : e.currentlyWork ? ' – Present' : ''}`
      line(`${e.jobTitle}${e.company ? ' at ' + e.company : ''}`, { size: 11, bold: true, gap: 5 })
      if (dateRange.trim()) line(dateRange, { size: 9, color: [100, 116, 139], gap: 4 })
      if (e.responsibilities) line(e.responsibilities, { size: 10, indent: 4, gap: 5 })
      if (i < exps.length - 1) y += 3
    })
  }

  // ── SKILLS ──
  if (c.work_skills) {
    sectionTitle('Skills')
    const skills = c.work_skills.split(/[,;]+/).map(s => s.trim()).filter(Boolean)
    line(skills.join('  ·  '), { size: 10, gap: 5 })
  }

  // ── QUALIFICATIONS ──
  const quals = safeArr(c.qualifications)
  if (quals.length > 0) {
    sectionTitle('Education')
    quals.forEach((q, i) => {
      const yr = q.startYear ? `${q.startYear}${q.endYear ? ' – ' + q.endYear : ''}` : ''
      line(`${q.degree}${q.institution ? ', ' + q.institution : ''}`, { size: 11, bold: true, gap: 5 })
      if (yr) line(yr, { size: 9, color: [100, 116, 139], gap: 4 })
      if (i < quals.length - 1) y += 2
    })
  }

  // ── CERTIFICATES & COURSES ──
  if (c.valid_certificates || c.completed_courses) {
    sectionTitle('Certifications & Courses')
    if (c.valid_certificates) line(`Certificates: ${c.valid_certificates}`, { size: 10, gap: 5 })
    if (c.completed_courses) line(`Courses: ${c.completed_courses}`, { size: 10, gap: 5 })
  }


  doc.save(`${c.first_name}_${c.last_name}_Resume.pdf`)
}

function HRDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeView, setActiveView] = useState('dashboard')
  const [activeLabel, setActiveLabel] = useState('Dashboard')

  /* ── Candidate Applications state ── */
  const [candidates, setCandidates] = useState([])
  const [loadingCandidates, setLoadingCandidates] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  const [jobs, setJobs] = useState([])
  const [loadingJobs, setLoadingJobs] = useState(false)
  const defaultJobState = {
    title: '', department: '', location: '',
    work_type: 'Onsite', employment_type: 'Full-time', experience: '',
    about_role: '', key_responsibilities: '', looking_for: '', nice_to_have: '', what_we_offer: ''
  }
  const [newJob, setNewJob] = useState(defaultJobState)

  const fetchJobs = async () => {
    setLoadingJobs(true)
    try {
      const res = await fetch(`${API_BASE}/api/jobs`)
      const data = await res.json()
      setJobs(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setJobs([])
    } finally {
      setLoadingJobs(false)
    }
  }

  /* ── Fetch candidates ── */
  const fetchCandidates = async () => {
    setLoadingCandidates(true)
    setFetchError('')
    try {
      const res = await fetch(`${API_BASE}/api/candidates`)
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      setCandidates(Array.isArray(data) ? data : [])
    } catch (err) {
      setFetchError('Could not load candidates: ' + err.message)
      setCandidates([])
    } finally {
      setLoadingCandidates(false)
    }
  }

  /* ── Update candidate status ── */
  const handleCandStatusChange = async (id, newStatus) => {
    try {
      await fetch(`${API_BASE}/api/candidates/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      setCandidates((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      )
    } catch {
      alert('Failed to update status.')
    }
  }

  /* ── Filter candidates by search ── */
  const filteredCandidates = candidates.filter((c) => {
    const q = search.toLowerCase()
    return (
      c.first_name?.toLowerCase().includes(q) ||
      c.last_name?.toLowerCase().includes(q) ||
      c.personal_email?.toLowerCase().includes(q) ||
      c.work_skills?.toLowerCase().includes(q)
    )
  })

  useEffect(() => {
    fetchJobs()
    fetchCandidates()
  }, [])

  const handleCreateJob = async (e) => {
    e.preventDefault()
    if (!newJob.title) return
    try {
      const res = await fetch(`${API_BASE}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob)
      })
      if (res.ok) {
        setNewJob(defaultJobState)
        fetchJobs()
      } else {
        const errData = await res.json()
        console.error('Post job failed:', errData)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // ── Edit Modal State ────────────────────────────────────────────────────
  const [editJob, setEditJob] = useState(null)  // null = closed, object = job being edited
  const [editSaving, setEditSaving] = useState(false)

  const openEdit = (job) => {
    setEditJob({ ...job })
  }

  const closeEdit = () => setEditJob(null)

  const handleEditSave = async () => {
    if (!editJob.title) return
    setEditSaving(true)
    try {
      const res = await fetch(`${API_BASE}/api/jobs/${editJob.job_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editJob)
      })
      if (res.ok) { fetchJobs(); closeEdit() }
    } catch (err) { console.error(err) }
    finally { setEditSaving(false) }
  }

  const handleStatusChange = async (jobId, status) => {
    try {
      await fetch(`${API_BASE}/api/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      fetchJobs()
    } catch (err) { console.error(err) }
  }

  const handleNavClick = (link, e) => {
    e.preventDefault()
    if (link.view) {
      setActiveView(link.view)
      setActiveLabel(link.label)
      if (link.view === 'candidates') fetchCandidates()
    }
    setSidebarOpen(false)
  }

  // Status badge helper
  const statusBadgeClass = (s) => {
    if (s === 'Active') return 'badge-green'
    if (s === 'Closed') return 'badge-red'
    if (s === 'Draft') return 'badge-gold'
    return 'badge-blue'
  }

  return (
    <div className="hr-dashboard-root">
      {/* Edit Job Modal */}
      {editJob && (
        <div className="edit-modal-overlay" onClick={closeEdit}>
          <div className="edit-modal" onClick={e => e.stopPropagation()}>
            <div className="edit-modal-header">
              <span className="edit-modal-title">Edit Job Post</span>
              <button className="edit-modal-close" onClick={closeEdit}>&times;</button>
            </div>
            <div className="edit-modal-body">
              <div className="edit-modal-grid">
                <div className="job-form-group">
                  <label className="job-form-label">Job Title *</label>
                  <input className="job-form-input" value={editJob.title} onChange={e => setEditJob({ ...editJob, title: e.target.value })} />
                </div>
                <div className="job-form-group">
                  <label className="job-form-label">Department</label>
                  <input className="job-form-input" value={editJob.department || ''} onChange={e => setEditJob({ ...editJob, department: e.target.value })} />
                </div>
                <div className="job-form-group">
                  <label className="job-form-label">Location</label>
                  <input className="job-form-input" value={editJob.location || ''} onChange={e => setEditJob({ ...editJob, location: e.target.value })} />
                </div>
                <div className="job-form-group">
                  <label className="job-form-label">Work Type</label>
                  <select className="job-form-select" value={editJob.work_type || 'Onsite'} onChange={e => setEditJob({ ...editJob, work_type: e.target.value })}>
                    <option>Onsite</option><option>Remote</option><option>Hybrid</option>
                  </select>
                </div>
                <div className="job-form-group">
                  <label className="job-form-label">Employment Type</label>
                  <select className="job-form-select" value={editJob.employment_type || 'Full-time'} onChange={e => setEditJob({ ...editJob, employment_type: e.target.value })}>
                    <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
                  </select>
                </div>
                <div className="job-form-group">
                  <label className="job-form-label">Years of Experience</label>
                  <input className="job-form-input" type="text" value={editJob.experience || ''} onChange={e => setEditJob({ ...editJob, experience: e.target.value })} />
                </div>
                <div className="job-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="job-form-label">About the Role</label>
                  <textarea className="job-form-textarea" rows="3" value={editJob.about_role || ''} onChange={e => setEditJob({ ...editJob, about_role: e.target.value })} />
                </div>
                <div className="job-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="job-form-label">Key Responsibilities</label>
                  <textarea className="job-form-textarea" rows="3" value={editJob.key_responsibilities || ''} onChange={e => setEditJob({ ...editJob, key_responsibilities: e.target.value })} />
                </div>
                <div className="job-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="job-form-label">What We Are Looking For</label>
                  <textarea className="job-form-textarea" rows="3" value={editJob.looking_for || ''} onChange={e => setEditJob({ ...editJob, looking_for: e.target.value })} />
                </div>
                <div className="job-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="job-form-label">Nice to Have</label>
                  <textarea className="job-form-textarea" rows="2" value={editJob.nice_to_have || ''} onChange={e => setEditJob({ ...editJob, nice_to_have: e.target.value })} />
                </div>
                <div className="job-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="job-form-label">What We Offer</label>
                  <textarea className="job-form-textarea" rows="2" value={editJob.what_we_offer || ''} onChange={e => setEditJob({ ...editJob, what_we_offer: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="edit-modal-footer">
              <button className="btn btn-ghost" onClick={closeEdit}>Cancel</button>
              <button className="btn btn-primary" onClick={handleEditSave} disabled={editSaving}>
                {editSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`} id="sidebar">
        <div className="sidebar-brand">
          <Link className="brand-logo" to="/">Simtech<span>ON</span></Link>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((group) => (
            <div key={group.group}>
              <div className="nav-group-label">{group.group}</div>
              {group.links.map((link) => (
                <a
                  key={link.label}
                  href="#"
                  className={activeLabel === link.label ? 'active' : ''}
                  onClick={(e) => handleNavClick(link, e)}
                >
                  <span className="nav-icon">
                    <span className="material-symbols-rounded">{link.icon}</span>
                  </span>
                  {link.label}
                  {(link.badge || link.view === 'jobs') && (
                    <span className={`nav-badge${link.badgeColor ? ' ' + link.badgeColor : ''}`}>
                      {link.view === 'jobs' ? jobs.length : link.badge === true ? candidates.length : link.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/login">
            <span className="material-symbols-rounded">logout</span> Sign Out
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      <div
        className="sidebar-overlay"
        id="sidebarOverlay"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="main">
        <header className="topbar">
          <button className="menu-toggle" id="menuToggle" onClick={() => setSidebarOpen(true)}>
            <span className="material-symbols-rounded">menu</span>
          </button>
        </header>

        <div className="page-content">
          {activeView === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="stats-grid">
                {statCards.map((card) => (
                  <div key={card.label} className={`stat-card ${card.color}`}>
                    <div className={`stat-icon ${card.color}`}>
                      <span className="material-symbols-rounded">{card.icon}</span>
                    </div>
                    <div className="stat-value">{card.value}</div>
                    <div className="stat-label">{card.label}</div>
                    <div className={`stat-change${card.changeUp ? ' up' : ''}`}>{card.change}</div>
                  </div>
                ))}
              </div>

              {/* Two-column grid */}
              <div className="grid-2">
                {/* Recent Applications */}
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Recent Applications</span>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Candidate</th>
                          <th>Job Position</th>
                          <th>Applied On</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((app) => (
                          <tr key={app.name}>
                            <td>{app.name}</td>
                            <td>{app.position}</td>
                            <td>{app.applied}</td>
                            <td>
                              <span className={`badge ${app.statusClass}`}>{app.status}</span>
                            </td>
                            <td>
                              <button className={`btn ${app.actionClass} btn-sm`}>{app.action}</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Upcoming Interviews */}
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Upcoming Interviews</span>
                  </div>
                  <div className="card-body">
                    {interviews.map((item) => (
                      <div key={item.title} className="list-item">
                        <div className="list-icon" style={item.iconStyle}>
                          <span className="material-symbols-rounded">{item.icon}</span>
                        </div>
                        <div className="list-text">
                          <div className="list-title">{item.title}</div>
                          <div className="list-sub">{item.sub}</div>
                        </div>
                        <button className={`btn ${item.actionClass} btn-sm`}>{item.action}</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeView === 'jobs' && (
            <div className="job-post-container">
              <div className="card">

                <div className="card-body">
                  <form onSubmit={handleCreateJob} className="job-form-grid">
                    <div className="form-section-title" style={{ marginTop: '0' }}>Basic Information</div>

                    <div className="job-form-group">
                      <label className="job-form-label">Job Title </label>
                      <input
                        type="text"
                        required
                        className="job-form-input"
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      />
                    </div>
                    <div className="job-form-group">
                      <label className="job-form-label">Department</label>
                      <input
                        type="text"
                        className="job-form-input"
                        value={newJob.department}
                        onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                      />
                    </div>
                    <div className="job-form-group">
                      <label className="job-form-label">Location</label>
                      <input
                        type="text"
                        className="job-form-input"
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      />
                    </div>

                    <div className="form-section-title">Job Details</div>

                    <div className="job-form-group">
                      <label className="job-form-label">Work Type</label>
                      <select
                        className="job-form-select"
                        value={newJob.work_type}
                        onChange={(e) => setNewJob({ ...newJob, work_type: e.target.value })}
                      >
                        <option>Onsite</option>
                        <option>Remote</option>
                        <option>Hybrid</option>
                      </select>
                    </div>
                    <div className="job-form-group">
                      <label className="job-form-label">Employment Type</label>
                      <select
                        className="job-form-select"
                        value={newJob.employment_type}
                        onChange={(e) => setNewJob({ ...newJob, employment_type: e.target.value })}
                      >
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                      </select>
                    </div>
                    <div className="job-form-group">
                      <label className="job-form-label">Years of Experience</label>
                      <input
                        type="text"
                        className="job-form-input"
                        value={newJob.experience}
                        onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                      />
                    </div>

                    <div className="form-section-title">Description</div>

                    <div className="job-form-group full-width">
                      <label className="job-form-label">About the Role</label>
                      <textarea
                        className="job-form-textarea"
                        rows="3"
                        value={newJob.about_role}
                        onChange={(e) => setNewJob({ ...newJob, about_role: e.target.value })}
                      />
                    </div>

                    <div className="job-form-group full-width">
                      <label className="job-form-label">Key Responsibilities</label>
                      <textarea
                        className="job-form-textarea narrow"
                        rows="4"
                        value={newJob.key_responsibilities}
                        onChange={(e) => setNewJob({ ...newJob, key_responsibilities: e.target.value })}
                      />
                    </div>
                    <div className="job-form-group full-width">
                      <label className="job-form-label">What We Are Looking For</label>
                      <textarea
                        className="job-form-textarea narrow"
                        rows="4"
                        value={newJob.looking_for}
                        onChange={(e) => setNewJob({ ...newJob, looking_for: e.target.value })}
                      />
                    </div>
                    <div className="job-form-group full-width">
                      <label className="job-form-label">Nice to Have</label>
                      <textarea
                        className="job-form-textarea narrow"
                        rows="3"
                        value={newJob.nice_to_have}
                        onChange={(e) => setNewJob({ ...newJob, nice_to_have: e.target.value })}
                      />
                    </div>
                    <div className="job-form-group full-width">
                      <label className="job-form-label">What We Offer</label>
                      <textarea
                        className="job-form-textarea narrow"
                        rows="3"
                        value={newJob.what_we_offer}
                        onChange={(e) => setNewJob({ ...newJob, what_we_offer: e.target.value })}
                      />
                    </div>

                    <div className="job-form-actions">
                      <button type="submit" className="btn btn-primary">Post Job</button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">Active Job Posts</span>
                </div>
                <div className="table-wrap">
                  {loadingJobs ? (
                    <p style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>Loading jobs...</p>
                  ) : jobs.length === 0 ? (
                    <p style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>No active job posts.</p>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Job ID</th>
                          <th>Job Title</th>
                          <th>Dept / Location</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Date Posted</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.map(job => (
                          <tr key={job.id}>
                            <td>
                              <span style={{
                                fontFamily: 'Manrope, sans-serif',
                                fontWeight: 800,
                                fontSize: '0.85rem',
                                color: 'var(--accent)',
                                letterSpacing: '0.04em'
                              }}>{job.job_id || '—'}</span>
                            </td>
                            <td style={{ fontWeight: 600 }}>{job.title}</td>
                            <td>
                              <div>{job.department || '—'}</div>
                              <div style={{ fontSize: '0.8em', color: '#64748b' }}>{job.location || '—'}</div>
                            </td>
                            <td>
                              <div>{job.employment_type || '—'}</div>
                              <div style={{ fontSize: '0.8em', color: '#64748b' }}>{job.work_type || '—'}</div>
                            </td>
                            <td>
                              <select
                                className="job-status-select"
                                value={job.status || 'Active'}
                                onChange={e => handleStatusChange(job.job_id, e.target.value)}
                              >
                                <option>Active</option>
                                <option>Draft</option>
                                <option>Closed</option>
                              </select>
                            </td>
                            <td>{new Date(job.created_at).toLocaleDateString()}</td>
                            <td>
                              <button className="btn btn-ghost btn-sm" onClick={() => openEdit(job)}>
                                <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>edit</span>
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              CANDIDATE APPLICATIONS VIEW — Live from MySQL
          ══════════════════════════════════════════════════ */}
          {activeView === 'candidates' && (
            <div className="card cand-section" style={{ marginTop: 0 }}>
              <div className="card-header cand-header">
                <div className="cand-controls">
                  <div className="cand-search-wrap">
                    <span className="material-symbols-rounded cand-search-icon">search</span>
                    <input
                      type="text"
                      className="cand-search"
                      placeholder="Search by name, email or skill…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <button className="cand-refresh-btn" onClick={fetchCandidates} title="Refresh">
                    <span className="material-symbols-rounded">refresh</span>
                  </button>
                </div>
              </div>

              <div className="cand-table-wrap">
                <table className="cand-table">
                  <thead>
                    <tr>
                      <th>Candidate ID</th>
                      <th>Name</th>
                      <th>Applied For</th>
                      <th>Expected Rate</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th style={{ width: 100, textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingCandidates ? (
                      <tr>
                        <td colSpan="9">
                          <div className="cand-state">
                            <div className="cand-spinner" />
                            <p>Loading candidates from database…</p>
                          </div>
                        </td>
                      </tr>
                    ) : (fetchError || filteredCandidates.length === 0) ? (
                      <tr>
                        <td colSpan="9">
                          <div className="cand-state">
                            <span className="material-symbols-rounded cand-empty-icon">inbox</span>
                            <p>{search ? 'No candidates match your search.' : 'No Candidates Available'}</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCandidates.map((c, idx) => (
                        <React.Fragment key={c.id}>
                          <tr
                            className={`cand-row ${expandedId === c.id ? 'cand-row-expanded' : ''}`}
                            onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                          >
                            <td className="cand-idx">{c.id || `C${100001 + idx}`}</td>
                            <td className="cand-fullname">{c.first_name} {c.last_name}</td>
                            <td>
                              <span className="cand-role-text" title={c.applied_for || '—'}>
                                {c.applied_for || '—'}
                              </span>
                            </td>
                            <td>
                              {c.expected_hourly_rate ? <div className="cand-rate">€{c.expected_hourly_rate}/hr</div> : null}
                              {c.expected_weekly_rate ? <div className="cand-rate-sub">€{c.expected_weekly_rate}/wk</div> : (!c.expected_hourly_rate ? '—' : null)}
                            </td>
                            <td onClick={(e) => e.stopPropagation()}>
                              <CandStatusBadge
                                status={c.status}
                                id={c.id}
                                onStatusChange={handleCandStatusChange}
                              />
                            </td>
                            <td className="cand-date">{fmtDate(c.submitted_at)}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <button
                                  className="btn-ghost"
                                  style={{ padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(37, 99, 235, 0.08)', color: '#2563eb' }}
                                  title="Export ATS Resume"
                                  onClick={(e) => { e.stopPropagation(); exportCandidatePDF(c) }}
                                >
                                  <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>download</span>
                                </button>
                                <button
                                  className="btn-ghost"
                                  style={{ padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                  title={expandedId === c.id ? "Hide Details" : "View Details"}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedId(expandedId === c.id ? null : c.id);
                                  }}
                                >
                                  <span className={`cand-chevron material-symbols-rounded ${expandedId === c.id ? 'open' : ''}`} style={{ fontSize: '18px' }}>
                                    expand_more
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded detail row */}
                          {expandedId === c.id && (
                            <tr key={`exp-${c.id}`} className="cand-detail-row">
                              <td colSpan={9}>
                                <div className="cand-detail-grid">

                                  {/* Availability */}
                                  <div className="cand-detail-block">
                                    <h4><span className="material-symbols-rounded">schedule</span> Availability</h4>
                                    <p><label>Time Window</label>{c.time_from && c.time_to ? `${c.time_from} – ${c.time_to}` : '—'}</p>
                                    <p><label>Available Days</label>{c.available_days || '—'}</p>
                                  </div>

                                  {/* Experience Level */}
                                  <div className="cand-detail-block">
                                    <h4><span className="material-symbols-rounded">work_history</span> Experience</h4>
                                    <p><label>Level</label>{c.experience_level || '—'}</p>
                                    {(() => {
                                      try {
                                        const exps = typeof c.experiences === 'string'
                                          ? JSON.parse(c.experiences)
                                          : c.experiences || []
                                        return exps.length > 0
                                          ? exps.map((e, i) => (
                                            <p key={i}>
                                              <label>{e.startDate}{e.endDate ? ` – ${e.endDate}` : e.currentlyWork ? ' – Present' : ''}</label>
                                              {e.jobTitle}{e.company ? ` @ ${e.company}` : ''}
                                            </p>
                                          ))
                                          : null
                                      } catch { return null }
                                    })()}
                                  </div>

                                  {/* Qualifications */}
                                  <div className="cand-detail-block">
                                    <h4><span className="material-symbols-rounded">school</span> Qualifications</h4>
                                    {(() => {
                                      try {
                                        const qs = typeof c.qualifications === 'string'
                                          ? JSON.parse(c.qualifications)
                                          : c.qualifications || []
                                        return qs.length > 0
                                          ? qs.map((q, i) => (
                                            <p key={i}>
                                              <label>{q.startYear}{q.endYear ? ` – ${q.endYear}` : ''}</label>
                                              {q.degree}{q.institution ? `, ${q.institution}` : ''}
                                            </p>
                                          ))
                                          : <p>—</p>
                                      } catch { return <p>—</p> }
                                    })()}
                                  </div>

                                  {/* Certificates & Courses */}
                                  <div className="cand-detail-block">
                                    <h4><span className="material-symbols-rounded">workspace_premium</span> Certificates &amp; Courses</h4>
                                    <p><label>Certificates</label>{c.valid_certificates || '—'}</p>
                                    <p><label>Courses</label>{c.completed_courses || '—'}</p>
                                  </div>

                                  {/* Work Skills */}
                                  <div className="cand-detail-block cand-skills-full">
                                    <h4><span className="material-symbols-rounded">construction</span> Work Skills</h4>
                                    <p>{c.work_skills || '—'}</p>
                                  </div>

                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HRDashboard
