/* eslint-disable @typescript-eslint/ban-ts-comment */
import { handleBinaryTrading,INadexTrade } from "../controllers/trading.controller";
import express,{ NextFunction,Request,Response } from "express";

const router = express.Router();

router.post("/place-binary-order",async (req: Request,response: Response,next: NextFunction) => {
	//we get the nadex trade default settings data
	const nadexTrade = {
		contractPrice: 2,
		contractSize: 3
	} as INadexTrade
	//@ts-ignore
	req.nadexTrade = nadexTrade;
	next();
},handleBinaryTrading);

export { router as AutoTradingRoute };
