import type { Config } from 'tailwindcss'
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { fkblack:'#050505', fkcharcoal:'#111111', fkgold:'#D4AF37', fkmuted:'#A8A8A8' } } }, plugins: [] }
export default config
