import { useEffect, useRef } from 'react'
import './BinaryRainBackground.css'

// A Matrix-style "digital rain" of falling 0s and 1s, drawn on a canvas.
// Purely decorative and skipped entirely for users who prefer reduced motion.
function BinaryRainBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const fontSize = 16
    let columns
    let drops
    let animationId

    function resize() {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      columns = Math.floor(canvas.width / fontSize)
      drops = new Array(columns).fill(1)
    }

    resize()
    window.addEventListener('resize', resize)

    if (prefersReducedMotion) {
      // Respect the user's motion preference: paint one static frame, no animation loop.
      ctx.fillStyle = '#05070d'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      return () => window.removeEventListener('resize', resize)
    }

    function draw() {
      ctx.fillStyle = 'rgba(5, 7, 13, 0.14)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = Math.random() > 0.5 ? '1' : '0'
        const x = i * fontSize
        const y = drops[i] * fontSize

        ctx.fillStyle = Math.random() > 0.95 ? '#e8f1ff' : 'rgba(0, 229, 255, 0.75)'
        ctx.fillText(char, x, y)

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += 1
      }
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="binary-rain-bg" aria-hidden="true" />
}

export default BinaryRainBackground
