const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const values = require('../../../values.json');
const { musicManager, formatDuration } = require('../../features/music/player');

function ensureMusicEnabled() {
  if (!values.settings.musicCmdEnable) {
    throw new Error(values.generalText?.ErrorMsg?.userend?.music_featuredisabledmsg ?? 'La fonctionnalité musicale est désactivée.');
  }
}

function ensureVoiceChannel(member) {
  const channel = member?.voice?.channel;

  if (!channel) {
    throw new Error(values.generalText?.ErrorMsg?.userend?.music_notinvocal ?? 'Rejoignez un salon vocal avant de lancer de la musique.');
  }

  return channel;
}

function buildResponseEmbed(song, requester, description) {
  const embed = new EmbedBuilder()
    .setColor(values.settings.embedColor ?? '#5865F2')
    .setTitle(description)
    .setDescription(`🎶 **${song.title}**`)
    .addFields(
      { name: 'Durée', value: formatDuration(song.duration ?? 0), inline: true },
      { name: 'Demandée par', value: requester, inline: true },
    );

  if (song.thumbnail) {
    embed.setThumbnail(song.thumbnail);
  }

  return embed;
}

async function handlePlay({ guild, member, channel, requesterTag }, query) {
  ensureMusicEnabled();
  const voiceChannel = ensureVoiceChannel(member);

  const { song, position } = await musicManager.enqueue({
    guild,
    voiceChannel,
    textChannel: channel,
    requester: member.user,
    query,
  });

  const description = position === 1 ? 'Lecture de la musique' : 'Ajoutée à la file d\'attente';
  const embed = buildResponseEmbed(song, requesterTag, description);

  if (position > 1) {
    embed.setFooter({ text: `Position dans la file : ${position}` });
  }

  return embed;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Lire une musique depuis un lien ou une recherche YouTube.')
    .addStringOption(option =>
      option
        .setName('recherche')
        .setDescription('Lien ou mots-clés YouTube')
        .setRequired(true),
    ),
  async executeInteraction(interaction) {
    try {
      await interaction.deferReply();
      const query = interaction.options.getString('recherche', true);
      const embed = await handlePlay(
        {
          guild: interaction.guild,
          member: interaction.member,
          channel: interaction.channel,
          requesterTag: interaction.user.tag,
        },
        query,
      );

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      const message = error.message ?? 'Une erreur est survenue lors de la lecture de la musique.';
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: message, embeds: [] }).catch(() => {});
      } else {
        await interaction.reply({ content: message, ephemeral: true }).catch(() => {});
      }
    }
  },
  async executeMessage(message, args) {
    const query = args.join(' ');

    if (!query) {
      await message.reply(values.generalText?.ErrorMsg?.userend?.music_noargumentprovided ?? 'Merci de préciser le titre ou le lien de la musique à jouer.');
      return;
    }

    try {
      const embed = await handlePlay(
        {
          guild: message.guild,
          member: message.member,
          channel: message.channel,
          requesterTag: message.author.tag,
        },
        query,
      );

      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      await message.reply(error.message ?? 'Une erreur est survenue lors de la lecture de la musique.').catch(() => {});
    }
  },
};
