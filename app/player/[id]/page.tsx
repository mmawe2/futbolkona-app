import { supabase } from '@/lib/supabaseClient'

export default async function PlayerProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const { data: player, error } = await supabase
    .from('players')
    .select('*')
    .eq('slug', params.id)
    .single()

  const profileUrl = `https://futbolkona-app.vercel.app/player/${params.id}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(profileUrl)}`

  if (error || !player) {
    return (
      <main style={pageStyle}>
        <h1 style={titleStyle}>Player Not Found</h1>
        <p>This Football CV profile does not exist yet.</p>
      </main>
    )
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <h1 style={titleStyle}>FutbolKona Football CV</h1>

        <h2>{player.full_name}</h2>
        <p><strong>Email:</strong> {player.email}</p>
        <p><strong>Phone:</strong> {player.phone}</p>
        <p><strong>School / Club:</strong> {player.school_club}</p>
        <p><strong>Position:</strong> {player.position}</p>
        <p><strong>Verification Status:</strong> {player.verification_status || 'Pending'}</p>
      </section>

      <section style={cardStyle}>
        <h2>QR Player Profile</h2>
        <p>Scan this QR code to open this player’s Football CV.</p>

        <img
          src={qrUrl}
          alt="FutbolKona Player QR Code"
          style={{
            marginTop: '20px',
            background: 'white',
            padding: '12px',
            borderRadius: '12px',
          }}
        />

        <p style={{ marginTop: '20px', wordBreak: 'break-all' }}>
          {profileUrl}
        </p>
      </section>

      <section style={cardStyle}>
        <h2>Football Proof</h2>
        <p>Videos, match evidence and verification will appear here.</p>
      </section>
    </main>
  )
}

const pageStyle = {
  minHeight: '100vh',
  background: '#111827',
  color: 'white',
  padding: '40px 20px',
} as const

const cardStyle = {
  maxWidth: '800px',
  margin: '0 auto 30px auto',
  padding: '30px',
  borderRadius: '18px',
  background: '#1f2937',
  border: '1px solid #374151',
} as const

const titleStyle = {
  color: '#facc15',
  fontSize: '36px',
  marginBottom: '20px',
} as const
