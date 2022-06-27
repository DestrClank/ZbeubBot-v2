// JavaScript source code
// JavaScript source code
const { MessageEmbed } = require("discord.js");
//const guild = new Discord.Guild()
//const client = new Discord.Client()

const values = require('../values.json');

const { andreaeaster } = require("./bin/andreaeaster");

module.exports = message => {
	const member = message.mentions.members.first()

	if (!member) {
		const args = message.content.split(" ");

		if (args[1] == "random") {
			const user = message.channel.guild.members.cache.random().user;
			//console.log(message.channel.guild.members.cache.random().user)
			const embedMessageRNG = new MessageEmbed()
				.setColor(values.settings.embedColor)
				.setDescription(`Pikachu fait Boule Elek à **${user.username}#${user.discriminator}** ! C'est très efficace !`)
				.setImage("https://cdn.discordapp.com/attachments/872866306473472040/872866875791523930/pika_attack.gif");
			return message.channel.send({embeds: [embedMessageRNG]})
        }
		
		const embedMessageDefault = new MessageEmbed()
			.setColor(values.settings.embedColor)
			.setDescription(`Pikachu fait Boule Elek ! C'est très efficace !`)
			.setImage("https://cdn.discordapp.com/attachments/872866306473472040/872866875791523930/pika_attack.gif");
		return message.channel.send({embeds: [embedMessageDefault]})
	}
	else 
	{
		const embedMessageMention = new MessageEmbed()
			.setColor(values.settings.embedColor)
			.setDescription(`Pikachu fait Boule Elek à **${member.user.tag}** ! C'est très efficace ! ${andreaeaster(member)}`)
			.setImage("https://cdn.discordapp.com/attachments/872866306473472040/872866875791523930/pika_attack.gif");

	return message.channel.send({embeds : [embedMessageMention]});
	//return message.channel.send("https://tenor.com/view/pokemon-pokemon-pikachu-gif-18775145")
	}
	return member
	//.then(() => message.reply("Le bot te dit bonjour ${member.user.tag} !"))
	//.catch(error => message.reply("Une erreur s'est produite"))
}