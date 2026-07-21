import { useState, useLayoutEffect } from 'react'
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
import ScrollToTopBtn from './components/ScrollToTopBtn/ScrollToTopBtn.jsx'
import './index.css'

function App() {

  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [loading, setLoading] = useState(false)
  const hideLayout = ['/hr-dashboard', '/ceo-dashboard', '/candidate-register'].includes(location.pathname)

  useLayoutEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      setDisplayLocation(location)
      setLoading(false)
    }, 450)
    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <div className="app-container">

      {/* Buffering spinner overlay */}
      <div className={`page-loader ${loading ? 'active' : ''}`}>
        <div className="page-loader__ring" />
      </div>

      {!hideLayout && <Header />}
      <main style={{ padding: hideLayout ? 0 : undefined }}>
        <Routes location={displayLocation}>
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
        </Routes>
      </main>
      {!hideLayout && <Footer />}
      <ScrollToTopBtn />
    </div>
  )
}

export default App
