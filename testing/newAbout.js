const Discord = require('discord.js'); //Chargement module Discord
const { sendCmdLog, sendStatusLog, sendErrorLog, sendFunctionLog, sendWarnLog } = require("../debug/consolelogs")
const values = require('../values.json');
const fs = require('fs');
const infos = fs.readFileSync('cmd/assets/about_changelog/about.txt', 'utf8');
sendStatusLog("Chargement du fichier \"cmd/assets/about_changelog/about.txt\"")
const versionNumber = values.version.versionNumber;

const embedAboutMessage = new Discord.MessageEmbed()
    .setColor(values.settings.embedColor)
    .setTitle("Changelog complet de Zbeub Bot")
    .setDescription("Voici le changelog complet du bot, démarrant à la version 0.3.3. Il est envoyé en pièce jointe dans ce message.")
    .addField("Version actuelle de Zbeub Bot", versionNumber)
    .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl});

module.exports = (message, ifSlash) => {
    if (ifSlash === true) {
        return message.reply({ embeds: [embedAboutMessage], files: ["cmd/assets/about_changelog/about.txt"] })
    } else {
        return message.channel.send({ embeds: [embedAboutMessage], files: ["cmd/assets/about_changelog/about.txt"] })
    }
}