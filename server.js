import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

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
      username, companyEmail,
      availableFrom, availableTo, timeFrom, timeTo,
      hoursPerDay, hoursPerWeek, hoursPerMonth,
      workSkills, qualifications,
      completedCourses, validCertificates,
      expectedHourlyRate, expectedWeeklyRate,
      appliedFor,
    } = req.body

    // Generate next candidate id: C100001, C100002...
    const [[{ maxNum }]] = await pool.execute(
      `SELECT MAX(CAST(SUBSTRING(id, 2) AS UNSIGNED)) as maxNum FROM candidates WHERE id LIKE 'C%'`
    )
    const nextNum = (maxNum && maxNum >= 1001) ? maxNum + 1 : 1001
    const candidateId = `C${nextNum}`


    await pool.execute(
      `INSERT INTO candidates
        (id, first_name, last_name, personal_email, phone, username, company_email,
         available_from, available_to, time_from, time_to,
         hours_per_day, hours_per_week, hours_per_month,
         work_skills, qualifications, completed_courses, valid_certificates,
         expected_hourly_rate, expected_weekly_rate, applied_for)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        candidateId,
        firstName, lastName, personalEmail, phone, username, companyEmail,
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
    res.json(rows)
  } catch (err) {
    console.error('GET /api/candidates error:', err)
    res.status(500).json({ error: err.message })
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
    res.json(rows)
  } catch (err) {
    console.error('GET /api/jobs error:', err)
    res.status(500).json({ error: err.message })
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
