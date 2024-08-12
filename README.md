# Discord Bot

Built to run perpetualy as a worker process on Heroku free tier. Has a clear separation of concerns between the bot and the commands it can run. This allows for easy extensibility and maintainability.

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


## Deploying to Heroku

First you must [install Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

```sh
# log in to Heroku
$ heroku login

# Make this repo connected to hHeroku by doing one of the next two commands
$ heroku create # connects to a fresh Heroku app with a random generated name
$ heroku git:remote -a my-cool-discord-bot # connects to existing Heroku app

# Now you can push code to Heroku and trigger a build
$ git push heroku main

# This next thing is only necessary to do once lifetime
# as it turns off the web dyno and turns on the workers dyno.
# You never want to use web dynos for 24/7 worker code.
$ heroku ps:scale web=0 worker=1
```

Now every time you do `git push heroku main` it will rebuild.


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
