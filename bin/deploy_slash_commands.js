#!/usr/bin/env node
require("dotenv").config(); //token
const Discord = require('discord.js'); //Chargement module Discord
const args = require("minimist")(process.argv.slice(2))

const values = require("../values.json")
const versionNumber = values.version.versionNumber

const botIntents = new Discord.Intents()
const Perm = Discord.Intents.FLAGS


botIntents.add(
    Perm.GUILDS,
    Perm.GUILD_MEMBERS,
    Perm.GUILD_BANS,
    Perm.GUILD_WEBHOOKS,
    Perm.GUILD_INTEGRATIONS,
    Perm.GUILD_INVITES,
    Perm.GUILD_VOICE_STATES,
    Perm.GUILD_PRESENCES,
    Perm.GUILD_MESSAGES,
    Perm.GUILD_MESSAGE_REACTIONS,
    Perm.GUILD_MESSAGE_TYPING,
    Perm.DIRECT_MESSAGES,
    Perm.DIRECT_MESSAGE_REACTIONS,
    Perm.DIRECT_MESSAGE_TYPING
)


const client = new Discord.Client({ intents: botIntents }); //Création du client

const { sendCmdLog, sendStatusLog, sendErrorLog, sendFunctionLog } = require("../debug/consolelogs")

const guildId = values.settings.DevelopmentServer

switch (args.v) {
    case "release":
        console.log("Installation des commandes sur la version Release.")
        token = process.env.RELEASE_BOT_TOKEN
        break;
    case "debug": 
        console.log("Installation des commandes sur la version Debug.")
        token = process.env.BOT_TOKEN
        break;
    default:
        console.log("Vous n'avez pas mentionné de version après la commande. Utilisez l'argument -v suivi de \"debug\" ou \"release\" pour installer les commandes slash sur la version Debug ou Release du bot.")
        process.exit(1)
}

client.once('ready', async () => {
    sendStatusLog("Déploiement des commandes slash...")
    //const guilddev = client.guilds.cache.get(guildId)

    client.user.setActivity(`${values.generalText.GeneralLogsMsg.DeploymentSlashCmd.botDeploying}`, { type: "PLAYING" })
/*
    if (guilddev) {
        commands = guilddev.commands
    } else {
        
    }
*/
    commands = client.application.commands

    console.log(commands)

    await commands.create({
        name: "ping",
        description: "Une fonction de test qui permet de ping le bot OnO."
    })

    await commands.create({
        name: "about",
        description: "z!about : Affiche le changelog de la version actuelle."
    })

    await commands.create({
        name: "changelog",
        description: "z!changelog : Envoie le changelog complet du bot depuis la version 0.3.3."
    })

    await commands.create({
        name: "credits",
        description: "z!credits : Affiche les crédits."
    })

    await commands.create({
        name: "botusage",
        description: "z!botusage : Affiche des informations statistiques concernant le bot."
    })

    await commands.create({
        name: "infos",
        description: "z!infos : Affiche des informations concernant l'avenir des bots musicaux et de Zbeub Bot."
    })

    await commands.create({
        name: "Dire bonjour",
        type: 2
    })

    await commands.create({
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
    await commands.create({
        name: "Danser",
        type: 2
    })

    await commands.create({
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
    await commands.create({
        name: "test",
        description: "Une fonction simple de test, qui teste les commandes slash."
    })

    await commands.create({
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

    await commands.create({
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

    await commands.create({
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

    await commands.create({
        name: "error",
        description: "z!error : envoie un message d'erreur."
    })

    await commands.create({
        name: "help",
        description: "z!help : envoie la liste des commandes."
    })

    await commands.create({
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

    await commands.create({
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

    await commands.create({
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

    await commands.create({
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

    await commands.create({
        name: "sartek",
        description: "z!sartek : Sartek, votre coupe !",
        options: [ 
            {
                name: "member",
                description: "z!sartek : Vous choisissez un membre.",
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
                description: "z!sartek : Le bot choisit un membre au hasard.",
                type: 1,
            }
        ]
    })

    await commands.create({
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

    await commands.create({
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

    await commands.create({
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

    await commands.create({
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

    await commands.create({
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

    await commands.create({
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

    await commands.create({
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

    await commands.create({
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

    await commands.create({
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

    await commands.create({
        name: "stop",
        description: "z!stop : permet d'arrêter la musique."
    })

    await commands.create({
        name: "skip",
        description: "z!skip : Permet de passer la musique."
    })

    await commands.create({
        name: "loop",
        description: "z!loop : Permet de boucler la musique en cours de lecture."
    })

    await commands.create({
        name: "queue",
        description: "z!queue : Permet d'afficher la liste de lecture."
    })

    await commands.create({
        name: "pause",
        description: "z!pause : Permet de mettre en pause la musique."
    })

    await commands.create({
        name: "resume",
        description: "z!resume : Permet de reprendre la lecture de la musique."
    })

    await commands.create({
        name: "np",
        description: "z!np : Permet de voir les détails de la musique en cours de lecture."
    })

    await commands.create({
        name: "qp",
        description: "z!qp : Permet de lire de la musique sans passer par le choix de celle-ci.",
        options: [{
            name: "argument",
            description: "Entrez une recherche ou un lien YouTube.",
            required: true,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING
        }]
    })

    console.log("Déploiement terminé.")

})

client.once("reconnecting", () => {
    sendStatusLog(values.generalText.GeneralLogsMsg.BotOperationLog.botReconnecting);
});

client.once("disconnect", () => {
    sendStatusLog(values.generalText.GeneralLogsMsg.BotOperationLog.botDisconnect);
});

client.on('shardError', error => {
    sendErrorLog(values.generalText.GeneralLogsMsg.BotOperationLog.botShardError, error);
})

process.on('unhandledRejection', error => {
    //const developer = client.users.fetch(values.properties.userID, false)
    //let errorCode = error.code
    sendErrorLog(values.generalText.GeneralLogsMsg.BotOperationLog.botUnhandledRejection, error)
    client.users.cache.get(values.properties.userID).send(`Une erreur inattendue est survenue. Code d'erreur : \nNom : ${error.name}\nMessage : ${error.message}\nEmplacement : ${error.path}\nCode API : ${error.code}\nMéthode : ${error.method}`)
    //console.log(developer)

    //throw error

})

client.login(token);

