import { TBotSettingOptions } from "@/types";

export const DEFAULT_BOT_SETTINGS= {
	buyPrice: 60,
  sellPrice: 40,
	maxLosses: 2,
	reenterAfterLoss: false,
  numberOfContracts: 1,
} satisfies TBotSettingOptions
