import { Check,X } from "lucide-react"
import { Card,CardContent,CardFooter,CardHeader } from "./ui/card"
import { TBotSettingOptions } from "@/types"


export const BotSettings = (currentBotSettings: TBotSettingOptions) => {
	return (
		<>
			<div className='self-end h-full w-full max-w-xl xl:w-[40%]'>
				<Card className="hover:shadow-lg transition-shadow md:mt-0 mt-8 max-w-md w-full border border-gray-200 rounded-lg h-full">
					<CardHeader className="flex justify-between items-center p-4 border-b border-gray-200">
						<div className="font-semibold text-lg">Current Bot Settings</div>
					</CardHeader>
					<CardContent className="p-4 space-y-2">
						<div className="flex items-center">
							<span className="mr-2">Number of Contracts:</span>
							<span className="font-medium">{currentBotSettings.numberOfContracts || 'N/A'}</span>
						</div>
						<div className="flex items-center">
							<span className="mr-2">Buy Price:</span>
							<span className="font-medium">{currentBotSettings.buyPrice || 'N/A'}</span>
						</div>
						<div className="flex items-center">
							<span className="mr-2">Sell Price:</span>
							<span className="font-medium">{currentBotSettings.sellPrice || 'N/A'}</span>
						</div>
						<div className="flex items-center">
							<span className="mr-2">Max Losses:</span>
							<span className="font-medium">{currentBotSettings.maxLosses || 'N/A'}</span>
						</div>
						<div className="flex items-center">
							<span className="mr-2">Reenter After Loss:</span>
							{currentBotSettings.reenterAfterLoss ? (
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
		</>
	)
}
