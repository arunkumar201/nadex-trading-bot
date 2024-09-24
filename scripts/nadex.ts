import puppeteer,{ Puppeteer } from 'puppeteer';
import { Page } from 'puppeteer';

interface Alert {
	symbol: string;
	action: 'buy' | 'sell';
}

class AutomatedTradingBot {
	private isRunning: boolean = false;
	private logs: string[] = [];

	private addLog(message: string): void {
		this.logs.push(message);
		console.log(message);
	}

	private async login(page: Page): Promise<void> {
		await page.goto('https://platform.nadex.com/npwa/#/login');
		this.addLog('Navigated to Nadex login page');

		// Click the Demo button
		// await page.waitForSelector('button:has-text("Demo")');
		// await page.click('button:has-text("Demo")');
		// this.addLog('Selected Demo option');

		// Click the LOGIN button
		await page.waitForSelector('input:[id="-demo]');
		await page.click('input:[id="-demo"]');
		this.addLog('Clicked LOGIN button');

		// Wait for the login process to complete
		//i have username and pass
		await page.type('input[name="username"]', 'arunp9825');
		await page.type('input[name="password"]', 'M0112kyBnana');
		await page.click('button[type="submit"]');
		await page.waitForSelector('div[data-testid="trade-page"]');
    this.addLog('Logged in successfully');

		// You may need to adjust this based on how the demo login actually works
		await page.waitForNavigation({ waitUntil: 'networkidle0' });
		this.addLog('Logged in successfully');
	}

	private async handleMT4Alert(alert: Alert): Promise<void> {
		this.addLog(`Received MT4 alert: ${alert.action} ${alert.symbol}`);
		try {

			const browser = await puppeteer.launch({
				headless: false,
				executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
			});
			const page = await browser.newPage();

			await this.login(page);

			// Navigate to the trading page (you may need to adjust this URL)
			await page.goto('https://platform.nadex.com/npwa/#/trade');
			this.addLog('Navigated to trading page');

			// Find and click the "buy" or "sell" button
			// You'll need to update these selectors based on the actual Nadex trading interface
			const buttonSelector = `button[data-testid="${alert.action}-button"]`;
			await page.waitForSelector(buttonSelector);
			await page.click(buttonSelector);
			this.addLog(`Clicked ${alert.action} button`);

			// Find and click the "place order" button
			const placeOrderSelector = 'button[data-testid="place-order-button"]';
			await page.waitForSelector(placeOrderSelector);
			await page.click(placeOrderSelector);
			this.addLog('Clicked place order button');

			await browser.close();
			this.addLog('Order placed successfully');
		} catch (error) {
			this.addLog(`Error: ${error.message}`);
		}
	}

	private simulateMT4Alerts(): void {
		const symbols = ['EUR/USD','GBP/USD','USD/JPY'];
		const actions: ('buy' | 'sell')[] = ['buy','sell'];

		// setInterval(() => {
		if (!this.isRunning) return;

		const alert: Alert = {
			symbol: symbols[Math.floor(Math.random() * symbols.length)],
			action: actions[Math.floor(Math.random() * actions.length)],
		};
		this.handleMT4Alert(alert);
		// },5000);
	}

	public start(): void {
		this.isRunning = true;
		this.addLog('Bot started');
		this.simulateMT4Alerts();
	}

	public stop(): void {
		this.isRunning = false;
		this.addLog('Bot stopped');
	}

	public getLogs(): string[] {
		return this.logs;
	}
}

// Usage
const bot = new AutomatedTradingBot();
bot.start();

// To stop the bot after 5 minutes
// setTimeout(() => {
// 	bot.stop();
// 	console.log('Final logs:',bot.getLogs());
// },5 * 60 * 1000);
