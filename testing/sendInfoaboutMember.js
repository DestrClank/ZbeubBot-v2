const values = require("../values.json");
const versionNumber = values.version.versionNumber

module.exports = async (message, client, Discord) => {
    const member = message.mentions.members.first()

    if (!member) {
        return message.channel.send("Vous n'avez mentionné aucun membre ou le membre n'a pas été trouvé.");
    }   

    var joindate = new Date(member.joinedTimestamp)
    var textdate = joindate.getDate() + "/" + (joindate.getMonth()+1) + "/" + joindate.getFullYear()

    var pseudo = member.nickname

    if (!pseudo) {
        pseudo = "Aucun pseudo."
    }



    var embedInfoMember = new Discord.MessageEmbed()
        .setTitle(`A propos de : ${member.user.username}#${member.user.discriminator}`)
        .setColor(values.settings.embedColor)
        .addFields(
            {name: "Nom d'utilisateur : ", value: `${member.user.username}#${member.user.discriminator}`, inline: true},
            {name: "Pseudo sur le serveur : ", value: `${pseudo}`, inline: true},
            {name: "A rejoint le serveur le :", value: textdate }
        )
        .setThumbnail(member.user.displayAvatarURL())
        .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl});

    //console.log(client)
    return message.channel.send({embeds: [embedInfoMember]})

}