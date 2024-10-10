'use server'

import { redisInstance } from "@/lib/db";



export const getLatestBalance = async () => { 
	try {
		const balance = await redisInstance.get("nadex-account-balance");
		if (balance) {
      return parseFloat(JSON.parse(balance));
		}
		console.log("No balance found in Redis, using default balance");
		return 0;
	} catch (err) {
		console.error('Error fetching latest balance:', err);
    return 0;
	}
}
