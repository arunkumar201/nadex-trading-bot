import puppeteer,{ Puppeteer } from 'puppeteer';
import { Page } from 'puppeteer';

interface Alert {
	symbol: string;
	action: 'buy' | 'sell';
}

class AutomatedTradingBot {
	private isRunning: boolean = false;
	private logs: string[] = [];
	private isUserLogin: boolean = false;
	private browser: Page;
	private userName = process.env.NADEX_USER_NAME;
	private password= process.env.NADEX_PASSWORD;

	private addLog(message: string): void {
		this.logs.push(message);
		console.log(message);
	}

	private async login(page: Page): Promise<void> {
		const userName = this.userName;
		const password = this.password;
		console.log(`userName : ${userName} password : ${password}`);
		await page.goto('https://platform.nadex.com/npwa/#/login');
		this.addLog('Navigated to Nadex login page');

		// Select the Demo option
		await page.waitForSelector('input#-demo');
		await page.click('input#-demo');
		this.addLog('Selected Demo option');

		if (!userName || !password) {
			throw new Error('NADEX_USER_NAME and NADEX_PASSWORD environment variables are required');
		}

		// Enter username and password
		await page.waitForSelector('input.demo-username');
		await page.type('input.demo-username',userName);
		this.addLog('Entered username');

		await page.waitForSelector('input.password');
		await page.type('input.password',password);
		this.addLog('Entered password');

		// Click the LOGIN button
		await page.waitForSelector('button[type="submit"]');
		await page.click('button.btn.login_submit');
		this.addLog('Clicked LOGIN button');

		// Wait for the login process to complete
		await page.waitForNavigation({ waitUntil: 'networkidle0' });
		this.addLog('Logged in successfully');

		this.isUserLogin = true;
		this.browser = page;
	}

	private async handleMT4Alert(alert: Alert): Promise<void> {
		this.addLog(`Received MT4 alert: ${alert.action} ${alert.symbol}`);

		try {
			const browser = await puppeteer.launch({ headless: false }); // Set to false for debugging
			const page = await browser.newPage();
			await this.login(page);
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
	private async getAccountBalance(): Promise<number> {
		try {
			console.log(`user is Login : ${this.isUserLogin} ands browser : ${!!this.browser} `)
			if (!this.isUserLogin || !this.browser) {
				this.start();
			}
			// Wait for the balance element to be visible
			await this.browser.waitForSelector('h2.balance_value');

			// Extract the balance value
			const balanceText = await this.browser.$eval('h2.balance_value',el => (el.textContent && el.textContent.trim()) ?? "0");
			this.addLog(`Fetched balance text: ${balanceText}`);

			// Convert the balance text to a number
			const balance = parseFloat(balanceText.replace(/[^0-9.-]+/g,""));
			this.addLog(`Parsed balance:$${balance}`);
			return balance;
		} catch (error) {
			this.addLog(`Error fetching account balance: ${error.message}`);
			throw error;
		}
	}

	private async OpenSelectPairSection() {
		// First click on the forex section to enter into it
		await this.browser.waitForSelector('a[role="button"] p[data-asset-type="forex"]');
		await this.browser.click('a[role="button"] p[data-asset-type="forex"]');
		this.addLog('Clicked on the forex section');
	}

	private async selectOrderType(orderType: "LIMIT" | "MARKET"): Promise<void> {
		this.addLog(`Order Type select to: ${orderType}`);
		await this.browser.waitForSelector('select#ember5498-type',{ visible: true });

		await this.browser.evaluate((orderType) => {
			const selectElement = document.querySelector('select#ember5498-type') as HTMLSelectElement;
			selectElement.value = orderType === "MARKET" ? 'ExecuteAndEliminate' : 'GoodTillCancelled';
			selectElement.dispatchEvent(new Event('change'));
		},orderType);
		this.addLog(`Selected order type: ${orderType}`);
	}
	private async openSelectPairForTrade(pair: string,tradeType: "BUY" | "SELL" = "BUY",timeRage: string = "2pm-4pm"): Promise<void> {
		// Click on the select pair dropdown
		await this.browser.waitForSelector('.card .expiry-list_market .cell');
		const pairs = await this.browser.$$('.card .expiry-list_market .cell');
		for (const p of pairs) {
			const text = await p.evaluate(el => el.textContent?.trim());
			if (text === pair) {
				await p.click();
				this.addLog(`Selected pair: ${pair}`);
				break;
			}
		}

		// Select the time range
		await this.browser.waitForSelector('.accordion-header .cell');
		const timeRanges = await this.browser.$$('.accordion-header .cell');
		for (const t of timeRanges) {
			const text = await t.evaluate(el => el.textContent?.trim());
			if (text === timeRage) {
				await t.click();
				this.addLog(`Selected time range: ${timeRage}`);
				break;
			}
		}

		// Click on the middle market list item
		await this.browser.waitForSelector('.market-list_content .market-list_item');
		const marketItems = await this.browser.$$('.market-list_content .market-list_item');
		const middleIndex = Math.floor(marketItems.length / 2);
		await marketItems[middleIndex].click();
		this.addLog('Clicked on the middle market list item');

		// Click on the trade type button
		const tradeTypeSelector = tradeType === "BUY" ? '.price-button--buy' : '.price-button--sell';
		await this.browser.waitForSelector(tradeTypeSelector);
		await this.browser.click(tradeTypeSelector);
		this.addLog(`Clicked on the ${tradeType} button`);
	}
	public async start(): Promise<void> {
		try {
			const browser = await puppeteer.launch({ headless: false });
			const page = await browser.newPage();
			this.browser = page;
			this.isRunning = true;
			this.isUserLogin = true;
			this.addLog('Bot started');
			this.login(page);
			const balance = await this.getAccountBalance();
			console.log(`Account balance: ${balance}`);
			await this.OpenSelectPairSection();
			await this.openSelectPairForTrade("'AUD/JPY","SELL")
			await this.selectOrderType("LIMIT")
		} catch (err) {
			this.addLog(`Error: ${err.message}`);
		}
	}

	public async stop() {
		this.isRunning = false;
		await this.browser.close();
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
