import { useNavigate } from 'react-router-dom'

const authStorageKey = 'smart-bus-user'
const authEventName = 'smart-bus-auth-changed'

export default function Profile() {
	const navigate = useNavigate()
	const user = JSON.parse(localStorage.getItem(authStorageKey) ?? '{"name":"Traveler"}')

	const handleLogout = () => {
		localStorage.removeItem(authStorageKey)
		window.dispatchEvent(new Event(authEventName))
		navigate('/')
	}

	return (
		<section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-100/40 sm:p-8">
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Profile</p>
				<h1 className="mt-2 text-3xl font-bold text-emerald-950">Hello, {user.name}</h1>
				<p className="mt-3 text-sm leading-6 text-slate-600">This page can later be replaced with the real account details from your backend auth flow.</p>
				<div className="mt-6 flex flex-wrap gap-3">
					<button type="button" onClick={() => navigate('/booking')} className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">Go to booking</button>
					<button type="button" onClick={handleLogout} className="rounded-full border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">Logout</button>
				</div>
			</div>
		</section>
	)
}