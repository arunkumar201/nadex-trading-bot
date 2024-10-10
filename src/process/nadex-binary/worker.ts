import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
import { Worker } from "bullmq";
import { processOrderOnNadex } from "./processOrder";

import { nadexBot } from "../../../scripts/nadex"
import redis  from "ioredis";

const REDIS_CONNECTION_OPTION = {
	port: parseInt(process.env.REDIS_PORT!),
	host: process.env.REDIS_HOST!,
	username: "default",
	password: process.env.REDIS_PASSWORD!,
};
//create the redis client 
export const redisClient = new redis({
	port: parseInt(process.env.REDIS_PORT!),
	host: process.env.REDIS_HOST!,
	username: "default",
	password: process.env.REDIS_PASSWORD!,
});

export const startProcesingOrderSingle = async () => {
	new Worker(`nadex-com-binary-queue`,processOrderOnNadex,{
		connection: REDIS_CONNECTION_OPTION,
		autorun: true,
		useWorkerThreads: true,
	});
};

(async () => {
	try {
		// Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
		const currentDay = new Date().getDay();

		// Check if the current day is Friday (5), Saturday (6), or Sunday (0)
		if (currentDay === 5 || currentDay === 6 || currentDay === 0) {
			console.log("Bot will not run on Friday, Saturday, or Sunday.");
			process.exit(1);
		}

		// Start the nadex website and login
		await nadexBot.start();
	} catch (err) {
		console.error("Error starting nadexBot:",err);
		process.exit(1);
	}

	try {
		// Start processing Order on Nadex worker queue.
		await startProcesingOrderSingle();
		console.log("Processing Order on Nadex started successfully");
	} catch (err) {
		console.error("Error starting processing Order on Nadex:",err);
	}
})();
