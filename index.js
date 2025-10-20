require('dotenv').config();
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  Events,
} = require('discord.js');
const values = require('./values.json');
const { loadCommands } = require('./src/handlers/commandLoader');
const { registerSlashCommands } = require('./src/handlers/slashRegistrar');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID || values.settings.ClientId;
const guildId = process.env.GUILD_ID || process.env.DEV_GUILD_ID || values.settings.DevelopmentServer;
const prefix = values.settings.prefix || 'z!';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

client.commands = new Collection();
client.messageAliases = new Collection();

const commands = loadCommands(client);

const registeringGlobally = Boolean(process.env.GLOBAL_COMMANDS) || !guildId;

if (!token) {
  console.error('❌ Variable d\'environnement DISCORD_TOKEN manquante.');
  process.exit(1);
}

client.once(Events.ClientReady, async readyClient => {
  console.log(`✅ Connecté en tant que ${readyClient.user.tag}`);

  try {
    const targetDescription = registeringGlobally
      ? 'globalement'
      : guildId
        ? `sur le serveur ${guildId}`
        : 'globalement';
    console.log(`⏳ Synchronisation des commandes slash ${targetDescription}...`);
    await registerSlashCommands(commands, token, clientId ?? readyClient.user.id, registeringGlobally ? undefined : guildId);
    console.log('✅ Commandes slash synchronisées.');
  } catch (error) {
    console.error('❌ Impossible de synchroniser les commandes slash :', error);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = client.commands.get(interaction.commandName);

  if (!command || typeof command.executeInteraction !== 'function') {
    await interaction.reply({ content: 'Commande indisponible pour le moment.', ephemeral: true }).catch(() => {});
    return;
  }

  try {
    await command.executeInteraction(interaction);
  } catch (error) {
    console.error(`❌ Erreur pendant l\'exécution de /${interaction.commandName} :`, error);
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: 'Une erreur est survenue lors de l\'exécution de la commande.', ephemeral: true }).catch(() => {});
    } else {
      await interaction.reply({ content: 'Une erreur est survenue lors de l\'exécution de la commande.', ephemeral: true }).catch(() => {});
    }
  }
});

client.on(Events.MessageCreate, async message => {
  if (message.author.bot || message.system) {
    return;
  }

  if (!prefix || !message.content.startsWith(prefix)) {
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const commandName = args.shift()?.toLowerCase();

  if (!commandName) {
    return;
  }

  const resolvedName = client.commands.has(commandName)
    ? commandName
    : client.messageAliases.get(commandName);

  if (!resolvedName) {
    return;
  }

  const command = client.commands.get(resolvedName);

  if (!command || typeof command.executeMessage !== 'function') {
    return;
  }

  try {
    await command.executeMessage(message, args);
  } catch (error) {
    console.error(`❌ Erreur pendant l\'exécution de ${prefix}${resolvedName} :`, error);
    await message.reply('Une erreur est survenue lors de l\'exécution de la commande.').catch(() => {});
  }
});

client.login(token).catch(error => {
  console.error('Impossible de se connecter à Discord :', error);
});
