import { useState, useEffect } from 'react'
import { API_BASE } from '../../config'
import {
  User, Mail, Phone, Calendar, Clock, Briefcase, BookOpen,
  Award, FileText, Euro, Key, Eye, EyeOff, CheckCircle,
  AlertCircle, ChevronRight, Loader
} from 'lucide-react'
import './CandidateRegister.css'

/* ── helpers ── */
const toUsername = (first, last) => {
  if (!first && !last) return ''
  return `${first.toLowerCase().trim()}.${last.toLowerCase().trim()}`
}

const toCompanyEmail = (first, last) => {
  if (!first && !last) return ''
  return `${first.toLowerCase().trim()}.${last.toLowerCase().trim()}@simtechon.com`
}

const pwChecks = (pw) => ({
  length: pw.length >= 8,
  upper: /[A-Z]/.test(pw),
  lower: /[a-z]/.test(pw),
  number: /[0-9]/.test(pw),
})

function PwRule({ ok, label }) {
  return (
    <div className={`pw-rule ${ok ? 'ok' : ''}`}>
      {ok ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
      <span>{label}</span>
    </div>
  )
}

/* ── steps config ── */
const STEPS = [
  'Personal Info',
  'Availability',
  'Skills & Qualifications',
  'Account Setup',
]

export default function CandidateRegister() {
  /* ── form state ── */
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [qualInput, setQualInput] = useState({ degree: '', institution: '', startYear: '', endYear: '' })
  const [expInput, setExpInput] = useState({ company: '', jobTitle: '', startDate: '', endDate: '', currentlyWork: false, responsibilities: '' })

  const [jobs, setJobs] = useState([])

  useEffect(() => {
    fetch(`${API_BASE}/api/jobs`)
      .then(res => res.json())
      .then(data => setJobs(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error(err)
        setJobs([])
      })
  }, [])

  const [form, setForm] = useState({
    // Step 1 – Personal Info
    firstName: '',
    lastName: '',
    personalEmail: '',
    phone: '',
    appliedFor: '',
    // Step 2 – Availability
    availableFrom: '',
    availableTo: '',
    timeFrom: '',
    timeTo: '',
    availableDays: [],
    // Step 3 – Skills & Qualifications
    workSkills: '',
    qualifications: [],
    completedCourses: '',
    validCertificates: '',
    experiences: [],
    totalExperience: '',
    expectedHourlyRate: '',
    // Step 4 – Account Setup
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})

  /* ── derived (auto-generated) ── */
  const username = toUsername(form.firstName, form.lastName)
  const companyEmail = toCompanyEmail(form.firstName, form.lastName)

  /* ── handlers ── */
  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const addQual = () => {
    const { degree, institution, year } = qualInput
    if (!degree.trim()) return
    setForm((prev) => ({
      ...prev,
      qualifications: [...prev.qualifications, { degree: degree.trim(), institution: institution.trim(), startYear: qualInput.startYear.trim(), endYear: qualInput.endYear.trim() }],
    }))
    setQualInput({ degree: '', institution: '', startYear: '', endYear: '' })
    setErrors((prev) => ({ ...prev, qualifications: undefined }))
  }

  const toggleDay = (day) => {
    setForm(prev => {
      const days = prev.availableDays || []
      if (days.includes(day)) {
        return { ...prev, availableDays: days.filter(d => d !== day) }
      } else {
        return { ...prev, availableDays: [...days, day] }
      }
    })
  }

  const removeQual = (idx) =>
    setForm((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== idx),
    }))

  // Auto-format MM/YYYY for experience dates
  const formatMonthYear = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 6)
    if (digits.length <= 2) return digits
    return digits.slice(0, 2) + '/' + digits.slice(2)
  }

  const addExp = () => {
    const { company, jobTitle, startDate } = expInput
    if (!company.trim() || !jobTitle.trim() || !startDate.trim()) return
    setForm((prev) => ({
      ...prev,
      experiences: [...prev.experiences, { ...expInput, company: company.trim(), jobTitle: jobTitle.trim() }],
    }))
    setExpInput({ company: '', jobTitle: '', startDate: '', endDate: '', currentlyWork: false, responsibilities: '' })
  }

  const removeExp = (idx) =>
    setForm((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== idx),
    }))

  const validate = () => {
    const errs = {}
    if (step === 0) {
      if (!form.appliedFor) errs.appliedFor = 'Please select a job position'
      if (!form.firstName.trim()) errs.firstName = 'Required'
      if (!form.lastName.trim()) errs.lastName = 'Required'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.personalEmail))
        errs.personalEmail = 'Enter a valid email'
      if (!form.phone.trim()) errs.phone = 'Required'
    }
    if (step === 1) {
      const todayStr = new Date().toLocaleDateString('en-CA')
      if (!form.availableFrom) errs.availableFrom = 'Required'
      else if (form.availableFrom < todayStr) errs.availableFrom = 'Date cannot be in the past'

      if (!form.availableTo) errs.availableTo = 'Required'
      else if (form.availableTo < (form.availableFrom || todayStr)) errs.availableTo = 'Date cannot be before Available From date'

      if (!form.timeFrom) errs.timeFrom = 'Required'
      if (!form.timeTo) errs.timeTo = 'Required'

      if (!form.availableDays || form.availableDays.length === 0) {
        errs.availableDays = 'Select at least one day'
      }
    }
    if (step === 2) {
      if (!form.workSkills.trim()) errs.workSkills = 'Required'
      if (!form.qualifications.length) errs.qualifications = 'Add at least one qualification'
    }
    if (step === 3) {
      const pw = form.password
      const checks = pwChecks(pw)
      if (!Object.values(checks).every(Boolean))
        errs.password = 'Password does not meet requirements'
      if (form.password !== form.confirmPassword)
        errs.confirmPassword = 'Passwords do not match'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const next = () => { if (validate()) setStep((s) => s + 1) }
  const back = () => setStep((s) => s - 1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch(`${API_BASE}/api/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          personalEmail: form.personalEmail,
          phone: form.phone,
          username: toUsername(form.firstName, form.lastName),
          availableFrom: form.availableFrom,
          availableTo: form.availableTo,
          timeFrom: form.timeFrom,
          timeTo: form.timeTo,
          availableDays: form.availableDays.join(', '),
          workSkills: form.workSkills,
          qualifications: form.qualifications,
          completedCourses: form.completedCourses,
          validCertificates: form.validCertificates,
          experiences: form.experiences,
          totalExperience: form.totalExperience,
          expectedHourlyRate: form.expectedHourlyRate,
          appliedFor: form.appliedFor,
          password: form.password,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Server error')

      setSubmitted(true)
    } catch (err) {
      setSubmitError('❌ Failed to submit: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  /* ── pw strength ── */
  const checks = pwChecks(form.password)
  const strength = Object.values(checks).filter(Boolean).length

  /* ── SUBMITTED ── */
  if (submitted) {
    return (
      <div className="cr-page">
        <div className="cr-success-wrap">
          <div className="cr-success-icon"><CheckCircle size={48} /></div>
          <h1>Registration Submitted!</h1>
          <p>
            Thank you, <strong>{form.firstName} {form.lastName}</strong>. Your application has been
            received. We will review your details and contact you.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="cr-page">
      {/* ── Brand bar ── */}
      <header className="cr-brand">
        <div className="cr-brand-logo">
          <img src="/assets/logo.png" alt="SimtechON" onError={(e) => { e.target.style.display = 'none' }} />
          <span>SimtechON</span>
        </div>
        <p className="cr-brand-sub">Candidate Registration</p>
      </header>

      <main className="cr-main">
        {/* ── Progress stepper ── */}
        <div className="cr-stepper">
          {STEPS.map((label, i) => (
            <div key={i} className={`cr-step ${i < step ? 'done' : i === step ? 'active' : ''}`}>
              <div className="cr-step-dot">
                {i < step ? <CheckCircle size={16} /> : <span>{i + 1}</span>}
              </div>
              <span className="cr-step-label">{label}</span>
              {i < STEPS.length - 1 && <div className="cr-step-line" />}
            </div>
          ))}
        </div>

        {/* ── Form card ── */}
        <div className="cr-card">
          <form onSubmit={step === STEPS.length - 1 ? handleSubmit : (e) => { e.preventDefault(); next() }}>

            {/* ════ STEP 0: Personal Info ════ */}
            {step === 0 && (
              <div className="cr-section">
                <div className="cr-section-header">
                  <div className="cr-section-icon"><User size={22} /></div>
                  <div>
                    <h2>Personal Information</h2>
                    <p>Provide your legal name and contact details.</p>
                  </div>
                </div>



                <div className="cr-row-2">
                  <div className="cr-field">
                    <label>First Name <span>*</span></label>
                    <div className="cr-input-wrap">
                      <User size={16} className="cr-icon" />
                      <input
                        id="firstName"
                        type="text"
                        placeholder="e.g. John"
                        value={form.firstName}
                        onChange={set('firstName')}
                        className={errors.firstName ? 'err' : ''}
                      />
                    </div>
                    {errors.firstName && <span className="cr-error">{errors.firstName}</span>}
                  </div>
                  <div className="cr-field">
                    <label>Last Name <span>*</span></label>
                    <div className="cr-input-wrap">
                      <User size={16} className="cr-icon" />
                      <input
                        id="lastName"
                        type="text"
                        placeholder="e.g. Smith"
                        value={form.lastName}
                        onChange={set('lastName')}
                        className={errors.lastName ? 'err' : ''}
                      />
                    </div>
                    {errors.lastName && <span className="cr-error">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="cr-field">
                  <label>Personal Email <span>*</span></label>
                  <div className="cr-input-wrap">
                    <Mail size={16} className="cr-icon" />
                    <input
                      id="personalEmail"
                      type="email"
                      placeholder="yourname@example.com"
                      value={form.personalEmail}
                      onChange={set('personalEmail')}
                      className={errors.personalEmail ? 'err' : ''}
                    />
                  </div>
                  {errors.personalEmail && <span className="cr-error">{errors.personalEmail}</span>}
                </div>

                <div className="cr-field">
                  <label>Phone Number <span>*</span></label>
                  <div className="cr-input-wrap">
                    <Phone size={16} className="cr-icon" />
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+353 87 123 4567"
                      value={form.phone}
                      onChange={set('phone')}
                      className={errors.phone ? 'err' : ''}
                    />
                  </div>
                  {errors.phone && <span className="cr-error">{errors.phone}</span>}
                </div>
                <div className="cr-field">
                  <label>Applying For (Job Role) <span>*</span></label>
                  <div className="cr-input-wrap">
                    <Briefcase size={16} className="cr-icon" />
                    <select
                      id="appliedFor"
                      value={form.appliedFor}
                      onChange={set('appliedFor')}
                      className={errors.appliedFor ? 'err' : ''}
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', fontSize: '0.95rem', outline: 'none', appearance: 'auto' }}
                    >
                      <option value="">-- Select a Job Position --</option>
                      {jobs.map(job => (
                        <option key={job.id} value={job.title}>{job.title}</option>
                      ))}
                    </select>
                  </div>
                  {errors.appliedFor && <span className="cr-error">{errors.appliedFor}</span>}
                </div>

                {/* Auto-generated fields preview
                <div className="cr-auto-block">
                  <div className="cr-auto-header">
                    <Key size={14} /> Auto-generated fields (set after submission)
                  </div>
                  <div className="cr-auto-row">
                    <div className="cr-auto-field">
                      <label>Username</label>
                      <div className="cr-auto-value">{username || 'first.lastname'}</div>
                    </div>
                    <div className="cr-auto-field">
                      <label>Company Email</label>
                      <div className="cr-auto-value">{companyEmail || 'first.lastname@simtechon.com'}</div>
                    </div>
                  </div>
                </div> */}
              </div>
            )}

            {/* ════ STEP 1: Availability ════ */}
            {step === 1 && (
              <div className="cr-section">
                <div className="cr-section-header">
                  <div className="cr-section-icon"><Calendar size={22} /></div>
                  <div>
                    <h2>Availability</h2>
                    <p>When are you available to start and how many hours can you work?</p>
                  </div>
                </div>

                <div className="cr-row-2">
                  <div className="cr-field">
                    <label>Available From <span>*</span></label>
                    <div className="cr-input-wrap">
                      <Calendar size={16} className="cr-icon" />
                      <input
                        id="availableFrom"
                        type="date"
                        min={new Date().toLocaleDateString('en-CA')}
                        value={form.availableFrom}
                        onChange={set('availableFrom')}
                        className={errors.availableFrom ? 'err' : ''}
                      />
                    </div>
                    {errors.availableFrom && <span className="cr-error">{errors.availableFrom}</span>}
                    <small>Format: DD MMM YYYY</small>
                  </div>
                  <div className="cr-field">
                    <label>Available To <span>*</span></label>
                    <div className="cr-input-wrap">
                      <Calendar size={16} className="cr-icon" />
                      <input
                        id="availableTo"
                        type="date"
                        min={form.availableFrom || new Date().toLocaleDateString('en-CA')}
                        value={form.availableTo}
                        onChange={set('availableTo')}
                        className={errors.availableTo ? 'err' : ''}
                      />
                    </div>
                    {errors.availableTo && <span className="cr-error">{errors.availableTo}</span>}
                    <small>Format: DD MMM YYYY</small>
                  </div>
                </div>

                <div className="cr-row-2">
                  <div className="cr-field">
                    <label>Time Available From <span>*</span></label>
                    <div className="cr-input-wrap">
                      <Clock size={16} className="cr-icon" />
                      <input
                        id="timeFrom"
                        type="time"
                        value={form.timeFrom}
                        onChange={set('timeFrom')}
                        className={errors.timeFrom ? 'err' : ''}
                      />
                    </div>
                    {errors.timeFrom && <span className="cr-error">{errors.timeFrom}</span>}
                    <small>24-hour format (e.g. 09:00)</small>
                  </div>
                  <div className="cr-field">
                    <label>Time Available To <span>*</span></label>
                    <div className="cr-input-wrap">
                      <Clock size={16} className="cr-icon" />
                      <input
                        id="timeTo"
                        type="time"
                        value={form.timeTo}
                        onChange={set('timeTo')}
                        className={errors.timeTo ? 'err' : ''}
                      />
                    </div>
                    {errors.timeTo && <span className="cr-error">{errors.timeTo}</span>}
                    <small>24-hour format (e.g. 17:00)</small>
                  </div>
                </div>

                <div className="cr-field">
                  <label>Available Days <span>*</span></label>
                  <div className="cr-days-wrap">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <label key={day} className={`cr-day-pill ${form.availableDays?.includes(day) ? 'active' : ''}`}>
                        <input
                          type="checkbox"
                          checked={form.availableDays?.includes(day) || false}
                          onChange={() => toggleDay(day)}
                          style={{ display: 'none' }}
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                  {errors.availableDays && <span className="cr-error">{errors.availableDays}</span>}
                  <small>Select the days you are available to work</small>
                </div>

                {/* Expecting Rate */}
                <div className="cr-row-2">
                  <div className="cr-field">
                    <label>Expecting Rate – Hourly (€)</label>
                    <div className="cr-input-wrap">
                      <Euro size={16} className="cr-icon" />
                      <input
                        id="expectedHourlyRate"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g. 25.00"
                        value={form.expectedHourlyRate}
                        onChange={set('expectedHourlyRate')}
                      />
                    </div>
                  </div>
                  <div className="cr-field" style={{ visibility: 'hidden' }}></div>
                </div>
              </div>
            )}

            {/* ════ STEP 2: Skills & Qualifications ════ */}
            {step === 2 && (
              <div className="cr-section">
                <div className="cr-section-header">
                  <div className="cr-section-icon"><Briefcase size={22} /></div>
                  <div>
                    <h2>Skills &amp; Qualifications</h2>
                  </div>
                </div>

                <div className="cr-field">
                  <label>Work Skills <span>*</span></label>
                  <textarea
                    id="workSkills"
                    rows={3}
                    placeholder="List the IT skills and tasks you can perform confidently (e.g. network setup, hardware repair, Microsoft 365 admin)…"
                    value={form.workSkills}
                    onChange={set('workSkills')}
                    className={errors.workSkills ? 'err' : ''}
                  />
                  {errors.workSkills && <span className="cr-error">{errors.workSkills}</span>}
                </div>

                <div className="cr-field">
                  <label>Experience</label>
                  <div className="cr-input-wrap">
                    <Briefcase size={16} className="cr-icon" />
                    <select
                      id="totalExperience"
                      value={form.totalExperience}
                      onChange={set('totalExperience')}
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', color: form.totalExperience ? '#0f172a' : '#94a3b8', fontSize: '0.95rem', outline: 'none', appearance: 'auto' }}
                    >
                      <option value="">Select range</option>
                      <option value="Fresher / less than 1 year">Fresher / less than 1 year</option>
                      <option value="1 – 3 years">1 – 3 years</option>
                      <option value="3 – 5 years">3 – 5 years</option>
                      <option value="5 – 8 years">5 – 8 years</option>
                      <option value="8 – 12 years">8 – 12 years</option>
                      <option value="12+ years">12+ years</option>
                    </select>
                  </div>
                </div>

                <div className="cr-field">

                  {form.totalExperience && form.totalExperience !== 'Fresher / less than 1 year' && (<>
                  {/* ── Experience entry builder ── */}
                  {form.experiences.map((exp, idx) => (
                    <div key={idx} className="cr-exp-card">
                      <div className="cr-exp-card-header">
                        <strong>EXPERIENCE {idx + 1}</strong>
                        <button type="button" className="cr-exp-remove-link" onClick={() => removeExp(idx)}>Remove</button>
                      </div>
                      <div className="cr-row-2">
                        <div className="cr-field">
                          <label>Company name</label>
                          <div className="cr-input-wrap">
                            <Briefcase size={16} className="cr-icon" />
                            <input type="text" value={exp.company} readOnly />
                          </div>
                        </div>
                        <div className="cr-field">
                          <label>Job title</label>
                          <div className="cr-input-wrap">
                            <Award size={16} className="cr-icon" />
                            <input type="text" value={exp.jobTitle} readOnly />
                          </div>
                        </div>
                      </div>
                      <div className="cr-row-2">
                        <div className="cr-field">
                          <label>Start date</label>
                          <div className="cr-input-wrap">
                            <Calendar size={16} className="cr-icon" />
                            <input type="text" value={exp.startDate} readOnly />
                          </div>
                        </div>
                        <div className="cr-field">
                          <label>End date</label>
                          <div className="cr-input-wrap">
                            <Calendar size={16} className="cr-icon" />
                            <input type="text" value={exp.currentlyWork ? 'Present' : exp.endDate} readOnly />
                          </div>
                        </div>
                      </div>
                      {exp.responsibilities && (
                        <div className="cr-field">
                          <label>Key responsibilities / achievements</label>
                          <div className="cr-exp-resp-preview">{exp.responsibilities}</div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* ── New experience input form ── */}
                  <div className="cr-exp-builder">
                    <div className="cr-exp-builder-title">EXPERIENCE {form.experiences.length + 1}</div>
                    <div className="cr-row-2">
                      <div className="cr-field">
                        <label>Company name</label>
                        <div className="cr-input-wrap">
                          <Briefcase size={16} className="cr-icon" />
                          <input
                            id="exp-company"
                            type="text"
                            placeholder="e.g. Acme Corp"
                            value={expInput.company}
                            onChange={(e) => setExpInput(p => ({ ...p, company: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="cr-field">
                        <label>Job title</label>
                        <div className="cr-input-wrap">
                          <Award size={16} className="cr-icon" />
                          <input
                            id="exp-jobTitle"
                            type="text"
                            placeholder="e.g. Software Engineer"
                            value={expInput.jobTitle}
                            onChange={(e) => setExpInput(p => ({ ...p, jobTitle: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="cr-row-2">
                      <div className="cr-field">
                        <label>Start date</label>
                        <div className="cr-input-wrap">
                          <Calendar size={16} className="cr-icon" />
                          <input
                            id="exp-startDate"
                            type="text"
                            placeholder="MM/YYYY"
                            maxLength={7}
                            value={expInput.startDate}
                            onChange={(e) => setExpInput(p => ({ ...p, startDate: formatMonthYear(e.target.value) }))}
                          />
                        </div>
                      </div>
                      <div className="cr-field">
                        <label>End date</label>
                        <div className="cr-input-wrap">
                          <Calendar size={16} className="cr-icon" />
                          <input
                            id="exp-endDate"
                            type="text"
                            placeholder="MM/YYYY"
                            maxLength={7}
                            value={expInput.endDate}
                            disabled={expInput.currentlyWork}
                            onChange={(e) => setExpInput(p => ({ ...p, endDate: formatMonthYear(e.target.value) }))}
                          />
                        </div>
                      </div>
                    </div>
                    <label className="cr-exp-current-check">
                      <input
                        type="checkbox"
                        checked={expInput.currentlyWork}
                        onChange={(e) => setExpInput(p => ({ ...p, currentlyWork: e.target.checked, endDate: e.target.checked ? '' : p.endDate }))}
                      />
                      <span>I currently work here</span>
                    </label>
                    <div className="cr-field" style={{ marginTop: '0.75rem' }}>
                      <label>Key responsibilities / achievements</label>
                      <textarea
                        id="exp-responsibilities"
                        rows={4}
                        placeholder="Briefly describe your role, key projects, and measurable achievements"
                        value={expInput.responsibilities}
                        onChange={(e) => setExpInput(p => ({ ...p, responsibilities: e.target.value }))}
                      />
                    </div>
                    <button type="button" className="cr-exp-add-btn" onClick={addExp}>
                      + Add Experience
                    </button>
                  </div>
                  </>)}

                  {!form.totalExperience && (
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    </p>
                  )}
                  {form.totalExperience === 'Fresher / less than 1 year' && (
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                    </p>
                  )}
                </div>

                <div className="cr-field">
                  <label>Qualifications <span>*</span></label>

                  {/* ── Qualification entry builder ── */}
                  <div className={`cr-qual-builder ${errors.qualifications ? 'err-border' : ''}`}>
                    <div className="cr-qual-inputs">
                      <div className="cr-input-wrap" style={{ flex: 2 }}>
                        <BookOpen size={16} className="cr-icon" />
                        <input
                          id="qual-degree"
                          type="text"
                          placeholder="Degree / Diploma / Title"
                          value={qualInput.degree}
                          onChange={(e) => setQualInput((p) => ({ ...p, degree: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addQual())}
                        />
                      </div>
                      <div className="cr-input-wrap" style={{ flex: 2 }}>
                        <Award size={16} className="cr-icon" />
                        <input
                          id="qual-institution"
                          type="text"
                          placeholder="Institution / University"
                          value={qualInput.institution}
                          onChange={(e) => setQualInput((p) => ({ ...p, institution: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addQual())}
                        />
                      </div>
                      <div className="cr-input-wrap" style={{ flex: 1 }}>
                        <Calendar size={16} className="cr-icon" />
                        <input
                          id="qual-startYear"
                          type="number"
                          min="1950"
                          max={new Date().getFullYear()}
                          placeholder="Start Year"
                          value={qualInput.startYear}
                          maxLength={4}
                          onChange={(e) => setQualInput((p) => ({ ...p, startYear: e.target.value.slice(0, 4) }))}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addQual())}
                        />
                      </div>
                      <div className="cr-input-wrap" style={{ flex: 1 }}>
                        <Calendar size={16} className="cr-icon" />
                        <input
                          id="qual-endYear"
                          type="number"
                          min="1950"
                          max={new Date().getFullYear() + 10}
                          placeholder="End Year"
                          value={qualInput.endYear}
                          maxLength={4}
                          onChange={(e) => setQualInput((p) => ({ ...p, endYear: e.target.value.slice(0, 4) }))}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addQual())}
                        />
                      </div>
                      <button type="button" className="cr-qual-add-btn" onClick={addQual}>
                        + Add
                      </button>
                    </div>

                    {/* ── Added qualification cards ── */}
                    {form.qualifications.length > 0 && (
                      <ul className="cr-qual-list">
                        {form.qualifications.map((q, i) => (
                          <li key={i} className="cr-qual-card">
                            <div className="cr-qual-card-body">
                              <span className="cr-qual-degree">{q.degree}</span>
                              {q.institution && <span className="cr-qual-inst">{q.institution}</span>}
                              {(q.startYear || q.endYear) && (
                                <span className="cr-qual-year">
                                  {q.startYear}{q.startYear && q.endYear ? ' – ' : ''}{q.endYear}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              className="cr-qual-remove"
                              aria-label="Remove"
                              onClick={() => removeQual(i)}
                            >
                              ✕
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {errors.qualifications && <span className="cr-error">{errors.qualifications}</span>}
                  <small>Enter each qualification and press <strong>+ Add</strong> or <kbd>Enter</kbd></small>
                </div>

                <div className="cr-field">
                  <label>Completed Courses</label>
                  <textarea
                    id="completedCourses"
                    rows={3}
                    placeholder="Any training courses or online certifications completed (e.g. CCNA, Azure AZ-900, ITIL Foundation)…"
                    value={form.completedCourses}
                    onChange={set('completedCourses')}
                  />
                  <small>Courses or training you have completed</small>
                </div>

                <div className="cr-field">
                  <label>Valid Certificates</label>
                  <textarea
                    id="validCertificates"
                    rows={3}
                    placeholder="List any currently valid professional certificates and their expiry dates…"
                    value={form.validCertificates}
                    onChange={set('validCertificates')}
                  />
                  <small>Valid certificates currently held</small>
                </div>


              </div>
            )}

            {/* ════ STEP 3: Account Setup ════ */}
            {step === 3 && (
              <div className="cr-section">
                <div className="cr-section-header">
                  <div className="cr-section-icon"><Key size={22} /></div>
                  <div>
                    <h2>Account Setup</h2>
                    <p>Review your auto-generated credentials and set a secure password.</p>
                  </div>
                </div>


                {/* Password */}
                <div className="cr-field">
                  <label>Set Password <span>*</span></label>
                  <div className="cr-input-wrap">
                    <Key size={16} className="cr-icon" />
                    <input
                      id="password"
                      type={showPw ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={form.password}
                      onChange={set('password')}
                      className={errors.password ? 'err' : ''}
                    />
                    <button type="button" className="cr-eye" onClick={() => setShowPw((v) => !v)}>
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <span className="cr-error">{errors.password}</span>}

                  {/* Strength meter */}
                  {form.password && (
                    <div className="cr-pw-strength">
                      <div className="cr-pw-bar">
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} className={`cr-pw-seg ${i < strength ? `s${strength}` : ''}`} />
                        ))}
                      </div>
                      <span className={`cr-pw-label s${strength}`}>
                        {['', 'Weak', 'Fair', 'Good', 'Strong'][strength]}
                      </span>
                    </div>
                  )}

                  <div className="cr-pw-rules">
                    <PwRule ok={checks.length} label="At least 8 characters" />
                    <PwRule ok={checks.upper} label="One uppercase letter" />
                    <PwRule ok={checks.lower} label="One lowercase letter" />
                    <PwRule ok={checks.number} label="One number" />
                  </div>
                </div>

                <div className="cr-field">
                  <label>Confirm Password <span>*</span></label>
                  <div className="cr-input-wrap">
                    <Key size={16} className="cr-icon" />
                    <input
                      id="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      value={form.confirmPassword}
                      onChange={set('confirmPassword')}
                      className={errors.confirmPassword ? 'err' : ''}
                    />
                    <button type="button" className="cr-eye" onClick={() => setShowConfirm((v) => !v)}>
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="cr-error">{errors.confirmPassword}</span>}
                </div>
              </div>
            )}

            {/* ── Navigation buttons ── */}
            <div className="cr-nav">
              {step > 0 && (
                <button type="button" className="cr-btn-back" onClick={back}>
                  ← Back
                </button>
              )}
              <button type="submit" className="cr-btn-next" disabled={submitting}>
                {step === STEPS.length - 1 ? (
                  submitting
                    ? <><Loader size={17} className="cr-spin" /> Saving…</>
                    : <><CheckCircle size={17} /> Submit Registration</>
                ) : (
                  <>Next <ChevronRight size={17} /></>
                )}
              </button>
            </div>
            {submitError && <p className="cr-submit-error">{submitError}</p>}
          </form>
        </div>
      </main>
    </div>
  )
}
