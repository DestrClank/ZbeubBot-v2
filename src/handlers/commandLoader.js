const fs = require('fs');
const path = require('path');

function isCommandModule(module) {
  return module && module.data && typeof module.data.name === 'string';
}

function registerCommand(client, command) {
  client.commands.set(command.data.name, command);

  if (Array.isArray(command.aliases)) {
    for (const alias of command.aliases) {
      client.messageAliases.set(alias, command.data.name);
    }
  }
}

function loadFromDirectory(client, directory) {
  const commands = [];
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      commands.push(...loadFromDirectory(client, fullPath));
      continue;
    }

    if (!entry.name.endsWith('.js')) {
      continue;
    }

    // eslint-disable-next-line global-require, import/no-dynamic-require
    const commandModule = require(fullPath);

    if (!isCommandModule(commandModule)) {
      continue;
    }

    registerCommand(client, commandModule);
    commands.push(commandModule);
  }

  return commands;
}

module.exports = {
  loadCommands(client) {
    client.commands = client.commands ?? new Map();
    client.messageAliases = client.messageAliases ?? new Map();

    client.commands.clear();
    client.messageAliases.clear();

    const commandsPath = path.join(__dirname, '..', 'commands');
    return loadFromDirectory(client, commandsPath);
  },
};
