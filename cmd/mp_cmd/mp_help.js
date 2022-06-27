const Discord = require('discord.js'); //Chargement module Discord
const values = require('../../values.json');

const versionNumber = values.version.versionNumber

const embedMsgHelpMP = new Discord.MessageEmbed()
    .setTitle("Aide de Zbeub Bot😊")
    .setColor(values.settings.embedColor)
    .addFields(
        {name : "Coucou ! ^^", value : "Voici les fonctionnalités et commandes utilisables par message privé ! Si vous voulez accéder à la liste des commandes complètes, tapez \`z!help\` sur un serveur ^^ !"},
        {name : "Liste des commandes : ", value : `
\`z!sendcomments\` : Si vous voulez envoyer des commentaires concernant le bot, ou signaler un problème, vous pouvez utiliser cette commande.
Vous pouvez aussi envoyer des captures d'écran ou des pièces jointes également.
`},     
        {name : `Règlement : `, value : `
Vous devez respecter certaines règles de base : 
- Ne pas insulter, être courtois, aimable et respectueux.
- Evitez de spammer la commande, sinon le développeur aura très peu de chance de lire votre commentaire.
- N'envoyez pas de données ou informations personnelles (identifiants, mot de passe, etc...).
- N'envoyez pas de captures d'écran choquantes, pornographiques ou NSFW, ou contenant des informations personnelles.
- N'envoyez pas de fichiers ou de pièces jointes malveillants, comme des virus ou trojans ou des fichiers de type *zip-bomb* par exemple.
- Le (les) règlement(s) du (des) serveur(s) où Zbeub Bot est présent s'applique(nt) ici également, veuillez à les respecter.
        
Si ces règles ci-dessus ne sont pas respectées, des sanctions seront appliquées en fonction des règlements en vigueur sur les serveurs où Zbeub Bot est présent.`});
        

module.exports = (message) => {
    embedMsgHelpMP.setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl});
    return message.reply({embeds: [embedMsgHelpMP]});
}