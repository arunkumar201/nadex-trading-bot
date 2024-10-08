'use client'

import { ChangeEvent,FormEvent,useState } from 'react';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Card,CardContent,CardFooter,CardHeader } from './ui/card';
import { X,Check } from 'lucide-react'
export const BotConfigurationForm = () => {
	const [formValues,setFormValues] = useState({
		numberOfContracts: '',
		buyPrice: '',
		sellPrice: '',
		maxLosses: '',
		reenterAfterLoss: false,
	});

	const handleFormData = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { numberOfContracts,buyPrice,sellPrice,maxLosses,reenterAfterLoss } = formValues;
		console.log(numberOfContracts,buyPrice,sellPrice,maxLosses,reenterAfterLoss);
	}

	const handleChange = (e: ChangeEvent<HTMLInputElement> | FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const { name,value,type } = e.currentTarget;
		const checked = type === 'checkbox' ? e.currentTarget.checked : true;
		console.log(checked,name,"-----")
		setFormValues({
			...formValues,
			[name]: type === 'checkbox' ? checked : value,
		});
	};

	return (
		<div className='w-full flex flex-row gap-4 justify-center flex-wrap-reverse items-start h-full'>
			<div className='xl:w-[60%] max-w-xl w-full'>
				<form className="bg-white shadow-md rounded p-4 flex flex-col gap-4">
					<Label htmlFor="numberOfContracts">Number of Contracts to Enter</Label>
					<Input type="number" name="numberOfContracts" id="numberOfContracts" value={formValues.numberOfContracts} onChange={handleChange} className="border p-2 rounded" />

					<Label htmlFor="buyPrice">Buy Contract Price</Label>
					<Input type="number" name="buyPrice" id="buyPrice" value={formValues.buyPrice} onChange={handleChange} className="border p-2 rounded" />

					<Label htmlFor="sellPrice">Sell Contract Price</Label>
					<Input type="number" name="sellPrice" id="sellPrice" value={formValues.sellPrice} onChange={handleChange} className="border p-2 rounded" />

					<Label htmlFor="maxLosses">Max Losses</Label>
					<Input type="number" name="maxLosses" id="maxLosses" value={formValues.maxLosses} onChange={handleChange} className="border p-2 rounded" />

					<div className="flex items-center gap-2">
						<Checkbox name="reenterAfterLoss" id="reenterAfterLoss" checked={formValues.reenterAfterLoss} onCheckedChange={(checkedValue) => {
							setFormValues((prev) => {
								return {
									...prev,
									reenterAfterLoss: Boolean(checkedValue.valueOf())
								}
							})
						}} />
						<Label htmlFor="reenterAfterLoss">Reenter After Loss</Label>
					</div>

					<Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded" onClick={handleFormData}>Submit</Button>
				</form>
			</div>
			<div className='self-end h-full w-full max-w-xl xl:w-[40%]'>
				<Card className="hover:shadow-lg transition-shadow md:mt-0 mt-8 max-w-md w-full border border-gray-200 rounded-lg h-full">
					<CardHeader className="flex justify-between items-center p-4 border-b border-gray-200">
						<div className="font-semibold text-lg">Current Bot Settings</div>
					</CardHeader>
					<CardContent className="p-4 space-y-2">
						<div className="flex items-center">
							<span className="mr-2">Number of Contracts:</span>
							<span className="font-medium">{formValues.numberOfContracts || 'N/A'}</span>
						</div>
						<div className="flex items-center">
							<span className="mr-2">Buy Price:</span>
							<span className="font-medium">{formValues.buyPrice || 'N/A'}</span>
						</div>
						<div className="flex items-center">
							<span className="mr-2">Sell Price:</span>
							<span className="font-medium">{formValues.sellPrice || 'N/A'}</span>
						</div>
						<div className="flex items-center">
							<span className="mr-2">Max Losses:</span>
							<span className="font-medium">{formValues.maxLosses || 'N/A'}</span>
						</div>
						<div className="flex items-center">
							<span className="mr-2">Reenter After Loss:</span>
							{formValues.reenterAfterLoss ? (
								<Check className="text-green-500" />
							) : (
								<X className="text-red-500" />
							)}
						</div>
					</CardContent>
					<CardFooter className="">
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
