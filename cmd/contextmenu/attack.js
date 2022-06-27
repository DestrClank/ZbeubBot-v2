// JavaScript source code
// JavaScript source code
const { MessageEmbed } = require("discord.js");
//const guild = new Discord.Guild()
//const client = new Discord.Client()

const values = require('../../values.json');

const { andreaeaster } = require("../bin/andreaeaster");

module.exports = async (message) => {
	const member = await message.guild.members.fetch(message.targetId)
	
		const embedMessageMention = new MessageEmbed()
			.setColor(values.settings.embedColor)
			.setDescription(`Pikachu fait Boule Elek à **${member.user.tag}** ! C'est très efficace ! ${andreaeaster(member)}`)
			.setImage("https://cdn.discordapp.com/attachments/872866306473472040/872866875791523930/pika_attack.gif");

	return message.reply({embeds : [embedMessageMention]});
	return member
}