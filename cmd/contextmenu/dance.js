
// JavaScript source code
const Discord = require("discord.js");
const values = require('../../values.json');
const { andreaeaster } = require("../bin/andreaeaster");

module.exports = async (message) => {
	const member = await message.guild.members.fetch(message.targetId)

		const embedMessageMention = new Discord.MessageEmbed()
			.setColor(values.settings.embedColor)
			.setDescription(`Pikachu fait une danse à **${member.user.tag}** ! ${andreaeaster(member)}`)
			.setImage("https://cdn.discordapp.com/attachments/872866306473472040/872867350658039869/pika_dance.gif");

	return message.reply({embeds: [embedMessageMention]});
	//return message.channel.send("https://tenor.com/view/pokemon-pokemon-pikachu-gif-18775145")
	
	return member
	//.then(() => message.reply("Le bot te dit bonjour ${member.user.tag} !"))
	//.catch(error => message.reply("Une erreur s'est produite"))
}