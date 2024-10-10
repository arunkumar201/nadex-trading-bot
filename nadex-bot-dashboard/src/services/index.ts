import 'server-only';

import { TBotSettingOptions } from '@/types';
import { DEFAULT_BOT_SETTINGS  as s} from '@/constants';
import { redisInstance as redisClient } from "../lib/db"

export const getBotSettings = async (): Promise<TBotSettingOptions> => {
	try {
		//will fetch bot settings from a database or a file
		const botSettings = await redisClient.get('nadex-bot-settings');

    if (botSettings) {
      return JSON.parse(botSettings) as TBotSettingOptions;
    }
    // if not found in db, return default settings
		console.log('bot settings not found in redis or db, using default settings');

		return {
			buyPrice: s.buyPrice,
      sellPrice: s.sellPrice,
			maxLosses: s.maxLosses,
			reenterAfterLoss: s.reenterAfterLoss,
      numberOfContracts: s.numberOfContracts,
		}
		
	} catch (error) {
		console.error('something went wrong while fetching bot settings: ',error);
		return {
			buyPrice: s.buyPrice,
      sellPrice: s.sellPrice,
      maxLosses: s.maxLosses,
      reenterAfterLoss: s.reenterAfterLoss,
      numberOfContracts: s.numberOfContracts,
		}
	}

	
}
