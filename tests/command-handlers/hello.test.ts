import { MessageEmbed } from "discord.js";
import { handleHello } from "../../src/command-handlers/hello";
import { expect, vi, describe, it } from "vitest";

describe('handleHello', () => {
  it('should set the bot status and reply with an embed', async () => {
    const setActivity = vi.fn();
    const reply = vi.fn();
    const editReply = vi.fn();
    const client = {
      user: {
        setActivity,
      },
    } as any;

    const interaction = {
      reply,
      editReply,
    } as any;

    await handleHello(client, interaction);

    expect(setActivity).toHaveBeenCalledWith('Hello test');

    const embed = new MessageEmbed()
    .setTitle(`HELLO test`)
    .setDescription(`A DESCRIPTION`)
    .setColor(0x00AE86)
    .setThumbnail('https://avatars.githubusercontent.com/u/6632701?v=4')
    .setURL('https://www.google.com')
    .setFooter("Powered by White Lights");
    expect(editReply).toHaveBeenCalledWith({
      embeds: [embed]
    });
  });
});
