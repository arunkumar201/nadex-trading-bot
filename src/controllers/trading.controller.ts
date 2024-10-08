/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request,Response } from "express";
import { ConnectionOptions,Queue } from "bullmq";
import { ENVConfig } from "../config/env.config";
import z from "zod";

export const REDIS_CONNECTION_OPTIONS: ConnectionOptions = {
	port: parseInt(ENVConfig.REDIS_PORT || "6379"),
	host: ENVConfig.REDIS_HOST,
	username: "default",
	password: ENVConfig.REDIS_PASSWORD,
	retryStrategy: () => {
		console.timeLog("reconnectStrategy","reconnectStrategy");
		return 500;
	},
};


const queue = new Queue(`nadex-com-binary-queue`,{
	connection: REDIS_CONNECTION_OPTIONS,
});

export interface INadexTrade {
	contractSize: number;
	contractPrice: number;
}

export const ZNadexBinaryTrade = z.object({
	symbol: z.string(),
	orderAction: z.enum(["BUY","SELL"]),
	orderType: z.enum(["LIMIT","MARKET"]).default("LIMIT"),
	selectedDuration: z.string().default("5 minute"),
})

export type TNadexBinaryTrade = z.infer<typeof ZNadexBinaryTrade>;

export const handleBinaryTrading = async (req: Request,res: Response) => {
	const bodyData = req.body;
	//@ts-expect-error
	const defaultNadexTrade = (req.nadexTrade) as INadexTrade;
	console.log(`default nadex trade settings : ${JSON.stringify(defaultNadexTrade)}`)

	const tradingData = bodyData as TNadexBinaryTrade;
	const timestamp = new Date().toLocaleString();
	console.log(`[${timestamp}] Signal Received for ${JSON.stringify(tradingData)}`);


	if (!tradingData) {
		return res.status(200).json({
			message: "No trading data found",
			result: null,
		});
	}

	const jobData = {
		orderType: tradingData.orderType,
		orderAction: tradingData.orderAction,
		pair: tradingData?.symbol.toUpperCase(),
		contractPrice: defaultNadexTrade.contractPrice ?? 10,
		contractSize: defaultNadexTrade.contractSize ?? 3,
		selectedDuration: tradingData.selectedDuration
	};

	console.log(`Job data: ${JSON.stringify(jobData)}`);

	try {
		await queue.add("binary-order",JSON.stringify(jobData));

		console.log(`[${timestamp}] Job added to queue for ${JSON.stringify(tradingData)}`);

		res.status(200).json({
			message: "Order has been placed successfully",
			result:
				"Order has been Place successfully and Currently Processing by Nadex.com",
		});

	} catch (error: unknown) {
		console.error("Error:",error);
		return res.status(400).json({
			message: "Something went wrong",
		});
	}
};
