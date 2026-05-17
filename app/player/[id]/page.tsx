'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function PlayerPage() {
  const params = useParams()
  const slug = params.id as string

  const [player, setPlayer] = useState<any>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  const profileUrl = `https://futbolkona-app.vercel.app/player/${slug}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(profileUrl)}`

  useEffect(() => {
    fetchPlayer()
  }, [])

  async function fetchPlayer() {
    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('slug', slug)
      .single()

    setPlayer(data)
  }

  async function uploadVideo(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)

    const fileName = `${slug}-${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from('player-videos')
      .upload(fileName, file)

    if (error) {
      alert(error.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage
      .from('player-videos')
      .getPublicUrl(fileName)

    setVideoUrl(data.publicUrl)
    setUploading(false)
  }

  if (!player) {
    return <main style={pageStyle}>Loading player profile...</main>
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
        <p><strong>Verification Status:</strong> pending</p>
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
        <h2>Upload Football Proof</h2>
        <p>Upload match clips, training videos or football evidence.</p>

        <input
          type="file"
          accept="video/*"
          onChange={uploadVideo}
          style={{ marginTop: '20px' }}
        />

        {uploading && <p>Uploading video...</p>}

        {videoUrl && (
          <video controls style={{ width: '100%', marginTop: '20px' }}>
            <source src={videoUrl} />
          </video>
        )}
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
