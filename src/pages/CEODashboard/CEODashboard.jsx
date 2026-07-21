import { useState } from 'react'
import { Link } from 'react-router-dom'
import './CEODashboard.css'

const navItems = [
  {
    group: 'Executive Overview',
    links: [
      { icon: 'dashboard',  label: 'Dashboard',         active: true },
      { icon: 'insights',   label: 'Business Insights' },
      { icon: 'show_chart', label: 'Growth Analytics'  },
    ],
  },
  {
    group: 'Global Access',
    links: [
      { icon: 'business',    label: 'All Employers'      },
      { icon: 'groups',      label: 'All Employees'      },
      { icon: 'folder_open', label: 'Full Record Access' },
    ],
  },
  {
    group: 'Operations',
    links: [
      { icon: 'payments',   label: 'Revenue & Payroll' },
      { icon: 'assignment', label: 'Reports Archive'   },
      { icon: 'security',   label: 'System Audit'      },
    ],
  },
]

const statCards = [
  { color: 'gold',   icon: 'trending_up',   value: '₹1.2M', label: 'Monthly Revenue',    change: '▲ 22% this quarter', changeUp: true  },
  { color: 'blue',   icon: 'business',      value: '42',    label: 'Partner Companies',   change: '▲ 4 new this month', changeUp: true  },
  { color: 'green',  icon: 'group_add',     value: '318',   label: 'Total Talent Pool',   change: '▲ 45 onboarding',   changeUp: true  },
  { color: 'purple', icon: 'verified_user', value: '98.4%', label: 'Placement Success',   change: '▲ 2.1% increase',   changeUp: true  },
]

const pipeline = [
  { label: 'Shortlisted',        count: 124, fillClass: 'fill-blue', width: '75%' },
  { label: 'Interviews Ongoing', count: 42,  fillClass: 'fill-gold', width: '45%' },
  { label: 'Final Offers',       count: 18,  fillClass: 'fill-green', width: '25%' },
]

const companies = [
  { name: 'TechCorp Ltd',  hires: 18, posts: 6, status: 'Premium',  badgeClass: 'badge-green' },
  { name: 'InfoSys Inc',   hires: 12, posts: 4, status: 'Premium',  badgeClass: 'badge-green' },
  { name: 'Nexus Tech',    hires: 9,  posts: 3, status: 'Verified', badgeClass: 'badge-blue'  },
  { name: 'CloudBase Co',  hires: 7,  posts: 5, status: 'Verified', badgeClass: 'badge-blue'  },
]

function CEODashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="ceo-dashboard-root">
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

      {/* Main */}
      <div className="main">
        <header className="topbar">
          <button className="menu-toggle" id="menuToggle" onClick={() => setSidebarOpen(true)}>
            <span className="material-symbols-rounded">menu</span>
          </button>
        </header>

        <div className="page-content">
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
                        <td>
                          <span className={`badge ${co.badgeClass}`}>{co.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CEODashboard
