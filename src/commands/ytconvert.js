const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const values = require('../../values.json');
const {
  convertYoutubeToMp3,
  getConversionState,
  formatDuration,
  formatFileSize,
} = require('../features/conversion/converter');

const FILE_SIZE_LIMIT = 8 * 1024 * 1024; // 8 Mo, limite habituelle pour les bots Discord.
const DOWNLOAD_BASE_URL = process.env.DOWNLOAD_BASE_URL;

function buildProgressMessage(state) {
  const title = state.title ?? 'Conversion en cours';
  const total = state.duration ? formatDuration(state.duration) : '??:??:??';
  const elapsed = state.elapsedFormatted ?? '00:00:00';
  const runtime = state.runtime ?? '00:00:00';
  const progress = Number.isFinite(state.progress) ? state.progress : 0;

  return [
    `Conversion de **${title}** en cours...`,
    `Progression : \`${progress}% effectuées\``,
    `Temps converti/Temps total : \`${elapsed}/${total}\``,
    `Temps écoulé : \`${runtime}\``,
  ].join('\n');
}

function buildStatusEmbed(state) {
  const embed = new EmbedBuilder()
    .setColor(values.settings.embedColor ?? '#5865F2')
    .setTitle('Conversion en cours')
    .setDescription(`La conversion de **${state.title}** est toujours en cours.`)
    .addFields(
      { name: 'Progression', value: `${state.progress ?? 0}%`, inline: true },
      { name: 'Temps converti', value: formatDuration(state.elapsedSeconds ?? 0), inline: true },
      { name: 'Durée totale', value: formatDuration(state.duration ?? 0), inline: true },
    );

  const runtimeSeconds = Math.floor(((Date.now()) - (state.startedAt ?? Date.now())) / 1000);
  embed.setFooter({ text: `Temps écoulé : ${formatDuration(runtimeSeconds)}` });
  return embed;
}

async function handleStatusRequest(target, userId) {
  const state = getConversionState(userId);

  if (!state) {
    const content = [
      "Pour convertir une vidéo YouTube en fichier musique, copiez-collez un lien YouTube après la commande.",
      'Attention : la vidéo doit durer moins de 2 heures.',
      '',
      'Exemple :',
      '`z!ytconvert https://www.youtube.com/watch?v=dQw4w9WgXcQ`',
    ].join('\n');

    if (target.isInteraction) {
      if (target.interaction.deferred || target.interaction.replied) {
        await target.interaction.editReply({ content });
      } else {
        await target.interaction.reply({ content, ephemeral: true });
      }
    } else {
      await target.message.reply({ content });
    }
    return;
  }

  const embed = buildStatusEmbed(state);
  if (target.isInteraction) {
    if (target.interaction.deferred || target.interaction.replied) {
      await target.interaction.editReply({ embeds: [embed] });
    } else {
      await target.interaction.reply({ embeds: [embed], ephemeral: true });
    }
  } else {
    await target.message.reply({ embeds: [embed] });
  }
}

async function performConversion({
  userId,
  url,
  sendInitial,
  updateProgress,
  sendResult,
  sendError,
}) {
  let lastFilePath;
  let preserveFile = false;

  if (!ytdlValidate(url)) {
    await sendError("Ce lien n'est pas valide.");
    return;
  }

  if (getConversionState(userId)) {
    await sendError('Une conversion est déjà en cours. Patientez avant de relancer une autre.');
    return;
  }

  await sendInitial('Conversion de la vidéo en cours...');

  try {
    const result = await convertYoutubeToMp3({
      userId,
      url,
      onProgress: state => updateProgress(buildProgressMessage(state)),
    });

    lastFilePath = result.filePath;

    const embed = new EmbedBuilder()
      .setColor(values.settings.embedColor ?? '#5865F2')
      .setDescription('Votre vidéo a été convertie avec succès.')
      .addFields(
        { name: 'Titre de la vidéo', value: result.title, inline: false },
        { name: 'Auteur de la vidéo', value: result.artist, inline: false },
        { name: 'Durée de la vidéo', value: formatDuration(result.duration), inline: true },
        { name: 'Taille du fichier', value: formatFileSize(result.fileSize), inline: true },
      );

    if (result.thumbnailUrl) {
      embed.setThumbnail(result.thumbnailUrl);
    }

    if (result.fileSize > FILE_SIZE_LIMIT && DOWNLOAD_BASE_URL) {
      const downloadUrl = `${DOWNLOAD_BASE_URL.replace(/\/$/, '')}/${userId}`;
      embed.addFields({ name: 'Information', value: 'Votre fichier est disponible via le lien de téléchargement ci-dessous pendant une durée limitée.' });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel('Télécharger le fichier')
          .setURL(downloadUrl),
      );

      await sendResult({
        content: 'Votre vidéo a été convertie avec succès.',
        embeds: [embed],
        components: [row],
      });
      preserveFile = true;
      return;
    }

    if (result.fileSize > FILE_SIZE_LIMIT) {
      embed.addFields({ name: 'Information', value: 'Le fichier est trop volumineux pour être envoyé via Discord. Contactez un administrateur pour le récupérer.' });
      await sendResult({ embeds: [embed] });
      await fs.promises.unlink(result.filePath).catch(() => {});
      return;
    }

    const attachment = new AttachmentBuilder(result.filePath, { name: result.filename });
    await sendResult({
      content: 'Votre fichier a été envoyé avec succès.',
      embeds: [embed],
      files: [attachment],
    });
    await fs.promises.unlink(result.filePath).catch(() => {});
  } catch (error) {
    await sendError(error.message ?? "Une erreur s'est produite pendant la conversion.");
  } finally {
    // Nettoyage éventuel du fichier temporaire s'il existe encore.
    if (!preserveFile) {
      try {
        const fallbackPath = lastFilePath ?? path.join(process.cwd(), 'output', `output_${userId}.mp3`);
        await fs.promises.unlink(fallbackPath);
      } catch (err) {
        // Ignorer si le fichier n'existe plus.
      }
    }
  }
}

function ytdlValidate(url) {
  try {
    return Boolean(url) && ytdl.validateURL(url);
  } catch (error) {
    return false;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ytconvert')
    .setDescription('Convertir une vidéo YouTube en fichier musique (.mp3).')
    .addStringOption(option =>
      option
        .setName('lien')
        .setDescription('Lien YouTube à convertir')
        .setRequired(false),
    ),
  aliases: ['ytconvert'],
  async executeInteraction(interaction) {
    const url = interaction.options.getString('lien');

    if (!url) {
      await interaction.deferReply({ ephemeral: true });
      await handleStatusRequest({ isInteraction: true, interaction }, interaction.user.id);
      return;
    }

    await interaction.deferReply();

    await performConversion({
      userId: interaction.user.id,
      url,
      sendInitial: content => interaction.editReply({ content }),
      updateProgress: content => interaction.editReply({ content }),
      sendResult: payload => interaction.editReply(payload),
      sendError: async message => {
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply({ content: message, embeds: [] });
        } else {
          await interaction.reply({ content: message, ephemeral: true });
        }
      },
    });
  },
  async executeMessage(message, args) {
    const url = args[0];

    if (!url) {
      await handleStatusRequest({ isInteraction: false, message }, message.author.id);
      return;
    }

    const statusMessage = await message.channel.send('Conversion de la vidéo en cours...');

    await performConversion({
      userId: message.author.id,
      url,
      sendInitial: content => statusMessage.edit(content).catch(() => {}),
      updateProgress: content => statusMessage.edit(content).catch(() => {}),
      sendResult: async payload => {
        await statusMessage.edit('Conversion terminée.');
        await message.channel.send(payload).catch(() => {});
      },
      sendError: async errorMessage => {
        await statusMessage.edit(errorMessage).catch(() => {});
      },
    });
  },
};
