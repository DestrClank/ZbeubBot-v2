const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const values = require('../../../values.json');
const { musicManager, formatDuration } = require('../../features/music/player');

function ensureMusicEnabled() {
  if (!values.settings.musicCmdEnable) {
    throw new Error(values.generalText?.ErrorMsg?.userend?.music_featuredisabledmsg ?? 'La fonctionnalité musicale est désactivée.');
  }
}

function buildQueueEmbed(guildId) {
  ensureMusicEnabled();
  const songs = musicManager.getSongs(guildId);

  if (!songs.length) {
    throw new Error(values.generalText?.ErrorMsg?.userend?.music_nomusicplaying ?? 'Aucune musique n\'est en cours.');
  }

  const current = songs[0];
  const upcoming = songs.slice(1).map((song, index) => `**${index + 1}.** ${song.title} (${formatDuration(song.duration ?? 0)})`).join('\n');

  const embed = new EmbedBuilder()
    .setColor(values.settings.embedColor ?? '#5865F2')
    .setTitle('File d\'attente de lecture')
    .setDescription(`En cours : **${current.title}** (${formatDuration(current.duration ?? 0)})`)
    .setFooter({ text: `Demandée par ${current.requestedBy?.tag ?? 'Inconnu'}` });

  if (current.thumbnail) {
    embed.setThumbnail(current.thumbnail);
  }

  embed.addFields({ name: 'À suivre', value: upcoming || 'Aucune autre musique.' });

  return embed;
}

module.exports = {
  data: new SlashCommandBuilder().setName('queue').setDescription('Afficher la file d\'attente musicale.'),
  async executeInteraction(interaction) {
    try {
      const embed = buildQueueEmbed(interaction.guildId);
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: error.message ?? 'Impossible d\'afficher la file.', ephemeral: true }).catch(() => {});
    }
  },
  async executeMessage(message) {
    try {
      const embed = buildQueueEmbed(message.guild.id);
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      await message.reply(error.message ?? 'Impossible d\'afficher la file.').catch(() => {});
    }
  },
};
