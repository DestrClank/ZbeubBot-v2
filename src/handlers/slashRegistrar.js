const { REST, Routes } = require('discord.js');

async function registerSlashCommands(commands, token, clientId, guildId) {
  if (!token) {
    throw new Error('DISCORD_TOKEN est manquant.');
  }

  const rest = new REST({ version: '10' }).setToken(token);
  const payload = commands.map(command => command.data.toJSON());

  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: payload });
    return;
  }

  await rest.put(Routes.applicationCommands(clientId), { body: payload });
}

module.exports = {
  registerSlashCommands,
};
