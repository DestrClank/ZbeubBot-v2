#!/usr/bin/env node
require("dotenv").config(); //token
const Discord = require('discord.js'); //Chargement module Discord
const cliProgress = require("cli-progress")
const colors = require("ansi-colors")
const args = require("minimist")(process.argv.slice(2))

const values = require("../values.json")
const versionNumber = values.version.versionNumber

const botIntents = new Discord.Intents()
const Perm = Discord.Intents.FLAGS

const fs = require("fs")

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

const commandlist = require(__dirname + "/commandlist")
/*
const jsonContent = JSON.stringify(commandlist);

fs.writeFile("./commandlist.json", jsonContent, 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});
*/

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
    sendStatusLog("Déploiement des commandes slash...\n")
    //const guilddev = client.guilds.cache.get(guildId)

    client.user.setActivity(`${values.generalText.GeneralLogsMsg.DeploymentSlashCmd.botDeploying}`, { type: "PLAYING" })
/*
    if (guilddev) {
        commands = guilddev.commands
    } else {
        
    }
*/
    commands = client.application.commands

    const b1 = new cliProgress.SingleBar({
        format: 'Progression |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} commandes || ETA : {eta_formatted} || {cmdname}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });

    b1.start(commandlist.length, 0, {
        speed: "N/A",
        cmdname: "N/A"
    });

    b1.updateETA()

    for (cmd of commandlist) {
        b1.increment()
        b1.update({
            cmdname: cmd.name
        })
        await commands.create(cmd)
    }

    b1.stop()

    //console.log(commands)

    console.log("\nDéploiement terminé.")

    switch (client.user.id) {
        case "986916236719980574":
            client.user.setActivity(`[DEBUG] z!help ■ ${versionNumber} ■ ${client.guilds.cache.size} serveurs`, { type: "PLAYING" });
            //sendStatusLog("Le bot est en mode DEBUG.");
            break;
        default:
            client.user.setActivity(`z!help ■ ${versionNumber} ■ ${client.guilds.cache.size} serveurs`, { type: "PLAYING" })
            //sendStatusLog("Le bot est en mode RELEASE.")
            break;
    }

    process.exit(1)

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

