import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useLanguage } from '../contexts/LanguageContext.jsx'

const Header = () => {
	const { user, logout } = useAuth()
	const navigate = useNavigate()
	const { language, setLanguage, messages, availableLanguages } = useLanguage()

	const { pathname } = useLocation()

	// On the homepage we start with a transparent header and white text,
	// and switch to the normal header after the user scrolls.
	const isHome = pathname === '/' || pathname === ''
	const [isAtTop, setIsAtTop] = useState(true)

	useEffect(() => {
		if (!isHome) {
			setIsAtTop(false)
			return
		}

		const onScroll = () => setIsAtTop(window.scrollY < 20)
		onScroll()
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [isHome])

	const cycleLanguage = () => {
		const idx = availableLanguages.indexOf(language)
		const next = availableLanguages[(idx + 1) % availableLanguages.length]
		setLanguage(next)
	}

	const handleLogout = () => {
		logout()
		navigate('/')
	}

	const headerBase = 'fixed left-0 right-0 top-0 z-10 h-[4.5rem] backdrop-blur transition-colors duration-300 z-100'
	const headerNormal = 'border-b border-emerald-100 bg-white/95 text-emerald-950 shadow-[0_10px_30px_-20px_rgba(16,185,129,0.45)] z-100'
	const headerTransparent = 'border-transparent bg-transparent text-white shadow-none z-100'

	return (
		<header className={`${headerBase} ${isHome && isAtTop ? headerTransparent : headerNormal}`}>
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
						<div className={`text-[0.95rem] font-semibold tracking-[0.18em] uppercase ${isHome && isAtTop ? 'text-white' : 'text-emerald-900'}`}>Smart Bus</div>
						<div className={`${isHome && isAtTop ? 'text-white/90' : 'text-emerald-600'} text-xs`}>Ticketing & Reservation</div>
					</div>
				</Link>

				<nav className="flex max-w-full items-center gap-2 overflow-x-auto whitespace-nowrap">
					<NavLink
						to="/booking"
						className={({ isActive }) =>
								`rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-emerald-600 text-white' : `${isHome && isAtTop ? 'text-white/95 hover:text-white/70' : 'text-emerald-800 hover:bg-emerald-50 hover:text-emerald-700'}`}`
							}
					>
						{messages.header.booking}
					</NavLink>
					<NavLink
						to="/wallet"
						className={({ isActive }) =>
								`rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-emerald-600 text-white' : `${isHome && isAtTop ? 'text-white/95 hover:text-white/70' : 'text-emerald-800 hover:bg-emerald-50 hover:text-emerald-700'}`}`
							}
					>
						{messages.header.wallet}
					</NavLink>
					<NavLink
						to="/about"
						className={({ isActive }) =>
								`rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-emerald-600 text-white' : `${isHome && isAtTop ? 'text-white/95 hover:text-white/70' : 'text-emerald-800 hover:bg-emerald-50 hover:text-emerald-700'}`}`
							}
					>
						{messages.header.about}
					</NavLink>
				</nav>

				<div className="flex items-center gap-2 sm:gap-3">
					<button
						type="button"
						onClick={cycleLanguage}
						className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${isHome && isAtTop ? 'border-white/30 bg-white/10 text-white' : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100'}`}
						aria-label="Change language"
					>
						<span className="text-base">🌐</span>
						<span>{language}</span>
					</button>

					{user ? (
						<button
							type="button"
							onClick={handleLogout}
							className={`inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 ${isHome && isAtTop ? '' : ''}`}
						>
							{messages.header.logout || 'Logout'}
						</button>
					) : (
						<NavLink
							to="/login"
							className={`inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 ${isHome && isAtTop ? '' : ''}`}
						>
							{messages.header.login}
						</NavLink>
					)}
				</div>
			</div>
		</header>
	)
}

export default Header;
