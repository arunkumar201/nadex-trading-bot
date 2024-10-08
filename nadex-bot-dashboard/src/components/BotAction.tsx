'use client'

import { useState } from "react"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"



export const BotAction = () => {
	const [isBotActive,setIsActive] = useState(false);
	const handleBotActionTrigger = () => {
		setIsActive(prev => !prev)
	}

	return (
		<>
			<div className="flex items-center space-x-2">
				<Button
					variant={"outline"}
					className={cn("")}
				>
					<Switch id="bot-action"

						className="text-xl "
						checked={isBotActive}
						onCheckedChange={handleBotActionTrigger}
					/>
					<Label htmlFor="bot-action" className={cn("text-base w-[9rem]",isBotActive ? 'text-green-500' : 'text-red-500')}>
						{isBotActive ? 'Bot is active' : 'Bot is inactive'}
					</Label>
				</Button>
			</div>
		</>
	)



}
