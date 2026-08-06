import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import crypto from 'crypto'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Helper to hash candidate password securely
function hashPassword(pw) {
  if (!pw) return null
  return crypto.scryptSync(pw, 'simtechon_salt_key_2026', 64).toString('hex')
}

// Root status endpoint
app.get('/', (req, res) => {
  res.json({ message: '🚀 Simtechon API Backend is running live!' })
})

// ── MySQL connection pool ──────────────────────────────────────────────────
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'simtechon',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  waitForConnections: true,
  connectionLimit: 10,
})

// ── Create table if it doesn't exist ─────────────────────────────────────
async function initDB() {
  const conn = await pool.getConnection()
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS candidates (
      id                    VARCHAR(20)   PRIMARY KEY,
      first_name            VARCHAR(100)    NOT NULL,
      last_name             VARCHAR(100)    NOT NULL,
      personal_email        VARCHAR(255)    NOT NULL,
      phone                 VARCHAR(50)     NOT NULL,
      applied_for           VARCHAR(255)    NOT NULL,
      username              VARCHAR(150),
      company_email         VARCHAR(255),
      password              VARCHAR(255),
      available_from        DATE,
      available_to          DATE,
      time_from             TIME,
      time_to               TIME,
      hours_per_day         INT,
      hours_per_week        INT,
      hours_per_month       INT,
      work_skills           TEXT,
      qualifications        JSON,
      completed_courses     TEXT,
      valid_certificates    TEXT,
      expected_hourly_rate  DECIMAL(10,2),
      expected_weekly_rate  DECIMAL(10,2),
      status                VARCHAR(50)   DEFAULT 'Pending',
      submitted_at          DATETIME      DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create Jobs table (job_id is the primary key)
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS jobs (
      job_id                VARCHAR(10)  PRIMARY KEY,
      title                 VARCHAR(200) NOT NULL,
      department            VARCHAR(100),
      location              VARCHAR(100),
      work_type             VARCHAR(50),
      employment_type       VARCHAR(50),
      experience            VARCHAR(100),
      payment_range         VARCHAR(100),
      about_role            TEXT,
      key_responsibilities  TEXT,
      looking_for           TEXT,
      nice_to_have          TEXT,
      what_we_offer         TEXT,
      status                VARCHAR(50) DEFAULT 'Active',
      created_at            DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  conn.release()
  console.log('✅ Database tables ready.')
}

// ── POST /api/candidates ──  Save new candidate ──────────────────────────
app.post('/api/candidates', async (req, res) => {
  try {
    const {
      firstName, lastName, personalEmail, phone,
      username, companyEmail, password,
      availableFrom, availableTo, timeFrom, timeTo,
      hoursPerDay, hoursPerWeek, hoursPerMonth,
      workSkills, qualifications,
      completedCourses, validCertificates,
      expectedHourlyRate, expectedWeeklyRate,
      appliedFor,
    } = req.body

    // Generate next candidate id starting at C100001: C100001, C100002...
    const [[{ maxNum }]] = await pool.execute(
      `SELECT MAX(CAST(SUBSTRING(id, 2) AS UNSIGNED)) as maxNum FROM candidates WHERE id LIKE 'C%'`
    )
    const nextNum = (maxNum && maxNum >= 100001) ? maxNum + 1 : 100001
    const candidateId = `C${nextNum}`

    // Hash password before saving to DB
    const hashedPassword = password ? hashPassword(password) : null

    await pool.execute(
      `INSERT INTO candidates
        (id, first_name, last_name, personal_email, phone, username, company_email, password,
         available_from, available_to, time_from, time_to,
         hours_per_day, hours_per_week, hours_per_month,
         work_skills, qualifications, completed_courses, valid_certificates,
         expected_hourly_rate, expected_weekly_rate, applied_for)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        candidateId,
        firstName, lastName, personalEmail, phone, username, companyEmail, hashedPassword,
        availableFrom || null, availableTo || null,
        timeFrom || null, timeTo || null,
        hoursPerDay || null, hoursPerWeek || null, hoursPerMonth || null,
        workSkills,
        JSON.stringify(qualifications || []),
        completedCourses, validCertificates,
        expectedHourlyRate || null, expectedWeeklyRate || null,
        appliedFor || null,
      ]
    )

    res.status(201).json({ success: true, id: candidateId })
  } catch (err) {
    console.error('POST /api/candidates error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

// ── GET /api/candidates ── Fetch all candidates ───────────────────────────
app.get('/api/candidates', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM candidates ORDER BY submitted_at DESC'
    )
    res.json(Array.isArray(rows) ? rows : [])
  } catch (err) {
    console.error('GET /api/candidates error:', err)
    res.status(500).json([])
  }
})

// ── GET /api/candidates/:id ── Fetch single candidate ─────────────────────
app.get('/api/candidates/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM candidates WHERE id = ?',
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (err) {
    console.error('GET /api/candidates/:id error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/candidate-login ── Candidate login with email + password ─────
app.post('/api/candidate-login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

    const [rows] = await pool.execute(
      'SELECT * FROM candidates WHERE personal_email = ?',
      [email.toLowerCase().trim()]
    )

    if (!rows.length) return res.status(401).json({ error: 'Invalid email or password' })

    const candidate = rows[0]
    const hashedPassword = hashPassword(password)

    // Verify hashed password (or plain text if legacy record)
    if (!candidate.password || (candidate.password !== hashedPassword && candidate.password !== password)) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Return everything except the password
    const { password: _pw, ...safe } = candidate
    res.json({ success: true, candidate: safe })
  } catch (err) {
    console.error('POST /api/candidate-login error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ── PUT /api/candidates/:id ── Candidate self-update ──────────────────────
app.put('/api/candidates/:id', async (req, res) => {
  try {
    const {
      available_from, available_to, time_from, time_to,
      hours_per_day, hours_per_week, hours_per_month,
      work_skills, qualifications,
      completed_courses, valid_certificates,
      expected_hourly_rate, expected_weekly_rate,
    } = req.body
    await pool.execute(
      `UPDATE candidates SET
        available_from=?, available_to=?, time_from=?, time_to=?,
        hours_per_day=?, hours_per_week=?, hours_per_month=?,
        work_skills=?, qualifications=?,
        completed_courses=?, valid_certificates=?,
        expected_hourly_rate=?, expected_weekly_rate=?
       WHERE id=?`,
      [
        available_from || null, available_to || null,
        time_from || null, time_to || null,
        hours_per_day || null, hours_per_week || null, hours_per_month || null,
        work_skills,
        JSON.stringify(qualifications || []),
        completed_courses, valid_certificates,
        expected_hourly_rate || null, expected_weekly_rate || null,
        req.params.id,
      ]
    )
    res.json({ success: true })
  } catch (err) {
    console.error('PUT /api/candidates/:id error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})


// ── PATCH /api/candidates/:id/status ── Update candidate status ───────────
app.patch('/api/candidates/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    await pool.execute(
      'UPDATE candidates SET status = ? WHERE id = ?',
      [status, req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    console.error('PATCH /api/candidates status error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ── GET /api/jobs ── Fetch active jobs ─────────────────────────────────────
app.get('/api/jobs', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM jobs ORDER BY created_at DESC')
    res.json(Array.isArray(rows) ? rows : [])
  } catch (err) {
    console.error('GET /api/jobs error:', err)
    res.status(500).json([])
  }
})

// ── POST /api/jobs ── Create new job ───────────────────────────────────────
app.post('/api/jobs', async (req, res) => {
  try {
    const {
      title, department, location, work_type, employment_type,
      experience, payment_range, about_role, key_responsibilities,
      looking_for, nice_to_have, what_we_offer
    } = req.body

    // Generate next job_id: J1001, J1002...
    const [[{ maxNum }]] = await pool.execute(
      `SELECT MAX(CAST(SUBSTRING(job_id, 2) AS UNSIGNED)) as maxNum FROM jobs WHERE job_id LIKE 'J%'`
    )
    const nextNum = (maxNum && maxNum >= 1001) ? maxNum + 1 : 1001
    const job_id = `J${nextNum}`

    await pool.execute(
      `INSERT INTO jobs 
        (job_id, title, department, location, work_type, employment_type,
         experience, payment_range, about_role, key_responsibilities,
         looking_for, nice_to_have, what_we_offer) 
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        job_id,
        title, department, location, work_type || null, employment_type || null,
        experience || null, payment_range || null, about_role || null, key_responsibilities || null,
        looking_for || null, nice_to_have || null, what_we_offer || null
      ]
    )
    res.status(201).json({ success: true, job_id })
  } catch (err) {
    console.error('POST /api/jobs error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

// ── PUT /api/jobs/:job_id ── Full update of a job post ─────────────────────────
app.put('/api/jobs/:job_id', async (req, res) => {
  try {
    const {
      title, department, location, work_type, employment_type,
      experience, payment_range, about_role, key_responsibilities,
      looking_for, nice_to_have, what_we_offer, status
    } = req.body
    await pool.execute(
      `UPDATE jobs SET
        title=?, department=?, location=?, work_type=?, employment_type=?,
        experience=?, payment_range=?, about_role=?, key_responsibilities=?,
        looking_for=?, nice_to_have=?, what_we_offer=?, status=?
       WHERE job_id=?`,
      [
        title, department, location, work_type, employment_type,
        experience, payment_range, about_role, key_responsibilities,
        looking_for, nice_to_have, what_we_offer, status,
        req.params.job_id
      ]
    )
    res.json({ success: true })
  } catch (err) {
    console.error('PUT /api/jobs/:job_id error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

// ── PATCH /api/jobs/:job_id/status ── Change job status ────────────────────
app.patch('/api/jobs/:job_id/status', async (req, res) => {
  try {
    const { status } = req.body
    await pool.execute('UPDATE jobs SET status=? WHERE job_id=?', [status, req.params.job_id])
    res.json({ success: true })
  } catch (err) {
    console.error('PATCH /api/jobs status error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ── Start ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001
initDB()
  .then(() => app.listen(PORT, () => console.log(`🚀 API server running on port ${PORT}`)))
  .catch((err) => {
    console.error('❌ Failed to connect to MySQL:', err.message)
    console.error('   ➜ Check your environment variables (DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT)')
    process.exit(1)
  })
