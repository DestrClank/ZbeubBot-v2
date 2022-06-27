require("dotenv").config();

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const values = require('../values.json');

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!')
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

module.exports = () => {

rest.put(Routes.applicationGuildCommands(values.settings.clientId, values.settings.DevelopmentServer), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

}