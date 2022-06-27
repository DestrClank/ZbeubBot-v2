const values = require("../../values.json");
//const { Discord, client } = require('discord.js');
const sendState = require("../../debug/sendStateToDev")
const { sendCmdLog, sendStatusLog, sendErrorLog, sendFunctionLog, sendWarnLog, sendLogToDev, logfilepath } = require("../../debug/consolelogs")

module.exports = async (message, client, Discord) => {
    //console.log(message.attachments)
    const cmd = "z!sendcomments"
    var FinalMessage = message.content.substr(cmd.length+1)
    var Attachment = Array.from(message.attachments.values())
    var messagefinal = (`Un message privé a été reçue par le bot : \nUtilisateur : ${message.author.username}#${message.author.discriminator}\nMessage : ${FinalMessage}\n\n**Ce message provient de la commande** \`z!sendcomments\`.`)

    

    if (Attachment.length >= 1) {
        sendStatusLog(`Des pièces jointes ont été reçues. Nombre de pièces jointes : ${Attachment.length}`)
        messagefinal = (messagefinal + `\n\n**Des pièces jointes ont été reçues.**\nNombre de pièces jointes : ${Attachment.length}`)
    }

    message.reply("Votre commentaire a bien été envoyée au développeur ^^, il pourra vous contacter si besoin.")

    await client.users.cache.get(values.properties.userID).send({ content: messagefinal, files: [logfilepath] })
    
    if (Attachment.length >= 1) {
        messagefinal += "\n\n" + "Liste des liens de pièce jointe : \n"
        for (i in Attachment) {
            messagefinal += "\n" + Attachment[i].url
            //console.log(Attachment[i].url)
            client.users.cache.get(values.properties.userID).send(Attachment[i].url)
        }
    }    
    

    return;

}