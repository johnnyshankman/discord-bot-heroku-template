#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DiscordBotStack } from './discord-bot-stack';

const app = new cdk.App();
new DiscordBotStack(app, 'DiscordBotStack');
