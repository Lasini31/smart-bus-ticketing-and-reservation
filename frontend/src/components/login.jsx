import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const authStorageKey = 'smart-bus-user'
const authEventName = 'smart-bus-auth-changed'

export default function Login() {
	const navigate = useNavigate()
	const [name, setName] = useState('')

	const handleSubmit = (event) => {
		event.preventDefault()
		localStorage.setItem(authStorageKey, JSON.stringify({ name: name.trim() || 'Traveler' }))
		window.dispatchEvent(new Event(authEventName))
		navigate('/')
	}

	return (
		<section className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-100/40 sm:p-8">
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Login</p>
				<h1 className="mt-2 text-3xl font-bold text-emerald-950">Welcome back</h1>
				<p className="mt-3 text-sm leading-6 text-slate-600">Use this demo login to switch the header from Login to the profile icon.</p>

				<form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
					<label className="grid gap-2 text-sm font-medium text-slate-700">
						Name
						<input
							type="text"
							value={name}
							onChange={(event) => setName(event.target.value)}
							className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
							placeholder="Enter your name"
						/>
					</label>
					<button type="submit" className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">Sign in</button>
				</form>
			</div>
		</section>
	)
}