const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const values = require('../../values.json');

const ATTACK_GIF = 'https://cdn.discordapp.com/attachments/872866306473472040/872866875791523930/pika_attack.gif';

function buildAttackEmbed(target) {
  const embed = new EmbedBuilder()
    .setColor(values.settings.embedColor)
    .setImage(ATTACK_GIF);

  if (target) {
    embed.setDescription(`Pikachu fait Boule Élek à **${target}** ! C'est très efficace !`);
  } else {
    embed.setDescription("Pikachu fait Boule Élek ! C'est très efficace !");
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
    .setName('attack')
    .setDescription('Pikachu lance une attaque Boule Élek !')
    .addUserOption(option =>
      option
        .setName('cible')
        .setDescription('La personne à attaquer')
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
    const embed = buildAttackEmbed(label);
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

    const embed = buildAttackEmbed(targetLabel);
    await message.channel.send({ embeds: [embed] });
  },
};
