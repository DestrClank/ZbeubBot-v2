const Discord = require('discord.js'); //Chargement module Discord
const values = require('../values.json');
const versions = require('../package.json');

const embedInfo = new Discord.MessageEmbed()
    .setTitle("Crédits :")
    .setColor(values.settings.embedColor)
    .addFields(
        { name: "Version", value: values.version.versionNumber, inline: true },
        {name: "Version des commandes slash", value: values.version.slashversionNumber, inline:true},
        {name : "Développé par", value: values.properties.developer, inline: true},
        {name: "Nom du bot", value: values.properties.name, inline:true},
        {name: "Version discord.js", value: versions.dependencies['discord.js']},
        {name: "Version discord.js-slash-command", value : versions.dependencies['discord.js-slash-command']},
        {name: "Version discord.js-commando", value: versions.dependencies['discord.js-commando']},
        {name: "Version dotenv", value: versions.dependencies['dotenv']},
        {name: "Version ffmpeg-static", value: versions.dependencies['ffmpeg-static']},
        {name: "Version node-opus", value: versions.dependencies['node-opus']},
        {name: "Version yt-search", value: versions.dependencies['yt-search']},
        {name: "Version ytdl-core", value: versions.dependencies['ytdl-core']},
        {name: "Version @discord.js/opus", value: "Non disponible."},
        {name: "Version simple-youtube-api", value: versions.dependencies['simple-youtube-api']},
        {name: "Ce bot utilise les dépendances listées ci-dessus.", value:"\u200b"},
        {name: "Merci à :", value: "<@861311210862411786> et <@1033801232512471170> pour leurs idées géniales, qui ont permis d'améliorer ce petit bot, à l'image de Pikachu *pika pika pikachu ^^* !"},
        {name: "\u200b", value: "Foura, pour avoir testé ce bot !"},
        {name: "\u200b", value : "Merci à <@660062370697183233> aussi xD !"}
    )
    .setFooter({text:`Zbeub Bot version ${values.version.versionNumber}`, iconURL:values.properties.botprofileurl})

module.exports = (message, ifSlash) => {
    if (ifSlash === true) {
        return message.reply({ embeds: [embedInfo] });
    } else {
        return message.channel.send({ embeds: [embedInfo] });
    }
}