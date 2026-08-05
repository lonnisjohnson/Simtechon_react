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
  const currentPath = location.pathname.replace(/\/$/, '')
  const hideLayout = ['/hr-dashboard', '/ceo-dashboard', '/candidate-register'].includes(currentPath)

  return (
    <div className="app-container">
      {!hideLayout && <Header />}
      <main style={{ padding: hideLayout ? 0 : undefined }}>
        <Routes>
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
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
      <ScrollToTopBtn />
    </div>
  )
}

export default App
