import { SlashCommandBuilder } from '@discordjs/builders'
import { handlePing } from './command-handlers/ping'
import { handleHello } from './command-handlers/hello'

/**
 * @dev Configure the commands that the bot will listen to.
 * @note Each one should have a handler in the `handlers` directory
 * @see handlers
 * @see ./command-handlers/
 */
export const COMMAND_NAME_PING = 'ping'
export const COMMAND_NAME_HELLO = 'hello'

export const commands = [
  new SlashCommandBuilder().setName(COMMAND_NAME_PING).setDescription('Replies with pong!'),
  new SlashCommandBuilder().setName(COMMAND_NAME_HELLO).setDescription('Replies with a hello world embed!'),
].map(command => command.toJSON())

export const handlers = {
  [COMMAND_NAME_PING]: handlePing,
  [COMMAND_NAME_HELLO]: handleHello,
}
