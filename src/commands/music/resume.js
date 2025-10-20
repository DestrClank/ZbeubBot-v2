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

function resume(member) {
  ensureMusicEnabled();
  const queue = musicManager.getQueue(member.guild.id);

  if (!queue) {
    throw new Error(values.generalText?.ErrorMsg?.userend?.music_nomusicplaying ?? 'Aucune musique en cours.');
  }

  ensureSameChannel(member, queue.voiceChannel.id);
  musicManager.resume(member.guild.id);
  return values.generalText?.GeneralLogsMsg?.musicLogs?.music_resuming ?? 'Reprise de la musique.';
}

module.exports = {
  data: new SlashCommandBuilder().setName('resume').setDescription('Reprendre la musique mise en pause.'),
  async executeInteraction(interaction) {
    try {
      const response = resume(interaction.member);
      await interaction.reply(response);
    } catch (error) {
      await interaction.reply({ content: error.message ?? 'Impossible de reprendre la musique.', ephemeral: true }).catch(() => {});
    }
  },
  async executeMessage(message) {
    try {
      const response = resume(message.member);
      await message.channel.send(response);
    } catch (error) {
      await message.reply(error.message ?? 'Impossible de reprendre la musique.').catch(() => {});
    }
  },
};
