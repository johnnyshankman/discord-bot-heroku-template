import { Client, CommandInteraction } from "discord.js";


export const handlePing = async (client: Client<true>, interaction: CommandInteraction) => {
  client.user?.setActivity(`Pong!`)
  await interaction.reply('Pong!')
};
