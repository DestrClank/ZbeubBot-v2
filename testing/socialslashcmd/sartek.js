// JavaScript source code
const Discord = require("discord.js");
const values = require('../../values.json');

//const { andreaeaster } = require("./bin/andreaeaster");

var attachment = 'https://cdn.discordapp.com/attachments/872866306473472040/1059503673622937671/Snaptik.app_7181932223665294598_1.mp4'

module.exports = {
	"sartekrandom": function(message) {
		const user = message.channel.guild.members.cache.random().user;
		//console.log(message.channel.guild.members.cache.random().user)
		const embedMessageRNG = new Discord.MessageEmbed()
			.setColor(values.settings.embedColor)
			.setDescription(`Sartek, le dégradé **${user.username}#${user.discriminator}** !`)
			//.setImage('https://cdn.discordapp.com/attachments/830828771173990420/918197175337500712/zemmour-1825.gif');
		return message.editReply({ embeds: [embedMessageRNG], files:[attachment] })
	}, 
	"sartekmember": function(message, arg) {
		const embedMessageRNG = new Discord.MessageEmbed()
			.setColor(values.settings.embedColor)
			.setDescription(`Sartek, le dégradé **${arg.username}#${arg.discriminator}** !`)
			//.setImage('https://cdn.discordapp.com/attachments/830828771173990420/918197175337500712/zemmour-1825.gif');
		return message.editReply({ embeds: [embedMessageRNG], files:[attachment] })
	}
}
/*
message => {
	const member = message.mentions.members.first()

	if (!member) {
		const args = message.content.split(" ");
		if (args[1] == "random") {
			const user = message.channel.guild.members.cache.random().user;
			//console.log(message.channel.guild.members.cache.random().user)
			const embedMessageRNG = new Discord.MessageEmbed()
				.setColor(values.settings.embedColor)
				.setDescription(`Pikachu te dit bonjour **${user.username}#${user.discriminator}** !`)
				.setImage("https://cdn.discordapp.com/attachments/872866306473472040/872867186081931364/pika_hello.gif");
			return message.channel.send({ embeds: [embedMessageRNG] })
		}
		const embedMessageDefault = new Discord.MessageEmbed()
			.setColor(values.settings.embedColor)
			.setDescription(`Pikachu te dit bonjour !`)
			.setImage("https://cdn.discordapp.com/attachments/872866306473472040/872867186081931364/pika_hello.gif");
		return message.channel.send({ embeds: [embedMessageDefault] })
	}
	else {
		const embedMessageMention = new Discord.MessageEmbed()
			.setColor(values.settings.embedColor)
			.setDescription(`Pikachu te dit bonjour **${member.user.tag}** !${andreaeaster(member)}`)
			.setImage("https://cdn.discordapp.com/attachments/872866306473472040/872867186081931364/pika_hello.gif");

		return message.channel.send({ embeds: [embedMessageMention] });
		//return message.channel.send("https://tenor.com/view/pokemon-pokemon-pikachu-gif-18775145")
	}
	return member
	//.then(() => message.reply("Le bot te dit bonjour ${member.user.tag} !"))
	//.catch(error => message.reply("Une erreur s'est produite"))
}
*/