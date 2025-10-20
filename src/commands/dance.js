const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const values = require('../../values.json');

const DANCE_GIF = 'https://cdn.discordapp.com/attachments/872866306473472040/872867386638282762/pika_dance.gif';

function buildDanceEmbed(target) {
  const embed = new EmbedBuilder()
    .setColor(values.settings.embedColor)
    .setImage(DANCE_GIF);

  if (target) {
    embed.setDescription(`Pikachu danse avec **${target}** !`);
  } else {
    embed.setDescription('Pikachu danse !');
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
    .setName('dance')
    .setDescription('Pikachu se met à danser !')
    .addUserOption(option =>
      option
        .setName('partenaire')
        .setDescription('La personne avec qui danser')
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
      : interaction.options.getUser('partenaire');

    const label = targetUser ? `${targetUser.username}#${targetUser.discriminator}` : null;
    const embed = buildDanceEmbed(label);
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

    const embed = buildDanceEmbed(targetLabel);
    await message.channel.send({ embeds: [embed] });
  },
};
