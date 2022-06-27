require("dotenv").config(); //token
const Discord = require("discord.js");
const ytdl = require('ytdl-core'); //Chargement module lecture vidéo Youtube
const yts = require('yt-search'); //Chargement module Youtube Data API v3 (eh ouais)
const DiscordSlash = require('discord.js-slash-command'); //Chargement module Discord Slash Commands
const guildId = '825631179939119105';
const client = new Discord.Client(); //Création du client
const play = require('./play');
//const queue = new Map();

module.exports = async (interaction, serverQueue, guild, member, queue) => {
    
    const args = interaction.command.options[0].value;
    //const args = interaction.command.options[0].value; // On récupère les arguments dans le message pour la suite
        //const searchString = args.slice(1).join(" ");
        //const url = args[1] ? args[1].replace(/<(._)>/g, '$1') : ''
    console.log(args);
    let validate = await ytdl.validateURL(args[0]);

    console.log("")

    const voiceChannel = member.voice.channel;
        //const voiceChannel = member.voice.channel;
        if (!voiceChannel) // Si l'utilisateur n'est pas dans un salon vocal
        {
            console.log("z!play : L'utilisateur n'était pas dans un salon vocal avant de faire la commande play.");
            return interaction.callback("Soyez dans un salon vocal pour que cela fonctionne 😉 !");
        }

        if (!args[0]) {
            console.log("z!play : L'utilisateur n'a pas spécifié d'arguments.");
            return interaction.callback("Pour utiliser la fonction \`z!play\`, vous devez mettre après \`z!play\` des termes de recherche ou un lien vers une vidéo YouTube spécifique.");
        }
        /*
        if (!validate) {
            console.log("z!play : Une recherche sur YouTube a été effectuée à la place car l'argument n'est pas un lien.");
            return ytsearch(message, serverQueue);
        }
        */

           /*
        const permissions = voiceChannel.permissionsFor(member.client.user); // On récupère les permissions du bot pour le salon vocal
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) { // Si le bot n'a pas les permissions
            console.log("z!play : Le bot ne possède pas les autorisations nécessaires tels que CONNECT et SPEAK. Il ne peut pas continuer.");
            return interaction.callback(
                "Le bot ne possède pas les autorisations nécessaires au fonctionnement de la lecture de musique. Vérifiez les rôles de @Zbeub Bot et leurs autorisations."
            );
        }*/
        /*
        try {
            var video = await youtube.getVideoById(url)
        } catch {
            try {
                var videos = await youtube.searchVideos(searchString, 1)
                var video = await youtube.getVideoById(videos[0].id)
            } catch {
                return message.channel.send("Pas de résultats trouvés.")
            } 
        }
        */
        /*
        const song = {
            id : video.id,
            title : video.title,
            url : `https://www.youtube.com/watch?v=${video.id}`
        } */
        console.log("z!play : Récupération des métadonnées de la vidéo YouTube.");
        const songInfo = await ytdl.getInfo(args);
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        };

        if (!serverQueue) {
            const queueConstruct = {
                textChannel: interaction.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 1,
                playing: true,
                loop: false,
            };

            console.log("z!play : Ajout dans la liste de lecture.");
            // On ajoute la queue du serveur dans la queue globale:
            queue.set(interaction.channel.guild.id, queueConstruct);
            // On y ajoute la musique
            queueConstruct.songs.push(song);
            console.log("z!play : Le bot essaie de rejoindre le salon vocal...");
            try {
                // On connecte le bot au salon vocal et on sauvegarde l'objet connection

                var connection = await voiceChannel.join();
                queueConstruct.connection = connection;
                // On lance la musique
                console.log("z!play : La lecture de musique s'est effectuée via un lien YouTube.");
                play(interaction.channel.guild, queueConstruct.songs[0], queue);
            }
            catch (err) {
                //On affiche les messages d'erreur si le bot ne réussi pas à se connecter, on supprime également la queue de lecture
                console.log("z!play : Le bot n'a pas réussi à rejoindre le salon vocal.");
                console.log(`Code d'erreur : ${err}`);
                queue.delete(interaction.channel.guild.id);
                return interaction.callback(err);
            }
        }
        else {
            serverQueue.songs.push(song);
            console.log("z!play : Ajout de la musique suivante (via lien YouTube).");
            console.log(`z!play : Titre : ${song.title}`);
            console.log(`z!play : URL : ${song.url}`);
            //console.log(serverQueue.songs);
            return interaction.callback(`**${song.title}** a été ajoutée dans la liste de lecture ! 😉`);
        }
}