
export interface IJobData {
	orderType: "LIMIT" | "MARKET";
	orderAction: "BUY" | "SELL";
	pair: string;
	contractPrice: number;
	contractSize: number;
	selectedDuration: string;
}

export const processOrderOnNadex = async (job: any,done: any) => {
	console.log(`Job - ${(job.id)} - Processing Order on Nadex...`);
	//order data
	const orderData = JSON.parse(job.data) as IJobData;
	console.log(`Order data - ${JSON.stringify(orderData)}`);


	done();

}
