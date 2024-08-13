import { SlashCommandBuilder } from '@discordjs/builders'
import { handlePing } from './command-handlers/ping'
import { handleTest } from './command-handlers/test'

/**
 * @dev Configure the commands that the bot will listen to.
 * @note Each one should have a handler in the `handlers` directory
 * @see handlers
 * @see ./handlers
 */
export const COMMAND_NAME_PING = 'ping'
export const COMMAND_NAME_TEST = 'test'

export const commands = [
  new SlashCommandBuilder().setName(COMMAND_NAME_PING).setDescription('Replies with pong!'),
  new SlashCommandBuilder().setName(COMMAND_NAME_TEST).setDescription('Replies with a test embed!'),
].map(command => command.toJSON())

export const handlers = {
  [COMMAND_NAME_PING]: handlePing,
  [COMMAND_NAME_TEST]: handleTest,
}
