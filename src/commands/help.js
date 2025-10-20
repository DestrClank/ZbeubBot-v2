const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const values = require('../../values.json');

function buildHelpEmbed(client) {
  const prefix = values.settings.prefix;
  const commands = client?.commands ?? new Map();
  const commandList = Array.from(commands.values())
    .map(command => `• \`/${command.data.name}\` — ${command.data.description}`)
    .join('\n');

  const embed = new EmbedBuilder()
    .setColor(values.settings.embedColor)
    .setTitle('Aide de Zbeub Bot 😊')
    .setDescription('Liste des commandes disponibles.')
    .addFields(
      {
        name: 'Commandes slash',
        value: commandList || 'Aucune commande enregistrée.',
      },
      {
        name: 'Commandes préfixées',
        value: prefix
          ? `Utilisez le préfixe \`${prefix}\` suivi du nom de la commande. Exemple : \`${prefix}hello\``
          : "Aucun préfixe n'est configuré.",
      },
    )
    .setFooter({ text: `Zbeub Bot version ${values.version.versionNumber}`, iconURL: values.properties.botprofileurl });

  return embed;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Affiche la liste des commandes disponibles.'),
  async executeInteraction(interaction) {
    const embed = buildHelpEmbed(interaction.client);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
  async executeMessage(message) {
    const embed = buildHelpEmbed(message.client);
    await message.channel.send({ embeds: [embed] });
  },
};
