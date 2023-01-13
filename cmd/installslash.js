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

const commandlist = 
[
    {
        name: "membercard",
        description: "Affiche les informations d'un membre sous la forme d'une carte de membre.",
        options: 
        [{
            name: "membre",
            description: "Mentionnez un membre.",
            required: true,
            type: 6
        }]
    },
    {
        name: "showinfoaboutmember",
        description: "Affiche les informations d'un membre.",
        options: 
        [{
            name: "membre",
            description: "Mentionnez un membre.",
            required: true,
            type: 6
        }]
    },
    {
        name: "calc",
        description: "Calculatrice permettant de faire des calculs simples."
    }
]


async function installslash(message, client)
{
    //const guild = client.guilds.cache.get(message.guild.id);
    //const member = guild.members.cache.get(message.author.id);

    if (message.author.id != "456117123283157002") {
        sendStatusLog("L'utilisateur n'est pas le développeur et ne peut pas utiliser cette commande.")
        return message.channel.send("Cette commande est désormais obsolète et n'est utilisée que par le développeur pour le débogage et le test de nouvelles commandes slash et les commandes d'application en cours de développement avant leur publication globale. \n\nToutes les commandes slash publiées devraient être disponibles dès que le bot a rejoint votre serveur et sont mises à jour automatiquement par le développeur au fur et à mesure que le bot reçoit des mises à jour. \n\nSi vous voyez que les commandes slash du bot sont présentes en double, vous pouvez lancer la commande `z!deleteslashcommands` pour supprimer la copie des commandes sur votre serveur et ne garder que la copie publique des commandes.")
    }

    try {

        const guild = client.guilds.cache.get(message.guild.id)

        commands = guild.commands

        for (cmd of commandlist) {
            sendStatusLog(`Création de ${cmd.name}...`)
            await commands.create(cmd)
        }
        
        message.channel.send("Les commandes slash et les commandes d'application sont en cours d'installation sur ce serveur.")
    } catch {
        sendErrorLog("Les commandes slash n'ont pas été installés à cause d'une erreur.", "")
        return message.channel.send("Les commandes slash n'ont pas été installés à cause d'une erreur.")
    }
}

module.exports = (message, guildId) =>  {
    installslash(message, guildId)
};

































    /*
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
       /*
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
       /*
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
            name: "tts",
            description: "z!tts : Fait parler le bot (langue française).",
            options: [
                {
                    name: "texte",
                    description: "Ecrivez votre texte (100 caractères max).",
                    required: true,
                    type: Discord.Constants.ApplicationCommandOptionTypes.STRING
                }
            ]
        })

        commands.create({
            name: "hello",
            description: "z!hello : Pikachu dira bonjour à un membre.",
            options: [ 
                {
                    name: "member",
                    description: "z!hello : Vous choisissez un membre.",
                    type: 1,
                    options: [ 
                        {
                            name: "membre",
                            description: "Choisissez un membre.",
                            type: 6,
                            required: true
                        }
                    ]
                },
                {
                    name: "random",
                    description: "z!hello : Le bot choisit un membre au hasard.",
                    type: 1,
                }
            ]
        })

        commands.create({
            name: "settings",
            description: "Paramètres du bot sur ce serveur.",
            options: [ 
                {
                    name: "simplifiedmenu",
                    description: "Menu de commande musical simplifié (avec icônes).",
                    type: 2,
                    options: [ 
                        {
                            name: "activate",
                            description: "Activer le menu de commande musical simplifié.",
                            type: 1
                        },
                        {
                            name: "deactivate",
                            description: "Désactiver le menu de commande musical simplifié.",
                            type: 1
                        }
                    ]
                },
            ]
        })

        commands.create({
            name: "attack",
            description: "z!attack : Pikachu attaquera un membre.",
            options: [ 
                {
                    name: "member",
                    description: "z!attack : Vous choisissez un membre.",
                    type: 1,
                    options: [ 
                        {
                            name: "membre",
                            description: "Choisissez un membre.",
                            type: 6,
                            required: true
                        }
                    ]
                },
                {
                    name: "random",
                    description: "z!attack : Le bot choisit un membre au hasard.",
                    type: 1,
                }
            ]
        })

        commands.create({
            name: "dance",
            description: "z!dance : Pikachu fera une danse à un membre.",
            options: [ 
                {
                    name: "member",
                    description: "z!dance : Vous choisissez un membre.",
                    type: 1,
                    options: [ 
                        {
                            name: "membre",
                            description: "Choisissez un membre.",
                            type: 6,
                            required: true
                        }
                    ]
                },
                {
                    name: "random",
                    description: "z!dance : Le bot choisit un membre au hasard.",
                    type: 1,
                }
            ]
        })

        commands.create({
            name: "hug",
            description: "z!hug : Pikachu fera un câlin à un membre.",
            options: [ 
                {
                    name: "member",
                    description: "z!hug : Vous choisissez un membre.",
                    type: 1,
                    options: [ 
                        {
                            name: "membre",
                            description: "Choisissez un membre.",
                            type: 6,
                            required: true
                        }
                    ]
                },
                {
                    name: "random",
                    description: "z!hug : Le bot choisit un membre au hasard.",
                    type: 1,
                }
            ]
        })

        commands.create({
            name: "wala",
            description: "z!wala : Vous jurez que c'est vrai ??",
            options: [ 
                {
                    name: "member",
                    description: "z!wala : Vous choisissez un membre.",
                    type: 1,
                    options: [ 
                        {
                            name: "membre",
                            description: "Choisissez un membre.",
                            type: 6,
                            required: true
                        }
                    ]
                },
                {
                    name: "random",
                    description: "z!wala : Le bot choisit un membre au hasard.",
                    type: 1,
                }
            ]
        })

        commands.create({
            name: "mtm",
            description: "z!mtm : Kirby passera un message à un membre.",
            options: [ 
                {
                    name: "member",
                    description: "z!mtm : Vous choisissez un membre.",
                    type: 1,
                    options: [ 
                        {
                            name: "membre",
                            description: "Choisissez un membre.",
                            type: 6,
                            required: true
                        }
                    ]
                },
                {
                    name: "random",
                    description: "z!mtm : Le bot choisit un membre au hasard.",
                    type: 1,
                }
            ]
        })

        commands.create({
            name: "buttonrole",
            description: "Créer des boutons permettant d'obtenir un rôle.",
            options: [ 
                {
                    name: "add",
                    description: "Ajouter un bouton faisant obtenir un rôle.",
                    type: 1
                },
                {
                    name: "remove",
                    description: "Supprimer un bouton faisant obtenir un rôle.",
                    type: 1,
                }
            ]
        })

        commands.create({
            name: "zemmour",
            description: "z!zemmour : A pas d'humour.",
            options: [ 
                {
                    name: "member",
                    description: "z!zemmour : Vous choisissez un membre.",
                    type: 1,
                    options: [ 
                        {
                            name: "membre",
                            description: "Choisissez un membre.",
                            type: 6,
                            required: true
                        }
                    ]
                },
                {
                    name: "random",
                    description: "z!zemmour : Le bot choisit un membre au hasard.",
                    type: 1,
                }
            ]
        })

        commands.create({
            name: "nice",
            description: "z!nice : Hmmm, nice !",
            options: [ 
                {
                    name: "member",
                    description: "z!nice : Vous choisissez un membre.",
                    type: 1,
                    options: [ 
                        {
                            name: "membre",
                            description: "Choisissez un membre.",
                            type: 6,
                            required: true
                        }
                    ]
                },
                {
                    name: "random",
                    description: "z!nice : Le bot choisit un membre au hasard.",
                    type: 1,
                }
            ]
        })

        commands.create({
            name: "bogossitude",
            description: "z!bogossitude : La bogossitude à son paroxysme.",
            options: [ 
                {
                    name: "member",
                    description: "z!bogossitude : Vous choisissez un membre.",
                    type: 1,
                    options: [ 
                        {
                            name: "membre",
                            description: "Choisissez un membre.",
                            type: 6,
                            required: true
                        }
                    ]
                },
                {
                    name: "random",
                    description: "z!bogossitude : Le bot choisit un membre au hasard.",
                    type: 1,
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
            name: "calc",
            description: "Calculatrice permettant de faire des calculs simples."
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
        */