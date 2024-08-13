import { describe, it, expect, beforeAll, vi } from 'vitest';
import createBot from '../createBot';
import { commands } from '../commands';


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

vi.mock('discord.js', () => {
  return {
    Client: vi.fn().mockImplementation((options) => {
      ClientConstructorSpy(options);

      return {
        on: vi.fn(),
        login: loginSpy,
        once: vi.fn((event, callback) => {
          if (event === 'ready') callback();
        }),
        user: {
          setStatus: setStatus,
          setActivity: setActivity,
        },
      };
    }),
    Intents: {
      FLAGS: {
        GUILDS: 1 << 0,
        GUILD_MESSAGES: 1 << 1,
      },
    },
  };
});

describe('Discord Bot Server', () => {
  let logSpy;

  beforeAll(async () => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    vi.stubEnv('CLIENT_ID', 'mockedClientId')
    vi.stubEnv('GUILD_ID', 'mockedGuildId')
    vi.stubEnv('BOT_TOKEN', 'mockedToken')

    await createBot();
  });

  it('should log "Starting Discord Bot..."', () => {
    expect(logSpy).toHaveBeenCalledWith('Starting Discord Bot...');
  });

  it('should log "Successfully registered Discord Bot application commands."', () => {
    expect(logSpy).toHaveBeenCalledWith('Successfully registered Discord Bot application commands.');
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

  it('should call the put method on the REST API with correct body to set commands up', () => {
    expect(putMock).toHaveBeenCalledWith('mockedRoute', { body: commands });
  });

  it('should call applicationGuildCommandsMock with the correct parameters', () => {
    expect(applicationGuildCommandsMock).toHaveBeenCalledWith('mockedClientId', 'mockedGuildId');
  });

  it('should create a new Discord Client with the correct intents', () => {
    expect(ClientConstructorSpy).toHaveBeenCalledWith({
      intents: [1, 2],
    });
  });
});
