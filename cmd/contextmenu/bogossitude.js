// JavaScript source code
const Discord = require("discord.js");
const values = require('../../values.json');
const attachment = 'https://cdn.discordapp.com/attachments/830828771173990420/922831617041498192/Sans_titre_95_20211220110906.png'

const { andreaeaster } = require("../bin/andreaeaster");

module.exports = async (message) => {
	const member = await message.guild.members.fetch(message.targetId)

		const text_mention = `Quel bogossitude **${member.user.tag}** OnO !${andreaeaster(member)}`
		const embedMessageMention = new Discord.MessageEmbed()
			.setColor(values.settings.embedColor)
			.setDescription(text_mention)
			.setImage(attachment);

	return message.reply({ embeds: [embedMessageMention] });
	
	return member

}