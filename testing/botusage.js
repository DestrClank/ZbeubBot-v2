const Discord = require('discord.js')
const { memoryUsage } = require('process')

const values = require("../values.json");
const convertyoutubetomp3 = require('./convertyoutubetomp3');
const versionNumber = values.version.versionNumber;

module.exports = (message, ifSlash, client) => {
    processusage = process.cpuUsage()
    memory = process.memoryUsage()
    const embed = new Discord.MessageEmbed()
        .setTitle("Performances système : ")
        .addFields(
            { name: "Mémoire heap utilisée : ", value: `${Math.round((memory.heapUsed / 1e6) * 100) / 100} MB`, inline: true },
            { name: "Mémoire heap totale : ", value: `${Math.round((memory.heapTotal / 1e6) * 100) / 100} MB`, inline: true },
            { name: "Mémoire utilisée totale par le processus : ", value: `${Math.round((memory.rss / 1e6) * 100) / 100} MB` },
            { name: "Mémoire external utilisée : ", value: `${Math.round((memory.external / 1e6) * 100) / 100} MB`, inline: true },
            { name: "Mémoire buffer utilisée : ", value: `${Math.round((memory.arrayBuffers / 1e6) * 100) / 100} MB`, inline: true },
            { name: "Temps CPU utilisateur : ", value: `${processusage.user} microsecondes` },
            { name: "Temps CPU système : ", value: `${processusage.system} microsecondes` },
            { name: "Statistiques : ",value: `Nombre de musiques en conversion : ${convertyoutubetomp3.convertingprocesses.length}`},
            { name: "Nombres de serveurs", value: `${client.guilds.cache.size} serveurs`}
        )
        .setDescription("Voici les statistiques de performances de Zbeub Bot.")
        .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
        .setColor(values.settings.embedColor);

    //console.log(processusage)
    //console.log(memory)
    if (ifSlash === true) {
        return message.reply({ embeds: [embed] })
    } else {
        return message.channel.send({ embeds: [embed] })
    }
}