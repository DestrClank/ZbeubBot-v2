const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const values = require('../../values.json');

const HUG_GIF = 'https://cdn.discordapp.com/attachments/872866306473472040/886534494046261258/be-happy-love.gif';

function buildHugEmbed(target) {
  const embed = new EmbedBuilder()
    .setColor(values.settings.embedColor)
    .setImage(HUG_GIF);

  if (target) {
    embed.setDescription(`Pikachu fait un câlin à **${target}** !`);
  } else {
    embed.setDescription('Pikachu fait un câlin !');
  }

  return embed;
}

async function pickRandomUser(guild) {
  if (!guild) return null;
  await guild.members.fetch();
  return guild.members.cache.random()?.user ?? null;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Pikachu fait un câlin !')
    .addUserOption(option =>
      option
        .setName('cible')
        .setDescription('La personne à prendre dans ses bras')
        .setRequired(false),
    )
    .addBooleanOption(option =>
      option
        .setName('aleatoire')
        .setDescription('Choisir un membre du serveur au hasard')
        .setRequired(false),
    ),
  async executeInteraction(interaction) {
    const shouldPickRandom = interaction.options.getBoolean('aleatoire');
    const targetUser = shouldPickRandom
      ? await pickRandomUser(interaction.guild)
      : interaction.options.getUser('cible');

    const label = targetUser ? `${targetUser.username}#${targetUser.discriminator}` : null;
    const embed = buildHugEmbed(label);
    await interaction.reply({ embeds: [embed] });
  },
  async executeMessage(message, args) {
    let targetLabel = null;

    if (args[0]?.toLowerCase() === 'random' && message.guild) {
      const random = await pickRandomUser(message.guild);
      if (random) {
        targetLabel = `${random.username}#${random.discriminator}`;
      }
    } else if (message.mentions.users.size > 0) {
      const user = message.mentions.users.first();
      targetLabel = `${user.username}#${user.discriminator}`;
    }

    const embed = buildHugEmbed(targetLabel);
    await message.channel.send({ embeds: [embed] });
  },
};
