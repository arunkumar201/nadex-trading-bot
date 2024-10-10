'use server'

import { redisInstance } from "@/lib/db";
import { validateInputs } from "@/lib/validate";
import { TBotSettingOptions, ZBotSettingOptions } from "@/types"
import { revalidatePath } from "next/cache";



export const updateBotSettings = async (botSettings: TBotSettingOptions) => { 
	validateInputs([botSettings,ZBotSettingOptions])
	try {
		await redisInstance.set('nadex-bot-settings',JSON.stringify(botSettings));
		revalidatePath("/")
		console.log('bot settings updated successfully');
	} catch (error) {
		console.error('something went wrong while updating bot settings: ', error);
    throw new Error('Something went wrong while updating bot settings');
	}

}
