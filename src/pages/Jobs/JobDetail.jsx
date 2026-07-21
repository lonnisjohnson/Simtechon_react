import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  MapPin, Clock, ArrowLeft, CheckCircle, Briefcase, Users,
  Star, MessageSquare, DollarSign, Calendar,
} from 'lucide-react'
import './JobDetail.css'

const jobsData = [
  {
    id: 'it-support-specialist',
    title: 'IT Support Specialist',
    location: 'Dublin (On-site)',
    type: 'Full-time',
    badge: 'Technical',
    department: 'IT Operations',
    experience: '2–4 Years',
    salary: '€40,000 – €55,000',
    postedDate: 'July 10, 2026',
    about:
      'We are looking for a proactive and skilled IT Support Specialist to join our growing IT Operations team in Dublin. You will be the first line of support for all technical issues, ensuring the smooth running of our internal systems and infrastructure.',
    responsibilities: [
      'Diagnose and resolve hardware, software, and network issues for end users.',
      'Install, configure, and maintain desktops, laptops, printers, and peripherals.',
      'Manage and monitor IT ticketing system; ensure SLA adherence.',
      'Assist with on-boarding/off-boarding — account setup, device provisioning.',
      'Collaborate with the network team on LAN/WAN troubleshooting.',
      'Maintain accurate IT asset inventory and documentation.',
      'Provide training and guidance to staff on software tools and best practices.',
    ],
    requirements: [
      'Bachelors degree in IT, Computer Science, or equivalent experience.',
      '2+ years of hands-on IT support in a corporate environment.',
      'Proficiency with Windows 10/11, macOS, and Microsoft 365 suite.',
      'Solid understanding of networking fundamentals (TCP/IP, DNS, DHCP).',
      'Experience with Active Directory and Azure AD.',
      'Excellent communication and customer-facing skills.',
      'CompTIA A+ or similar certification is a plus.',
    ],
    niceToHave: [
      'Experience with ITIL framework.',
      'Familiarity with SIEM or endpoint security tools.',
      'Previous experience supporting remote/hybrid teams.',
    ],
    perks: ['Health & dental insurance', 'Hybrid work options (post-probation)', 'Professional development budget', 'Annual performance bonus'],
  },
  {
    id: 'network-engineer',
    title: 'Network Engineer',
    location: 'Remote / Hybrid',
    type: 'Full-time',
    badge: 'Network',
    department: 'Infrastructure',
    experience: '4–7 Years',
    salary: '€65,000 – €85,000',
    postedDate: 'July 12, 2026',
    about:
      'Simtechon is seeking a talented Network Engineer to design, implement, and maintain our enterprise network infrastructure. You will work alongside cloud architects and security teams to deliver high-availability solutions for our global clients.',
    responsibilities: [
      'Design and deploy routers, switches, firewalls, and VPN solutions.',
      'Monitor network performance and carry out capacity planning.',
      'Configure and manage SD-WAN and cloud networking (AWS/Azure).',
      'Troubleshoot complex Layer 2/3 network issues with minimal downtime.',
      'Implement network security policies and firewall rule sets.',
      'Produce and maintain network diagrams and runbooks.',
      'Participate in 24/7 on-call rotation for critical incidents.',
    ],
    requirements: [
      '4+ years of network engineering experience in enterprise environments.',
      'Strong hands-on skills with Cisco, Juniper, or Fortinet equipment.',
      'Expert knowledge of BGP, OSPF, MPLS, and VLANs.',
      'Experience with network monitoring tools (PRTG, SolarWinds, Zabbix).',
      'Understanding of cloud networking concepts (AWS VPC, Azure VNet).',
      'CCNP or equivalent certification required.',
    ],
    niceToHave: [
      'CCIE certification.',
      'Experience with automation tools (Ansible, Python for network scripting).',
      'Knowledge of Zero Trust Network Architecture.',
    ],
    perks: ['Fully remote / hybrid flexibility', 'Annual tech allowance (€1,500)', 'Company pension scheme', 'Medical insurance'],
  },
  {
    id: 'help-desk-analyst',
    title: 'Help Desk Analyst',
    location: 'London (Hybrid)',
    type: 'Contract',
    badge: 'Support',
    department: 'Customer Support',
    experience: '1–3 Years',
    salary: '£28,000 – £38,000',
    postedDate: 'July 15, 2026',
    about:
      'We are recruiting a Help Desk Analyst on a 12-month contract basis to support end users across our London office. This is an excellent opportunity to grow your IT career within a dynamic, fast-paced managed services environment.',
    responsibilities: [
      'Serve as the first point of contact for IT support requests via phone, email, and ticketing system.',
      'Log, track, and resolve incidents within agreed SLAs.',
      'Escalate unresolved issues to senior support tiers or specialist teams.',
      'Assist with software installations, updates, and licensing.',
      'Support Microsoft 365 administration (user accounts, SharePoint, Teams).',
      'Produce knowledge base articles to improve first-call resolution rates.',
    ],
    requirements: [
      '1+ year of experience in a help desk or service desk role.',
      'Working knowledge of Windows OS and Microsoft 365.',
      'Familiarity with ITSM tools (ServiceNow, Jira Service Desk, Freshservice).',
      'Strong communication and problem-solving skills.',
      'Ability to work independently in a hybrid setup.',
    ],
    niceToHave: [
      'CompTIA A+ or ITIL Foundation certification.',
      'Experience with remote support tools (AnyDesk, TeamViewer).',
    ],
    perks: ['Hybrid working (3 days on-site)', 'Contractor day rate negotiable', 'Potential to convert to permanent role', 'Access to company training portal'],
  },
]

function JobDetail() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const job = jobsData.find((j) => j.id === jobId)

  if (!job) {
    return (
      <div className="jd-not-found">
        <h2>Job Not Found</h2>
        <button className="jd-back-btn-plain" onClick={() => navigate('/jobs')}>
          <ArrowLeft size={16} /> Back to Jobs
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* ─── HERO (matches Jobs / Services hero banner style) ─── */}
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
            <span>{job.department}</span>
          </h1>
          <div className="jd-hero-meta fade-up">
            <span className="jd-meta-chip"><MapPin size={14} /> {job.location}</span>
            <span className="jd-meta-chip"><Clock size={14} /> {job.type}</span>
            <span className="jd-meta-chip"><Users size={14} /> {job.experience}</span>
            <span className="jd-meta-chip jd-salary-chip"><DollarSign size={14} /> {job.salary}</span>
          </div>
        </div>
      </div>

      {/* ─── ABOUT THE ROLE ─── */}
      <section id="jd-about">
        <div className="container">
          <div className="wcu-header fade-up">
            <h2 className="wcu-title">About the <span className="text-blue">Role</span></h2>
          </div>
          <div className="jd-about-body fade-up">
            <p>{job.about}</p>
          </div>
        </div>
      </section>

      {/* ─── RESPONSIBILITIES ─── */}
      <section id="jd-responsibilities" className="jd-alt-bg">
        <div className="container">
          <div className="wcu-header fade-up">
            <h2 className="wcu-title">Key <span className="text-blue">Responsibilities</span></h2>
          </div>
          <div className="jd-bento-grid fade-up">
            {job.responsibilities.map((r, i) => (
              <div key={i} className="jd-resp-card">
                <div className="wcu-icon-circle">
                  <CheckCircle size={22} />
                </div>
                <p>{r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REQUIREMENTS ─── */}
      <section id="jd-requirements">
        <div className="container">
          <div className="wcu-header fade-up">
            <h2 className="wcu-title">What We're <span className="text-blue">Looking For</span></h2>
          </div>
          <div className="jd-req-list fade-up">
            {job.requirements.map((r, i) => (
              <div key={i} className="jd-req-item">
                <CheckCircle size={20} className="jd-check-icon" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NICE TO HAVE ─── */}
      <section id="jd-nice" className="jd-alt-bg">
        <div className="container">
          <div className="wcu-header fade-up">
            <h2 className="wcu-title">Nice to <span className="text-blue">Have</span></h2>
          </div>
          <div className="jd-req-list fade-up">
            {job.niceToHave.map((r, i) => (
              <div key={i} className="jd-req-item jd-req-item--star">
                <Star size={18} className="jd-star-icon" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PERKS ─── */}
      <section id="jd-perks">
        <div className="container">
          <div className="wcu-header fade-up">
            <h2 className="wcu-title">What We <span className="text-blue">Offer</span></h2>
          </div>
          <div className="jd-perks-grid fade-up">
            {job.perks.map((p, i) => (
              <div key={i} className="jd-perk-card">
                <div className="wcu-icon-circle">
                  <CheckCircle size={22} />
                </div>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW TO APPLY CTA ─── */}
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
              through our <strong>Contact page</strong>. Mention the job title, your experience level,
              and include your CV or LinkedIn profile link. Our HR team will respond within{' '}
              <strong>2–3 business days</strong>.
            </p>
            <div className="jd-posted-row">
              <Calendar size={14} />
              <span>Posted: {job.postedDate}</span>
            </div>
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
