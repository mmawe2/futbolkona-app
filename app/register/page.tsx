'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

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

    if (password.length < 6) {
      setMessage('❌ Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setMessage('❌ Passwords do not match.')
      setLoading(false)
      return
    }

    const full_name = String(form.get('full_name') || '')
    const email = String(form.get('email') || '')
    const phone = String(form.get('phone') || '')
    const school_club = String(form.get('school_club') || '')
    const position = String(form.get('position') || '')

    const slug =
      full_name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-') +
      '-' +
      Date.now()

    const { error } = await supabase.from('players').insert([
      {
        full_name,
        email,
        phone,
        school_club,
        position,
        slug,
      },
    ])

    if (error) {
      setMessage('❌ ' + error.message)
    } else {
      setMessage('✅ Football CV created successfully.')
      e.currentTarget.reset()
    }

    setLoading(false)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#111827',
        padding: '40px 20px',
        color: 'white',
      }}
    >
      <div
        style={{
          maxWidth: '700px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: '32px',
            marginBottom: '20px',
            color: '#facc15',
          }}
        >
          Register Your Football CV
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            name="full_name"
            placeholder="Full Name"
            required
            style={inputStyle}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            style={inputStyle}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            required
            style={inputStyle}
          />

          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            required
            style={inputStyle}
          />

          <input
            name="confirm_password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            required
            style={inputStyle}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={buttonSecondary}
          >
            {showPassword ? 'Hide Password' : 'Show Password'}
          </button>

          <input
            name="school_club"
            placeholder="School or Club"
            required
            style={inputStyle}
          />

          <textarea
            name="position"
            placeholder="Playing Position"
            required
            style={{
              ...inputStyle,
              height: '120px',
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={buttonPrimary}
          >
            {loading ? 'Creating...' : 'Create My Football CV'}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: '20px',
              fontSize: '18px',
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '18px',
  marginBottom: '18px',
  borderRadius: '12px',
  border: 'none',
  fontSize: '16px',
} as const

const buttonPrimary = {
  width: '100%',
  padding: '18px',
  background: '#facc15',
  color: '#111827',
  border: 'none',
  borderRadius: '12px',
  fontSize: '18px',
  fontWeight: 'bold',
  cursor: 'pointer',
} as const

const buttonSecondary = {
  width: '100%',
  padding: '14px',
  background: '#1f2937',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  marginBottom: '18px',
  cursor: 'pointer',
} as const
