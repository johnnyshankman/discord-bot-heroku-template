import fs from 'fs'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { Client, Intents, MessageEmbed } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

// Load the config file with the bot's token, client ID, and guild ID
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'))
const { clientId, guildId, token } = config

// Create a new client instance and set the intents
const client = new Client({ intents:
  [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})

// Setup the list of available commands
const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
  new SlashCommandBuilder().setName('test').setDescription('Replies with a test embed!'),
].map(command => command.toJSON())

// Setup REST API
const rest = new REST({ version: '9' }).setToken(token)
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log('Successfully registered Discord Bot application commands.'))
  .catch(console.error)


// HANDLE ALL COMMANDS HERE
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) {
    return
  }

  const { commandName } = interaction

  const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
  console.log(`User Interacted: ${interactionUser.user.username}#${interactionUser.user.discriminator} (${interactionUser.user.id})`)

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
 * When the client is fully ready, this event will trigger.
 * This is the best time to set bot status and activity that it's working.
 * It's also a good place to setup intervals that check for interactions.
 */
client.once('ready', async () => {
  console.log('Starting Discord Bot...')
  client.user.setStatus('available')
  client.user.setActivity('Hello World')
})

// Login to Discord with your client's token
client.login(token)
