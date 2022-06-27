const values = require('../values.json')
const sendErrorToDev = require("../debug/sendErrorToDeveloper")

module.exports = async (Discord, client, message) => {
    var messagefinal = `Un message a été reçue par le bot OnO : \nUtilisateur : ${message.author.username}#${message.author.discriminator}\nMessage : ${message.content}`
    var Attachment = Array.from(message.attachments.values())

    //console.log(Attachment)
    
    if (Attachment.length >= 1) {
        console.log(`Des pièces jointes ont été reçues. Nombre de pièces jointes : ${Attachment.length}`)
        messagefinal = (messagefinal + `\n\n**Des pièces jointes ont été reçues.**\nNombre de pièces jointes : ${Attachment.length}`)
    }
        
    client.users.cache.get(values.properties.userID).send(messagefinal)
    
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