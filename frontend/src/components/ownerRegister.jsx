import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'

export default function OwnerRegister() {
  const navigate = useNavigate()
  const { authUrl, setUser } = useAuth()
  const { messages } = useLanguage()
  const [form, setForm] = useState({ businessName: '', email: '', password: '' })
  const [status, setStatus] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.businessName || !form.email || !form.password) {
      setStatus({ type: 'error', text: 'Please complete all fields.' })
      return
    }
    try {
      const response = await fetch(`${authUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      })
      const result = await response.json()
      setUser({ name: form.businessName, token: result.token, userId: result.userId, role: 'owner' })
      setStatus({ type: 'success', text: 'Owner registration complete. Redirecting...' })
      setTimeout(() => navigate('/profile'), 700)
    } catch (error) {
      setStatus({ type: 'error', text: 'Registration failed. Please try again.' })
    }
  }

  return (
    <section className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">{messages.ownerRegister?.title || 'Owner signup'}</p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">{messages.ownerRegister?.title || 'Owner signup'}</h1>
        <p className="mt-3 text-sm text-slate-600">{messages.ownerRegister?.subtitle || 'Register your bus business and publish routes.'}</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">{messages.ownerRegister?.businessName || 'Business name'}
            <input
              value={form.businessName}
              onChange={(e) => setForm((prev) => ({ ...prev, businessName: e.target.value }))}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="Sunshine Travels"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">{messages.ownerRegister?.email || 'Email address'}
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="owner@example.com"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">{messages.ownerRegister?.password || 'Password'}
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="••••••••"
            />
          </label>

          <button type="submit" className="w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">{messages.ownerRegister?.submit || 'Register owner'}</button>
        </form>

        {status && (
          <div className={`mt-5 rounded-3xl px-4 py-3 text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{status.text}</div>
        )}

        <p className="mt-6 text-sm text-slate-600">
          {messages.ownerRegister?.passengerLink || 'Register as passenger instead'}{' '}
          <button type="button" className="font-semibold text-emerald-600 hover:text-emerald-700" onClick={() => navigate('/register')}>Back</button>
        </p>
      </div>
    </section>
  )
}
