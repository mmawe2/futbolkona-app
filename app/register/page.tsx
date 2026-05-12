<input
  name="password"
  placeholder="Password: minimum 8 characters, include letters and numbers"
  type={showPassword ? 'text' : 'password'}
  required
  minLength={8}
  style={{ flex: 1, padding: '14px', borderRadius: '10px', color: 'black' }}
/>

<input
  name="confirm_password"
  placeholder="Confirm password"
  type={showPassword ? 'text' : 'password'}
  required
  minLength={8}
  style={{ padding: '14px', borderRadius: '10px', color: 'black' }}
/>
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
