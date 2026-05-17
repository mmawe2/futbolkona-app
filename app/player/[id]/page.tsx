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
  const [uploadMessage, setUploadMessage] = useState('')

  const profileUrl = `https://futbolkona-app.vercel.app/player/${slug}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(profileUrl)}`

  useEffect(() => {
    fetchPlayer()
  }, [])

  async function fetchPlayer() {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      setUploadMessage('Could not load player profile.')
      return
    }

    setPlayer(data)
  }

  async function uploadVideo(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    setUploadMessage('')
    setVideoUrl('')

    if (!file) return

    const maxSizeMB = 25
    const fileSizeMB = file.size / 1024 / 1024

    if (!file.type.startsWith('video/')) {
      setUploadMessage('❌ Please upload a video file only.')
      event.target.value = ''
      return
    }

    if (fileSizeMB > maxSizeMB) {
      setUploadMessage(
        `❌ Video is too large (${fileSizeMB.toFixed(
          1
        )}MB). Please upload a short clip under ${maxSizeMB}MB.`
      )
      event.target.value = ''
      return
    }

    try {
      setUploading(true)
      setUploadMessage('Uploading video. Please wait...')

      const cleanFileName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9.]/g, '-')

      const filePath = `${slug}/${Date.now()}-${cleanFileName}`

      const { error } = await supabase.storage
        .from('player-videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        })

      if (error) {
        setUploadMessage('❌ Upload failed: ' + error.message)
        return
      }

      const { data } = supabase.storage
        .from('player-videos')
        .getPublicUrl(filePath)

      setVideoUrl(data.publicUrl)
      setUploadMessage('✅ Video uploaded successfully.')
      event.target.value = ''
    } catch (err) {
      setUploadMessage('❌ Upload failed. Please try a smaller video.')
    } finally {
      setUploading(false)
    }
  }

  if (!player) {
    return (
      <main style={pageStyle}>
        <section style={cardStyle}>
          <h1 style={titleStyle}>Loading Player Profile...</h1>
          {uploadMessage && <p>{uploadMessage}</p>}
        </section>
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
        <h2>Upload Football Proof</h2>

        <p>
          Upload a short football clip under 25MB. Use highlights, training
          clips or match evidence. Longer clips will be added later.
        </p>

        <input
          type="file"
          accept="video/*"
          onChange={uploadVideo}
          disabled={uploading}
          style={{
            marginTop: '20px',
            display: 'block',
            color: 'white',
          }}
        />

        {uploading && (
          <p style={{ marginTop: '15px', color: '#facc15' }}>
            Uploading... please do not close this page.
          </p>
        )}

        {uploadMessage && (
          <p style={{ marginTop: '15px', fontWeight: 'bold' }}>
            {uploadMessage}
          </p>
        )}

        {videoUrl && (
          <video
            controls
            src={videoUrl}
            style={{
              width: '100%',
              marginTop: '20px',
              borderRadius: '14px',
            }}
          />
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
