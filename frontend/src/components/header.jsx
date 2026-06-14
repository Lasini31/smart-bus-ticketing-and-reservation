import React from 'react';

const Header = () => {
	return (
		<header className="justify-between items-center px-6 py-4 bg-slate-900 text-white h-16 fixed top-0 left-0 right-0 z-10">
			<div className="text-lg font-bold">Header goes here.</div>
			{/* <nav>
				<ul className="flex gap-4 list-none m-0 p-0">
					<li><a href="#home" className="text-white no-underline text-sm hover:underline">Home</a></li>
				</ul>
			</nav> */}
		</header>
	);
};

export default Header;
