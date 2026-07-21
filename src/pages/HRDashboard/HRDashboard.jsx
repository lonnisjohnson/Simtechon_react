import { useState } from 'react'
import { Link } from 'react-router-dom'
import './HRDashboard.css'

const navItems = [
  {
    group: 'Recruitment',
    links: [
      { icon: 'dashboard', label: 'Dashboard', active: true },
      { icon: 'work', label: 'My Job Posts', badge: '12', badgeColor: 'green' },
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

  return (
    <div className="hr-dashboard-root">
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
                  className={link.active ? 'active' : ''}
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="nav-icon">
                    <span className="material-symbols-rounded">{link.icon}</span>
                  </span>
                  {link.label}
                  {link.badge && (
                    <span className={`nav-badge${link.badgeColor ? ' ' + link.badgeColor : ''}`}>
                      {link.badge}
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
        </div>
      </div>
    </div>
  )
}

export default HRDashboard
