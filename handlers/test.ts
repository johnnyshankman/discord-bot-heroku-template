import { Client, CommandInteraction, MessageEmbed } from "discord.js";


export const handleTest = async (client: Client<true>, interaction: CommandInteraction) => {
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
};
