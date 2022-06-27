// JavaScript source code
const Discord = require("discord.js");
const values = require('../../values.json');
const attachment = 'https://cdn.discordapp.com/attachments/830828771173990420/922831516772478976/yes-nice.gif'

const { andreaeaster } = require("../bin/andreaeaster");

module.exports = async (message) => {
	const member = await message.guild.members.fetch(message.targetId)

	const text_default = `Pikachu te dit **nice** OnO !`

		const text_mention = `**${member.user.tag}** te dit **nice** OnO !${andreaeaster(member)}`
		const embedMessageMention = new Discord.MessageEmbed()
			.setColor(values.settings.embedColor)
			.setDescription(text_mention)
			.setImage(attachment);

		return message.reply({ embeds: [embedMessageMention] });
		//return message.channel.send("https://tenor.com/view/pokemon-pokemon-pikachu-gif-18775145")
	
	return member
	//.then(() => message.reply("Le bot te dit bonjour ${member.user.tag} !"))
	//.catch(error => message.reply("Une erreur s'est produite"))
}