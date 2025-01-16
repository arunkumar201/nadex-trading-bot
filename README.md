# Nadex Bot

Nadex Bot is an automated trading application designed to interact with the Nadex platform, allowing users to place binary options orders programmatically. This README provides detailed instructions on configuring, running, and using the Nadex Bot and its associated dashboard.

## Prerequisites

- Ensure you have [pnpm](https://pnpm.io/) installed on your system.
- Create a `.env` file in the root of the project and in the `nadex-bot-dashboard` folder, based on the respective `.env.example` files.

## Configuration

1. **Root Configuration:**
   - Create a `.env` file in the root directory of the project.
   - Populate it with the necessary environment variables as specified in the `.env.example` file.

2. **Dashboard Configuration:**
   - Create a `.env` file inside the `nadex-bot-dashboard` folder.
   - Add the required environment variables as per the `.env.example` file in the `nadex-bot-dashboard` folder.

## Running the Application

### Starting the Bot API Server

To start the bot API server, execute the following commands:

```bash
pnpm install
pnpm start:prod
```

### Starting the Nadex Bot

The Nadex Bot will open the Nadex site and log in using the credentials configured in the `.env` file. To start the bot, run:

```bash
pnpm start:nadex
```

### Starting the Nadex Bot Dashboard

The dashboard provides a user interface to interact with the bot. To launch the dashboard in your browser, execute:

```bash
pnpm start:dashboard
```

## Placing an Order on Nadex

To place a binary order on Nadex, make a POST request to the following endpoint:

```
POST http://localhost:8000/nadex/place-binary-order
```

### Request Payload

The request should include a JSON payload with the following structure:

```json
{
  "symbol": "USD/JPY",          // The currency pair you want to trade
  "orderAction": "BUY",         // Action to perform: BUY or SELL
  "orderType": "LIMIT",         // Type of order: LIMIT or MARKET
  "selectedDuration": "5 minute" // Duration for the order: e.g., 5 minute etc
}
```

## Additional Information

- Ensure that your `.env` files are correctly configured with the necessary credentials and environment variables.
- The Nadex Bot will automatically log in to the Nadex site using the credentials provided in the `.env` file.
- The Nadex Bot Dashboard provides a user interface to interact with the bot and place orders on Nadex.
