import { describe, it, expect, beforeAll, vi, beforeEach, MockedFunction, MockInstance } from 'vitest';
import createBot from '../src/createBot';
import { commands } from '../src/commands';
import { Intents, Client, CommandInteraction } from 'discord.js'


const putMock = vi.fn().mockResolvedValue({});
vi.mock('@discordjs/rest', () => {
  class MockREST {
    setToken() {
      return this;
    }
    async put() {
      return Promise.resolve({});
    }

    constructor() {
      this.put = putMock
    }
  }
  return { REST: MockREST };
});

const applicationGuildCommandsMock = vi.hoisted(() => {
  return vi.fn().mockReturnValue('mockedRoute');
});

vi.mock('discord-api-types/v9', () => {
  return {
    Routes: {
      applicationGuildCommands: applicationGuildCommandsMock
    },
  };
});

const setStatus = vi.fn();
const setActivity = vi.fn();
const loginSpy = vi.fn();
const ClientConstructorSpy = vi.fn();

vi.mock('discord.js', async () => {
  const actualDiscord = await vi.importActual('discord.js') as any;

  return {
    Client: vi.fn().mockImplementation((options) => {
      const clientInstance = new actualDiscord.Client(options);
      ClientConstructorSpy(options);

      return {
        on: clientInstance.on.bind(clientInstance),
        once: vi.fn((event, callback) => {
          if (event === 'ready') callback();
        }),
        login: loginSpy,
        user: {
          setStatus: setStatus,
          setActivity: setActivity,
        },
        emit: clientInstance.emit.bind(clientInstance),
      };
    }),
    Intents: actualDiscord.Intents
  };
});

describe('Discord Bot Server', () => {
  let logSpy: MockInstance;
  let client: Client<boolean>;

  beforeAll(async () => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    vi.stubEnv('CLIENT_ID', 'mockedClientId')
    vi.stubEnv('GUILD_ID', 'mockedGuildId')
    vi.stubEnv('BOT_TOKEN', 'mockedToken')
  });

  beforeEach(async () => {
    client = await createBot();
  });

  it('should log "Successfully registered Discord Bot application commands."', () => {
    expect(logSpy).toHaveBeenCalledWith('Successfully registered Discord Bot application commands.');
  });

  it('should call the put method on the REST API with correct body to set commands up', () => {
    expect(putMock).toHaveBeenCalledWith('mockedRoute', { body: commands });
  });

  it('should call applicationGuildCommandsMock with the correct parameters', () => {
    expect(applicationGuildCommandsMock).toHaveBeenCalledWith('mockedClientId', 'mockedGuildId');
  });

  it('should create a new Discord Client with the correct intents', () => {
    expect(ClientConstructorSpy.mock.calls[0][0].intents).toEqual(Intents.FLAGS.GUILDS + Intents.FLAGS.GUILD_MESSAGES);
  });

  describe('when the bot is ready', () => {
    it('should log "Starting Discord Bot..."', () => {
      expect(logSpy).toHaveBeenCalledWith('Starting Discord Bot...');
    });

    it('should set the bot status to online', () => {
      expect(setStatus).toHaveBeenCalledWith('online');
    });

    it('should set the bot activity to Hello World', () => {
      expect(setActivity).toHaveBeenCalledWith('Hello World');
    });

    it('should log "Discord Bot is ready as <bot tag>! after setup is complete"', () => {
      expect(logSpy).toHaveBeenCalledWith('Discord Bot is ready as undefined!');
    });

    it('should login to Discord with the token gotten from env', () => {
      expect(loginSpy).toHaveBeenCalledWith('mockedToken');
    });
  });

  describe('responding to interactions', () => {
    it('should respond with an error message if the command is not found', async () => {
      const interaction = {
        isCommand: () => true,
        user: { id: 'mockedUserId' },
        guild: { members: { fetch: vi.fn().mockResolvedValue({ user: { username: 'mockedUsername', discriminator: 'mockedDiscriminator', id: 'mockedUserId' } }) } },
        reply: vi.fn(),
        commandName: 'nonExistentCommand',
      } as any as CommandInteraction;

      await client.emit('interactionCreate', interaction);

      expect(interaction.reply).toHaveBeenCalledWith({
        content: 'Command not found: nonExistentCommand',
        ephemeral: true,
      });
    });

    it('should do nothing if the interaction is not a command', async () => {
      const interaction = {
        isCommand: () => false,
        user: { id: 'mockedUserId' },
        guild: { members: { fetch: vi.fn().mockResolvedValue({ user: { username: 'mockedUsername', discriminator: 'mockedDiscriminator', id: 'mockedUserId' } }) } },
        reply: vi.fn(),
        commandName: 'nonExistentCommand',
      } as any as CommandInteraction;

      await client.emit('interactionCreate', interaction);

      expect(interaction.reply).not.toHaveBeenCalled();
    });

    it('should do nothing if the client user is not available', async () => {
      const interaction = {
        isCommand: () => true,
        user: { id: 'mockedUserId' },
        guild: { members: { fetch: vi.fn().mockResolvedValue({ user: { username: 'mockedUsername', discriminator: 'mockedDiscriminator', id: 'mockedUserId' } }) } },
        reply: vi.fn(),
        commandName: 'nonExistentCommand',
      } as any as CommandInteraction;

      client.user = null;

      await client.emit('interactionCreate', interaction);

      expect(interaction.reply).not.toHaveBeenCalled();
    });

    it('should call the correct handler if the command is found', async () => {
      /**
       * @note This test implicitly tests the ping handler's functionality.
       * That is not important here and that handler is not what we care about.
       * We only care that the correct handler is called.
       */
      const interaction = {
        isCommand: () => true,
        user: { id: 'mockedUserId' },
        guild: { members: { fetch: vi.fn().mockResolvedValue({ user: { username: 'mockedUsername', discriminator: 'mockedDiscriminator', id: 'mockedUserId' } }) } },
        reply: vi.fn(),
        commandName: 'ping',
      } as any as CommandInteraction;

      await client.emit('interactionCreate', interaction);

      expect(interaction.reply).toHaveBeenCalledWith('Pong!');
    });
  });
});
