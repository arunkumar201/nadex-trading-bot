# Nadex Bot

## Configuration
 - Create a `.env` file in the root of the project according to `.env.example` and add the following environment variables.
- also create .env inside the nadex-bot-dashboard  folder and add the following environment variables as per.
`.env.example` in the nadex-bot-dashboard folder.

## Running the Application

To start the bot api server
```
1. pnpm i
2. pnpm build
3. pnpm start:prod

```
- start the Nadex Bot  - it will open the nadex site and login as we configured credential in .env  file.
``` bash 
 pnpm start:nadex
```
- start the Nadex Bot Dashboard - it will open the dashboard in the browser.
``` bash

pnpm start:dashboard

```
