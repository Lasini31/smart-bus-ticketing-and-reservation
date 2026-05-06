import { NavLink } from 'react-router-dom'

const Header = () => {
	return (
		<header className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white h-16 fixed top-0 left-0 right-0 z-10 shadow-lg shadow-slate-900/10">
			<div className="text-lg font-semibold tracking-tight">Smart Bus</div>
			<nav>
				<ul className="flex items-center gap-5 text-sm font-medium">
					<li>
						<NavLink
							to="/"
							className={({ isActive }) =>
								`text-slate-200 hover:text-white ${isActive ? 'text-white underline' : ''}`
							}
						>
							Home
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/booking"
							className={({ isActive }) =>
								`text-slate-200 hover:text-white ${isActive ? 'text-white underline' : ''}`
							}
						>
							Book
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/wallet"
							className={({ isActive }) =>
								`text-slate-200 hover:text-white ${isActive ? 'text-white underline' : ''}`
							}
						>
							Wallet
						</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	)
}

export default Header;
