/* eslint-disable @typescript-eslint/no-explicit-any */
import { nadexBot,orderType } from "../../../scripts/nadex";

export interface IJobData {
	orderType: orderType;
	orderAction: "BUY" | "SELL";
	pair: string;
	contractPrice: number;
	contractSize: number;
	selectedDuration: string;
}

export const processOrderOnNadex = async (job: any,done: any) => {
	console.log(`Job - ${(job.id)}  [${new Date()}]- Processing Order on Nadex...`);

	//order data
	const orderData = JSON.parse(job.data) as IJobData;
	console.log(`Order data - ${JSON.stringify(orderData)}`);

	console.time("start")
	await nadexBot.processNadexBinaryOrder(orderData);
	console.timeEnd("start");

	const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(2000); 
	done();

}
