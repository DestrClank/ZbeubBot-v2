const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs/promises');
const path = require('path');
const values = require('../../values.json');

async function buildAboutEmbed() {
  const changelogPath = path.join(__dirname, '..', '..', 'cmd', 'assets', 'about_changelog', 'current_patch.txt');
  let changelog = 'Patch note indisponible.';

  try {
    changelog = await fs.readFile(changelogPath, 'utf8');
  } catch (error) {
    changelog = 'Impossible de charger le patch note actuel.';
  }

  return new EmbedBuilder()
    .setColor(values.settings.embedColor)
    .setTitle(`Zbeub Bot version ${values.version.versionNumber}`)
    .setDescription('Zbeub Bot créé par DestrClank. Pour consulter le changelog complet, utilisez `z!changelog`.')
    .addFields({
      name: `Version ${values.version.versionNumber}`,
      value: changelog.trim() || 'Aucune note de version disponible.',
    })
    .setFooter({ text: `Zbeub Bot version ${values.version.versionNumber}` , iconURL: values.properties.botprofileurl });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Affiche des informations à propos de Zbeub Bot.'),
  async executeInteraction(interaction) {
    const embed = await buildAboutEmbed();
    await interaction.reply({ embeds: [embed] });
  },
  async executeMessage(message) {
    const embed = await buildAboutEmbed();
    await message.channel.send({ embeds: [embed] });
  },
};
