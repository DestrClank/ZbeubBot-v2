const values = require("../values.json");
//const { Discord, client } = require('discord.js');
const sendState = require("../debug/sendStateToDev")

const { sendCmdLog, sendStatusLog, sendErrorLog, sendFunctionLog, sendWarnLog, sendLogToDev } = require("../debug/consolelogs")

module.exports = async (message, client, Discord) => {
    var messagefinal = `Un message a été reçue par le bot : \nUtilisateur : ${message.author.username}#${message.author.discriminator}\nMessage : ${message.content} \n\n **Ce message provient de la commande \`z!d_sendfiles\`.`
    var Attachment = message.attachments.array()
    
    if (Attachment.length >= 1) {
        sendStatusLog(`Des pièces jointes ont été reçues. Nombre de pièces jointes : ${Attachment.length}`)
        messagefinal = (messagefinal + `\n\n**Des pièces jointes ont été reçues.**\nNombre de pièces jointes : ${Attachment.length}`)
    } else {
        sendWarnLog("z!d_sendfiles : Aucun fichier n'a été reçu.")
        messagefinal = `La commande \`z!d_sendfiles\` n'a pas pu aboutir, aucun fichier n'a été envoyé par l'utilisateur **${message.author.username}#${message.author.discriminator}.**`
    }
        
    client.users.cache.get(values.properties.userID).send(messagefinal, Attachment)

}