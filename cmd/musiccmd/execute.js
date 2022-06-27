const Discord = require('discord.js'); //Chargement module Discord
const ytdl = require('ytdl-core'); //Chargement module lecture vidéo Youtube
const yts = require('yt-search'); //Chargement module Youtube Data API v3 (eh ouais)

const embedExecute = new Discord.MessageEmbed()

module.exports = () => {
    let arg = argument

    if (!voiceChannel) // Si l'utilisateur n'est pas dans un salon vocal
    {
        embedExecute.setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
        embedExecute.setTitle(values.generalText.ErrorMsg.userend.music_oups)
        embedExecute.setDescription(values.generalText.ErrorMsg.userend.music_notinvocal)
        embedExecute.setAuthor(author.username + "#" + author.discriminator, author.displayAvatarURL())
        embedExecute.setColor(values.settings.embedColor)
        sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.ErrorMsg.logs.music_notinvocal);
        if (ifSlash === true) {
            return await message.editReply({ embeds: [embedExecute] });
        } else {
            return await message.channel.send({ embeds: [embedExecute] });
        }
    }

    const permissions = voiceChannel.permissionsFor(member.client.user); // On récupère les permissions du bot pour le salon vocal
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) { // Si le bot n'a pas les permissions
        embedExecute.setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
        embedExecute.setTitle(values.generalText.ErrorMsg.userend.music_oups)
        embedExecute.setDescription(values.generalText.ErrorMsg.userend.music_missingauthorisation)
        embedExecute.setAuthor(author.username + "#" + author.discriminator, author.displayAvatarURL())
        embedExecute.setColor(values.settings.embedColor)
        sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.ErrorMsg.logs.music_missingauthorisation);
        if (ifSlash === true) {
            return await message.editReply({ embeds: [embedExecute] });
        } else {
            return await message.channel.send({ embeds: [embedExecute] });
        }
    }

    let validate = await ytdl.validateURL(arg);


    if (!validate) {
        sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.GeneralLogsMsg.musicLogs.music_usesearchinstead);
        if (ifSlash === true) {
            return ytsearch(message, serverQueue, voiceChannel, true, member, arg, author, false);
        } else {
            return ytsearch(message, serverQueue, voiceChannel, false, member, arg, author, false);
        }

    }



    sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.GeneralLogsMsg.musicLogs.music_youtubemetadataget);
    const songInfo = await ytdl.getInfo(arg);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        author: songInfo.videoDetails.author.name,
        thumbnail: songInfo.videoDetails.thumbnails[0].url,
        time: songInfo.videoDetails.lengthSeconds,
        likes: songInfo.videoDetails.likes,
        views: songInfo.videoDetails.viewCount,
        addedby: author.username + "#" + author.discriminator,
        pdp: author.displayAvatarURL()
    };

    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 1,
            playing: true,
            loop: false,
        };

        sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.GeneralLogsMsg.musicLogs.music_addtoplaylistmsg);
        // On ajoute la queue du serveur dans la queue globale:
        queue.set(member.guild.id, queueConstruct);
        // On y ajoute la musique
        queueConstruct.songs.push(song);
        sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.GeneralLogsMsg.musicLogs.music_joinvocal);
        try {
            // On connecte le bot au salon vocal et on sauvegarde l'objet connection

            //const player = Music.createAudioPlayer();
            //const ressource = Music.createAudioResource(stream);

            var connection = await Music.joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.channel.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            });



            if (ifSlash === true) {
                await message.editReply("La musique a été préparée. La lecture va commencer.")
            }

            queueConstruct.connection = connection;


            // On lance la musique
            sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.GeneralLogsMsg.musicLogs.music_youtubesucess);
            play(member.guild, queueConstruct.songs[0], false);
        }
        catch (err) {
            //On affiche les messages d'erreur si le bot ne réussi pas à se connecter, on supprime également la queue de lecture
            sendErrorLog(values.CmdList.MusicCmds.play + " : " + values.generalText.ErrorMsg.logs.music_failjoinvocal, err);
            queue.delete(member.guild.id);
            sendErrorToDev(Discord, client, err, "execute");
            return message.channel.send(err);
        }
    }
    else {
        serverQueue.songs.push(song);
        sendStatusLog(values.generalText.GeneralLogsMsg.musicLogs.music_linkadded);
        sendStatusLog(`z!play : Titre : ${song.title}`);
        sendStatusLog(`z!play : URL : ${song.url}`);


        let embedAddPlaylist = new Discord.MessageEmbed()
            .setAuthor("Ajoutée par : " + song.addedby, song.pdp)
            .setThumbnail(song.thumbnail)
            .setColor(values.settings.embedColor)
            .addFields(
                { name: 'Titre', value: song.title })
            .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl});

        if (ifSlash === true) {
            return await message.editReply({ embeds: [embedAddPlaylist], content: "La musique a été ajoutée." })
        } else {
            return await message.channel.send({ embeds: [embedAddPlaylist] });
        }

    }
}