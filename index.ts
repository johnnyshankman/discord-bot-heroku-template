import fs from 'fs'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { Client, Intents, MessageEmbed } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

/**
 * @dev Load the config file with the bot's token, client ID, and guild ID
 */
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'))
const { clientId, guildId, token } = config

/**
 * @dev Create a new Discord client instance and set the intents.
 * The intents are used to specify what events the bot will listen to.
 */
const client = new Client({ intents:
  [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})

/**
 * @dev Configure the commands that the bot will listen to.
 */
const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
  new SlashCommandBuilder().setName('test').setDescription('Replies with a test embed!'),
].map(command => command.toJSON())

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

  const { commandName } = interaction

  const interactionUser = await interaction?.guild?.members.fetch(interaction.user.id)
  console.log(`User Interacted: ${interactionUser?.user.username}#${interactionUser?.user.discriminator} (${interactionUser?.user.id})`)

  if (commandName === 'ping') {
    client.user.setActivity(`Pong!`)
    await interaction.reply('Pong!')
  }

  else if (commandName === 'test') {
    client.user.setActivity(`Hello test`)
    const embed = new MessageEmbed()
      .setTitle(`HELLO test`)
      .setDescription(`A DESCRIPTION`)
      .setColor(0x00AE86)
      .setThumbnail('https://avatars.githubusercontent.com/u/6632701?v=4')
      .setTimestamp()
      .setURL('https://www.google.com')
      .setFooter("Powered by White Lights")

    await interaction.editReply({
      embeds: [embed]
    })
  }
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
client.login(token)