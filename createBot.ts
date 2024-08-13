import fs from 'fs'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { Client, Intents } from 'discord.js'
import { commands, handlers } from './commands'
import dotenv from 'dotenv'

const createBot = async (): Promise<Client> => {

  /**
   * @dev Load the env file with the bot's token, client ID, and guild ID
   */
  dotenv.config()
  const clientId = process.env.CLIENT_ID || 'NOT_FOUND';;
  const guildId = process.env.GUILD_ID || 'NOT_FOUND';;
  const token = process.env.BOT_TOKEN || 'NOT_FOUND';

  /**
   * @dev Create a new Discord client instance and set the intents.
   * The intents are used to specify what events the bot will listen to.
   * @ref https://discord.com/developers/docs/topics/gateway#list-of-intents
   */
  const client = new Client({ intents:
    [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
  })
  /**
   * @dev Setup the REST API to register the commands.
   */
  const rest = new REST({ version: '9' }).setToken(token)
  rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered Discord Bot application commands.'))
    .catch(console.error)

  /**
   * @dev Listen for Command-type interactions with the bot.
   */
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
      return
    }

    if (!client.user) {
      return
    }

    // Some logging to see who is interacting with the bot
    const interactionUser = await interaction?.guild?.members.fetch(interaction.user.id)
    console.log(`User Interacted: ${interactionUser?.user.username}#${interactionUser?.user.discriminator} (${interactionUser?.user.id})`)


    const { commandName } = interaction;

    // if the command is not available, return an error message
    if (!Object.keys(handlers).includes(commandName)) {
      await interaction.reply({
        content: `Command not found: ${commandName}`,
        ephemeral: true,
      })
      return
    }

    // @note: safe to cast here - commandName is guaranteed to be a key of handlers
    const handlerKey = commandName as keyof typeof handlers;

    // execute the command handler
    const handler = handlers[handlerKey];
    handler(client, interaction);
  })

  /**
   * @dev When the client is fully ready, this event will trigger.
   * @note This is the best time to set initial bot status and log that the bot is ready.
   * @important This is the best place to setup intervals that check for interactions.
   */
  client.once('ready', async () => {
    console.log('Starting Discord Bot...')

    if (!client.user) {
      console.error('Client user is not available.')
      return
    }

    client.user.setStatus('online')
    client.user.setActivity('Hello World')

    console.log(`Discord Bot is ready as ${client.user.tag}!`)
  })

  // Login to Discord client token
  await client.login(token)

  return client;
};

export default createBot;
