const Discord = require('discord.js'); //Chargement module Discord
const { sendCmdLog, sendStatusLog, sendErrorLog, sendFunctionLog, sendWarnLog } = require("../debug/consolelogs")
const fs = require('fs');
const values = require('../values.json');
const infos = fs.readFileSync('cmd/assets/about_changelog/current_patch.txt', 'utf8');
sendStatusLog("Chargement du fichier \"cmd/assets/about_changelog/current_patch.txt\"")
const versionNumber = values.version.versionNumber;

const embedAboutMessage = new Discord.MessageEmbed()
    .setColor("#FFF305")
    .setTitle(`Zbeub Bot version ${versionNumber}`)
    .setDescription("Zbeub Bot crée par DestrClank. Pour accéder au changelog complet, utilisez \`z!changelog\`")
    .addField(`Version ${values.version.versionNumber}`, `${infos}`)
    .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl});

module.exports = (message, ifSlash) => {
    if (ifSlash === true) {
        return message.reply({ embeds: [embedAboutMessage] });
    } else {
        return message.channel.send({embeds: [embedAboutMessage]});
    }
}