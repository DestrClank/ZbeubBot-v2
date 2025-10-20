const { SlashCommandBuilder } = require('discord.js');
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
    throw new Error(values.generalText?.ErrorMsg?.userend?.music_notinvocal ?? 'Rejoignez un salon vocal pour contrôler la musique.');
  }

  return channel;
}

function ensureSameChannel(member, voiceChannelId) {
  const channel = ensureVoiceChannel(member);

  if (channel.id !== voiceChannelId) {
    throw new Error('Vous devez être dans le même salon vocal que le bot pour utiliser cette commande.');
  }
}

async function skipSong(member) {
  ensureMusicEnabled();
  const queue = musicManager.getQueue(member.guild.id);

  if (!queue) {
    throw new Error(values.generalText?.ErrorMsg?.userend?.music_nomusicplaying ?? 'Aucune musique n\'est en cours.');
  }

  ensureSameChannel(member, queue.voiceChannel.id);

  const nextSong = musicManager.skip(member.guild.id);

  if (!nextSong) {
    return 'Lecture arrêtée, il n\'y avait plus de musique dans la liste.';
  }

  return `Lecture de **${nextSong.title}** (${formatDuration(nextSong.duration ?? 0)})`;
}

module.exports = {
  data: new SlashCommandBuilder().setName('skip').setDescription('Passer à la musique suivante.'),
  async executeInteraction(interaction) {
    try {
      const message = await skipSong(interaction.member);
      await interaction.reply(message);
    } catch (error) {
      await interaction.reply({ content: error.message ?? 'Impossible de passer la musique.', ephemeral: true }).catch(() => {});
    }
  },
  async executeMessage(message) {
    try {
      const result = await skipSong(message.member);
      await message.channel.send(result);
    } catch (error) {
      await message.reply(error.message ?? 'Impossible de passer la musique.').catch(() => {});
    }
  },
};
