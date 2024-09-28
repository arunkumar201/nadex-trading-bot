import { ENVConfig } from "./config/env.config";
ENVConfig.validateConfig();
import { defaultErrorHandler } from "./middleware/error/defaultError.middleware";
import express,{ NextFunction,Request,Response } from "express";

import { PORT } from "./constants/index";
import bodyParser from "body-parser";
import cors from "cors";
import { httpResponse } from "../src/utils/httpResponse";
import { httpError } from "./utils/httpError.ts";
import apiRoutes from "./routes/api.route";
import { AutoTradingRoute } from "./routes/trading.route";

const app = express();

app.disable("x-powered-by")

app.use(cors({
	credentials: true,
}));

app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

app.get("/server-status",async (req: Request,res: Response,next: NextFunction) => {
	try {
		httpResponse(req,res,200,"Server is up running!",{
			status: "running"
		});
	} catch (err) {
		console.error(`error while getting server status: ${JSON.stringify(err)}`);
		httpError(next,err,req,500);
	}
});

app.get("/",async (req: Request,res: Response,next: NextFunction) => {
	try {
		httpResponse(req,res,200,"Server is up running!",{
			status: "running"
		});
	} catch (err) {
		console.error(`error while getting server status: ${JSON.stringify(err)}`);
		httpError(next,err,req,500);
	}
});

app.use('/api',apiRoutes);
app.use("/nadex",AutoTradingRoute)


app.use(defaultErrorHandler)

const server = app.listen(PORT,() => {
	console.log(`Bot server is server is running on port ${PORT}`);
	console.log(`http://localhost:${PORT}`);
	console.log(`http://localhost:${PORT}/server-status`);
});
