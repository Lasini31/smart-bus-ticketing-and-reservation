import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const authEventName = 'smart-bus-auth-changed'
const languageEventName = 'smart-bus-language-changed'
const authStorageKey = 'smart-bus-user'
const languageStorageKey = 'smart-bus-language'

const Header = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem(authStorageKey)))
	const [language, setLanguage] = useState(() => localStorage.getItem(languageStorageKey) ?? 'EN')

	useEffect(() => {
		const syncAuthState = () => setIsLoggedIn(Boolean(localStorage.getItem(authStorageKey)))
		const syncLanguageState = () => setLanguage(localStorage.getItem(languageStorageKey) ?? 'EN')

		window.addEventListener('storage', syncAuthState)
		window.addEventListener(authEventName, syncAuthState)
		window.addEventListener('storage', syncLanguageState)
		window.addEventListener(languageEventName, syncLanguageState)

		return () => {
			window.removeEventListener('storage', syncAuthState)
			window.removeEventListener(authEventName, syncAuthState)
			window.removeEventListener('storage', syncLanguageState)
			window.removeEventListener(languageEventName, syncLanguageState)
		}
	}, [])

	const nextLanguage = language === 'EN' ? 'සිං' : 'EN'

	const toggleLanguage = () => {
		localStorage.setItem(languageStorageKey, nextLanguage)
		window.dispatchEvent(new Event(languageEventName))
	}

	return (
		<header className="fixed left-0 right-0 top-0 z-10 h-[4.5rem] border-b border-emerald-100 bg-white/95 text-emerald-950 shadow-[0_10px_30px_-20px_rgba(16,185,129,0.45)] backdrop-blur">
			<div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
				<Link to="/" className="flex items-center gap-3">
					<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25">
						<svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
							<path d="M5 15.5V8.75C5 6.68 6.68 5 8.75 5h6.5C17.32 5 19 6.68 19 8.75v6.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
							<path d="M6.5 10.25h11M7 15.5h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
							<path d="M7.25 18.5h1.5M15.25 18.5h1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
						</svg>
					</div>
					<div className="leading-tight">
						<div className="text-[0.95rem] font-semibold tracking-[0.18em] text-emerald-900 uppercase">Smart Bus</div>
						<div className="text-xs text-emerald-600">Ticketing & Reservation</div>
					</div>
				</Link>

				<nav className="flex max-w-full items-center gap-2 overflow-x-auto whitespace-nowrap">
					<NavLink
						to="/booking"
						className={({ isActive }) =>
							`rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-emerald-600 text-white' : 'text-emerald-800 hover:bg-emerald-50 hover:text-emerald-700'}`
						}
					>
						Booking
					</NavLink>
					<NavLink
						to="/feedback"
						className={({ isActive }) =>
							`rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-emerald-600 text-white' : 'text-emerald-800 hover:bg-emerald-50 hover:text-emerald-700'}`
						}
					>
						Feedback
					</NavLink>
				</nav>

				<div className="flex items-center gap-2 sm:gap-3">
					<button
						type="button"
						onClick={toggleLanguage}
						className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
						aria-label="Change language"
					>
						<span className="text-base">🌐</span>
						<span>{language}</span>
					</button>

					{isLoggedIn ? (
						<NavLink
							to="/profile"
							className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
							aria-label="Open profile"
							title="Profile"
						>
							<svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
								<path d="M12 12.25a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" stroke="currentColor" strokeWidth="1.8" />
								<path d="M5.5 19.25c1.55-3.15 4.07-4.75 6.5-4.75s4.95 1.6 6.5 4.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
							</svg>
						</NavLink>
					) : (
						<NavLink
							to="/login"
							className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
						>
							Login
						</NavLink>
					)}
				</div>
			</div>
		</header>
	)
}

export default Header;
