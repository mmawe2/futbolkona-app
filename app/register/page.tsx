'use client'

import { useState } from 'react'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (loading) return

    setLoading(true)
    setMessage('Creating your Football CV...')

    setTimeout(() => {
      setMessage('✅ Successful! Your Football CV profile has been created.')
      setLoading(false)
    }, 1200)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#111', color: 'white', padding: '40px' }}>
      <h1>Register Your Football CV</h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>
        <input name="full_name" placeholder="Full name" required style={{ padding: '14px', borderRadius: '10px', color: 'black' }} />
        <input name="email" placeholder="Email address" type="email" required style={{ padding: '14px', borderRadius: '10px', color: 'black' }} />
        <input name="phone" placeholder="Phone number" required style={{ padding: '14px', borderRadius: '10px', color: 'black' }} />

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            name="password"
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            required
            style={{ flex: 1, padding: '14px', borderRadius: '10px', color: 'black' }}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <input name="team" placeholder="Current team / school / academy" style={{ padding: '14px', borderRadius: '10px', color: 'black' }} />
        <textarea name="bio" placeholder="Short football bio" style={{ padding: '14px', borderRadius: '10px', color: 'black' }} />

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '14px', borderRadius: '10px', background: '#facc15', color: 'black', fontWeight: 'bold', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Creating Football CV...' : 'Create My Football CV'}
        </button>

        {message && <p>{message}</p>}
      </form>
    </main>
  )
}
