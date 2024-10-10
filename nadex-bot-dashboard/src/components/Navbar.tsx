'use client'
import React from "react";
import { Button } from "@/components/ui/button";
import { BotAction } from "./BotAction";
import useSWR from 'swr';
export interface INavBar {
	nadex_account_balance: string;
}
const fetcher = (url: string) => fetch(url).then((res) => res.json());


const formatBalance = (balance: string): string => {
	const sanitizedBalance = balance.replace(/[^\d.-]/g,'');
	const parsedBalance = parseFloat(sanitizedBalance);

	if (isNaN(parsedBalance)) {
		return "Balance: $0.00";
	}

	// Use Intl.NumberFormat for proper formatting with commas and two decimals
	const formattedBalance = new Intl.NumberFormat('en-US',{
		style: 'currency',
		currency: 'USD',
	}).format(parsedBalance);

	return `${formattedBalance}`;
};


const Navbar = ({ nadex_account_balance }: INavBar) => {
	const { data } = useSWR('/api/latest-balance',fetcher,{
		keepPreviousData: true,
		fallbackData: nadex_account_balance,
		refreshInterval: 500,
	})
	return (
		<nav className="relative top-0 h-full flex items-center justify-between bg-gray-300 shadow-sm p-2 rounded-xl w-full">
			<div className="text-xl font-bold p-2">Nadex Bot</div>
			<div className="relative hidden md:flex items-center space-x-4 p-2">
				<Button variant="outline" className="relative">
					<span className="text-base">Balance</span>
					<span className="ml-2 text-xl text-gray-400 font-bold">{formatBalance(data?.balance.toString() ?? "0")}</span>
				</Button>
				<BotAction />
			</div>
		</nav>
	);
};

export default Navbar;
