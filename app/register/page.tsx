'use client'

import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return

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

    if (password !== confirmPassword) {
      setMessage('❌ Passwords do not match.')
      setLoading(false)
      return
    }

    const profileSlug =
      String(form.get('email') || '')
        .split('@')[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-') +
      '-' +
      Date.now()

    const { error } = await supabase.from('players').insert([
      {
        full_name: form.get('full_name'),
        email: form.get('email'),
        phone: form.get('phone'),
        team: form.get('team'),
        bio: form.get('bio'),
        profile_slug: profileSlug,
      },
    ])

    if (error) {
      setMessage('❌ Failed to save player. Please try again.')
    } else {
      setMessage('✅ Successful! Your Football CV profile has been created.')
      e.currentTarget.reset()
    }

    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#111', color: 'white', padding: '40px' }}>
      <h1>Register Your Football CV</h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', maxWidth: '700px' }}>
        <input name="full_name" placeholder="Full name" required style={{ padding: '14px', borderRadius: '10px', color: 'black' }} />
        <input name="email" placeholder="Email address" type="email" required style={{ padding: '14px', borderRadius: '10px', color: 'black' }} />
        <input name="phone" placeholder="Phone number" required style={{ padding: '14px', borderRadius: '10px', color: 'black' }} />

        <input name="password" placeholder="Password" type={showPassword ? 'text' : 'password'} required minLength={8} style={{ padding: '14px', borderRadius: '10px', color: 'black' }} />
        <input name="confirm_password" placeholder="Confirm password" type={showPassword ? 'text' : 'password'} required minLength={8} style={{ padding: '14px', borderRadius: '10px', color: 'black' }} />

        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? 'Hide Password' : 'Show Password'}
        </button>

        <input name="team" placeholder="Current team / school / academy" style={{ padding: '14px', borderRadius: '10px', color: 'black' }} />
        <textarea name="bio" placeholder="Short football bio" style={{ padding: '14px', borderRadius: '10px', color: 'black', minHeight: '100px' }} />

        <button type="submit" disabled={loading} style={{ padding: '14px', borderRadius: '10px', background: '#facc15', color: 'black', fontWeight: 'bold' }}>
          {loading ? 'Creating Football CV...' : 'Create My Football CV'}
        </button>

        {message && <p>{message}</p>}
      </form>
    </main>
  )
}
