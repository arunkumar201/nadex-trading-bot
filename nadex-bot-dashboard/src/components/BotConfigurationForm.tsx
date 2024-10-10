'use client'

import { ChangeEvent,FormEvent,useState } from 'react';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import toast from 'react-hot-toast';
import { updateBotSettings } from '@/actions/updateBotSettingsAction';

export const BotConfigurationForm = () => {
	const [formValues,setFormValues] = useState({
		numberOfContracts: '',
		buyPrice: '',
		sellPrice: '',
		maxLosses: '',
		reenterAfterLoss: false,
	});
	const [errors,setErrors] = useState({
		numberOfContracts: '',
		buyPrice: '',
		sellPrice: '',
		maxLosses: '',
	});
	const [isUpdating,setIsUpdating] = useState(false);

	const validateForm = () => {
		const newErrors = {
			numberOfContracts: '',
			buyPrice: '',
			sellPrice: '',
			maxLosses: '',
		};

		if (!formValues.numberOfContracts || isNaN(Number(formValues.numberOfContracts))) {
			newErrors.numberOfContracts = 'Please enter a valid number of contracts.';
		}
		if (!formValues.buyPrice || isNaN(Number(formValues.buyPrice))) {
			newErrors.buyPrice = 'Please enter a valid buy price.';
		}
		if (!formValues.sellPrice || isNaN(Number(formValues.sellPrice))) {
			newErrors.sellPrice = 'Please enter a valid sell price.';
		}
		if (!formValues.maxLosses || isNaN(Number(formValues.maxLosses))) {
			newErrors.maxLosses = 'Please enter a valid number of max losses.';
		}

		setErrors(newErrors);

		return Object.values(newErrors).every(error => error === '');
	};

	const handleFormData = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsUpdating(true);
		try {
			const updateConfig = {
				numberOfContracts: parseInt(formValues.numberOfContracts),
				buyPrice: parseFloat(formValues.buyPrice),
				sellPrice: parseFloat(formValues.sellPrice),
				maxLosses: parseInt(formValues.maxLosses),
				reenterAfterLoss: formValues.reenterAfterLoss,
			};
			await updateBotSettings(updateConfig);
			toast.success(`Bot Settings updated successfully`);
		} catch (err) {
			toast.error(`Failed to update bot settings`);
			console.error('Failed to update bot settings: ',err);
		} finally {
			setIsUpdating(false);
			setFormValues({
				numberOfContracts: '',
				buyPrice: '',
				sellPrice: '',
				maxLosses: '',
				reenterAfterLoss: false,
			});
		}
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement> | FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const { name,value,type } = e.currentTarget;
		const checked = type === 'checkbox' ? e.currentTarget.checked : true;
		setFormValues({
			...formValues,
			[name]: type === 'checkbox' ? checked : value,
		});
	};

	return (
			<div className='xl:w-[60%] max-w-xl w-full'>
				<form className="bg-white shadow-md rounded p-4 flex flex-col gap-4">
					<Label htmlFor="numberOfContracts">Number of Contracts to Enter</Label>
				<Input required type="number" name="numberOfContracts" id="numberOfContracts" value={formValues.numberOfContracts} onChange={handleChange} className="border p-2 rounded" />
				{errors.numberOfContracts && <span className="text-red-500">{errors.numberOfContracts}</span>}

					<Label htmlFor="buyPrice">Buy Contract Price</Label>
				<Input required type="number" name="buyPrice" id="buyPrice" value={formValues.buyPrice} onChange={handleChange} className="border p-2 rounded" />
				{errors.buyPrice && <span className="text-red-500">{errors.buyPrice}</span>}

					<Label htmlFor="sellPrice">Sell Contract Price</Label>
				<Input required type="number" name="sellPrice" id="sellPrice" value={formValues.sellPrice} onChange={handleChange} className="border p-2 rounded" />
				{errors.sellPrice && <span className="text-red-500">{errors.sellPrice}</span>}

					<Label htmlFor="maxLosses">Max Losses</Label>
				<Input required type="number" name="maxLosses" id="maxLosses" value={formValues.maxLosses} onChange={handleChange} className="border p-2 rounded" />
				{errors.maxLosses && <span className="text-red-500">{errors.maxLosses}</span>}

					<div className="flex items-center gap-2">
						<Checkbox name="reenterAfterLoss" id="reenterAfterLoss" checked={formValues.reenterAfterLoss} onCheckedChange={(checkedValue) => {
							setFormValues((prev) => {
								return {
									...prev,
									reenterAfterLoss: Boolean(checkedValue.valueOf())
								};
							});
						}} />
						<Label htmlFor="reenterAfterLoss">Reenter After Loss</Label>
					</div>

				<Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded" onClick={handleFormData}
					disabled={isUpdating}
					aria-disabled={isUpdating}
				>Submit</Button>
				</form>
		</div>
	);
}
