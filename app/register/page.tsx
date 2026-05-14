'use client'
import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(setMessage('')e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return
setLoading(false)
    setLoading(true)
    setMessage('')

    const form = new FormData(e.currentTarget)
    const password = String(form.get('password') || '')
    const confirmPassword = String(form.get('confirm_password') || '')

    if (password.length < 8) {
      setMessage('❌ Password must be at least 8 characters.')
      setLoading(false)
      return
    }

    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setMessage('❌ Password must include letters and numbers.')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setMessage('❌ Passwords do not match.')
      setLoading(false)
      return
    }

    setMessage('✅ Successful! Your Football CV profile has been created.')
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#111', color: 'white', padding: '40px' }}>
      <h1>Register Your Football CV</h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>
        <input name="full_name" placeholder="Full name" required style={{ padding: '14px', borderRadius: '10px', color: 'black' }} />
        <input name="email" placeholder="Email address" type="email" required style={{ padding: '14px', borderRadius: '10px', color: 'black' }} />
        <input name="phone" placeholder="Phone number" required style={{ padding: '14px', borderRadius: '10px', color: 'black' }} />

        <input
          name="password"
          placeholder="Password: minimum 8 characters, include letters and numbers"
          type={showPassword ? 'text' : 'password'}
          required
          minLength={8}
          style={{ padding: '14px', borderRadius: '10px', color: 'black' }}
        />

        <input
          name="confirm_password"
          placeholder="Confirm password"
          type={showPassword ? 'text' : 'password'}
          required
          minLength={8}
          style={{ padding: '14px', borderRadius: '10px', color: 'black' }}
        />

        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? 'Hide Password' : 'Show Password'}
        </button>

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
