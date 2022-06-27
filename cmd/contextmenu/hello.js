// JavaScript source code
const Discord = require("discord.js");
const values = require('../../values.json');

const { andreaeaster } = require("../bin/andreaeaster");

module.exports = async (message) => {
	const member = await message.guild.members.fetch(message.targetId)

		const embedMessageMention = new Discord.MessageEmbed()
			.setColor(values.settings.embedColor)
			.setDescription(`Pikachu te dit bonjour **${member.user.tag}** !${andreaeaster(member)}`)
			.setImage("https://cdn.discordapp.com/attachments/872866306473472040/872867186081931364/pika_hello.gif");

		return message.reply({ embeds: [embedMessageMention] });
		//return message.channel.send("https://tenor.com/view/pokemon-pokemon-pikachu-gif-18775145")
	
	return member
}