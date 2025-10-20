const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const values = require('../../values.json');

const HELLO_GIF = 'https://cdn.discordapp.com/attachments/872866306473472040/872867186081931364/pika_hello.gif';

function createHelloEmbed(target) {
  const embed = new EmbedBuilder()
    .setColor(values.settings.embedColor)
    .setImage(HELLO_GIF);

  if (target) {
    embed.setDescription(`Pikachu te dit bonjour **${target}** !`);
  } else {
    embed.setDescription('Pikachu te dit bonjour !');
  }

  return embed;
}

async function pickRandomMember(guild) {
  await guild.members.fetch();
  const member = guild.members.cache.random();
  return member?.user;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Pikachu dit bonjour à quelqu\'un.')
    .addUserOption(option =>
      option
        .setName('utilisateur')
        .setDescription('La personne à saluer')
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
      ? await pickRandomMember(interaction.guild)
      : interaction.options.getUser('utilisateur');

    const label = targetUser ? `${targetUser.username}#${targetUser.discriminator}` : null;
    const embed = createHelloEmbed(label);
    await interaction.reply({ embeds: [embed] });
  },
  async executeMessage(message, args) {
    let targetLabel = null;

    if (args[0]?.toLowerCase() === 'random' && message.guild) {
      const randomUser = await pickRandomMember(message.guild);
      if (randomUser) {
        targetLabel = `${randomUser.username}#${randomUser.discriminator}`;
      }
    } else if (message.mentions.users.size > 0) {
      const user = message.mentions.users.first();
      targetLabel = `${user.username}#${user.discriminator}`;
    }

    const embed = createHelloEmbed(targetLabel);
    await message.channel.send({ embeds: [embed] });
  },
};
