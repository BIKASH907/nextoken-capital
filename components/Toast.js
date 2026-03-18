import { useState, useEffect, createContext, useContext } from 'react'

const ToastContext = createContext({})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  function toast(message, type = 'info') {
    const id = Date.now()
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }

  const colors = {
    success: { bg: '#0ECB81', color: 'black' },
    error: { bg: '#F6465D', color: 'white' },
    info: { bg: '#F0B90B', color: 'black' }
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: '0.75rem 1.25rem', borderRadius: 4,
            background: colors[t.type]?.bg || colors.info.bg,
            color: colors[t.type]?.color || 'black',
            fontSize: '0.82rem', fontWeight: 600,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            animation: 'slideIn 0.2s ease',
            maxWidth: 320, fontFamily: 'Inter,sans-serif'
          }}>
            {t.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
