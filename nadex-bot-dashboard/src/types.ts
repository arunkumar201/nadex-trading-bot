
import z from 'zod';

export const ZBotSettingOptions = z.object({
	buyPrice: z.number().max(100),
  sellPrice: z.number().max(100),
  maxLosses: z.number().max(10),
  reenterAfterLoss: z.boolean(),
  numberOfContracts: z.number().max(20),
})

export type TBotSettingOptions =z.infer<typeof ZBotSettingOptions>;
