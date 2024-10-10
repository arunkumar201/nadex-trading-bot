/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { redisInstance } from "../cache/redis";
import { handleBinaryTrading } from "../controllers/trading.controller";
import express, { NextFunction, Request, Response } from "express";

export const DEFAULT_BOT_SETTINGS = {
  buyPrice: 60,
  sellPrice: 40,
  maxLosses: 2,
  reenterAfterLoss: false,
  numberOfContracts: 1,
};

const router = express.Router();
const redisClient = redisInstance.getClient();

router.post("/place-binary-order", async (req: Request, response: Response, next: NextFunction) => {
  try {
    // Retrieve trade information from the request body
    const tradeInfo = req.body;
    console.log("tradeInfo", tradeInfo);

    // Attempt to get bot settings from Redis
    const botSettings = await redisClient.get('nadex-bot-settings');
    let nadexTrade: any;

    if (!botSettings) {
      // Use default settings if no custom settings are found in Redis
      nadexTrade = {
        contractPrice: tradeInfo?.orderAction == "SELL" ? DEFAULT_BOT_SETTINGS.sellPrice : DEFAULT_BOT_SETTINGS.buyPrice,
        contractSize: DEFAULT_BOT_SETTINGS.numberOfContracts,
        maxLosses: DEFAULT_BOT_SETTINGS.maxLosses,
        reenterAfterLoss: DEFAULT_BOT_SETTINGS.reenterAfterLoss,
      };
    } else {
      // Parse and use custom settings from Redis
      const currentSettings = JSON.parse(botSettings);
      console.log("currentSettings", currentSettings);
      nadexTrade = {
        contractPrice: tradeInfo?.orderAction == "SELL" ? currentSettings.sellPrice : currentSettings.buyPrice,
        contractSize: currentSettings.numberOfContracts,
        maxLosses: currentSettings.maxLosses,
        reenterAfterLoss: currentSettings.reenterAfterLoss,
      };
    }

    // Attach the trade settings to the request object
    // @ts-ignore
    req.nadexTrade = nadexTrade;
    next();
  } catch (error) {
    console.error("Error retrieving bot settings:", error);

    // Use default settings in case of an error
    const nadexTrade = {
      contractPrice: DEFAULT_BOT_SETTINGS.buyPrice,
      contractSize: DEFAULT_BOT_SETTINGS.numberOfContracts,
      maxLosses: DEFAULT_BOT_SETTINGS.maxLosses,
      reenterAfterLoss: DEFAULT_BOT_SETTINGS.reenterAfterLoss,
    };

    // Attach the default trade settings to the request object
    // @ts-ignore
    req.nadexTrade = nadexTrade;
    next();
  }
}, handleBinaryTrading);

export { router as AutoTradingRoute };
