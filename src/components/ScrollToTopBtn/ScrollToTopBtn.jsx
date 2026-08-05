import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronUp } from 'lucide-react'
import './ScrollToTopBtn.css'

function ScrollToTopBtn() {
  const [visible, setVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  let themeClass = ''
  if (location.pathname === '/hr-dashboard') themeClass = 'theme-hr'
  if (location.pathname === '/ceo-dashboard') themeClass = 'theme-ceo'

  return (
    <button
      id="scroll-to-top-btn"
      className={`scroll-top-btn ${themeClass} ${visible ? 'scroll-top-btn--visible' : ''}`}
      onClick={scrollUp}
      aria-label="Scroll to top"
    >
      <ChevronUp size={22} strokeWidth={2.5} />
    </button>
  )
}

export default ScrollToTopBtn
