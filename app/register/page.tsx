'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return

    setLoading(true)
    setMessage('')

    const form = new FormData(event.currentTarget)

    const full_name = String(form.get('full_name') || '')
    const email = String(form.get('email') || '')
    const phone = String(form.get('phone') || '')
    const password = String(form.get('password') || '')
    const confirmPassword = String(form.get('confirmPassword') || '')
    const school_club = String(form.get('school_club') || '')
    const position = String(form.get('position') || '')
    const registered_by_type = String(form.get('registered_by_type') || 'self')
    const registered_by_code = String(form.get('registered_by_code') || '')

    if (password.length < 6) {
      setMessage('❌ Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setMessage('❌ Passwords do not match')
      setLoading(false)
      return
    }

    const slug =
      full_name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now()

    const player_referral_code =
      'PLAYER-' +
      full_name.toUpperCase().replace(/[^A-Z0-9]/g, '-').slice(0, 12) +
      '-' +
      Date.now().toString().slice(-5)

    const { error } = await supabase.from('players').insert([
      {
        full_name,
        email,
        phone,
        school_club,
        position,
        slug,
        registered_by_type,
        registered_by_code,
        player_referral_code,
      },
    ])

    if (error) {
      setMessage('❌ ' + error.message)
      setLoading(false)
      return
    }

    setMessage('✅ Football CV created successfully')

    setTimeout(() => {
      router.push(`/player/${slug}`)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-[#111827] p-10 rounded-3xl border border-yellow-500/20">
        <h1 className="text-5xl font-bold text-yellow-500 mb-4">
          Register Your Football CV
        </h1>

        <p className="text-gray-300 mb-10">
          Create your FK player identity. If a field agent or player referred you,
          enter their code below so their work is recorded.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input name="full_name" type="text" placeholder="Full Name" required className="w-full p-5 rounded-2xl bg-white text-black text-xl" />

          <input name="email" type="email" placeholder="Email" required className="w-full p-5 rounded-2xl bg-white text-black text-xl" />

          <input name="phone" type="text" placeholder="Phone Number" required className="w-full p-5 rounded-2xl bg-white text-black text-xl" />

          <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" required className="w-full p-5 rounded-2xl bg-white text-black text-xl" />

          <input name="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Confirm Password" required className="w-full p-5 rounded-2xl bg-white text-black text-xl" />

          <button type="button" onClick={() => setShowPassword(!showPassword)} className="w-full bg-[#1f2937] text-white py-4 rounded-2xl text-2xl">
            {showPassword ? 'Hide Password' : 'Show Password'}
          </button>

          <input name="school_club" type="text" placeholder="School or Club" required className="w-full p-5 rounded-2xl bg-white text-black text-xl" />

          <input name="position" type="text" placeholder="Playing Position" required className="w-full p-5 rounded-2xl bg-white text-black text-xl" />

          <select name="registered_by_type" className="w-full p-5 rounded-2xl bg-white text-black text-xl" defaultValue="self">
            <option value="self">I registered myself</option>
            <option value="field_agent">A FutbolKona field agent registered me</option>
            <option value="player_referral">Another player referred me</option>
            <option value="school">My school registered me</option>
            <option value="academy">My academy registered me</option>
          </select>

          <input
            name="registered_by_code"
            type="text"
            placeholder="Agent / Player / School / Academy code (optional)"
            className="w-full p-5 rounded-2xl bg-white text-black text-xl"
          />

          <button type="submit" disabled={loading} className="w-full bg-yellow-500 text-black py-5 rounded-2xl text-2xl font-bold">
            {loading ? 'Creating...' : 'Create My Football CV'}
          </button>

          {message && <p className="text-center text-white text-xl">{message}</p>}
        </form>
      </div>
    </div>
  )
}
