'use client'

export default function RegisterPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#111', color: 'white', padding: '40px' }}>
      <h1>Register Your Football CV</h1>

      <form style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>
        <input placeholder="Full name" style={{ padding: '14px', borderRadius: '10px', color: 'black' }} />
        <input placeholder="Email address" type="email" style={{ padding: '14px', borderRadius: '10px', color: 'black' }} />
        <input placeholder="Phone number" style={{ padding: '14px', borderRadius: '10px', color: 'black' }} />
        <input placeholder="Password" type="password" style={{ padding: '14px', borderRadius: '10px', color: 'black' }} />
        <input placeholder="Current team / school / academy" style={{ padding: '14px', borderRadius: '10px', color: 'black' }} />
        <textarea placeholder="Short football bio" style={{ padding: '14px', borderRadius: '10px', color: 'black' }} />

        <button style={{ padding: '14px', borderRadius: '10px', background: '#facc15', color: 'black', fontWeight: 'bold' }}>
          Create My Football CV
        </button>
      </form>
    </main>
  )
}
