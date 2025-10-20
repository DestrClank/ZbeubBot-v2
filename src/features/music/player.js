const {
  joinVoiceChannel,
  createAudioPlayer,
  NoSubscriberBehavior,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
} = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const { EmbedBuilder } = require('discord.js');

const values = require('../../../values.json');

function formatDuration(totalSeconds) {
  if (!Number.isFinite(totalSeconds)) {
    return '??:??';
  }

  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

async function resolveQuery(query) {
  if (ytdl.validateURL(query)) {
    const info = await ytdl.getInfo(query);
    const details = info.videoDetails;
    return {
      title: details.title,
      url: details.video_url,
      author: details.author?.name ?? 'Inconnu',
      thumbnail: details.thumbnails?.[0]?.url ?? null,
      duration: Number.parseInt(details.lengthSeconds, 10),
      source: 'url',
    };
  }

  const searchResult = await yts(query);
  const video = searchResult?.videos?.[0];

  if (!video) {
    throw new Error('Aucun résultat pour cette recherche.');
  }

  return {
    title: video.title,
    url: video.url,
    author: video.author?.name ?? 'Inconnu',
    thumbnail: video.thumbnail,
    duration: video.seconds,
    source: 'search',
  };
}

class MusicQueue {
  constructor(manager, guild, voiceChannel, textChannel) {
    this.manager = manager;
    this.guild = guild;
    this.voiceChannel = voiceChannel;
    this.textChannel = textChannel;
    this.connection = null;
    this.player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Stop,
      },
    });
    this.songs = [];
    this.loop = false;
    this.current = null;
    this.destroyed = false;
    this.forceNext = false;

    this.player.on('error', error => {
      console.error('Erreur du lecteur audio :', error);
      if (this.textChannel) {
        this.textChannel
          .send('Une erreur est survenue lors de la lecture de la musique. La lecture est arrêtée.')
          .catch(() => {});
      }
      this.stop();
    });

    this.player.on(AudioPlayerStatus.Idle, () => {
      if (this.destroyed) {
        return;
      }

      if (this.forceNext) {
        this.forceNext = false;
      } else if (!this.loop) {
        this.songs.shift();
      } else if (this.songs.length > 1) {
        const [first, ...rest] = this.songs;
        this.songs = [...rest, first];
      }

      if (this.songs.length === 0) {
        this.destroy();
      } else {
        this.process().catch(error => {
          console.error('Erreur lors du passage à la piste suivante :', error);
          this.destroy();
        });
      }
    });
  }

  async ensureConnection() {
    if (this.connection && this.connection.state.status !== VoiceConnectionStatus.Destroyed) {
      return;
    }

    this.connection = joinVoiceChannel({
      channelId: this.voiceChannel.id,
      guildId: this.guild.id,
      adapterCreator: this.guild.voiceAdapterCreator,
      selfDeaf: true,
    });

    this.connection.on('stateChange', (oldState, newState) => {
      if (newState.status === VoiceConnectionStatus.Disconnected) {
        this.destroy();
      }
    });

    await entersState(this.connection, VoiceConnectionStatus.Ready, 30_000);
    this.connection.subscribe(this.player);
  }

  async addSong(song, requester) {
    this.songs.push({ ...song, requestedBy: requester });

    if (this.songs.length === 1) {
      await this.process();
    }
  }

  async process() {
    if (this.songs.length === 0) {
      return;
    }

    await this.ensureConnection();

    const song = this.songs[0];
    this.current = song;

    try {
      const stream = ytdl(song.url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
      });

      const resource = createAudioResource(stream);
      this.player.play(resource);
    } catch (error) {
      console.error('Erreur lors de la préparation du flux audio :', error);
      if (this.textChannel) {
        this.textChannel
          .send("Impossible de lire la musique sélectionnée. Elle a été retirée de la file d'attente.")
          .catch(() => {});
      }

      this.songs.shift();
      this.forceNext = false;
      if (this.songs.length === 0) {
        this.destroy();
        return;
      }

      await this.process();
      return;
    }

    if (this.textChannel) {
      const embed = new EmbedBuilder()
        .setColor(values.settings.embedColor ?? '#5865F2')
        .setTitle('Lecture en cours')
        .setDescription(`🎶 **${song.title}**`)
        .setFooter({ text: `Demandée par ${song.requestedBy.tag}` });

      if (song.thumbnail) {
        embed.setThumbnail(song.thumbnail);
      }

      embed.addFields(
        { name: 'Durée', value: formatDuration(song.duration ?? 0), inline: true },
        { name: 'Source', value: song.source === 'search' ? 'Recherche YouTube' : 'Lien direct', inline: true },
      );

      this.textChannel.send({ embeds: [embed] }).catch(() => {});
    }
  }

  toggleLoop() {
    this.loop = !this.loop;
    return this.loop;
  }

  skip() {
    if (this.songs.length === 0) {
      throw new Error('Aucune musique à passer.');
    }

    if (this.songs.length === 1) {
      this.stop();
      return null;
    }

    this.forceNext = true;
    this.songs.shift();

    const nextSong = this.songs[0];
    this.player.stop();
    return nextSong;
  }

  pause() {
    if (this.player.state.status !== AudioPlayerStatus.Playing) {
      throw new Error('Aucune musique en cours de lecture.');
    }

    const success = this.player.pause();
    if (!success) {
      throw new Error('Impossible de mettre la musique en pause.');
    }
  }

  resume() {
    if (this.player.state.status !== AudioPlayerStatus.Paused) {
      throw new Error("La musique n'est pas en pause.");
    }

    const success = this.player.unpause();
    if (!success) {
      throw new Error('Impossible de reprendre la lecture.');
    }
  }

  stop() {
    this.songs = [];
    this.player.stop();
    this.destroy();
  }

  destroy() {
    this.destroyed = true;
    try {
      this.player.stop();
    } catch (error) {
      console.error('Erreur lors de l\'arrêt du lecteur :', error);
    }

    if (this.connection && this.connection.state.status !== VoiceConnectionStatus.Destroyed) {
      try {
        this.connection.destroy();
      } catch (error) {
        console.error('Erreur lors de la destruction de la connexion vocale :', error);
      }
    }

    this.connection = null;
    this.current = null;
    this.songs = [];
    this.forceNext = false;
    if (this.manager) {
      this.manager.queues.delete(this.guild.id);
    }
  }
}

class MusicManager {
  constructor() {
    this.queues = new Map();
  }

  getQueue(guildId) {
    return this.queues.get(guildId);
  }

  ensureQueue(guild, voiceChannel, textChannel) {
    let queue = this.queues.get(guild.id);

    if (queue?.destroyed) {
      this.queues.delete(guild.id);
      queue = null;
    }

    if (!queue) {
      queue = new MusicQueue(this, guild, voiceChannel, textChannel);
      this.queues.set(guild.id, queue);
    } else {
      queue.voiceChannel = voiceChannel;
      queue.textChannel = textChannel ?? queue.textChannel;
    }

    return queue;
  }

  removeQueue(guildId) {
    const queue = this.queues.get(guildId);
    if (queue) {
      queue.destroy();
      this.queues.delete(guildId);
    }
  }

  async enqueue({ guild, voiceChannel, textChannel, requester, query }) {
    const song = await resolveQuery(query);
    const queue = this.ensureQueue(guild, voiceChannel, textChannel);
    await queue.addSong(song, requester);
    return {
      song: { ...song, requestedBy: requester },
      position: queue.songs.length,
      queue,
    };
  }

  skip(guildId) {
    const queue = this.queues.get(guildId);
    if (!queue) {
      throw new Error('Aucune musique en cours.');
    }

    const nextSong = queue.skip();

    if (!nextSong) {
      this.queues.delete(guildId);
    }

    return nextSong;
  }

  stop(guildId) {
    const queue = this.queues.get(guildId);
    if (!queue) {
      throw new Error('Aucune musique en cours.');
    }

    queue.stop();
    this.queues.delete(guildId);
  }

  toggleLoop(guildId) {
    const queue = this.queues.get(guildId);
    if (!queue) {
      throw new Error('Aucune musique en cours.');
    }

    return queue.toggleLoop();
  }

  pause(guildId) {
    const queue = this.queues.get(guildId);
    if (!queue) {
      throw new Error('Aucune musique en cours.');
    }

    queue.pause();
  }

  resume(guildId) {
    const queue = this.queues.get(guildId);
    if (!queue) {
      throw new Error('Aucune musique en cours.');
    }

    queue.resume();
  }

  getCurrent(guildId) {
    const queue = this.queues.get(guildId);
    if (!queue) {
      return null;
    }

    return queue.current;
  }

  getSongs(guildId) {
    const queue = this.queues.get(guildId);
    if (!queue) {
      return [];
    }

    return [...queue.songs];
  }
}

module.exports = {
  musicManager: new MusicManager(),
  formatDuration,
};
