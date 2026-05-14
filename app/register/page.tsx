'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    if (loading) return

    setLoading(true)
    setMessage('')

    const form = new FormData(e.currentTarget)

    const full_name = String(form.get('full_name') || '')
    const email = String(form.get('email') || '')
    const phone = String(form.get('phone') || '')
    const password = String(form.get('password') || '')
    const confirm_password = String(
      form.get('confirm_password') || ''
    )
    const school_club = String(
      form.get('school_club') || ''
    )
    const position = String(form.get('position') || '')

    if (password.length < 6) {
      setMessage('❌ Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (password !== confirm_password) {
      setMessage('❌ Passwords do not match')
      setLoading(false)
      return
    }

    const slug =
      full_name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-') +
      '-' +
      Date.now()

    const { error } = await supabase
      .from('players')
      .insert([
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
      setMessage(
        '✅ Football CV created successfully'
      )

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
            color: '#facc15',
            fontSize: '42px',
            marginBottom: '30px',
            fontWeight: 'bold',
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
            type={
              showPassword ? 'text' : 'password'
            }
            placeholder="Password"
            required
            style={inputStyle}
          />

          <input
            name="confirm_password"
            type={
              showPassword ? 'text' : 'password'
            }
            placeholder="Confirm Password"
            required
            style={inputStyle}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            style={showButton}
          >
            {showPassword
              ? 'Hide Password'
              : 'Show Password'}
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
              minHeight: '140px',
              resize: 'vertical',
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={submitButton}
          >
            {loading
              ? 'Creating...'
              : 'Create My Football CV'}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: '20px',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '20px',
  marginBottom: '20px',
  borderRadius: '14px',
  border: 'none',
  fontSize: '18px',
  color: '#111827',
  backgroundColor: '#ffffff',
  outline: 'none',
  boxSizing: 'border-box' as const,
}

const showButton = {
  width: '100%',
  padding: '18px',
  marginBottom: '20px',
  borderRadius: '14px',
  border: 'none',
  background: '#1f2937',
  color: '#ffffff',
  fontSize: '18px',
  cursor: 'pointer',
}

const submitButton = {
  width: '100%',
  padding: '20px',
  borderRadius: '14px',
  border: 'none',
  background: '#facc15',
  color: '#111827',
  fontSize: '20px',
  fontWeight: 'bold',
  cursor: 'pointer',
}
