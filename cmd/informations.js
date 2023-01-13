const Discord = require('discord.js'); //Chargement module Discord
const values = require('../values.json');
const versions = require('../package.json');

const embedInfo = new Discord.MessageEmbed()
    .setTitle("Crédits :")
    .setColor(values.settings.embedColor)
    .addFields(
        {name: "Version", value: values.version.versionNumber, inline: true },
        {name: "Version des commandes slash", value: values.version.slashversionNumber, inline:true},
        {name : "Développé par", value: values.properties.developer, inline: true},
        {name: "Nom du bot", value: values.properties.name, inline:true},
        //{name: "Packages utilisés", value: getPackageVersion()},
        {name: "Ce bot utilise les dépendances listées ci-dessus.", value:"\u200b"},
        {name: "Merci à :", value: "<@861311210862411786> et <@1033801232512471170> pour leurs idées géniales, qui ont permis d'améliorer ce petit bot, à l'image de Pikachu *pika pika pikachu ^^* !"},
        {name: "\u200b", value: "Foura, pour avoir testé ce bot !"},
        {name: "\u200b", value : "Merci à <@660062370697183233> aussi xD !"}
    )
    .setFooter({text:`Zbeub Bot version ${values.version.versionNumber}`, iconURL:values.properties.botprofileurl})

module.exports = (message, ifSlash) => {
    if (ifSlash === true) {
        return message.reply({ embeds: [embedInfo], content: getPackageVersion() });
    } else {
        return message.channel.send({ embeds: [embedInfo], content: getPackageVersion() });
    }
}

function getPackageVersion() {
    let text = "Packages utilisés : \n\n"
    for (package in versions.dependencies) {
        text += `**${package}** : Version ${versions.dependencies[package]}\n` 
    }
    return text
}