import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
    status === 'Approved' ? 'badge badge-green' :
      status === 'Rejected' ? 'badge badge-red' : 'badge badge-yellow'

  return (
    <select
      className={`cand-status-select ${cls}`}
      value={status}
      onChange={(e) => onStatusChange(id, e.target.value)}
    >
      <option value="Pending" className="opt-pending">Pending</option>
      <option value="Approved" className="opt-approved">Approved</option>
      <option value="Rejected" className="opt-rejected">Rejected</option>
    </select>
  )
}

/* ── Format date helper ──────────────────────────────────────────────────── */
function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
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
                      <th>Contact</th>
                      <th>Availability</th>
                      <th>Expected Rate</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="11">
                          <div className="cand-state">
                            <div className="cand-spinner" />
                            <p>Loading candidates from database…</p>
                          </div>
                        </td>
                      </tr>
                    ) : (fetchError || filtered.length === 0) ? (
                      <tr>
                        <td colSpan="11">
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
                              <div className="cand-contact-main">{c.personal_email}</div>
                              <div className="cand-contact-sub">{c.phone}</div>
                            </td>
                            <td>
                              <div className="cand-avail">{fmtDate(c.available_from)}</div>
                              <div className="cand-avail-to">→ {fmtDate(c.available_to)}</div>
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
                              <span className={`cand-chevron material-symbols-rounded ${expandedId === c.id ? 'open' : ''}`}>
                                expand_more
                              </span>
                            </td>
                          </tr>

                          {/* Expanded detail row */}
                          {expandedId === c.id && (
                            <tr key={`exp-${c.id}`} className="cand-detail-row">
                              <td colSpan={11}>
                                <div className="cand-detail-grid">
                                  <div className="cand-detail-block">
                                    <h4><span className="material-symbols-rounded">badge</span> Account</h4>
                                    <p><label>Username</label>{c.username || '—'}</p>
                                    <p><label>Company Email</label>{c.company_email || '—'}</p>
                                  </div>
                                  <div className="cand-detail-block">
                                    <h4><span className="material-symbols-rounded">schedule</span> Availability Hours</h4>
                                    <p><label>Time Window</label>{c.time_from} – {c.time_to}</p>
                                    <p><label>Hours/Day</label>{c.hours_per_day || '—'}</p>
                                    <p><label>Hours/Week</label>{c.hours_per_week || '—'}</p>
                                    <p><label>Hours/Month</label>{c.hours_per_month || '—'}</p>
                                  </div>
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
                                              <label>{q.year}</label>
                                              {q.degree}{q.institution ? `, ${q.institution}` : ''}
                                            </p>
                                          ))
                                          : <p>—</p>
                                      } catch { return <p>—</p> }
                                    })()}
                                  </div>
                                  <div className="cand-detail-block">
                                    <h4><span className="material-symbols-rounded">workspace_premium</span> Certificates &amp; Courses</h4>
                                    <p><label>Certificates</label>{c.valid_certificates || '—'}</p>
                                    <p><label>Courses</label>{c.completed_courses || '—'}</p>
                                  </div>
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
