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
  const [qualInput, setQualInput] = useState({ degree: '', institution: '', year: '' })
  
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    fetch(`${API_BASE}/api/jobs`)
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err))
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
    hoursPerDay: '',
    hoursPerWeek: '',
    hoursPerMonth: '',
    // Step 3 – Skills & Qualifications
    workSkills: '',
    qualifications: [],
    completedCourses: '',
    validCertificates: '',
    expectedHourlyRate: '',
    expectedWeeklyRate: '',
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
      qualifications: [...prev.qualifications, { degree: degree.trim(), institution: institution.trim(), year: year.trim() }],
    }))
    setQualInput({ degree: '', institution: '', year: '' })
    setErrors((prev) => ({ ...prev, qualifications: undefined }))
  }

  const removeQual = (idx) =>
    setForm((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== idx),
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
          firstName:           form.firstName,
          lastName:            form.lastName,
          personalEmail:       form.personalEmail,
          phone:               form.phone,
          username:            toUsername(form.firstName, form.lastName),
          companyEmail:        toCompanyEmail(form.firstName, form.lastName),
          availableFrom:       form.availableFrom,
          availableTo:         form.availableTo,
          timeFrom:            form.timeFrom,
          timeTo:              form.timeTo,
          hoursPerDay:         form.hoursPerDay,
          hoursPerWeek:        form.hoursPerWeek,
          hoursPerMonth:       form.hoursPerMonth,
          workSkills:          form.workSkills,
          qualifications:      form.qualifications,
          completedCourses:    form.completedCourses,
          validCertificates:   form.validCertificates,
          expectedHourlyRate:  form.expectedHourlyRate,
          expectedWeeklyRate:  form.expectedWeeklyRate,
          appliedFor:          form.appliedFor,
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
            received. HR will review your details and contact you at{' '}
            <strong>{form.personalEmail}</strong> within 2–3 business days.
          </p>
          <div className="cr-success-detail">
            <div><span>Username</span><strong>{username}</strong></div>
            <div><span>Company Email</span><strong>{companyEmail}</strong></div>
          </div>
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
                    <small>1st letter capital</small>
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
                    <small>1st letter capital</small>
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
                  <small>Must contain @ symbol</small>
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
                  <small>Include country code (e.g. +353 for Ireland)</small>
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

                <div className="cr-row-3">
                  <div className="cr-field">
                    <label>Hours / Day</label>
                    <div className="cr-input-wrap">
                      <Clock size={16} className="cr-icon" />
                      <input
                        id="hoursPerDay"
                        type="number"
                        min="1" max="24"
                        placeholder="e.g. 8"
                        value={form.hoursPerDay}
                        onChange={set('hoursPerDay')}
                      />
                    </div>
                    <small>How many hours per day</small>
                  </div>
                  <div className="cr-field">
                    <label>Hours / Week</label>
                    <div className="cr-input-wrap">
                      <Clock size={16} className="cr-icon" />
                      <input
                        id="hoursPerWeek"
                        type="number"
                        min="1" max="168"
                        placeholder="e.g. 40"
                        value={form.hoursPerWeek}
                        onChange={set('hoursPerWeek')}
                      />
                    </div>
                    <small>How many hours per week</small>
                  </div>
                  <div className="cr-field">
                    <label>Hours / Month</label>
                    <div className="cr-input-wrap">
                      <Clock size={16} className="cr-icon" />
                      <input
                        id="hoursPerMonth"
                        type="number"
                        min="1" max="744"
                        placeholder="e.g. 160"
                        value={form.hoursPerMonth}
                        onChange={set('hoursPerMonth')}
                      />
                    </div>
                    <small>How many hours per month</small>
                  </div>
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
                    <small>Your expected hourly rate in Euros</small>
                  </div>
                  <div className="cr-field">
                    <label>Expecting Rate – Weekly (€)</label>
                    <div className="cr-input-wrap">
                      <Euro size={16} className="cr-icon" />
                      <input
                        id="expectedWeeklyRate"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g. 1000.00"
                        value={form.expectedWeeklyRate}
                        onChange={set('expectedWeeklyRate')}
                      />
                    </div>
                    <small>Your expected weekly rate in Euros</small>
                  </div>
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
                    <p>Tell us what you can do and what you have achieved.</p>
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
                  <small>What work can you do confidently?</small>
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
                          id="qual-year"
                          type="number"
                          min="1950"
                          max={new Date().getFullYear()}
                          placeholder="Year"
                          value={qualInput.year}
                          onChange={(e) => setQualInput((p) => ({ ...p, year: e.target.value }))}
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
                              {q.year && <span className="cr-qual-year">{q.year}</span>}
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

                {/* Auto-generated info */}
                <div className="cr-account-info">
                  <div className="cr-account-row">
                    <div className="cr-account-item">
                      <User size={16} />
                      <div>
                        <label>Username (auto-generated)</label>
                        <strong>{username || '—'}</strong>
                      </div>
                    </div>
                    <div className="cr-account-item">
                      <Mail size={16} />
                      <div>
                        <label>Company Email (auto-generated)</label>
                        <strong>{companyEmail || '—'}</strong>
                      </div>
                    </div>
                  </div>
                  <p className="cr-account-note">
                    These credentials are assigned by SimtechON HR. Your username is
                    <strong> first.lastname</strong> and your company email will be activated once approved.
                  </p>
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
