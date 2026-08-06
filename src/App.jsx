import { useState, useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import Home from './pages/Home/Home.jsx'
import About from './pages/About/About.jsx'
import Services from './pages/Services/Services.jsx'
import Jobs from './pages/Jobs/Jobs.jsx'
import JobDetail from './pages/Jobs/JobDetail.jsx'
import Contact from './pages/Contact/Contact.jsx'
import Login from './pages/Login/Login.jsx'
import HRDashboard from './pages/HRDashboard/HRDashboard.jsx'
import CEODashboard from './pages/CEODashboard/CEODashboard.jsx'
import CandidateRegister from './pages/CandidateRegister/CandidateRegister.jsx'
import CandidateLogin from './pages/CandidateLogin/CandidateLogin.jsx'
import CandidateDashboard from './pages/CandidateDashboard/CandidateDashboard.jsx'
import ScrollToTopBtn from './components/ScrollToTopBtn/ScrollToTopBtn.jsx'
import './index.css'

function PageLoader({ visible }) {
  return (
    <div className={`page-loader${visible ? ' active' : ''}`} aria-hidden={!visible}>
      <div className="page-loader__ring" />
    </div>
  )
}

function App() {
  const location = useLocation()

  // displayPath is what's actually rendered — it lags behind location while spinner is up
  const [displayPath, setDisplayPath] = useState(location.pathname)
  const [displaySearch, setDisplaySearch] = useState(location.search)
  const [loading, setLoading] = useState(false)
  const timerRef = useRef(null)
  const isFirst = useRef(true)

  useEffect(() => {
    // On first render just sync without spinner
    if (isFirst.current) {
      isFirst.current = false
      setDisplayPath(location.pathname)
      setDisplaySearch(location.search)
      return
    }

    // 1. Show the spinner first — before any scroll or page change
    setLoading(true)

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      // 2. Scroll to top while spinner is covering the screen (invisible to user)
      window.scrollTo({ top: 0, behavior: 'instant' })
      // 3. Swap in the new page, then fade spinner out
      setDisplayPath(location.pathname)
      setDisplaySearch(location.search)
      setLoading(false)
    }, 600)

    return () => clearTimeout(timerRef.current)
  }, [location.pathname, location.search])

  // Use a fake location object so Routes renders the page we want (not the pending one)
  const fakeLocation = { ...location, pathname: displayPath, search: displaySearch }
  const currentPath = displayPath.replace(/\/$/, '')
  const hideLayout = ['/hr-dashboard', '/ceo-dashboard', '/candidate-register', '/candidate-login', '/candidate-dashboard'].includes(currentPath)

  return (
    <div className="app-container">
      <PageLoader visible={loading} />
      {!hideLayout && <Header />}
      <main style={{ padding: hideLayout ? 0 : undefined }}>
        <Routes location={fakeLocation}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hr-dashboard" element={<HRDashboard />} />
          <Route path="/ceo-dashboard" element={<CEODashboard />} />
          <Route path="/candidate-register" element={<CandidateRegister />} />
          <Route path="/candidate-login" element={<CandidateLogin />} />
          <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
      <ScrollToTopBtn />
    </div>
  )
}

export default App
