import { NavLink } from 'react-router-dom'
import './Navigation.css'

const LINKS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/journal', label: 'Journal' },
  { to: '/nest', label: 'The Nest' },
  { to: '/resources', label: 'Resources' },
  { to: '/courses', label: 'Courses', highlight: true },
]

function Navigation() {
  return (
    <nav className="navigation">
      <ul className="navigation__list">
        {LINKS.map((link) => (
          <li className="navigation__item" key={link.to}>
            <NavLink
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `navigation__link${link.highlight ? ' navigation__link_highlight' : ''}${
                  isActive ? ' navigation__link_active' : ''
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
