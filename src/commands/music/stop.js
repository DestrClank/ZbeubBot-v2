const { SlashCommandBuilder } = require('discord.js');
const values = require('../../../values.json');
const { musicManager } = require('../../features/music/player');

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

function stopPlayback(member) {
  ensureMusicEnabled();
  const queue = musicManager.getQueue(member.guild.id);

  if (!queue) {
    throw new Error(values.generalText?.ErrorMsg?.userend?.music_nomusicplaying ?? 'Aucune musique n\'est en cours.');
  }

  ensureSameChannel(member, queue.voiceChannel.id);
  musicManager.stop(member.guild.id);
  return values.generalText?.GeneralUserMsg?.music_musicstopped ?? 'Lecture arrêtée !';
}

module.exports = {
  data: new SlashCommandBuilder().setName('stop').setDescription('Arrêter la musique et vider la file d\'attente.'),
  async executeInteraction(interaction) {
    try {
      const response = stopPlayback(interaction.member);
      await interaction.reply(response);
    } catch (error) {
      await interaction.reply({ content: error.message ?? 'Impossible d\'arrêter la musique.', ephemeral: true }).catch(() => {});
    }
  },
  async executeMessage(message) {
    try {
      const response = stopPlayback(message.member);
      await message.channel.send(response);
    } catch (error) {
      await message.reply(error.message ?? 'Impossible d\'arrêter la musique.').catch(() => {});
    }
  },
};
