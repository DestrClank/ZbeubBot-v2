const Discord = require('discord.js'); //Chargement module Discord
const { sendCmdLog, sendStatusLog, sendErrorLog, sendFunctionLog, sendWarnLog } = require("../debug/consolelogs")
const values = require('../values.json');
const fs = require('fs');
const infos = fs.readFileSync('cmd/assets/about_music_bots/about_music_bots_text.txt', 'utf8');
const watchtogether = fs.readFileSync('cmd/assets/about_music_bots/watch_together_paragraph.txt', 'utf8')
sendStatusLog("Chargement du fichier \"cmd/assets/about_music_bots/about_music_bots_text.txt\"")
sendStatusLog("Chargement du fichier \"cmd/assets/about_music_bots/watch_together_paragraph.txt\"")
const versionNumber = values.version.versionNumber;

const embedMusicBotsMessage = new Discord.MessageEmbed()
    .setColor(values.settings.embedColor)
    .setTitle("Informations importantes concernant l'avenir des bots musicaux et de Zbeub Bot")
    .setDescription(infos)
    .addField("Paragraphe ajouté le 10 octobre 2021",watchtogether)
    .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl});

module.exports = (message, ifSlash) => {
    if (ifSlash === true) {
        return message.reply({ embeds: [embedMusicBotsMessage] });
    } else {
        return message.channel.send({ embeds: [embedMusicBotsMessage] });
    }
}
