import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE } from '../../config'
import './HRDashboard.css'

const navItems = [
  {
    group: 'Recruitment',
    links: [
      { icon: 'dashboard', label: 'Dashboard', view: 'dashboard' },
      { icon: 'work', label: 'My Job Posts', view: 'jobs', badgeColor: 'green' },
      { icon: 'description', label: 'All Applications', badge: '84' },
    ],
  },
  {
    group: 'Pipeline',
    links: [
      { icon: 'groups', label: 'Interviews', badge: '5', badgeColor: 'gold' },
      { icon: 'person_search', label: 'Candidate Search' },
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

function HRDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeView, setActiveView] = useState('dashboard')
  const [activeLabel, setActiveLabel] = useState('Dashboard')

  const [jobs, setJobs] = useState([])
  const [loadingJobs, setLoadingJobs] = useState(false)
  const defaultJobState = {
    title: '', department: '', location: '',
    work_type: 'Onsite', employment_type: 'Full-time', experience: '', payment_range: '',
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

  useEffect(() => {
    fetchJobs()
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
                  <label className="job-form-label">Experience</label>
                  <input className="job-form-input" value={editJob.experience || ''} onChange={e => setEditJob({ ...editJob, experience: e.target.value })} />
                </div>
                <div className="job-form-group">
                  <label className="job-form-label">Payment Range</label>
                  <input className="job-form-input" value={editJob.payment_range || ''} onChange={e => setEditJob({ ...editJob, payment_range: e.target.value })} />
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
                      {link.view === 'jobs' ? jobs.length : link.badge}
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
                      <label className="job-form-label">Job Title *</label>
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
                      <label className="job-form-label">Experience Required</label>
                      <input
                        type="text"
                        placeholder="e.g. 3-5 years"
                        className="job-form-input"
                        value={newJob.experience}
                        onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                      />
                    </div>
                    <div className="job-form-group">
                      <label className="job-form-label">Payment Range</label>
                      <input
                        type="text"
                        placeholder="e.g. $80k - $100k"
                        className="job-form-input"
                        value={newJob.payment_range}
                        onChange={(e) => setNewJob({ ...newJob, payment_range: e.target.value })}
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
        </div>
      </div>
    </div>
  )
}

export default HRDashboard
