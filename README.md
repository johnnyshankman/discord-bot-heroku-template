# Discord Bot Heroku Template

Built to run perpetualy as a worker process on Heroku for very cheap (originally designed for their sunsetted Free Tier). Has a clear separation of concerns between the bot and the commands it can run. This allows for easy extensibility and maintainability.

Written in typescript and runs as a daemon process using `ts-node`.

## Running Locally

```sh
npm i
npm run start
```

Bot will run inside of terminal until killed as it's essentially a DAEMON process.

## Linting

```sh
npm run lint # fixes any issues it can fix automatically
```

## Getting Credentials

### Your Bot Token
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to the Bot tab and create a new bot
4. Copy the token

### Your Guild ID
1. Go to your Discord server
2. Right click on the server name in the left sidebar
3. Click on "Copy ID"

### Your Client ID
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click on the application you created earlier
3. Go to the OAuth2 tab
3. Copy the Client ID

## Deploying to Heroku

First you must [install Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) on your local machine. Then use the instructions below to deploy your bot to Heroku.

```sh
# Log in to Heroku
$ heroku login

# Connect your local repo to a Heroku project by either:
#   1. creating a fresh Heroku app with a randomly generated name and connecting to it
$ heroku create
#   2. connecting to an existing Heroku app
$ heroku git:remote -a my-cool-heroku-project

# Set up your environment variables (See .env.example for more info)
$ heroku config:set CLIENT_ID=0
$ heroku config:set GUILD_ID=0
$ heroku config:set BOT_TOKEN=XXX.YYY.ZZZ

# Turn off the web dyno as this is a bot with only a backend worker dyno
$ heroku ps:scale web=0 worker=1

# Now you can push code to Heroku and trigger a build any time
$ git push heroku main
```

To deploy new code to Heroku, just push to the `main` branch and do a `git push heroku main` to trigger a build.

## Inviting Your Bot to Your Server

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click on the application you created earlier
3. Go to the OAuth2 tab
4. In the "OAuth2 URL Generator" section, select the "bot" scope
5. Copy the generated URL and paste it into your browser
6. Select the server you want to invite the bot to
7. Click "Authorize"

## Documentation

* https://devcenter.heroku.com/articles/procfile
* https://devcenter.heroku.com/articles/git
* https://devcenter.heroku.com/articles/scaling

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)

## To Do

* Create an AWS/Docker version of this repo for AWS peeps
  * https://www.freecodecamp.org/news/how-to-deploy-a-node-js-application-to-amazon-web-services-using-docker-81c2a2d7225b/
