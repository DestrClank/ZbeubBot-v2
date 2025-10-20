const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const values = require('../../../values.json');
const { musicManager, formatDuration } = require('../../features/music/player');

function ensureMusicEnabled() {
  if (!values.settings.musicCmdEnable) {
    throw new Error(values.generalText?.ErrorMsg?.userend?.music_featuredisabledmsg ?? 'La fonctionnalité musicale est désactivée.');
  }
}

function nowPlaying(guildId) {
  ensureMusicEnabled();
  const song = musicManager.getCurrent(guildId);

  if (!song) {
    throw new Error(values.generalText?.ErrorMsg?.userend?.music_nomusicplaying ?? 'Aucune musique n\'est en cours.');
  }

  const embed = new EmbedBuilder()
    .setColor(values.settings.embedColor ?? '#5865F2')
    .setTitle('En lecture actuellement')
    .setDescription(`🎶 **${song.title}**`)
    .addFields(
      { name: 'Durée', value: formatDuration(song.duration ?? 0), inline: true },
      { name: 'Demandée par', value: song.requestedBy?.tag ?? 'Inconnu', inline: true },
    );

  if (song.thumbnail) {
    embed.setThumbnail(song.thumbnail);
  }

  return embed;
}

module.exports = {
  data: new SlashCommandBuilder().setName('np').setDescription('Afficher la musique en cours de lecture.'),
  async executeInteraction(interaction) {
    try {
      const embed = nowPlaying(interaction.guildId);
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: error.message ?? 'Aucune musique en cours.', ephemeral: true }).catch(() => {});
    }
  },
  async executeMessage(message) {
    try {
      const embed = nowPlaying(message.guild.id);
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      await message.reply(error.message ?? 'Aucune musique en cours.').catch(() => {});
    }
  },
};
