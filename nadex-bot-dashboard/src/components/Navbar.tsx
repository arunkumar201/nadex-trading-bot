import React from "react";
import { Button } from "@/components/ui/button";
import { BotAction } from "./BotAction";

const Navbar = () => {
	return (
		<nav className="relative top-0 h-full flex items-center justify-between bg-gray-300  shadow-sm p-2 rounded-xl  w-full">
			<div className="text-xl font-bold p-2">Nadex Bot</div>
			<div className="hidden md:flex items-center space-x-4 p-2">
				<Button variant="outline">
					<span className="text-base">Balance</span>
					<span className="ml-2 text-xl text-gray-400 font-bold">$2,345.67</span>
				</Button>
				<BotAction />
			</div>
		</nav>
	);
};

export default Navbar;
