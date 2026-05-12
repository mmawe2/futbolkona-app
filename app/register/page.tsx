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
