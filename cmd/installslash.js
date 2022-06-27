const Discord = require('discord.js'); //Chargement module Discord
const { sendCmdLog, sendStatusLog, sendErrorLog, sendFunctionLog, sendWarnLog } = require("../debug/consolelogs")

//const getApp = (guildId) => {
//    console.log(client)
//    const app = client.api.applications(client.user.id)
//    if (guildId) {
//        app.guilds(guildId)
//    }
//    return app
//}


async function installslash(message, client)
{
    //const guild = client.guilds.cache.get(message.guild.id);
    //const member = guild.members.cache.get(message.author.id);

    try {

        const guild = client.guilds.cache.get(message.guild.id)

        commands = guild.commands
    
        commands.create({
            name: "ping",
            description: "Une fonction de test qui permet de ping le bot OnO."
        })

        commands.create({
            name: "about",
            description: "z!about : Affiche le changelog de la version actuelle."
        })

        commands.create({
            name: "changelog",
            description: "z!changelog : Envoie le changelog complet du bot depuis la version 0.3.3."
        })

        commands.create({
            name: "credits",
            description: "z!credits : Affiche les crédits."
        })

        commands.create({
            name: "botusage",
            description: "z!botusage : Affiche des informations statistiques concernant le bot."
        })

        commands.create({
            name: "infos",
            description: "z!infos : Affiche des informations concernant l'avenir des bots musicaux et de Zbeub Bot."
        })

        commands.create({
            name: "Dire bonjour",
            type: 2
        })

        commands.create({
            name: "Attaquer",
            type: 2
        })
        /*
        commands.create({
            name: "bogossitude",
            type: 2
        })
        */
        /*
        commands.create({
            name: "cordula",
            type: 2
        })
        */
        commands.create({
            name: "Danser",
            type: 2
        })

        commands.create({
            name: "Faire un câlin",
            type: 2
        })
        /*
        commands.create({
            name: "mtm",
            type: 2
        })
        */
        /*
        commands.create({
            name: "nice",
            type: 2
        })
        */
        commands.create({
            name: "test",
            description: "Une fonction simple de test, qui teste les commandes slash."
        })
    
        commands.create({
            name: "embed",
            description: "Renvoie le message saisi sous la forme d'un embed.",
            options: [
                {
                    name: "description",
                    description: "Entrez la description de l'embed ici.",
                    required: true,
                    type: Discord.Constants.ApplicationCommandOptionTypes.STRING
                },
                {
                    name: "titre",
                    description: "Entrez le titre de l'embed ici.",
                    required: false,
                    type: Discord.Constants.ApplicationCommandOptionTypes.STRING
                }
            ]
        })

        commands.create({
            name: "ytconvert",
            description: "z!ytconvert : Le bot convertit une vidéo YouTube en fichier mp3.",
            options: [
                {
                    name: "argument",
                    description: "Entrez le lien de la vidéo ici.",
                    required: true,
                    type: Discord.Constants.ApplicationCommandOptionTypes.STRING

                }
            ]
        })
    
        commands.create({
            name: "sendmessage",
            description: "Le bot renvoie un message saisi par l'utilisateur.",
        options: [
            {
                name: "texte",
                description: "Entrez le message ici.",
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    
            }
        ]})
    
        commands.create({
            name: "error",
            description: "z!error : envoie un message d'erreur."
        })
    
        commands.create({
            name: "help",
            description: "z!help : envoie la liste des commandes."
        })
    
        commands.create({
            name: "play",
            description: "z!play : permet de lire de la musique dans un salon vocal ou de faire une recherche YouTube.",
            options: [
                {
                    name: "argument",
                    description: "Entrez une recherche ou un lien YouTube.",
                    required: true,
                    type: Discord.Constants.ApplicationCommandOptionTypes.STRING
                }
            
            ]
    
            
        })

        commands.create({
            name: "volume",
            description: "z!volume : Règle le volume sonore de la musique.",
            options: [
                {
                    name: "argument",
                    description: "Entrez une valeur entre 0 et 200.",
                    required: true,
                    type: Discord.Constants.ApplicationCommandOptionTypes.INTEGER
                }
            ]
        })
    
        commands.create({
            name: "stop",
            description: "z!stop : permet d'arrêter la musique."
        })
    
        commands.create({
            name: "skip",
            description: "z!skip : Permet de passer la musique."
        })
    
        commands.create({
            name: "loop",
            description: "z!loop : Permet de boucler la musique en cours de lecture."
        })
    
        commands.create({
            name: "queue",
            description: "z!queue : Permet d'afficher la liste de lecture."
        })
    
        commands.create({
            name: "pause",
            description: "z!pause : Permet de mettre en pause la musique."
        })
    
        commands.create({
            name: "resume",
            description: "z!resume : Permet de reprendre la lecture de la musique."
        })
    
        commands.create({
            name: "np",
            description: "z!np : Permet de voir les détails de la musique en cours de lecture."
        })
    
        commands.create({
            name: "qp",
            description: "z!qp : Permet de lire de la musique sans passer par le choix de celle-ci.",
            options: [{
                name: "argument",
                description: "Entrez une recherche ou un lien YouTube.",
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.STRING
            }]
        })

        message.channel.send("Les commandes slash et les commandes d'application sont en cours d'installation sur ce serveur.")
    } catch {
        sendErrorLog("Les commandes slash n'ont pas été installés à cause d'une erreur.", "")
        return message.channel.send("Les commandes slash n'ont pas été installés à cause d'une erreur.")
    }
}

module.exports = (message, guildId) =>  {
    installslash(message, guildId)
};