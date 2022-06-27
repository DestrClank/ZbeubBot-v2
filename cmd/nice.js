// JavaScript source code
const Discord = require("discord.js");
const values = require('../values.json');
const attachment = 'https://cdn.discordapp.com/attachments/830828771173990420/922831516772478976/yes-nice.gif'

const { andreaeaster } = require("./bin/andreaeaster");

module.exports = message => {
	const member = message.mentions.members.first()

	const text_default = `Pikachu te dit **nice** OnO !`

	if (!member) {
		const args = message.content.split(" ");
		if (args[1] == "random") {
			const user = message.channel.guild.members.cache.random().user;
			const text_random = `**${user.username}#${user.discriminator}** te dit **nice** OnO !`
			//console.log(message.channel.guild.members.cache.random().user)
			const embedMessageRNG = new Discord.MessageEmbed()
				.setColor(values.settings.embedColor)
				.setDescription(text_random)
				.setImage(attachment);
			return message.channel.send({ embeds: [embedMessageRNG] })
		}
		const embedMessageDefault = new Discord.MessageEmbed()
			.setColor(values.settings.embedColor)
			.setDescription(text_default)
			.setImage(attachment);
		return message.channel.send({ embeds: [embedMessageDefault] })
	}
	else {
		const text_mention = `**${member.user.tag}** te dit **nice** OnO !${andreaeaster(member)}`
		const embedMessageMention = new Discord.MessageEmbed()
			.setColor(values.settings.embedColor)
			.setDescription(text_mention)
			.setImage(attachment);

		return message.channel.send({ embeds: [embedMessageMention] });
		//return message.channel.send("https://tenor.com/view/pokemon-pokemon-pikachu-gif-18775145")
	}
	return member
	//.then(() => message.reply("Le bot te dit bonjour ${member.user.tag} !"))
	//.catch(error => message.reply("Une erreur s'est produite"))
}