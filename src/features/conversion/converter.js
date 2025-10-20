const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const NodeID3 = require('node-id3');

if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

const conversions = new Map();
const outputDirectory = path.join(process.cwd(), 'output');

const RESERVED_WINDOWS_NAMES = new Set([
  'con',
  'prn',
  'aux',
  'nul',
  'com1',
  'com2',
  'com3',
  'com4',
  'com5',
  'com6',
  'com7',
  'com8',
  'com9',
  'lpt1',
  'lpt2',
  'lpt3',
  'lpt4',
  'lpt5',
  'lpt6',
  'lpt7',
  'lpt8',
  'lpt9',
  'deltarune chapter 2 - spamton theme (remix and extended)',
]);

function sanitizeFilename(value) {
  if (!value) {
    return 'audio';
  }

  const trimmed = value.trim();
  const base = RESERVED_WINDOWS_NAMES.has(trimmed.toLowerCase()) ? `filename_${trimmed}_` : trimmed;
  return base.replace(/[\/\\?%*:|"<>]/g, '_');
}

function formatDuration(totalSeconds) {
  const total = Number.isFinite(totalSeconds) ? Number(totalSeconds) : 0;
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = Math.floor(total % 60);

  const padded = [hours, minutes, seconds]
    .map(unit => unit.toString().padStart(2, '0'))
    .join(':');

  return padded;
}

function formatFileSize(size) {
  if (size < 1024) {
    return `${size} octets`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} Ko`;
  }

  return `${(size / (1024 * 1024)).toFixed(2)} Mo`;
}

async function ensureOutputDirectory() {
  await fs.promises.mkdir(outputDirectory, { recursive: true });
}

function toSeconds(timemark) {
  if (!timemark) {
    return 0;
  }

  const [time] = timemark.split('.');
  const parts = time.split(':').map(Number);
  while (parts.length < 3) {
    parts.unshift(0);
  }

  const [hours, minutes, seconds] = parts;
  return hours * 3600 + minutes * 60 + seconds;
}

function getBestThumbnail(thumbnails) {
  if (!Array.isArray(thumbnails) || thumbnails.length === 0) {
    return undefined;
  }

  return thumbnails.reduce((best, current) => (current.width > (best?.width ?? 0) ? current : best));
}

async function fetchThumbnailBuffer(url) {
  if (!url) {
    return undefined;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return undefined;
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.warn('Impossible de récupérer la miniature de la vidéo :', error);
    return undefined;
  }
}

function buildConversionState({ userId, title, duration }) {
  const now = Date.now();
  const state = {
    userId,
    title,
    duration,
    startedAt: now,
    updatedAt: now,
    progress: 0,
    elapsedSeconds: 0,
  };

  conversions.set(userId, state);
  return state;
}

function updateConversionState(userId, { timemark, progress }) {
  const state = conversions.get(userId);

  if (!state) {
    return undefined;
  }

  state.updatedAt = Date.now();
  state.elapsedSeconds = toSeconds(timemark);
  state.progress = Math.min(100, Math.max(0, Math.round(progress ?? 0)));
  return state;
}

function clearConversionState(userId) {
  conversions.delete(userId);
}

function getConversionState(userId) {
  return conversions.get(userId);
}

async function convertYoutubeToMp3({
  userId,
  url,
  onProgress,
}) {
  if (conversions.has(userId)) {
    throw new Error('Une conversion est déjà en cours pour cet utilisateur.');
  }

  await ensureOutputDirectory();

  let info;
  try {
    info = await ytdl.getInfo(url);
  } catch (error) {
    throw new Error("Une erreur s'est produite pendant la récupération des informations de la vidéo.");
  }

  const durationSeconds = Number(info.videoDetails.lengthSeconds ?? 0);
  if (Number.isFinite(durationSeconds) && durationSeconds > 7200) {
    throw new Error('Cette vidéo dépasse 2 heures de longueur. Impossible de la traiter.');
  }

  const title = info.videoDetails.title ?? 'Audio YouTube';
  const artist = info.videoDetails.author?.name ?? 'YouTube';
  const thumbnailUrl = getBestThumbnail(info.videoDetails.thumbnails)?.url;
  const thumbnailBuffer = await fetchThumbnailBuffer(thumbnailUrl);

  const state = buildConversionState({ userId, title, duration: durationSeconds });
  onProgress?.({
    ...state,
    progress: 0,
    elapsedFormatted: formatDuration(0),
    runtime: formatDuration(0),
  });

  let stream;
  try {
    stream = ytdl(url, { filter: 'audioonly', highWaterMark: 1 << 25 });
  } catch (error) {
    clearConversionState(userId);
    throw new Error("Une erreur s'est produite pendant la récupération de la vidéo.");
  }

  const sanitizedTitle = sanitizeFilename(title);
  const finalFilename = `${sanitizedTitle}.mp3`;
  const tempFilePath = path.join(outputDirectory, `output_${userId}.mp3`);

  await new Promise((resolve, reject) => {
    ffmpeg(stream)
      .audioCodec('libmp3lame')
      .format('mp3')
      .on('progress', progress => {
        const elapsedSeconds = toSeconds(progress.timemark);
        const percentage = state.duration > 0 ? Math.min(100, Math.floor((elapsedSeconds / state.duration) * 100)) : 0;
        const updatedState = updateConversionState(userId, {
          timemark: progress.timemark,
          progress: Number.isFinite(percentage) ? percentage : 0,
        });

        if (updatedState && onProgress) {
          const runtimeSeconds = Math.floor((Date.now() - updatedState.startedAt) / 1000);
          onProgress({
            ...updatedState,
            elapsedFormatted: formatDuration(updatedState.elapsedSeconds),
            runtime: formatDuration(runtimeSeconds),
          });
        }
      })
      .on('end', resolve)
      .on('error', reject)
      .save(tempFilePath);
  }).catch(error => {
    clearConversionState(userId);
    throw new Error("Une erreur s'est produite pendant la conversion.");
  });

  const tags = {
    title,
    artist,
  };

  if (thumbnailBuffer) {
    tags.image = {
      mime: 'image/jpeg',
      type: { id: 3, name: 'front cover' },
      description: 'Cover',
      imageBuffer: thumbnailBuffer,
    };
  }

  try {
    await NodeID3.write(tags, tempFilePath);
  } catch (error) {
    // Continue even if ID3 tags fail to write.
    console.warn("Impossible d'écrire les métadonnées ID3 :", error);
  }

  const stats = await fs.promises.stat(tempFilePath);
  clearConversionState(userId);

  return {
    filePath: tempFilePath,
    filename: finalFilename,
    title,
    artist,
    duration: durationSeconds,
    fileSize: stats.size,
    thumbnailUrl,
  };
}

module.exports = {
  convertYoutubeToMp3,
  getConversionState,
  formatDuration,
  formatFileSize,
};
