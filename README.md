# I am a fish that play music 🐟

Single use bot to listen to youtube with friends through discord

## Configure
Create a file `bot.js` in `/config`
```
const config = {
    "token_bot": "<Your Bot token id>",
    "clientId": "<Your Bot Id>",
    "guildId": "<Your Server Id>"
}

export default config
```

Where to find that:
- **Your Bot token id**: Go to [Discord for developpers](https://discord.com/developers/applications/) and get your app token in Bot section
- **Your Bot Id**: Go to [Discord for developpers](https://discord.com/developers/applications/) and get your Id from General Information
- **Your Server Id**: Go to your discord server (via a web browser) and take the id found in the url

## Install libs 
```
> npm install

OR

> pnmp install
```

## Compile Typescript

```
> npx tsc
```

## Deploy the commands
Deploy the commands to your server to have access to the / commands: [General Guide](https://discordjs.guide/creating-your-bot/command-deployment.html#global-commands)
```
> node deploy-commands.js
```

## Launch the bot
```
> node index.js
```