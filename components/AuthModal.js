import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import { useRouter } from 'next/router'

export default function AuthModal({ mode, onClose, onSwitch }) {
  const { login, register } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', password: '', account_type: 'investor'
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    let result
    if (mode === 'login') {
      result = await login(form.email, form.password)
    } else {
      if (form.password.length < 8) { setError('Password must be at least 8 characters'); setLoading(false); return }
      result = await register(form)
    }

    setLoading(false)
    if (result.success) {
      onClose()
      router.push('/dashboard')
    } else {
      setError(result.error || 'Something went wrong. Please try again.')
    }
  }

  const inp = {
    width: '100%', padding: '0.65rem 0.9rem', background: '#1E2329',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4,
    color: 'white', fontSize: '0.85rem', fontFamily: 'Inter,sans-serif',
    outline: 'none', marginTop: 2, boxSizing: 'border-box'
  }
  const lbl = { display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 2 }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
    >
      <div style={{ background: '#161A1E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '2.25rem', width: '100%', maxWidth: 400, position: 'relative' }}>

        {/* Close */}
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '1.1rem', cursor: 'pointer', lineHeight: 1 }}>✕</button>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.75rem' }}>
          <span className="logo-nxt">NXT</span>
          <div className="logo-sep" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="logo-name">NEXTOKEN</span>
            <span className="logo-cap">CAPITAL</span>
          </div>
        </div>

        <div style={{ fontSize: '1.15rem', fontWeight: 900, marginBottom: 4, letterSpacing: '-0.3px' }}>
          {mode === 'login' ? 'Log In' : 'Create Account'}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1.5rem' }}>
          {mode === 'login' ? 'Welcome back to Nextoken Capital' : 'Start tokenizing assets in minutes — free'}
        </div>

        {error && <div style={{ padding: '0.7rem 1rem', background: 'rgba(246,70,93,0.1)', border: '1px solid rgba(246,70,93,0.2)', borderRadius: 4, color: '#F6465D', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label style={lbl}>First Name</label>
                <input style={inp} placeholder="John" value={form.first_name} onChange={e => set('first_name', e.target.value)} required />
              </div>
              <div>
                <label style={lbl}>Last Name</label>
                <input style={inp} placeholder="Smith" value={form.last_name} onChange={e => set('last_name', e.target.value)} required />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={lbl}>Email Address</label>
            <input style={inp} type="email" placeholder="you@company.com" value={form.email} onChange={e => set('email', e.target.value)} required />
          </div>

          <div style={{ marginBottom: mode === 'register' ? '1rem' : '1.5rem' }}>
            <label style={lbl}>Password</label>
            <input style={inp} type="password" placeholder={mode === 'register' ? 'Min. 8 characters' : '••••••••'} value={form.password} onChange={e => set('password', e.target.value)} required />
          </div>

          {mode === 'register' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={lbl}>Account Type</label>
              <select style={{ ...inp, appearance: 'none' }} value={form.account_type} onChange={e => set('account_type', e.target.value)}>
                <option value="investor">Investor — Invest in tokenized assets</option>
                <option value="issuer">Issuer — Tokenize assets / issue bonds</option>
                <option value="institution">Institution — Enterprise / API access</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem', background: loading ? '#B8930A' : '#F0B90B', color: 'black', border: 'none', borderRadius: 4, fontSize: '0.88rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter,sans-serif' }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.1rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
          {mode === 'login' ? (
            <>New to Nextoken? <span onClick={() => onSwitch('register')} style={{ color: '#F0B90B', fontWeight: 700, cursor: 'pointer' }}>Create Account →</span></>
          ) : (
            <>Already have an account? <span onClick={() => onSwitch('login')} style={{ color: '#F0B90B', fontWeight: 700, cursor: 'pointer' }}>Log In →</span></>
          )}
        </div>
      </div>
    </div>
  )
}
