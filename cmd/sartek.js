// JavaScript source code
const Discord = require("discord.js");
const values = require('../values.json');
const attachment = 'https://cdn.discordapp.com/attachments/872866306473472040/1059503673622937671/Snaptik.app_7181932223665294598_1.mp4'

const { andreaeaster } = require("./bin/andreaeaster");

module.exports = message => {
	const member = message.mentions.members.first()

	if (!member) {
		const args = message.content.split(" ");
		if (args[1] == "random") {
			const user = message.channel.guild.members.cache.random().user;
			//console.log(message.channel.guild.members.cache.random().user)
			const embedMessageRNG = new Discord.MessageEmbed()
				.setColor(values.settings.embedColor)
				.setDescription(`Sartek, le dégradé **${user.username}#${user.discriminator}** !`)
				//.setImage(attachment);
			return message.channel.send({embeds: [embedMessageRNG], files:[attachment]})
		}
		const embedMessageDefault = new Discord.MessageEmbed()
			.setColor(values.settings.embedColor)
			.setDescription(`Sartek, le dégradé Mohammed !`)
			//.setImage(attachment);
		return message.channel.send({embeds: [embedMessageDefault], files:[attachment]})
	}
	else 
	{
		const embedMessageMention = new Discord.MessageEmbed()
			.setColor(values.settings.embedColor)
			.setDescription(`Sartek, le dégradé **${member.user.tag}** !${andreaeaster(member)}`)
			//.setImage(attachment);

	return message.channel.send({embeds: [embedMessageMention], files:[attachment]});
	//return message.channel.send("https://tenor.com/view/pokemon-pokemon-pikachu-gif-18775145")
	}
	return member
	//.then(() => message.reply("Le bot te dit bonjour ${member.user.tag} !"))
	//.catch(error => message.reply("Une erreur s'est produite"))
}