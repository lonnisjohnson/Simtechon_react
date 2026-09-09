import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import { API_BASE } from '../../config'
import './CEODashboard.css'

/* ── Sidebar nav config ──────────────────────────────────────────────────── */
const navItems = [
  {
    group: 'Executive Overview',
    links: [
      { icon: 'dashboard', label: 'Dashboard', view: 'dashboard' },
      { icon: 'insights', label: 'Business Insights', view: 'dashboard' },
      { icon: 'show_chart', label: 'Growth Analytics', view: 'dashboard' },
    ],
  },
  {
    group: 'Global Access',
    links: [
      { icon: 'business', label: 'All Employers', view: 'dashboard' },
      { icon: 'groups', label: 'All Employees', view: 'dashboard' },
      { icon: 'folder_open', label: 'Full Record Access', view: 'dashboard' },
      { icon: 'person_search', label: 'Applications', view: 'candidates', badge: true },
    ],
  },
  {
    group: 'Operations',
    links: [
      { icon: 'payments', label: 'Revenue & Payroll', view: 'dashboard' },
      { icon: 'assignment', label: 'Reports Archive', view: 'dashboard' },
      { icon: 'security', label: 'System Audit', view: 'dashboard' },
    ],
  },
]

/* ── Static stat cards ───────────────────────────────────────────────────── */
const statCards = [
  { color: 'gold', icon: 'trending_up', value: '₹1.2M', label: 'Monthly Revenue', change: '▲ 22% this quarter', changeUp: true },
  { color: 'blue', icon: 'business', value: '42', label: 'Partner Companies', change: '▲ 4 new this month', changeUp: true },
  { color: 'green', icon: 'group_add', value: '318', label: 'Total Talent Pool', change: '▲ 45 onboarding', changeUp: true },
  { color: 'purple', icon: 'verified_user', value: '98.4%', label: 'Placement Success', change: '▲ 2.1% increase', changeUp: true },
]

/* ── Pipeline ────────────────────────────────────────────────────────────── */
const pipeline = [
  { label: 'Shortlisted', count: 124, fillClass: 'fill-blue', width: '75%' },
  { label: 'Interviews Ongoing', count: 42, fillClass: 'fill-gold', width: '45%' },
  { label: 'Final Offers', count: 18, fillClass: 'fill-green', width: '25%' },
]

/* ── Top companies ───────────────────────────────────────────────────────── */
const companies = [
  { name: 'TechCorp Ltd', hires: 18, posts: 6, status: 'Premium', badgeClass: 'badge-green' },
  { name: 'InfoSys Inc', hires: 12, posts: 4, status: 'Premium', badgeClass: 'badge-green' },
  { name: 'Nexus Tech', hires: 9, posts: 3, status: 'Verified', badgeClass: 'badge-blue' },
  { name: 'CloudBase Co', hires: 7, posts: 5, status: 'Verified', badgeClass: 'badge-blue' },
]

/* ── Status badge helper ─────────────────────────────────────────────────── */
function StatusBadge({ status, id, onStatusChange }) {
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

/* ── Main Component ──────────────────────────────────────────────────────── */
function CEODashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  /* ── Active sidebar view ── */
  const [activeView, setActiveView] = useState('dashboard')
  const [activeLabel, setActiveLabel] = useState('Dashboard')

  /* ── Fetch candidates from MySQL via API ── */
  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    setLoading(true)
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
      setLoading(false)
    }
  }

  /* ── Update candidate status ── */
  const handleStatusChange = async (id, newStatus) => {
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

  /* ── Filter by search ── */
  const filtered = candidates.filter((c) => {
    const q = search.toLowerCase()
    return (
      c.first_name?.toLowerCase().includes(q) ||
      c.last_name?.toLowerCase().includes(q) ||
      c.personal_email?.toLowerCase().includes(q) ||
      c.work_skills?.toLowerCase().includes(q)
    )
  })

  /* ── Handle sidebar nav click ── */
  const handleNavClick = (link, e) => {
    e.preventDefault()
    setActiveView(link.view)
    setActiveLabel(link.label)
    setSidebarOpen(false)
    if (link.view === 'candidates') {
      fetchCandidates()
    }
  }

  return (
    <div className="ceo-dashboard-root">

      {/* ── Sidebar ── */}
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
                  {link.badge && (
                    <span className="nav-badge nav-badge-accent">
                      {candidates.length}
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

      {/* ── Overlay ── */}
      <div className="sidebar-overlay" id="sidebarOverlay" onClick={() => setSidebarOpen(false)} />

      {/* ── Main ── */}
      <div className="main">
        <header className="topbar">
          <button className="menu-toggle" id="menuToggle" onClick={() => setSidebarOpen(true)}>
            <span className="material-symbols-rounded">menu</span>
          </button>
        </header>

        <div className="page-content">

          {/* ══════════════════════════════════════════════════
              DASHBOARD VIEW
          ══════════════════════════════════════════════════ */}
          {activeView === 'dashboard' && (
            <>
              {/* Stat Cards */}
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
                {/* Placement Pipeline */}
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Placement Pipeline Overview</span>
                  </div>
                  <div className="card-body">
                    {pipeline.map((item) => (
                      <div key={item.label} className="progress-wrap">
                        <div className="progress-label">
                          <span>{item.label}</span>
                          <span>{item.count}</span>
                        </div>
                        <div className="progress-bar">
                          <div className={`progress-fill ${item.fillClass}`} style={{ width: item.width }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Partnering Companies */}
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Top Partnering Companies</span>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Company</th>
                          <th>Hires</th>
                          <th>Active Posts</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {companies.map((co) => (
                          <tr key={co.name}>
                            <td>{co.name}</td>
                            <td>{co.hires}</td>
                            <td>{co.posts}</td>
                            <td><span className={`badge ${co.badgeClass}`}>{co.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
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

              {/* Candidate Table and States */}
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
                    {loading ? (
                      <tr>
                        <td colSpan="9">
                          <div className="cand-state">
                            <div className="cand-spinner" />
                            <p>Loading candidates from database…</p>
                          </div>
                        </td>
                      </tr>
                    ) : (fetchError || filtered.length === 0) ? (
                      <tr>
                        <td colSpan="9">
                          <div className="cand-state">
                            <span className="material-symbols-rounded cand-empty-icon">inbox</span>
                            <p>{search ? 'No candidates match your search.' : 'No Candidates Available'}</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((c, idx) => (
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
                              <StatusBadge
                                status={c.status}
                                id={c.id}
                                onStatusChange={handleStatusChange}
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

export default CEODashboard
