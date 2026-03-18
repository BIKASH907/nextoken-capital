import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import { useRouter } from 'next/router'

export default function Navbar({ onLogin, onRegister }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Markets', href: '/markets' },
    { label: 'Exchange', href: '/exchange' },
    { label: 'Bonds', href: '/bonds' },
    { label: 'Equity & IPO', href: '/equity' },
    { label: 'Tokenize', href: '/tokenize' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      height: 60, display: 'flex', alignItems: 'center', padding: '0 5%',
      background: '#0B0E11', borderBottom: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(20px)'
    }}>
      {/* Logo */}
      <div
        onClick={() => router.push('/')}
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0, marginRight: '2rem' }}
      >
        <span className="logo-nxt">NXT</span>
        <div className="logo-sep" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="logo-name">NEXTOKEN</span>
          <span className="logo-cap">CAPITAL</span>
        </div>
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '0.25rem', flex: 1 }}>
        {navLinks.map(link => (
          <button
            key={link.href}
            onClick={() => router.push(link.href)}
            style={{
              padding: '0.45rem 0.75rem',
              background: router.pathname === link.href ? '#1E2329' : 'transparent',
              border: 'none',
              borderRadius: 4,
              fontSize: '0.82rem',
              fontWeight: 500,
              color: router.pathname === link.href ? 'white' : 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={e => { e.target.style.color = 'white'; e.target.style.background = '#1E2329' }}
            onMouseLeave={e => {
              e.target.style.color = router.pathname === link.href ? 'white' : 'rgba(255,255,255,0.45)'
              e.target.style.background = router.pathname === link.href ? '#1E2329' : 'transparent'
            }}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        {user ? (
          <>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginRight: '0.25rem' }}>
              {user.first_name} {user.last_name}
            </span>
            <button
              className="btn btn-gold btn-sm"
              onClick={() => router.push('/dashboard')}
              style={{ background: '#F0B90B', color: 'black', border: 'none', padding: '0.4rem 1rem', borderRadius: 4, fontWeight: 800, cursor: 'pointer', fontSize: '0.78rem' }}
            >
              Dashboard
            </button>
            <button
              onClick={logout}
              style={{ padding: '0.4rem 1rem', background: 'transparent', border: '1px solid rgba(240,185,11,0.25)', color: 'rgba(255,255,255,0.5)', borderRadius: 4, fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onLogin}
              style={{ padding: '0.4rem 1rem', background: 'transparent', border: '1px solid rgba(240,185,11,0.25)', color: 'rgba(255,255,255,0.55)', borderRadius: 4, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}
            >
              Log In
            </button>
            <button
              onClick={onRegister}
              style={{ padding: '0.4rem 1.1rem', background: '#F0B90B', color: 'black', border: 'none', borderRadius: 4, fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
