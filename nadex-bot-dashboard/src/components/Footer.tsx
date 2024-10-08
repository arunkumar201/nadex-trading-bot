import React from 'react';

const Footer = () => {
	return (
		<footer className="bg-[#33443C] text-white p-8 mt-12">
			<div className="container mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<nav>
						<h3 className="font-bold mb-4">Nadex Bot Dashboard</h3>
						<ul className='flex flex-col gap-y-1'>
							<li><a href="#" className="hover:underline">Nadex</a></li>
						</ul>
					</nav>

					<nav>
						<h3 className="font-bold mb-4">FAQ</h3>
						<ul className='flex flex-col gap-y-1'>
							<li><a href="#" className="hover:underline">Bot</a></li>

						</ul>
					</nav>

				</div>

				<hr className="my-8 border-gray-600" />

				<div className="flex flex-col md:flex-row justify-between items-center">
					<p>&copy; 2024 Nadex Bot.</p>
					<nav>
						<ul className="flex space-x-4 mt-4 md:mt-0">
							<li><a href="#" className="hover:underline">Nadex Bot</a></li>
							<li><a href="#" className="hover:underline">Auto Trading Bot</a></li>
						</ul>
					</nav>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
