const Discord = require('discord.js'); //Chargement module Discord
const values = require('../values.json');


const embedMessageError = new Discord.MessageEmbed() //message Embed du message d'erreur
    .setColor(values.settings.embedColor)
	.setDescription("Une erreur est survenue lol mdr jpp ! xD")
    .setImage("https://cdn.discordapp.com/attachments/872866306473472040/872866613219708988/errorwindows.png");

module.exports = (message) => {
    return message.channel.send({embeds: [embedMessageError]});
}

