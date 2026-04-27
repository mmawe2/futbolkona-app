'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Nav from '@/components/Nav'
export default function RegisterPage(){
const [loading,setLoading]=useState(false); const [message,setMessage]=useState('')
async function handleSubmit(e:React.FormEvent<HTMLFormElement>){
 e.preventDefault(); setLoading(true); setMessage('')
 const form=new FormData(e.currentTarget)
 const email=String(form.get('email')||''), password=String(form.get('password')||''), full_name=String(form.get('full_name')||''), phone=String(form.get('phone')||'')
 const date_of_birth=String(form.get('date_of_birth')||''), position=String(form.get('position')||''), preferred_foot=String(form.get('preferred_foot')||''), current_team=String(form.get('current_team')||''), location=String(form.get('location')||'South Africa'), bio=String(form.get('bio')||'')
 const {data,error}=await supabase.auth.signUp({email,password})
 if(error||!data.user){setMessage('Auth signup failed: '+(error?.message||'No user returned')); setLoading(false); return}
 const userId=data.user.id
 const {error:profileError}=await supabase.from('profiles').insert({id:userId,full_name,email,phone,role:'player'})
 if(profileError){setMessage('Profile insert failed: '+profileError.message); setLoading(false); return}
 const is_minor=date_of_birth?new Date(date_of_birth)>new Date(new Date().setFullYear(new Date().getFullYear()-18)):false
 const {error:detailsError}=await supabase.from('player_details').insert({user_id:userId,date_of_birth,position,preferred_foot,current_team,location,bio,is_minor,profile_complete:true})
 if(detailsError){setMessage('Player details insert failed: '+detailsError.message); setLoading(false); return}
 setMessage('Welcome to FutbolKona. Your Football CV has been created.'); setLoading(false)
}
return <main className="min-h-screen bg-fkblack"><Nav/><section className="mx-auto max-w-3xl px-6 py-12"><h1 className="text-4xl font-bold">Create Your Football CV</h1><p className="mt-3 text-fkmuted">Connected to Supabase Auth and FK tables.</p><form onSubmit={handleSubmit} className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-fkcharcoal p-6"><input name="full_name" required placeholder="Full name" className="rounded-xl bg-black/40 p-3 outline-none"/><input name="email" required type="email" placeholder="Email address" className="rounded-xl bg-black/40 p-3 outline-none"/><input name="phone" placeholder="Phone number" className="rounded-xl bg-black/40 p-3 outline-none"/><input name="password" required type="password" placeholder="Password" className="rounded-xl bg-black/40 p-3 outline-none"/><input name="date_of_birth" type="date" className="rounded-xl bg-black/40 p-3 outline-none"/><select name="position" className="rounded-xl bg-black/40 p-3 outline-none"><option value="">Select position</option><option>Goalkeeper</option><option>Defender</option><option>Midfielder</option><option>Forward</option></select><select name="preferred_foot" className="rounded-xl bg-black/40 p-3 outline-none"><option value="">Preferred foot</option><option>Left</option><option>Right</option><option>Both</option></select><input name="current_team" placeholder="Current team / school / academy" className="rounded-xl bg-black/40 p-3 outline-none"/><input name="location" defaultValue="South Africa" className="rounded-xl bg-black/40 p-3 outline-none"/><textarea name="bio" placeholder="Short football bio" className="rounded-xl bg-black/40 p-3 outline-none"/><label className="flex items-center gap-2 text-sm text-fkmuted"><input required type="checkbox"/> I agree to the Terms & Conditions and Privacy Policy.</label><button disabled={loading} className="rounded-xl bg-fkgold px-6 py-3 font-semibold text-black">{loading?'Creating...':'Create My Football CV'}</button>{message&&<p className="rounded-xl border border-white/10 p-3 text-sm">{message}</p>}</form></section></main>}
