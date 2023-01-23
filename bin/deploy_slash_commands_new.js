#!/usr/bin/env node
require("dotenv").config(); //token
const Discord = require('discord.js'); //Chargement module Discord
const cliProgress = require("cli-progress")
const colors = require("ansi-colors")
const args = require("yargs").argv

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');



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

let configs = {
    cmdlist: null,
    build: null,
    to: null,
    mode: null
};

console.log(`${colors.yellow(`
----------------------------------------------------------------
  GESTIONNAIRE DE COMMANDES SLASH POUR ZBEUB BOT VERSION ${values.version.deployerVersion}
----------------------------------------------------------------
`)}`)



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

const { sendCmdLog, sendStatusLog, sendErrorLog, sendFunctionLog } = require("../debug/consolelogs");
const readlineSync = require("readline-sync")

const guildId = values.settings.DevelopmentServer

switch (args.build) {
    case "release":
        console.log("Gestion des commandes sur la build Release.")
        token = process.env.RELEASE_BOT_TOKEN
        configs.build = "release"
        break;
    case "debug":
        console.log("Gestion des commandes sur la build Debug.")
        token = process.env.DEBUG_BOT_TOKEN
        configs.build = "debug"
        break;
    default:
        console.log(`

Gestionnaire de commandes slash de Zbeub Bot version ${values.version.deployerVersion}
-------------------------------------------------------------

Ce programme permet de déployer ou de supprimer les commandes slash du bot sur un serveur ou de manière globale.

${colors.yellow("Arguments obligatoires :")}

    ${colors.greenBright("--build")} : Indique quelle build de Zbeub Bot est affectée.

        ${colors.gray("debug")} : Gère les commandes sur Zbeub Bot - Debug#8984.
        ${colors.gray("release")} : Gère les commandes sur Zbeub Bot#1917.

    ${colors.greenBright("--mode")} : Choisit si les commandes seront installées ou supprimées.

        ${colors.gray("install")} : Installe les commandes slash.
        ${colors.gray("delete")} : Supprime les commandes slash.

    ${colors.greenBright("--to")} : Indique si les commandes doivent être gérées sur un serveur spécifique ou dans tous les serveurs.

        ${colors.gray("guild")} : Gère les commandes sur un serveur spécifique. Vous devrez récupérer un identifiant valide d'un serveur où le bot visé est présent et a le droit ${colors.blue("Administrateur")} sur le serveur.
        ${colors.gray("global")} : Gère les commandes sur la totalité des serveurs.
    
${colors.yellow("Autres arguments :")}

    ${colors.greenBright("--onguild")} : Si vous gérez les commandes sur un serveur spécifique, utilisez cet argument pour indiquer l'identifiant du serveur sur lequel vous souhaitez gérer les commandes.

    ${colors.greenBright("--cmdlist")} : Choisit la liste des commandes à installer.
        -> Utilisez les fichiers "commandlist.json" ou "debug_commandlist.json" pour gérer les commandes slash du bot.
        
        ${colors.blueBright("commandlist.json")} -> ${colors.yellowBright("Release")}
        ${colors.blueBright("debug_commandlist.json")} -> ${colors.yellowBright("Debug")}

        > Arguments: ${colors.gray("debug, release")}
        > Par défaut : ${colors.gray("release")}

${colors.yellow("Exemple :")}

    node bin/deploy_slash_commands_new.js --build=debug --to=global --mode=install
`)
        //console.log("Vous n'avez pas mentionné de version après la commande. Utilisez l'argument --build= suivi de \"debug\" ou \"release\" pour installer les commandes slash sur la build Debug ou Release du bot.")
        process.exit(1)
}

switch (args.cmdlist) {
    case "debug":
        console.log("La liste de commandes Debug a été sélectionnée.")
        commandlist = require(__dirname + "/debug_commandlist")
        configs.cmdlist = "debug"
        break;
    case "release":
        console.log("La liste de commandes Release a été sélectionnée.")
        commandlist = require(__dirname + "/commandlist")
        configs.cmdlist = "release"
        break;
    default:
        console.log("La liste de commandes Release a été sélectionnée par défaut.")
        commandlist = require(__dirname + "/commandlist")
        configs.cmdlist = "release"
        break;
}

client.once('ready', async () => {
    sendStatusLog("Connexion à Discord réussie.")
    const rest = new REST({ version: '9' }).setToken(token);
    //const guilddev = client.guilds.cache.get(guildId)

    client.user.setActivity(`${values.generalText.GeneralLogsMsg.DeploymentSlashCmd.botDeploying}`, { type: "PLAYING" })
    /*
        if (guilddev) {
            commands = guilddev.commands
        } else {
            
        }
    */

    switch (args.mode) {
        case "install":
            console.log("Mode installation séléctionné.")
            
            switch (args.to) {
                case "guild":
                    if (!args.onguild) {
                        console.log(colors.red("ERREUR : ") + "Pas de Guild ID mentionné. Utilisez --onguild= suivi d'un Guild ID valide pour installer les commandes slash sur un serveur spécifique.")
                        process.exit(1)
                    }
                    console.log("Installation des commandes slash sur un serveur spécifique.")
        
                    try {
                        guild = await client.guilds.cache.get(args.onguild)
                        commands = guild.commands
                        console.log(`Gestion des commandes sur le serveur ID : ${args.onguild} (${guild.name}).`)
                        configs.to = "guild"
                    } catch {
                        console.log(colors.red("ERREUR : ") + "Le Guild ID mentionné est invalide. Mentionnez un Guild ID valide d'un serveur où le bot visé est présent.")
                        process.exit(1)
                    }
        
                    break;
                case "global":
                    console.log("Installation des commandes slash sur tous les serveurs.")
                    commands = client.application.commands
                    configs.to = "global"
                    break;
                default:
                    console.log("Installation des commandes slash sur tous les serveurs.")
                    configs.to = "global"
                    commands = client.application.commands
                    break;
            }
        
            if (configs.to == "global" && configs.cmdlist == "debug" && configs.build == "release") {
                console.log(`\n${colors.red("ATTENTION : ")}Vous allez installer les commandes slash de la liste Debug sur la build Release du bot (sur le bot utilisable par les utilisateurs) de manière globale sur tous les serveurs. Cela peut entraîner un comportement inattendu sur le bot voire des plantages. Voulez-vous vraiment continuer ?\n`)
        
                if (!readlineSync.keyInYN("Appuyez sur Y pour accepter ou N pour refuser.")) {
                    process.exit(1)
                }
            }
            
        
            sendStatusLog("Déploiement des commandes slash...\n")
        
            try {
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
            } catch (err) {
                console.error(colors.red("ERREUR : ") + "Une erreur est survenue lors du déploiement des commandes slash. L'installateur va s'arrêter.", err)
                process.exit(1)
            }

            break;
        case "delete":
            switch (args.to) {
                case "guild":
                    console.log("Mode suppression sur un serveur séléctionné. Suppression des commandes en cours.")

                    if (!args.onguild) {
                        console.log(colors.red("ERREUR : ") + "Pas de Guild ID mentionné. Utilisez --onguild= suivi d'un Guild ID valide pour supprimer les commandes slash sur un serveur spécifique.")
                        process.exit(1)
                    }

                    try {
                        guild = await client.guilds.cache.get(args.onguild)
                        commands = guild.commands
                        configs.to = "guild"
                    } catch {
                        console.log(colors.red("ERREUR : ") + "Le Guild ID mentionné est invalide. Mentionnez un Guild ID valide d'un serveur où le bot visé est présent.")
                        process.exit(1)
                    }

                    console.log(`Gestion des commandes sur le serveur ID : ${args.onguild} (${guild.name}).`)
                
                    await rest.put(Routes.applicationGuildCommands(client.user.id, args.onguild), { body: [] })
                    .then(() => {
                        console.log('Suppression des commandes sur le serveur terminées.')
                        process.exit(1)
                    })
                    .catch(console.error);

                    break;
                case "global":
                    console.log("Mode suppression global séléctionné. Suppression des commandes en cours.")
                    
                    await rest.put(Routes.applicationCommands(client.user.id), { body: [] })
                    .then(() =>{
                        console.log('Suppression des commandes globales terminées.')
                        process.exit(1)
                    })
                    .catch(console.error);

                    break;
                default: 
                    console.log(colors.red("ERREUR : ") + "Pas de destination mentionnée. Utilisez --to suivi de global ou guild pour indiquer si les commandes seront supprimées d'un serveur ou sur tout les serveurs.")
                    process.exit(1)
                    break;
            }
            break;
        default:
            console.log(colors.red("ERREUR : ") + "Pas de mode mentionné. Utilisez --mode suivi de install ou delete pour installer ou désinstaller les commandes slash.")
            process.exit(1)
            break;
    }

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

