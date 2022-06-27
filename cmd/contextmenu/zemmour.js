// JavaScript source code
const Discord = require("discord.js");
const values = require('../../values.json');
const attachment = 'https://cdn.discordapp.com/attachments/830828771173990420/918197175337500712/zemmour-1825.gif'

const { andreaeaster } = require("../bin/andreaeaster");

module.exports = async (message) => {
	const member = await message.guild.members.fetch(message.targetId)

		const embedMessageMention = new Discord.MessageEmbed()
			.setColor(values.settings.embedColor)
			.setDescription(`Prépare-toi, **${member.user.tag}**, ça ne rigole plus OnO !${andreaeaster(member)}`)
			.setImage(attachment);

	return message.reply({embeds: [embedMessageMention]});
	//return message.channel.send("https://tenor.com/view/pokemon-pokemon-pikachu-gif-18775145")
	
	return member
	//.then(() => message.reply("Le bot te dit bonjour ${member.user.tag} !"))
	//.catch(error => message.reply("Une erreur s'est produite"))
}