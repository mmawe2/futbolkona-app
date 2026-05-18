'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function PlayerPage() {
  const params = useParams()
  const slug = params.id as string

  const [player, setPlayer] = useState<any>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [message, setMessage] = useState('')

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
      setMessage('Could not load player profile.')
      return
    }

    setPlayer(data)
    if (data?.video_url) {
      setVideoUrl(data.video_url)
    }
  }

  function getStatusLabel() {
    if (player?.verification_stage === 'verified') {
      return '✅ Verified Player'
    }

    if (player?.verification_stage === 'pending_review') {
      return '🟡 Video Submitted — Pending FK Review'
    }

    if (player?.profile_completed) {
      return '✅ Profile Completed'
    }

    if (player?.verification_stage === 'profile_created') {
      return '🟠 Profile Created — Video Proof Required'
    }

    return '🟠 Pending'
  }

  async function uploadProfilePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    setMessage('')

    if (!file) return

    const maxSizeMB = 5
    const fileSizeMB = file.size / 1024 / 1024

    if (!file.type.startsWith('image/')) {
      setMessage('❌ Please upload an image file only.')
      event.target.value = ''
      return
    }

    if (fileSizeMB > maxSizeMB) {
      setMessage(`❌ Photo is too large (${fileSizeMB.toFixed(1)}MB). Please upload a photo under ${maxSizeMB}MB.`)
      event.target.value = ''
      return
    }

    try {
      setUploadingPhoto(true)
      setMessage('Uploading profile photo...')

      const cleanFileName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, '-')
      const filePath = `${slug}/${Date.now()}-${cleanFileName}`

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        })

      if (uploadError) {
        setMessage('❌ Photo upload failed: ' + uploadError.message)
        return
      }

      const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath)

      const publicUrl = data.publicUrl

      const { error: updateError } = await supabase
        .from('players')
        .update({ profile_photo_url: publicUrl })
        .eq('slug', slug)

      if (updateError) {
        setMessage('❌ Photo saved but profile update failed: ' + updateError.message)
        return
      }

      setPlayer({
        ...player,
        profile_photo_url: publicUrl,
      })

      setMessage('✅ Profile photo uploaded successfully.')
      event.target.value = ''
    } catch (err) {
      setMessage('❌ Photo upload failed. Please try again.')
    } finally {
      setUploadingPhoto(false)
    }
  }

  async function uploadVideo(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    setMessage('')

    if (!file) return

    const maxSizeMB = 25
    const fileSizeMB = file.size / 1024 / 1024

    if (!file.type.startsWith('video/')) {
      setMessage('❌ Please upload a video file only.')
      event.target.value = ''
      return
    }

    if (fileSizeMB > maxSizeMB) {
      setMessage(`❌ Video is too large (${fileSizeMB.toFixed(1)}MB). Please upload a short clip under ${maxSizeMB}MB.`)
      event.target.value = ''
      return
    }

    try {
      setUploadingVideo(true)
      setMessage('Uploading video. Please wait...')

      const cleanFileName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, '-')
      const filePath = `${slug}/${Date.now()}-${cleanFileName}`

      const { error } = await supabase.storage
        .from('player-videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        })

      if (error) {
        setMessage('❌ Upload failed: ' + error.message)
        return
      }

      const { data } = supabase.storage
        .from('player-videos')
        .getPublicUrl(filePath)

      const publicUrl = data.publicUrl

      const { error: updateError } = await supabase
        .from('players')
        .update({
          video_url: publicUrl,
          video_submitted: true,
          profile_completed: true,
          verification_stage: 'pending_review',
          verification_status: 'pending',
        })
        .eq('slug', slug)

      if (updateError) {
        setMessage('❌ Video uploaded, but profile status update failed: ' + updateError.message)
        return
      }

      setVideoUrl(publicUrl)
      setPlayer({
        ...player,
        video_url: publicUrl,
        video_submitted: true,
        profile_completed: true,
        verification_stage: 'pending_review',
        verification_status: 'pending',
      })

      setMessage('✅ Profile successfully created. Video proof submitted. FK review is now pending.')
      event.target.value = ''
    } catch (err) {
      setMessage('❌ Upload failed. Please try a smaller video.')
    } finally {
      setUploadingVideo(false)
    }
  }

  async function copyReferralCode() {
    if (!player?.player_referral_code) return
    await navigator.clipboard.writeText(player.player_referral_code)
    setMessage('✅ Referral code copied.')
  }

  async function copyProfileLink() {
    await navigator.clipboard.writeText(profileUrl)
    setMessage('✅ Profile link copied.')
  }

  if (!player) {
    return (
      <main style={pageStyle}>
        <section style={cardStyle}>
          <h1 style={titleStyle}>Loading Player Profile...</h1>
          {message && <p>{message}</p>}
        </section>
      </main>
    )
  }

  return (
    <main style={pageStyle}>
      {player.profile_completed && player.video_submitted && (
        <section style={successCardStyle}>
          <h2>✅ Profile Successfully Created</h2>
          <p>
            Your FutbolKona Football CV is ready. Video proof has been submitted
            and your profile is now pending FK review.
          </p>
        </section>
      )}

      <section style={cardStyle}>
        <h1 style={titleStyle}>FutbolKona Football CV</h1>

        {player.profile_photo_url ? (
          <img
            src={player.profile_photo_url}
            alt="Player profile photo"
            style={profilePhotoStyle}
          />
        ) : (
          <div style={photoPlaceholderStyle}>No Profile Photo</div>
        )}

        <h2>{player.full_name}</h2>
        <p><strong>Email:</strong> {player.email}</p>
        <p><strong>Phone:</strong> {player.phone}</p>
        <p><strong>School / Club:</strong> {player.school_club}</p>
        <p><strong>Position:</strong> {player.position}</p>
        <p><strong>Status:</strong> {getStatusLabel()}</p>

        <div style={{ marginTop: '20px' }}>
          <h3>Upload Profile Photo</h3>
          <p>Upload a clear photo under 5MB.</p>

          <input
            type="file"
            accept="image/*"
            onChange={uploadProfilePhoto}
            disabled={uploadingPhoto}
            style={{ marginTop: '10px', display: 'block', color: 'white' }}
          />

          {uploadingPhoto && (
            <p style={{ marginTop: '10px', color: '#facc15' }}>
              Uploading photo...
            </p>
          )}
        </div>
      </section>

      <section style={cardStyle}>
        <h2>My FK Referral Code</h2>
        <p>
          Share this code with other players. If they register using your code,
          FK can track that you introduced them.
        </p>

        <div style={codeBoxStyle}>
          {player.player_referral_code || 'Referral code not available yet'}
        </div>

        <button onClick={copyReferralCode} style={goldButtonStyle}>
          Copy Referral Code
        </button>
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

        <button onClick={copyProfileLink} style={goldButtonStyle}>
          Copy Profile Link
        </button>
      </section>

      <section style={cardStyle}>
        <h2>Upload Football Proof</h2>

        <p>
          Upload a short football clip under 25MB. FK keeps the page lightweight
          by showing a link instead of loading the full video automatically.
        </p>

        <input
          type="file"
          accept="video/*"
          onChange={uploadVideo}
          disabled={uploadingVideo}
          style={{ marginTop: '20px', display: 'block', color: 'white' }}
        />

        {(uploadingVideo || uploadingPhoto) && (
          <p style={{ marginTop: '15px', color: '#facc15' }}>
            Please do not close this page.
          </p>
        )}

        {message && (
          <p style={{ marginTop: '15px', fontWeight: 'bold' }}>
            {message}
          </p>
        )}

        {videoUrl && (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={videoButtonStyle}
          >
            Open Uploaded Video
          </a>
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

const successCardStyle = {
  maxWidth: '800px',
  margin: '0 auto 30px auto',
  padding: '25px',
  borderRadius: '18px',
  background: '#064e3b',
  border: '1px solid #10b981',
  color: 'white',
} as const

const titleStyle = {
  color: '#facc15',
  fontSize: '36px',
  marginBottom: '20px',
} as const

const profilePhotoStyle = {
  width: '140px',
  height: '140px',
  objectFit: 'cover',
  borderRadius: '50%',
  border: '3px solid #facc15',
  marginBottom: '20px',
} as const

const photoPlaceholderStyle = {
  width: '140px',
  height: '140px',
  borderRadius: '50%',
  border: '3px solid #374151',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#9ca3af',
  marginBottom: '20px',
  textAlign: 'center',
} as const

const codeBoxStyle = {
  marginTop: '15px',
  marginBottom: '15px',
  padding: '16px',
  borderRadius: '12px',
  background: '#111827',
  border: '1px solid #facc15',
  color: '#facc15',
  fontWeight: 'bold',
  wordBreak: 'break-all',
} as const

const goldButtonStyle = {
  display: 'inline-block',
  marginTop: '10px',
  padding: '14px 20px',
  borderRadius: '12px',
  background: '#facc15',
  color: '#111827',
  fontWeight: 'bold',
  border: 'none',
  cursor: 'pointer',
} as const

const videoButtonStyle = {
  display: 'inline-block',
  marginTop: '20px',
  padding: '14px 20px',
  borderRadius: '12px',
  background: '#facc15',
  color: '#111827',
  fontWeight: 'bold',
  textDecoration: 'none',
} as const
