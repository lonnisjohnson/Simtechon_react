import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'
import './ScrollToTopBtn.css'

function ScrollToTopBtn() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      id="scroll-to-top-btn"
      className={`scroll-top-btn ${visible ? 'scroll-top-btn--visible' : ''}`}
      onClick={scrollUp}
      aria-label="Scroll to top"
    >
      <ChevronUp size={22} strokeWidth={2.5} />
    </button>
  )
}

export default ScrollToTopBtn
