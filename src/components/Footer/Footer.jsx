import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <p className="footer__text">
        &copy; {new Date().getFullYear()} Bleu Ape Trading — a TripleTen final project.
      </p>
      <p className="footer__credit">Made by Laura Alburez</p>
    </footer>
  )
}

export default Footer
