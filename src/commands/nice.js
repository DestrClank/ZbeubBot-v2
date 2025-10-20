const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const values = require('../../values.json');

const NICE_GIF = 'https://cdn.discordapp.com/attachments/830828771173990420/922831516772478976/yes-nice.gif';

function buildNiceEmbed(target) {
  const embed = new EmbedBuilder()
    .setColor(values.settings.embedColor)
    .setImage(NICE_GIF);

  if (target) {
    embed.setDescription(`**${target}** te dit **nice** OnO !`);
  } else {
    embed.setDescription('Pikachu te dit **nice** OnO !');
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
    .setName('nice')
    .setDescription('Pikachu te dit nice !')
    .addUserOption(option =>
      option
        .setName('personne')
        .setDescription('La personne qui dit nice')
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
      : interaction.options.getUser('personne');

    const label = targetUser ? `${targetUser.username}#${targetUser.discriminator}` : null;
    const embed = buildNiceEmbed(label);
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

    const embed = buildNiceEmbed(targetLabel);
    await message.channel.send({ embeds: [embed] });
  },
};
