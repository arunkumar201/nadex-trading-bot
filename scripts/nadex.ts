import puppeteer,{ Puppeteer } from 'puppeteer';
import { Page } from 'puppeteer';

interface Alert {
	symbol: string;
	action: 'buy' | 'sell';
}
const VIEWPORT = { width: 1920,height: 1080 };

export enum orderType {
	LIMIT = "LIMIT",
	MARKET = "MARKET"
}
export interface IJobData {
	orderType: orderType;
	orderAction: "BUY" | "SELL";
	pair: string;
	contractPrice: number;
	contractSize: number;
	selectedDuration: string;
}

class AutomatedTradingBot {
	private isRunning: boolean = false;
	private logs: string[] = [];
	private isUserLogin: boolean = false;
	//@ts-expect-error
	private browser: Page;
	private userName = process.env.NADEX_USER_NAME;
	private password = process.env.NADEX_PASSWORD;

	private addLog(message: string): void {
		this.logs.push(message);
		console.log(message);
	}

	private async login_demo(page: Page): Promise<void> {
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





	private async login_live(page: Page): Promise<void> {
		const userName = this.userName;
		const password = this.password;
		console.log(`userName : ${userName} password : ${password}`);

		await page.goto('https://platform.nadex.com/npwa/#/login');
		this.addLog('Navigated to Nadex login page');

		// Get the current number of pages
		const pagesBeforeClick = await page.evaluate(() => window.opener ? 1 : 0);

		// Click the LOGIN button
		await page.waitForSelector('button[type="submit"]');
		await page.click('button.btn.login_submit');
		this.addLog('Clicked LOGIN button');

		// Wait for the new page to open
		let newPage: Page | undefined;
		while (!newPage) {
			await page.waitForNetworkIdle(); // Wait for 1 second
			const pages = await page.browser().pages();
			if (pages.length > pagesBeforeClick + 1) {
				newPage = pages[pages.length - 1];
			}
		}
		await newPage.waitForNavigation();
		this.addLog('New login page opened');

		// Wait for the login form to appear on the new page
		await newPage.waitForSelector('input#username');
		await newPage.waitForSelector('input#password');

		// Enter username and password
		await newPage.type('input#username',userName!);
		this.addLog('Entered username');

		await newPage.type('input#password',password!);
		this.addLog('Entered password');

		// Click the submit button on the new login form
		await newPage.waitForSelector('button[type="submit"]');
		await newPage.click('button[type="submit"]');
		this.addLog('Clicked submit button on new login form');

		// Wait for the login process to complete
		await newPage.waitForNavigation({ waitUntil: 'networkidle0' });
		this.addLog('Logged in successfully');

		this.isUserLogin = true;
		this.browser = newPage;
	}






	private async getAccountBalance(): Promise<number> {
		try {
			console.log(`user is Login : ${this.isUserLogin} ands browser : ${!!this.browser} `)
			if (!this.isUserLogin || !this.browser) {
				throw new Error("Error while fetching account balance");
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
			this.addLog(`Error fetching account balance: ${error}`);
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
		this.addLog(`Selecting Order Type: ${orderType}`);

		// Use the label to find the associated select element
		const labelSelector = 'label[for^="ember"][for$="-type"]';  // Matches 'emberxxxx-type'
		const selectSelector = 'select.ticket_type-select';

		try {
			// Wait for the label to be visible first
			await this.browser.waitForSelector(labelSelector,{ visible: true });

			// Wait for the select element using the select's class
			await this.browser.waitForSelector(selectSelector,{ visible: true });

			// Log the available options for debugging
			const options = await this.browser.$$eval(`${selectSelector} option`,options => options.map(option => option.value));
			this.addLog(`Available options: ${options.join(', ')}`);

			// Select the appropriate option based on the orderType argument
			const valueToSelect = orderType === "MARKET" ? 'ExecuteAndEliminate' : 'GoodTillCancelled';
			await this.browser.select(selectSelector,valueToSelect);

			this.addLog(`Successfully selected order type: ${orderType}`);
		} catch (error) {
			this.addLog(`Error while selecting order type: ${error}`);
			throw error;
		}
	}

	async selectMiddleMarketTrade(tradeType: 'BUY' | 'SELL'): Promise<void> {
		try {
			// Wait for the market list items to be present
			await this.browser.waitForSelector('.market-list_item');

			// Use JavaScript to find the middle item and click the appropriate button
			const clickResult = await this.browser.evaluate((type) => {
				const items = document.querySelectorAll('.market-list_item');
				if (items.length === 0) return 'No items found';

				const middleIndex = Math.floor(items.length / 2);
				const middleItem = items[middleIndex];

				const buttonSelector = type === 'BUY' ? '.price-button--buy' : '.price-button--sell';
				const button = middleItem.querySelector(buttonSelector);

				if (!button) return `${type} button not found`;

				// Check if the button is an HTMLElement before clicking
				if (button instanceof HTMLElement) {
					button.click();
					return `Clicked ${type} button`;
				} else {
					return `${type} button is not clickable`;
				}
			},tradeType);

			this.addLog(clickResult);

			if (!clickResult.startsWith('Clicked')) {
				throw new Error(clickResult);
			}
		} catch (error) {
			this.addLog(`Error selecting middle market trade: ${error instanceof Error ? error.message : String(error)}`);
			throw error;
		}
	}


	private async openSelectPairForTrade(pair: string,tradeType: "BUY" | "SELL" = "BUY",selectedDuration: string = "5 minute"): Promise<void> {
		// Click on the 5 minute option inside the by duration
		await this.browser.waitForSelector('.card .card_header a[role="button"]');
		const durationOptions = await this.browser.$$('.card .card_header a[role="button"]');
		for (const option of durationOptions) {
			const text = await option.evaluate(el => el.textContent?.trim());
			if (text === selectedDuration) {
				await option.click();
				this.addLog(`Selected ${selectedDuration} duration`);
				break;
			}
		}

		// Then click on the select pair dropdown based on the input pair. 
		await this.browser.waitForNetworkIdle();
		await this.browser.waitForSelector('.market-list_group .market-list_heading .cell.market-list_duration');
		const pairs = await this.browser.$$('.market-list_group .market-list_heading .cell.market-list_duration');
		for (const p of pairs) {
			const text = await p.evaluate(el => el.textContent?.trim());
			if (text === pair) {
				await p.click();
				this.addLog(`Selected pair: ${pair}`);
				break;
			}
		}

		// Wait for the market list items to be present
		await this.selectMiddleMarketTrade(tradeType);

	}


	private async setContractPriceAndSize(price: number,size: number) {
		this.addLog(`Setting contract price to ${price} and size to ${size}`);

		// Selectors for price and size inputs using more generic attributes
		const priceInputSelector = 'input[name="price"]';
		const sizeInputSelector = 'input[name="size"]';

		// Wait for the price input to be visible
		await this.browser.waitForSelector(priceInputSelector,{ visible: true });
		await this.browser.focus(priceInputSelector);
		await this.browser.click(priceInputSelector,{ clickCount: 3 });
		await this.browser.type(priceInputSelector,price.toString());

		// Trigger necessary events after entering the price
		await this.browser.evaluate((selector) => {
			const input = document.querySelector(selector) as HTMLInputElement;
			input.dispatchEvent(new Event('input',{ bubbles: true }));
			input.dispatchEvent(new Event('change',{ bubbles: true }));
			input.dispatchEvent(new Event('blur',{ bubbles: true }));
		},priceInputSelector);

		this.addLog(`Set price to ${price}`);

		// Wait for the size input to be visible
		await this.browser.waitForSelector(sizeInputSelector,{ visible: true });
		await this.browser.focus(sizeInputSelector);
		await this.browser.click(sizeInputSelector,{ clickCount: 3 });
		await this.browser.type(sizeInputSelector,size.toString());

		// Trigger necessary events after entering the size
		await this.browser.evaluate((selector) => {
			const input = document.querySelector(selector) as HTMLInputElement;
			input.dispatchEvent(new Event('input',{ bubbles: true }));
			input.dispatchEvent(new Event('change',{ bubbles: true }));
			input.dispatchEvent(new Event('blur',{ bubbles: true }));
		},sizeInputSelector);

		this.addLog(`Set size to ${size}`);
	}


	private async placeOrder() {
		try {
			// Wait for the "Place order" button to be enabled and visible
			await this.browser.waitForFunction(() => {
				const button = document.querySelector('button.btn.btn--primary[type="submit"]') as HTMLButtonElement;
				return button && !button.disabled;
			},{ timeout: 5000 });

			// Click the "Place order" button natively
			const button = await this.browser.$('button.btn.btn--primary[type="submit"]');
			if (button) {
				const boundingBox = await button.boundingBox();
				if (boundingBox) {
					await this.browser.mouse.click(
						boundingBox.x + boundingBox.width / 2,
						boundingBox.y + boundingBox.height / 2,
						{ delay: 100 } // Add a slight delay to mimic human interaction
					);
					this.addLog('Clicked "Place order" button');
				} else {
					throw new Error('Button bounding box not found');
				}
			} else {
				throw new Error('Button not found');
			}
		} catch (error) {
			this.addLog(`Error placing order: ${error}`);
			throw error;
		}
	}

	public async start(): Promise<void> {
		try {
			const browser = await puppeteer.launch({
				headless: false,
				defaultViewport: null,

				args: ['--start-fullscreen','--window-size=1920,1040'],
			},
			);
			const page = await browser.newPage();
			// await page.setViewport(VIEWPORT);
			this.browser = page;
			const isDemoMode = process.env.DEMO_MODE;
			console.log(`Nadex Bot is running in ${isDemoMode ? 'DEMO MODE' : 'LIVE MODE'}`);
			if (isDemoMode) {
				await this.login_demo(page);
			} else {
				await this.login_live(page); 
			}
			this.isUserLogin = true;
			this.addLog('Bot started');
			const balance = await this.getAccountBalance();
			console.log(`Account balance: ${balance}`);
			this.isRunning = true;
			// await this.OpenSelectPairSection();
			// await this.openSelectPairForTrade("EUR/USD","BUY")
			// await this.selectOrderType("LIMIT")
			// await this.setContractPriceAndSize(2,3);
			// await this.placeOrder();

		} catch (err) {
			this.addLog(`Error: ${err}`);
		}

	}

	public async stop() {
		this.isRunning = false;
		await this.browser.close();
		this.addLog('Bot stopped');
	}

	private async backToBinaryOption() {
		try {
			this.addLog('Back to Binary Options section clicking on back btn');
			await this.browser.waitForSelector('a.page_back.market-list_back',{ visible: true });
			await this.browser.click('a.page_back.market-list_back');
			this.addLog('Clicked "Back to Binary Options" button');
		} catch (error) {
			this.addLog(`Error going back to Binary Options page: ${error}`);
		}
	}
	public async processNadexBinaryOrder(orderData: IJobData) {
		try {
			if (!this.isRunning || !this.isUserLogin) {
				throw new Error("please start the bot first");
			}

			// If the order is valid and relevant, execute the trade
			console.log(`Order Action - ${orderData.orderAction} on ${orderData.pair} at ${orderData.contractPrice} with ${orderData.contractSize} contracts`)
			await this.openSelectPairForTrade(orderData.pair,orderData.orderAction)
			await this.selectOrderType(orderData.orderType)
			await this.setContractPriceAndSize(orderData.contractPrice,orderData.contractSize);
			await this.placeOrder();
			await this.backToBinaryOption();

			this.addLog(`Nadex binary order processed: ${JSON.stringify(orderData)}`);
		}
		catch (err) {
			this.addLog(`Error processing Nadex binary order: ${err}`);
		}
	}

	public getLogs(): string[] {
		return this.logs;
	}
}

// Usage
export const nadexBot = new AutomatedTradingBot();
// To stop the bot after 5 minutes
// setTimeout(() => {
// 	bot.stop();
// 	console.log('Final logs:',bot.getLogs());
// },5 * 60 * 1000);
