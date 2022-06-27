require("dotenv").config(); //token
const Discord = require("discord.js");
const ytdl = require('ytdl-core'); //Chargement module lecture vidéo Youtube
const yts = require('yt-search'); //Chargement module Youtube Data API v3 (eh ouais)
const DiscordSlash = require('discord.js-slash-command'); //Chargement module Discord Slash Commands
const guildId = '825631179939119105';
const client = new Discord.Client(); //Création du client
//const play = require('./play');
//const queue = new Map();
module.exports = (guild, song, queue) => {
    
        //console.log(song);
        const serverQueue = queue.get(guild.id); // On récupère la queue de lecture
        if (!song) { // Si la musique que l'utilisateur veux lancer n'existe pas on annule tout et on supprime la queue de lecture
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            console.log("Fonction play : Arrêt de la lecture et le bot quitte le salon vocal.");
            client.user.setActivity("z!help", { type: "PLAYING" });
            return;
        }
        // On lance la musique
        const dispatcher = serverQueue.connection
            .play(ytdl(song.url, { filter: 'audioonly' }))
            .on("finish", () => { // On écoute l'événement de fin de musique
                if (!serverQueue.loop) serverQueue.songs.shift(); // On passe à la musique suivante quand la courante se termine
                play(guild, serverQueue.songs[0], queue);
            })
            .on("error", error => console.error(error));
        dispatcher.setVolume(1); // On définie le volume
        console.log("Fonction play : Lecture de la musique suivante : ");
        console.log(`Fonction play : Titre : ${song.title}`);
        console.log(`Fonction play : URL : ${song.url}`);
        serverQueue.textChannel.send(`Lecture de la musique : **${song.title}**`);
        client.user.setActivity(song.title, { type: "PLAYING" });

}