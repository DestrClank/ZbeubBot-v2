#!/usr/bin/env node
require("dotenv").config(); //token
const Discord = require('discord.js'); //Chargement module Discord

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



client.once('ready', async () => {
    sendStatusLog("Déploiement des commandes slash...")
    const guilddev = client.guilds.cache.get(guildId)

    client.user.setActivity(`${values.generalText.GeneralLogsMsg.DeploymentSlashCmd.botDeploying}`, { type: "PLAYING" })

    if (guilddev) {
        commands = guilddev.commands
    } else {
        commands = guilddev.application.commands
    }

    sendStatusLog("Déploiement de ping...")

    commands.create({
        name: "ping",
        description: "Une fonction de test qui permet de ping le bot OnO."
    })

    sendStatusLog("Déploiement de test...")

    commands.create({
        name: "test",
        description: "Une fonction simple de test, qui teste les commandes slash."
    })

    sendStatusLog("Déploiement de embed...")

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

    sendStatusLog("Déploiement de sendmessage...")

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


    sendStatusLog("Déploiement de error...")

    commands.create({
        name: "error",
        description: "z!error : envoie un message d'erreur."
    })

    sendStatusLog("Déploiement de help...")

    commands.create({
        name: "help",
        description: "z!help : envoie la liste des commandes."
    })

    sendStatusLog("Déploiement de play...")

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

    sendStatusLog("Déploiement de stop...")

    commands.create({
        name: "stop",
        description: "z!stop : permet d'arrêter la musique."
    })

    sendStatusLog("Déploiement de skip...")

    commands.create({
        name: "skip",
        description: "z!skip : Permet de passer la musique."
    })

    sendStatusLog("Déploiement de loop...")

    commands.create({
        name: "loop",
        description: "z!loop : Permet de boucler la musique en cours de lecture."
    })

    sendStatusLog("Déploiement de queue...")

    commands.create({
        name: "queue",
        description: "z!queue : Permet d'afficher la liste de lecture."
    })

    sendStatusLog("Déploiement de pause...")

    commands.create({
        name: "pause",
        description: "z!pause : Permet de mettre en pause la musique."
    })

    sendStatusLog("Déploiement de resume...")

    commands.create({
        name: "resume",
        description: "z!resume : Permet de reprendre la lecture de la musique."
    })

    sendStatusLog("Déploiement de np...")

    commands.create({
        name: "np",
        description: "z!np : Permet de voir les détails de la musique en cours de lecture."
    })

    sendStatusLog("Déploiement de qp...")

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

    sendStatusLog("Déploiement terminé.")
    setTimeout(() => {
        sendStatusLog("Fermeture du programme.")
        process.exit(0)
    }, 5000)
    

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

client.login(process.env.BOT_TOKEN);

