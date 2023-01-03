// JavaScript source codea

/* Commentaires sur la fonction de ping :
 * La fonction ping vérifie si le fichier .noping est présent à la racine du bot
 * (dossier contenant les fichiers package.json, index.js etc...).
 * Dans la phase de test et de développement, il est recommandé de garder le fichier .noping à la racine.
 * Dans la phase de déploiement et de fonctionnement global, il est recommande de supprimer le fichier .noping à la racine.
 * Le fichier .gitignore indique à Git que le fichier .noping est à ignorer.
 *
 * Activer la fonction de ping : supprimer ou renommer le fichier .noping.
 * Désactiver la fonction de ping : créer un fichier nommé .noping.
 *
 */



const invalidwindowsnames = [
    "con",
    "prn",
    "aux",
    "nul",
    "com1",
    "com2",
    "com3",
    "com4",
    "com5",
    "com6",
    "com7",
    "com8",
    "com9",
    "lpt1",
    "lpt2",
    "lpt3",
    "lpt4",
    "lpt5",
    "lpt6",
    "lpt7",
    "lpt8",
    "lpt9",
    "deltarune chapter 2 - spamton theme (remix and extended)"]

require("dotenv").config(); //token du bot
require('better-logging')(console)
const { sendCmdLog, sendStatusLog, sendErrorLog, sendFunctionLog, sendWarnLog, sendLogToDev, logfilepath, sendCrashLog } = require("./debug/consolelogs")

var platform = process.platform

sendStatusLog("Démarrage du bot en cours...")
sendStatusLog(`Le fichier log ${logfilepath} a été crée avec succès.`)
sendStatusLog(`Plateforme actuelle : ${platform}`)

//Modules et assets
const { spawn, exec } = require('child_process'); sendStatusLog("Chargement de child_process...")
const Discord = require('discord.js'); sendStatusLog("Chargement de discord.js...") //Chargement module Discord
const ytdl = require('ytdl-core'); sendStatusLog("Chargement de ytdl-core...") //Chargement module lecture vidéo Youtube
const yts = require('yt-search'); sendStatusLog("Chargement de yt-search...") //Chargement module Youtube Data API v3 (eh ouais)
//const DiscordSlash = require('discord.js-slash-command'); sendStatusLog("Chargement de discord.js-slash-command...") //Chargement module Discord Slash Commands
const fs = require('fs'); sendStatusLog("Chargement de fs...")

sendStatusLog("Définition des intents du bot...")

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
sendStatusLog("Chargement des dépendances...")
const client = new Discord.Client({ intents: botIntents, partials: ["CHANNEL"], shards : 'auto' }); sendStatusLog("Création du client Discord...") //Création du client
var connectionstate = "connecting"

client.voiceManager = new Discord.Collection()

const { stream } = require("play-dl"); sendStatusLog("Chargement de play-dl...")
const Music = require('@discordjs/voice'); sendStatusLog("Chargement de @discordjs/voice...")
const hello = require("./cmd/hello"); sendStatusLog("Chargement de ./cmd/hello...") //Charge le module pour la commande z!hello
const help = require("./cmd/help"); sendStatusLog("Chargement de ./cmd/help...") //Charge le module de l'aide
const attack = require("./cmd/attack"); sendStatusLog("Chargement de ./cmd/hello...") //Charge le module Attaque
const dance = require("./cmd/dance"); sendStatusLog("Chargement de ./cmd/dance...")//Charge le module Danse
//const slash = new DiscordSlash.Slash(client); sendStatusLog("Création de DiscordSlash.Slash...") //Création des commandes slash
const about = require("./cmd/about"); sendStatusLog("Chargement de ./cmd/about...") //Charge le module about
const installslash = require('./cmd/installslash'); sendStatusLog("Chargement de ./cmd/installslash...")
const error = require("./cmd/error"); sendStatusLog("Chargement de ./cmd/error...")
const deleteslash = require("./cmd/deleteslash"); sendStatusLog("Chargement de ./cmd/deleteslash...")
const informations = require("./cmd/informations"); sendStatusLog("Chargement de ./cmd/informations...")
const hug = require("./cmd/hug"); sendStatusLog("Chargement de ./cmd/hug...")
const musicbotfuture = require("./cmd/about_music_bots"); sendStatusLog("Chargement de ./cmd/about_music_bots...")
const sendErrorToDev = require("./debug/sendErrorToDeveloper"); sendStatusLog("Chargement de ./debug/sendErrorToDeveloper...")
const sendMPToDev = require("./debug/sendMPToDev"); sendStatusLog("Chargement de ./debug/sendMPToDev...")
const sendStateToDev = require("./debug/sendStateToDev"); sendStatusLog("Chargement de ./debug/sendStateToDev...")
const mphelp = require("./cmd/mp_cmd/mp_help"); sendStatusLog("Chargement de ./cmd/mp_cmd/mp_help...")
const sendCommentsToDev = require("./cmd/mp_cmd/sendCommentsToDev"); sendStatusLog("Chargement de ./cmd/mp_cmd/sendCommentsToDev...")
const debugsendFile = require("./testing/sendAttachment"); sendStatusLog("Chargement de ./testing/sendAttachment...")
const debugshowInfoAboutMember = require("./testing/sendInfoaboutMember"); sendStatusLog("Chargement de ./testing/sendInfoaboutMember...")
const debugNewAboutMessage = require("./testing/newAbout"); sendStatusLog("Chargement de ./testing/newAbout...")
const cordula = require("./cmd/cordula"); sendStatusLog("Chargement de ./cmd/cordula...")
const debugdeployslash = require('./debug/deployslash'); sendStatusLog("Chargement de ./debug/deployslash...")
const restartbot = require('./testing/restartbot'); sendStatusLog("Chargement de ./testing/restartbot...")
const botusage = require('./testing/botusage'); sendStatusLog("Chargement de ./testing/botusage...")
const discordTTS = require("discord-tts"); sendStatusLog("Chargement de discord-tts...")
const sendMail = require("./testing/mailwhenerror"); sendStatusLog("Chargement de ./testing/mailwhenerror...")

if (platform == "linux") {
    var canvasgenerator = require('./testing/profileimage'); sendStatusLog("Chargement de ./testing/profileimage...")
} else {
    sendWarnLog("La plateforme actuelle étant Windows (ou plateforme incompatible n'étant pas Linux), impossible de charger le module ./testing/profileimage. La fonctionnalité sera désactivée.")
}

const mtm = require("./cmd/mtm"); sendStatusLog("Chargement de ./cmd/mtm...")
const wala = require("./cmd/wala"); sendStatusLog("Chargement de ./cmd/wala...")
const zemmour = require("./cmd/zemmour"); sendStatusLog("Chargement de ./cmd/zemmour...")
const { setChanceTo, debugtest } = require('./cmd/bin/andreaeaster'); sendStatusLog("Chargement de ./cmd/bin/andreaeaster...")
const convertyoutubetomp3 = require('./testing/convertyoutubetomp3'); sendStatusLog("Chargement de ./testing/convertyoutubetomp3...")
const nice = require('./cmd/nice'); sendStatusLog("Chargement de ./cmd/nice...")
const http = require('http'); sendStatusLog("Chargement de http...")
const path = require('path'); sendStatusLog("Chargement de path...")
const mime = require('mime'); sendStatusLog("Chargement de mime...")
const url = require('url'); sendStatusLog("Chargement de url...")
const NodeID3 = require('node-id3'); sendStatusLog("Chargement de Node-ID3...")
const boteasteregg = require('./cmd/bin/boteasteregg'); sendStatusLog("Chargement de ./cmd/bin/boteasteregg...")
const findRemoveSync = require('find-remove'); sendStatusLog("Chargement de find-remove...")

const menuhello = require('./cmd/contextmenu/hello'); sendStatusLog("Chargement de ./cmd/contextmenu/hello...")
const menuattack = require('./cmd/contextmenu/attack'); sendStatusLog("Chargement de ./cmd/contextmenu/attack...")
const menubogossitude = require('./cmd/contextmenu/bogossitude'); sendStatusLog("Chargement de ./cmd/contextmenu/bogossitude...")
const menucordula = require('./cmd/contextmenu/cordula'); sendStatusLog("Chargement de ./cmd/contextmenu/cordula...")
const menudance = require('./cmd/contextmenu/dance'); sendStatusLog("Chargement de ./cmd/contextmenu/dance...")
const menuhug = require('./cmd/contextmenu/hug'); sendStatusLog("Chargement de ./cmd/contextmenu/hug...")
const menumtm = require('./cmd/contextmenu/mtm'); sendStatusLog("Chargement de ./cmd/contextmenu/mtm...")
const menunice = require('./cmd/contextmenu/nice'); sendStatusLog("Chargement de ./cmd/contextmenu/nice...")

const values = require("./values.json"); sendStatusLog("Chargement des paramètres de configuration...")
const { SlashCommandBuilder } = require("@discordjs/builders"); sendStatusLog("Chargement de @discordjs/builders...")

const getParam = require('./debug/getParam'); sendStatusLog("Chargement de ./debug/getParam...")
const bogossitude = require("./cmd/bogossitude"); sendStatusLog("Chargement de ./cmd/bogossitude...")
const sartek = require("./cmd/sartek"); sendStatusLog("Chargement de ./cmd/sartek...")
const testrecordaudio = require("./testing/recordaudio"); sendStatusLog("Chargement de ./testing/recordaudio...")
const { sendHelp, modifyHelp } = require("./testing/help"); sendStatusLog("Chargement de ./testing/help...")

const { hellorandom, hellomember } = require("./testing/socialslashcmd/hello"); sendStatusLog("Chargement de ./testing/socialslashcmd/hello...")
const { attackrandom, attackmember } = require("./testing/socialslashcmd/attack"); sendStatusLog("Chargement de ./testing/socialslashcmd/attack...")
const { dancerandom, dancemember } = require("./testing/socialslashcmd/dance"); sendStatusLog("Chargement de ./testing/socialslashcmd/dance...")
const { hugrandom, hugmember } = require("./testing/socialslashcmd/hug"); sendStatusLog("Chargement de ./testing/socialslashcmd/hug...")
const { cordularandom, cordulamember } = require("./testing/socialslashcmd/cordula"); sendStatusLog("Chargement de ./testing/socialslashcmd/cordula...")
const { walarandom, walamember } = require("./testing/socialslashcmd/wala"); sendStatusLog("Chargement de ./testing/socialslashcmd/wala...")
const { mtmrandom, mtmmember } = require("./testing/socialslashcmd/mtm"); sendStatusLog("Chargement de ./testing/socialslashcmd/mtm...")
const { zemmourrandom, zemmourmember } = require("./testing/socialslashcmd/zemmour"); sendStatusLog("Chargement de ./testing/socialslashcmd/zemmour...")
const { nicerandom, nicemember } = require("./testing/socialslashcmd/nice"); sendStatusLog("Chargement de ./testing/socialslashcmd/nice...")
const { bogossituderandom, bogossitudemember } = require("./testing/socialslashcmd/bogossitude"); sendStatusLog("Chargement de ./testing/socialslashcmd/bogossitude...")
const { sartekrandom, sartekmember } = require("./testing/socialslashcmd/sartek"); sendStatusLog("Chargement de ./testing/socialslashcmd/sartek...")
const keepalive = require("./keepalive")
const speakTTS = require('./testing/tts'); sendStatusLog("Chargement de ./testing/tts...")

const GuildModel = require('./schemes/guildmodel'); sendStatusLog("Chargement de ./schemes/guildmodel...")
const { connect } = require('mongoose')

sendStatusLog("Chargement des dépendances terminé.")
sendStatusLog("Récupération des informations système..")
getParam();

const versionNumber = values.version.versionNumber;
const musicFeatureState = values.settings.musicCmdEnable;
var ConfigStateSent = false;

const PikachuEmote = client.emojis.cache.find(emoji => emoji.name === "Pikachu"); //https://cdn.discordapp.com/emojis/830729434058850345.png?v=1

const queue = new Map();
const ttsqueue = new Map()

async function MusicStateEmbed(message, author, ifslash, title, description, serverQueue, ifButton, type) {
    let embedMusicState = new Discord.MessageEmbed()
        .setAuthor({name: `${author.username}#${author.discriminator}`, iconURL:`${author.displayAvatarURL()}`})
        .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
        .setColor(values.settings.embedColor);
    
    let row = new Discord.MessageActionRow() 
    .addComponents(
        new Discord.MessageButton()
            .setStyle('SECONDARY')
            .setLabel("Afficher les détails de la musique en cours")
            .setCustomId("whatsplaying")
    );

    let rowdisabled = new Discord.MessageActionRow() 
    .addComponents(
        new Discord.MessageButton()
            .setStyle('SECONDARY')
            .setLabel("Afficher les détails de la musique en cours")
            .setCustomId("whatsplaying")
            .setDisabled(true)
    );

    let rownomusic = new Discord.MessageActionRow() 
    .addComponents(
        new Discord.MessageButton()
            .setStyle('SECONDARY')
            .setLabel("Aucune musique en cours de lecture")
            .setCustomId("whatsplaying")
            .setDisabled(true)
    );

    let rownotinvocal = new Discord.MessageActionRow() 
    .addComponents(
        new Discord.MessageButton()
            .setStyle('SECONDARY')
            .setLabel("Vous n'êtes pas dans un salon vocal")
            .setCustomId("error1")
            .setDisabled(true)
    )
    .addComponents(
        new Discord.MessageButton()
            .setStyle('SECONDARY')
            .setLabel("Aucune musique en cours de lecture")
            .setCustomId("error2")
            .setDisabled(true)
    );

    if (serverQueue) {
        var buttonactivation = row
    } else {
        var buttonactivation = rowdisabled
    }

    //if (type === "stop_music") {
    //    buttonactivation = ""
    //}

    if (title) {
        embedMusicState.setTitle(`${title}`)
    }
    if (description) {
        embedMusicState.setDescription(`${description}`)
    }

    if (ifButton) {
        if (type === "no_music") {
            return message.update({components: [rownomusic]})
        }

        if (type === "not_in_vocal") {
            if (serverQueue) {
                return message.reply({ embeds: [embedMusicState], ephemeral: true })
            } else {
                return message.update({components: [rownotinvocal]})
            }
        }
        return message.reply({ embeds: [embedMusicState], components: [buttonactivation], ephemeral: true })
    }

    if (ifslash === true) {
        await message.editReply({ embeds: [embedMusicState], components: [buttonactivation] })
    } else {
        message.channel.send({ embeds: [embedMusicState], components: [buttonactivation] })
    }
    return
}


const express = require('express');
const about_music_bots = require("./cmd/about_music_bots");
const { rejects } = require("assert");
const app = express()
const request = require('request');

app.use(express.static(__dirname + "/test_webpage"))
app.use("/downloaderror", express.static(__dirname + "/test_webpage/downloaderror"))
const PORT = process.env.PORT || 3001
app.listen(3000, ()=>{console.log("Le serveur est actif.")});

app.get("/", (req, res) => {
    res.render(index)
})

app.get('/download/:userid', function(req, res){

    var userid = req.params.userid;

    var file = __dirname + `/output/output_${userid}.mp3`;

    if (!fs.existsSync(file)) {
        res.redirect("/downloaderror")
        return;
    }

    songtitle = NodeID3.read(file).title

    if (invalidwindowsnames.includes(songtitle.toLowerCase())) {
        sendStatusLog("Fonction ytconvert : Le titre contient un nom incompatible pour les noms de fichiers Windows.")
        futurefilename = "filename_" + songtitle + "_"
    } else {
        futurefilename = songtitle
    }

    let finalfilename = futurefilename.replace(/[/\\?%*:|"<>]/g, "_") + ".mp3"
  
    var filename = path.basename(file);
    var mimetype = mime.getType(file);
  
    res.setHeader('Content-disposition', 'attachment; filename=' + finalfilename);
    res.setHeader('Content-type', mimetype);
  
    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
  }); 

app.listen(PORT, () => {
    sendStatusLog(`Application ouverte sur le port ${PORT}`)
})

const guildId = values.settings.DevelopmentServer


//initialisation du bot
sendStatusLog("Initialisation...")
client.once('ready', async () => {

    connectionstate = "connected"
    sendStatusLog(values.generalText.GeneralLogsMsg.BotOperationLog.botInitialized)

    sendStatusLog("ID Client connecté : "+client.user.id)

    switch (client.user.id) {
        case "986916236719980574":
            client.user.setActivity(`[DEBUG] z!help ■ ${versionNumber} ■ ${client.guilds.cache.size} serveurs`, { type: "PLAYING" });
            sendStatusLog("Le bot est en mode DEBUG.");
            break;
        default:
            client.user.setActivity(`z!help ■ ${versionNumber} ■ ${client.guilds.cache.size} serveurs`, { type: "PLAYING" })
            sendStatusLog("Le bot est en mode RELEASE.")
            break;
    }

    getConfig()
    getPing()

    try {
        http.get("http://ZbeubBot-v2.dylanvassalo.repl.co") //http://zbeubbot.herokuapp.com
        sendStatusLog("Ping du site initial réussi.")
    } catch (error) {
        sendErrorLog("Une erreur de ping du site s'est produite.", error)
    }
    
    sendStateToDev(Discord.Client, client, `Le bot est initialisé.\n Version : \`${values.version.versionNumber}\``);

});

function getConfig() {
    try {
        switch (client.user.id) {
            case "986916236719980574":
                var configfile = require("./debug_config.json");
                break;
            default:
                var configfile = require("./release_config.json");
                break;
        }
    
        if (ConfigStateSent == false) {
            sendStatusLog("\nConfiguration appliquée : "+configfile.ConfigType+"\n\nLogs:\nSendLogsWhenShutdown:"+configfile.SendLogs.SendLogsWhenShutdown+"\nSendLogsWhenCrash:"+configfile.SendLogs.SendLogsWhenCrash+"\nSendLogsWhenError:"+configfile.SendLogs.SendLogsWhenError)
            ConfigStateSent = true
        }

        return configfile;

    } catch {
        sendWarnLog("Impossible de vérifier la configuration à appliquer au bot. Le bot va s'arrêter.")
        process.exit(1)
    }
   
}

setInterval(() => {
    if (getConfig().DeleteOutputFiles.DeleteAfter1Hour == true) {
        sendStatusLog("Suppression des fichiers obsolètes.")
        let result = findRemoveSync(__dirname + '/output', {age: {seconds: 3600}, files: "*.*"}); //3600
        sendStatusLog("Les fichiers sont supprimés.")
        console.log("Fichiers supprimés : "+result)
        return;
    } else {
        sendStatusLog("La configuration ne permet pas de supprimer les fichiers obsolètes de 1 heure.")
        return;
    }
    //console.log("Fichiers supprimés : ")
    //console.log(result)
}, 1800000) //

async function getPing() {
    sendStatusLog(`Calcul du temps de latence entre le bot et l'API en cours...`)
    await sleep(5000)
    sendStatusLog(`Temps de latence : ${client.ws.ping} ms`)
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

client.once("reconnecting", () => {
    connectionstate = "connecting"
    sendWarnLog(values.generalText.GeneralLogsMsg.BotOperationLog.botReconnecting);
});

client.once("disconnect", () => {
    connectionstate = "connecting"
    sendWarnLog(values.generalText.GeneralLogsMsg.BotOperationLog.botDisconnect);
});

client.on('shardError', error => {
    connectionstate = "connecting"
    sendErrorLog(values.generalText.GeneralLogsMsg.BotOperationLog.botShardError, error);
})


process.on('unhandledRejection', async (error) => {

    if (connectionstate == "connecting" && error.code == "500") {
        sendErrorLog("Le bot n'a pas réussi à se connecter au serveur d'API. Le bot ne peut pas continuer et par conséquent va s'arrêter.", error)
        sleep(5000)
        process.exit(1)
    }

    sendErrorLog(values.generalText.GeneralLogsMsg.BotOperationLog.botUnhandledRejection, error)
    if (getConfig().SendLogs.SendLogsWhenError == true) {
        sendWarnLog("Envoi des logs au développeur...")
        try {
            await client.users.cache.get(values.properties.userID).send({
                content: `Une erreur inattendue est survenue. Code d'erreur : \nNom : ${error.name}\nMessage : ${error.message}\nEmplacement : ${error.path}\nCode API : ${error.code}\nMéthode : ${error.method}`,
                files: [logfilepath]
            }).then(() => sendWarnLog("Les logs sont envoyés.")).catch((err) => {
                sendErrorLog("Une erreur d'envoi des logs s'est produite.", err)
                return;
            })
        } catch (err) {
            sendErrorLog("Impossible d'envoyer les logs.", err)
            return;
        }
    } else {
        sendWarnLog("La configuration désactive l'envoi des logs lorsque le bot rencontre une erreur inattendue.")
    }
})

const termination = [`SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`]
var requesttermination = 0;

termination.forEach((eventType) => {

    if (requesttermination === 1) {
        return sendWarnLog("Une demande d'arrêt du bot a déja été reçue.")
    }
    //process.stdin.resume();

    process.on(eventType, async function () {
        requesttermination = 1;
        sendWarnLog(`Une demande d'arrêt du bot a été reçue. Code d'arrêt : ${eventType}`)
        try {
            if (getConfig().SendLogs.SendLogsWhenShutdown == true) {
            sendWarnLog("Envoi des logs au développeur...")
            try {
                await client.users.cache.get(values.properties.userID).send({
                    content: "Le bot s'est arrêté avec succès.",
                    files: [logfilepath]
                }).then(() => {
                    sendWarnLog("Les logs sont envoyés. Le bot va s'arrêter.")
                    process.exit(1)
                }).catch((err) => {
                    sendErrorLog("Une erreur d'envoi des logs s'est produite.", err)
                    process.exit(1)
                })
            } catch (err) {
                sendErrorLog("Impossible d'envoyer les logs. Le bot va s'arrêter.", err)
                process.exit(1)
            }
        } else {
            sendWarnLog("La configuration désactive l'envoi des logs à l'arrêt du bot. Le bot va s'arrêter.")
            process.exit(1)
        }
        } catch {
            sendWarnLog("Aucune configuration n'a été chargée ou la configuration est inconnue. Le bot va s'arrêter.")
            process.exit(1)
        }


    })
})

process.on('uncaughtException', async (err) => {
    sendCrashLog(err)

    if (getConfig().SendLogs.SendLogsWhenCrash == true) {
        try {
            sendWarnLog("Envoi des logs au développeur...")
            await client.users.cache.get(values.properties.userID).send({
                content: "Une erreur sérieuse qui a provoqué l'arrêt du bot s'est produite.",
                files: [logfilepath]
            }).then(() => {
                sendWarnLog("Les logs sont envoyés. Le bot va s'arrêter.")
                process.exit(1)
            }).catch((err) => {
                sendErrorLog("Une erreur d'envoi des logs s'est produite.", err)
                process.exit(1)
            })
        } catch (err) {
            sendErrorLog("Impossible d'envoyer les logs et le bot a rencontré une erreur sérieuse entrâinant son arrêt.", err)
            process.exit(1)
        }
    } else {
        sendWarnLog("La configuration désactive l'envoi des logs lorsque le bot rencontre une erreur sérieuse. Le bot va s'arrêter.")
        process.exit(1)
    }

})

async function getMember(interaction) {
    const guild = await client.guilds.cache.get(interaction.channel.guild.id);
    const member = await guild.members.cache.get(interaction.user.id);
    return member
}



client.on('interactionCreate', async interaction => {
    //if (!interaction.isCommand()) return;

    //console.log(interaction)

    if (!interaction.guild) {
        interaction.reply("Les commandes slash ne fonctionnent que sur les serveurs.\n\nTapez `z!help` pour voir la liste des commandes réalisables par message privé.\nSi vous souhaitez utiliser les autres fonctionnalités du bot, rejoignez le serveur de support de Zbeub Bot et tapez `/help` pour voir la liste des commandes réalisables sur les serveurs : https://discord.gg/jBgC2QggeA");
        return;
    }

    if (interaction.isButton()) {

        const serverQueue = queue.get(interaction.guild.id)
        const guild = client.guilds.cache.get(interaction.guild.id);
        const voiceChannel = interaction.member.voice.channel;
        const member = guild.members.cache.get(interaction.user.id);
        const author = interaction.user
        let connection = client.voiceManager.get(interaction.guild.id)

        if (interaction.customId == "restart_confirmed") {
            restartbot.restartbot(interaction)
        } else if (interaction.customId == "restart_declined") {
            restartbot.deleteMsg(interaction)
        } else if (interaction.customId == "skip_music") {
            skip(interaction, serverQueue, author, false, true)
        } else if (interaction.customId == "pause_music") {
            pauseMusic(interaction, serverQueue, author, false, true)
        } else if (interaction.customId == "resume_music") {
            resumeMusic(interaction, serverQueue, author, false, true)
        } else if (interaction.customId == "toggleloop_music") {
            loop(interaction, serverQueue, author, false, true)
        } else if (interaction.customId == "whatsplaying") {
            whatsplaying(interaction, serverQueue, author, false, true)
        } else if (interaction.customId == "showqueue") {
            showQueue(interaction, serverQueue, author, false, true)
        } else if (interaction.customId == "stop_music") {
            stop(interaction, serverQueue, author, false, true)
        }
    }

    if (interaction.isContextMenu()) {
        const { commandName } = interaction;

        if (commandName === "Dire bonjour") {
            menuhello(interaction)
        } else if (commandName === "Attaquer") {
            menuattack(interaction)
        } else if (commandName === "bogossitude") {
            menubogossitude(interaction)
        } else if (commandName === "cordula") {
            menucordula(interaction)
        } else if (commandName === "Danser") {
            menudance(interaction)
        } else if (commandName === "Faire un câlin") {
            menuhug(interaction)
        } else if (commandName === "mtm") {
            menumtm(interaction)
        } else if (commandName === "nice") {
            menunice(interaction)
        }

        sendStatusLog("Fonction interactionCreate : Une interaction avec le menu contextuel a été effectuée.")
    }

    if (interaction.isSelectMenu()) {
        sendStatusLog("Fonction interactionCreate : Une interaction avec une sélection de menu a été effectuée.")
        if (interaction.customId === 'select') {
            const { options } = interaction
            const serverQueue = queue.get(interaction.guild.id)
            const guild = client.guilds.cache.get(interaction.guild.id);
            const voiceChannel = interaction.member.voice.channel;
            const member = guild.members.cache.get(interaction.user.id);
            let connection = client.voiceManager.get(interaction.guild.id)
            const cmd = "z!play"
            const author = interaction.user
            let args = interaction.values[0]

            //const value = interaction.value

            if (connection) {
                sendStatusLog("Le bot est en train d'enregistrer un salon vocal actuellement dans le serveur demandé. Il est donc impossible d'utiliser la fonctionnalité musicale.")
                return interaction.reply("Le bot est en train d'enregistrer un salon vocal actuellement dans ce serveur. Il est donc impossible d'utiliser la fonctionnalité musicale.")
            }

            if (!voiceChannel) // Si l'utilisateur n'est pas dans un salon vocal
            {
                sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.ErrorMsg.logs.music_notinvocal);
                return await interaction.reply(values.generalText.ErrorMsg.userend.music_notinvocal);
            }

            const permissions = voiceChannel.permissionsFor(member.client.user); // On récupère les permissions du bot pour le salon vocal
            if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) { // Si le bot n'a pas les permissions
                sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.ErrorMsg.logs.music_missingauthorisation);
                return await interaction.reply(values.generalText.ErrorMsg.userend.music_missingauthorisation);
            }

            //console.log(interaction)

            await interaction.deferReply()
            //console.log()
            try {
                execute(interaction, serverQueue, voiceChannel, true, member, args, author, false)
            } catch (err) {
                sendErrorLog("Fonction execute : La musique n'a pas pu être traitée.", error);
                return interaction.editReply(`${values.generalText.ErrorMsg.userend.music_oups}, ${values.generalText.ErrorMsg.userend.music_linkbroken}`)
            }

        }

        if (interaction.customId = "helpselect") {
            const { options } = interaction

            let args = interaction.values[0]

            modifyHelp(interaction, true, args)
        }

    }
    if (interaction.isCommand()) {

        const { commandName, options } = interaction;

        //console.log(interaction)

        const serverQueue = queue.get(interaction.guild.id)
        const guild = client.guilds.cache.get(interaction.guild.id);
        const voiceChannel = interaction.member.voice.channel;
        const member = guild.members.cache.get(interaction.user.id);
        const author = interaction.user
        let username = interaction.user.username + "#" + interaction.user.discriminator
        let guildname = interaction.guild.name
        let connection = client.voiceManager.get(interaction.guild.id)

        const ifsettings = await GuildModel.findOne({id: interaction.guild.id})

        if (!ifsettings) {
            sendStatusLog("Pas de paramètres dans la base de données. Le bot va enregistrer pour ce serveur les paramètres par défaut.")
            const defaultsettings = new GuildModel({id: interaction.guild.id})
            await defaultsettings.save()
        }

        sendStatusLog(`Fonction interactionCreate : Une commande slash : ${commandName} a été effectuée sur le serveur : ${guildname} par l'utilisateur : ${username}.`)

        if (commandName === 'ping') {
            await interaction.reply("Calcul du temps de latence en cours...")
            let msgping = Math.abs(Date.now() - interaction.createdTimestamp);
            let apiping = client.ws.ping
            interaction.editReply(`**⏲️ Résultats du ping :**\nTemps de latence calculée : ${msgping} ms\nTemps de latence API : ${apiping} ms`)
            sendStatusLog(`Résultats du ping :\nTemps de latence calculée : ${msgping} ms\nTemps de latence API : ${apiping} ms`)

            //await interaction.reply('Pong ! OnO');
        } else if (commandName === 'embed') {
            //console.log(interaction)
            //let Attachment = Array.from(interaction.attachments.values())

            let desc = options.getString('description')
            let title = options.getString('titre')

            let embedMessage = new Discord.MessageEmbed()
                .setDescription(desc)
                .setColor(values.settings.embedColor)

            if (title) {
                embedMessage.setTitle(title)
            }
            /*
            if (Attachment.length >= 1) {
                embedMessage.setImage(Attachment[0].url)
            }
            */
            await interaction.reply({ embeds: [embedMessage] })

        } else if (commandName === 'user') {
            await interaction.reply('User info.');
        } else if (commandName === 'test') {
            await interaction.reply("Ca marche ! UwU")
        } else if (commandName === 'sendmessage') {
            let contentsent = options.getString("texte")
            await interaction.reply(contentsent)
        } else if (commandName == 'help') {
            sendHelp(interaction, true)
        } else if (commandName == 'error') {
            await interaction.reply("OnO")
        } else if (commandName == 'play') {
            //const { options } = interaction
            //const serverQueue = queue.get(interaction.guild.id)
            //const guild = client.guilds.cache.get(interaction.guild.id);
            //const voiceChannel = interaction.member.voice.channel;
            //const member = guild.members.cache.get(interaction.user.id);
            const cmd = "z!play"
            //const author = interaction.user

            //console.log(options)

            if (connection) {
                sendStatusLog("Le bot est en train d'enregistrer un salon vocal actuellement dans le serveur demandé. Il est donc impossible d'utiliser la fonctionnalité musicale.")
                return interaction.reply("Le bot est en train d'enregistrer un salon vocal actuellement dans ce serveur. Il est donc impossible d'utiliser la fonctionnalité musicale.")
            }

            let args = options.getString("argument")

            //console.log(args)

            await interaction.deferReply()
            execute(interaction, serverQueue, voiceChannel, true, member, args, author)


        } else if (commandName === 'stop') {
            await interaction.deferReply()
            stop(interaction, serverQueue, author, true)
        } else if (commandName === 'skip') {
            await interaction.deferReply()
            skip(interaction, serverQueue, author, true, false)
        } else if (commandName === 'loop') {
            await interaction.deferReply()
            loop(interaction, serverQueue, author, true)
        } else if (commandName === 'queue') {
            await interaction.deferReply()
            showQueue(interaction, serverQueue, author, true)
        } else if (commandName === 'pause') {
            await interaction.deferReply()
            pauseMusic(interaction, serverQueue, author, true)
        } else if (commandName === 'resume') {
            await interaction.deferReply()
            resumeMusic(interaction, serverQueue, author, true)
        } else if (commandName === 'np') {
            await interaction.deferReply()
            whatsplaying(interaction, serverQueue, author, true)
        } else if (commandName === 'volume') {
            await interaction.deferReply()
            let args = options.getInteger("argument")
            setVolume(interaction, serverQueue, author, args, true)
        } else if (commandName === 'qp') {

            if (connection) {
                sendStatusLog("Le bot est en train d'enregistrer un salon vocal actuellement dans le serveur demandé. Il est donc impossible d'utiliser la fonctionnalité musicale.")
                return interaction.reply("Le bot est en train d'enregistrer un salon vocal actuellement dans ce serveur. Il est donc impossible d'utiliser la fonctionnalité musicale.")
            }

            let args = options.getString("argument")

            await interaction.deferReply()

            ytsearch(interaction, serverQueue, voiceChannel, true, member, args, author, true)
        } else if (commandName === 'ytconvert') {
            let args = options.getString("argument")

            await interaction.deferReply()

            convertyoutubetomp3.convertfile(interaction, args, true)

        } else if (commandName === 'about') {
            about(interaction, true)
        } else if (commandName === 'changelog') {
            debugNewAboutMessage(interaction, true)
        } else if (commandName === 'botusage') {
            botusage(interaction, true, client, queue)
        } else if (commandName === 'credits') {
            informations(interaction, true)
        } else if (commandName === 'infos') {
            musicbotfuture(interaction, true)
        } else if (commandName === 'hello') {
            if (interaction.options.getSubcommand() === "random") {
                hellorandom(interaction)
            } else if (interaction.options.getSubcommand() === "member") {
                let arg = interaction.options.getUser("membre")
                hellomember(interaction, arg)
            }
        } else if (commandName === 'attack') {
            if (interaction.options.getSubcommand() === "random") {
                attackrandom(interaction)
            } else if (interaction.options.getSubcommand() === "member") {
                let arg = interaction.options.getUser("membre")
                attackmember(interaction, arg)
            }
        } else if (commandName === 'dance') {
            if (interaction.options.getSubcommand() === "random") {
                dancerandom(interaction)
            } else if (interaction.options.getSubcommand() === "member") {
                let arg = interaction.options.getUser("membre")
                dancemember(interaction, arg)
            } 
        } else if (commandName === 'hug') {
            if (interaction.options.getSubcommand() === "random") {
                hugrandom(interaction)
            } else if (interaction.options.getSubcommand() === "member") {
                let arg = interaction.options.getUser("membre")
                hugmember(interaction, arg)
            }
        } else if (commandName === 'chewie') {
            if (interaction.options.getSubcommand() === "random") {
                cordularandom(interaction)
            } else if (interaction.options.getSubcommand() === "member") {
                let arg = interaction.options.getUser("membre")
                cordulamember(interaction, arg)
            }
        } else if (commandName === 'wala') {
            if (interaction.options.getSubcommand() === "random") {
                walarandom(interaction)
            } else if (interaction.options.getSubcommand() === "member") {
                let arg = interaction.options.getUser("membre")
                walamember(interaction, arg)
            }
        } else if (commandName === 'mtm') {
            if (interaction.options.getSubcommand() === "random") {
                mtmrandom(interaction)
            } else if (interaction.options.getSubcommand() === "member") {
                let arg = interaction.options.getUser("membre")
                mtmmember(interaction, arg)
            }
        } else if (commandName === 'zemmour') {
            if (interaction.options.getSubcommand() === "random") {
                zemmourrandom(interaction)
            } else if (interaction.options.getSubcommand() === "member") {
                let arg = interaction.options.getUser("membre")
                zemmourmember(interaction, arg)
            }
        } else if (commandName === 'nice') {
            if (interaction.options.getSubcommand() === "random") {
                nicerandom(interaction)
            } else if (interaction.options.getSubcommand() === "member") {
                let arg = interaction.options.getUser("membre")
                nicemember(interaction, arg)
            }
        } else if (commandName === 'bogossitude') {
            if (interaction.options.getSubcommand() === "random") {
                bogossituderandom(interaction)
            } else if (interaction.options.getSubcommand() === "member") {
                let arg = interaction.options.getUser("membre")
                bogossitudemember(interaction, arg)
            }
        } else if (commandName === 'tts') {
            if (connection) {
                sendStatusLog("Le bot est en train d'enregistrer un salon vocal actuellement dans le serveur demandé. Il est donc impossible d'utiliser la fonctionnalité Text-to-Speech.")
                return interaction.reply("Le bot est en train d'enregistrer un salon vocal actuellement dans ce serveur. Il est donc impossible d'utiliser la fonctionnalité Text-to-Speech.")
            }

            let args = options.getString("texte")

            await interaction.deferReply()
            execute(interaction, serverQueue, voiceChannel, true, member, args, author, true)
        } else if (commandName === "settings") {
            if (interaction.options.getSubcommandGroup() === "simplifiedmenu") {
                //console.log("ca a deteckté")
                if (interaction.options.getSubcommand() === "activate") {
                    await GuildModel.findOneAndUpdate({id : interaction.guild.id}, { $set: { SimplifiedMusicMenus: "true"}})
                    interaction.reply({content: "Le menu de commande musicale simplifié (avec des icônes à la place du texte) est activé.", files: [{attachment: "./cmd/assets/music_menu_styles/newstyle.png", name: "newstyle.png"}]})
                    //console.log("ca marche c activé")
                } else {
                    await GuildModel.findOneAndUpdate({id : interaction.guild.id}, { $set: { SimplifiedMusicMenus: "false"}})
                    interaction.reply({content: "Le menu de commande musicale simplifié (avec des icônes à la place du texte) est désactivé.", files: [{attachment: "./cmd/assets/music_menu_styles/oldstyle.png", name: "oldstyle.png"}]})
                    //console.log("ca marche c pa active")
                }
            }
        } else if (commandName === 'sartek') {
            if (interaction.options.getSubcommand() === "random") {
                await interaction.deferReply()
                sartekrandom(interaction)
            } else if (interaction.options.getSubcommand() === "member") {
                await interaction.deferReply()
                let arg = interaction.options.getUser("membre")
                sartekmember(interaction, arg)
            }
        }
    }
});

//à chaque message envoyé (fonction d'analyse des messages avec préfixe z!)
client.on("messageCreate", async message => {

    if (message.author.bot) {
        return;
    }

    boteasteregg(message)

    if (!message.content.startsWith("z!") && message.guild) {
        return;
    }

    if (!message.guild) {
        let cmd = message.content.split(" ");
        sendStatusLog(`${values.generalText.GeneralLogsMsg.PrivateMsgLogs.msgget} ${message.author.username}#${message.author.discriminator}.`)
        switch (cmd[0]) {
            case values.PrivateMsgCmdList.help:
                sendStatusLog(`${values.PrivateMsgCmdList.help} : ${values.generalText.GeneralLogsMsg.PrivateMsgLogs.cmdget} ${message.author.username}#${message.author.discriminator}.`)
                return mphelp(message);
                break;
            case values.PrivateMsgCmdList.sendcomments:
                sendStatusLog(`${values.PrivateMsgCmdList.sendcomments} : ${values.generalText.GeneralLogsMsg.PrivateMsgLogs.cmdget} ${message.author.username}#${message.author.discriminator}. ${values.generalText.GeneralLogsMsg.PrivateMsgLogs.contentSent}`)
                return sendCommentsToDev(message, client, Discord);
                break;
            case values.PrivateMsgCmdList.sendfiles:
                sendStatusLog(`${values.PrivateMsgCmdList.sendfiles} : ${values.generalText.GeneralLogsMsg.PrivateMsgLogs.cmdget} ${message.author.username}#${message.author.discriminator}. ${values.generalText.GeneralLogsMsg.PrivateMsgLogs.contentSent}`)

                if (message.author.id != values.properties.userID) {
                    sendWarnLog(values.PrivateMsgCmdList.sendfiles + " : " + values.generalText.featureTestMsg.debug_featureTestBlockedMessage + message.author.username + "#" + message.author.discriminator)
                    return message.channel.send(values.generalText.featureTestMsg.featureTestDisabledMessage)
                }

                return debugsendFile(message, client, Discord).catch((err) => {
                    if (err.code == "500") {
                        sendErrorLog(values.generalText.ErrorMsg.logs.d_sendfiles_errorwhilesendingfiles, err);
                        client.users.cache.get(values.properties.userID).send("\`z!d_sendfiles\` : Une erreur est survenue pendant l'envoi des fichiers. Une annulation s'est produite.")
                        return message.reply(values.generalText.ErrorMsg.userend.d_sendfiles_errorwhilesendingfiles);
                    }
                })
                break;
            default:
                sendMPToDev(Discord, client, message)
                return message.reply("Coucou, je suis Zbeub Bot ! Tu peux m'appeler Pikachu si tu veux hihi UwU ! Tu viens de m'envoyer un message n'est ce pas ? Tu viens donc de découvrir un easter egg ! Félicitations ! :) OwO")
                break;
        }
    }

    let username = message.author.tag
    let guildname = message.guild.name
    const author = message.author
    let cmd = message.content.split(" ");
    const serverQueue = queue.get(message.guild.id);
    const ttsserverQueue = queue.get(message.guild.id)
    const guild = client.guilds.cache.get(message.guild.id);
    const voiceChannel = message.member.voice.channel;
    const member = guild.members.cache.get(message.author.id);
    let args = message.content.substr(cmd[0].length + 1)
    let findargument = message.content.substr(cmd[0].length + 1);
    let connection = client.voiceManager.get(message.channel.guild.id)

    sendCmdLog(cmd[0], guildname, username)
    message.channel.sendTyping()

    const ifsettings = await GuildModel.findOne({id: message.guild.id})

    if (!ifsettings) {
        sendStatusLog("Pas de paramètres dans la base de données. Le bot va enregistrer pour ce serveur les paramètres par défaut.")
        const defaultsettings = new GuildModel({id: message.guild.id})
        await defaultsettings.save()
    }

    //console.log(ifsettings.SimplifiedMusicMenus)

    switch (cmd[0]) {
        case values.CmdList.InfoCmds.help:
            //message.channel.send("Coucou, tu as besoin d'aide ?");
            sendHelp(message, false);
            break;
        case values.CmdList.InfoCmds.about:
            about(message, false);
            break;
        case values.CmdList.SocialCmds.error:
            error(message);
            break;
        case values.CmdList.SocialCmds.hello:
            hello(message);
            break;
        case values.CmdList.SocialCmds.hug:
            hug(message);
            break;
        case values.CmdList.SocialCmds.attack:
            attack(message);
            break;
        case values.CmdList.SocialCmds.dance:
            dance(message);
            break;
        case values.CmdList.MusicCmds.play:
            //const cmdd = "z!play"
            //const guild = client.guilds.cache.get(message.guild.id);
            //const voiceChannel = message.member.voice.channel;
            //const member = guild.members.cache.get(message.author.id);


            //let args = message.content.substr(cmd[0].length + 1)

            //let findargument = message.content.substr(values.CmdList.MusicCmds.play.length + 1);

            if (musicFeatureState == false) {
                return MusicFeatureDisabled(message);
            }

            if (!findargument) {
                return MusicStateEmbed(message, author, false, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_noargumentprovided, serverQueue)
            }

            if (connection) {
                sendStatusLog("Le bot est en train d'enregistrer un salon vocal actuellement dans le serveur demandé. Il est donc impossible d'utiliser la fonctionnalité musicale.")
                return message.channel.send("Le bot est en train d'enregistrer un salon vocal actuellement dans ce serveur. Il est donc impossible d'utiliser la fonctionnalité musicale.")
            }

            execute(message, serverQueue, voiceChannel, false, member, args, author).catch(error => {
                sendWarnLog(error.message)

                if (error.code == "410") {
                    sendStatusLog(values.generalText.ErrorMsg.logs.music_servererror)
                    return message.channel.send(values.generalText.ErrorMsg.userend.music_servererror)
                }

                if (error.message == "Video unavailable") {
                    sendErrorLog("z!play : Le lien YouTube est inexistant.", error);
                    return MusicStateEmbed(message, author, false, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_linkbroken, serverQueue)
                } else {
                    sendErrorLog("z!play : Une erreur inconnue est survenue.", error);
                    sendErrorToDev(Discord, client, error, values.CmdList.MusicCmds.play)
                    return message.channel.send(values.generalText.ErrorMsg.userend.music_erroroccuredwhileyoutubelink)
                }
            })
            break;
        case values.CmdList.MusicCmds.skip:
            if (musicFeatureState == false) {
                return MusicFeatureDisabled(message);
            }

            skip(message, serverQueue, author, false, false);
            break;
        case values.CmdList.MusicCmds.stop:
            if (musicFeatureState == false) {
                return MusicFeatureDisabled(message);
            }

            stop(message, serverQueue, author);
            break;
        case values.CmdList.MusicCmds.loop:
            sendCmdLog(values.CmdList.MusicCmds.loop, guildname, username);

            if (musicFeatureState == false) {
                return MusicFeatureDisabled(message);
            }

            loop(message, serverQueue, author);
            break;
        case values.CmdList.DebugCmds.debug:
            message.channel.send()
            break;
        case values.CmdList.MusicCmds.queue:
            if (musicFeatureState == false) {
                return MusicFeatureDisabled(message);
            }

            showQueue(message, serverQueue, author);
            break;
        case values.CmdList.MusicCmds.pause:
            if (musicFeatureState == false) {
                return MusicFeatureDisabled(message);
            }

            pauseMusic(message, serverQueue, author);
            break;
        case values.CmdList.MusicCmds.resume:
            if (musicFeatureState == false) {
                return MusicFeatureDisabled(message);
            }

            resumeMusic(message, serverQueue, author);
            break;
        case values.CmdList.MusicCmds.np:
            if (musicFeatureState == false) {
                return MusicFeatureDisabled(message);
            }

            whatsplaying(message, serverQueue, author);
            break;
        case values.CmdList.InstallCmds.installslashcommands:
            sendStatusLog(values.generalText.GeneralLogsMsg.InstallSlashCmd.InstallCmdMsg);
            sendStatusLog(`Guild ID du serveur demandé : ${message.guild.id}`);

            if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                sendWarnLog(values.generalText.GeneralLogsMsg.InstallSlashCmd.UserNotAdmin);
                return message.channel.send(values.generalText.GeneralUserMsg.InstallSlashCmd_notenoughpermission)
            }

            installslash(message, client);
            break;
        case values.CmdList.MusicCmds.qp:
            //const guild = client.guilds.cache.get(message.guild.id);
            //const voiceChannel = message.member.voice.channel;
            //const member = guild.members.cache.get(message.author.id);

            //let args = message.content.substr(cmd[0].length + 1)

            //let findargument = message.content.substr(values.CmdList.MusicCmds.qp.length + 1);
            
            if (musicFeatureState == false) {
                return MusicFeatureDisabled(message);
            }

            if (!findargument) {
                return MusicStateEmbed(message, author, false, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_noargumentprovided, serverQueue)
            }

            if (connection) {
                sendStatusLog("Le bot est en train d'enregistrer un salon vocal actuellement dans le serveur demandé. Il est donc impossible d'utiliser la fonctionnalité musicale.")
                return message.channel.send("Le bot est en train d'enregistrer un salon vocal actuellement dans ce serveur. Il est donc impossible d'utiliser la fonctionnalité musicale.")
            }

            ytsearch(message, serverQueue, voiceChannel, false, member, args, author, true);
            break;
        case values.CmdList.InfoCmds.credits:
            informations(message);
            break;
        case values.CmdList.InfoCmds.music_bots_infos:
            musicbotfuture(message);
            break;
        case values.CmdList.FeaturesTesting.showInfoAboutMember:
            debugshowInfoAboutMember(message, client, Discord);
            break;
        case values.CmdList.FeaturesTesting.changelog:
            debugNewAboutMessage(message, false);
            break;
        case values.CmdList.SocialCmds.cordula:
            cordula(message);
            break;
        case values.CmdList.DebugCmds.deployslashcmd:
            if (message.author.id == values.properties.userID) {
                message.channel.send("Déploiement des commandes slash en cours...")
                debugdeployslash(client, message)
                return;
            } else {
                sendStatusLog("L'utilisateur n'est pas le développeur.")
                message.channel.send(`Seul le développeur ${client.users.cache.get(values.properties.userID).toString()} peut utiliser cette commande.`)
                return;
            }
            break;
        case values.CmdList.DebugCmds.botusage:
            botusage(message, false, client, queue);
            break;
        case values.CmdList.MemberInfoCmds.membercard:
            if (platform == "linux") {
                canvasgenerator(message)
            } else {
                return message.channel.send("La plateforme actuelle qui fait tourner le bot est Windows (ou une autre plateforme autre qu'un système Linux). Cette fonctionnalité est désactivée.")
            }
            break;
        case values.CmdList.SocialCmds.mtm:
            mtm(message);
            break;
        case values.CmdList.SocialCmds.wala:
            wala(message);
            break;
        case values.CmdList.DebugCmds.generatebotinvite:
            break;
        case values.CmdList.SocialCmds.zemmour:
            zemmour(message);
            break;
        case "z!setchanceto": 
            setChanceTo(message);
            break;
        case "z!testing":
            //debugtest(erruerdbfvdjfvbejfgesjb)
            if (values.properties.userID == message.author.id) {
                message.channel.send()
            }
            message.channel.send("pas touche à ma commande secrète !!! OnO")
            break;
        case "z!sendlog": 
            sendLogToDev(message);
            break;
        case "z!ytconvert":
            convertyoutubetomp3.convertfile(message, args, false)
            break;
        case "z!nice":
            nice(message);
            break;
        case "z!bogossitude":
            bogossitude(message)
            break;
        case "z!deleteslashcommands":
            deleteslash(message)
            break;
        case "z!ping":
            message.channel.send("Calcul du temps de latence en cours...").then(async (msg) => {
                let msgping = msg.createdTimestamp - message.createdTimestamp
                let apiping = client.ws.ping
                msg.edit(`**⏲️ Résultats du ping :**\nTemps de latence calculée : ${msgping} ms\nTemps de latence API : ${apiping} ms`)
                sendStatusLog(`Résultats du ping :\nTemps de latence calculée : ${msgping} ms\nTemps de latence API : ${apiping} ms`)
            })
            break;
        case "z!killprocess":

            if (message.author.id !== "456117123283157002") {
                sendWarnLog("L'utilisateur n'est pas le développeur.")
                return;
            }

            sendWarnLog("Le bot va être arrêté.")
            message.channel.send("Le bot va être arrêté.")
            stopbot();
            break;
        case "z!crash":
            if (message.author.id == values.properties.userID) {
                throw new Error("Le développeur a initié manuellement le plantage.")
                return;
            } else {
                sendStatusLog("L'utilisateur n'est pas le développeur.")
                message.channel.send(`Seul le développeur ${client.users.cache.get(values.properties.userID).toString()} peut utiliser cette commande.`)
                return;
            }
            break;
        //case "z!sendresult":
        //    sendfileto(message)
        //    break;
        case "z!record":

            if (serverQueue) {
                sendStatusLog("Impossible de lancer un enregistrement, la fonctionnalité musicale est en cours d'utilisation.")
                return message.channel.send("Impossible de lancer un enregistrement, des musiques sont jouées dans un salon vocal.")
            }

            testrecordaudio(message, client);
            break;
        case "z!volume":
            if (musicFeatureState == false) {
                return MusicFeatureDisabled(message);
            }

            setVolume(message, serverQueue, author, args, false)
            break;
        case "z!newhelp":
            sendHelp(message, false)
            break;
        case "z!createinvite":
            invite = await message.channel.createInvite();
            sendStatusLog(`Lien d'invitation générée pour le serveur : ${message.guild.name}, lien : ${invite.url}`)
            message.channel.send(`Voici votre lien d'invitation : ${invite.url}`)
            break;
        case "z!getallserverinvites":
            /*
            client.guilds.cache.forEach(async server => {
                const firstchannel = server.channels.cache.first()
                console.log(firstchannel)
                const serverinvite = await firstchannel.createInvite()
                message.channel.send(serverinvite.url)
            })
            */
            if (message.author.id !== "456117123283157002") {
                message.channel.send("Seul le développeur peut utiliser cette commande.")
            }
            client.guilds.cache.forEach(async guild => {
                await guild.channels.cache.filter(x => x.type = "text").random().createInvite()
                  .then(inv => message.channel.send(`Nom du serveur : ${guild.name}\nLien : ${inv.url}`));
              });

            break;
            case "z!restartbot":
                if (message.author.id != "456117123283157002") {

                    return message.channel.send("Seul le développeur peut utiliser cette commande.")
                }
                restartbot.sendConfirmationMsg(message, queue)
                break;
            case "z!tts":
                if (connection) {
                    sendStatusLog("Le bot est en train d'enregistrer un salon vocal actuellement dans le serveur demandé. Il est donc impossible d'utiliser la fonctionnalité Text-to-Speech.")
                    return message.channel.send("Le bot est en train d'enregistrer un salon vocal actuellement dans ce serveur. Il est donc impossible d'utiliser la fonctionnalité Text-to-Speech.")
                }
                execute(message, serverQueue, voiceChannel, false, member, args, author, true)
                break;
            case "z!sendtestmail":
                if (message.author.id != "456117123283157002") {
                    return message.channel.send("Seul le développeur peut utiliser cette commande.")
                }
                //sendMail("Mail de test", "Ceci est un mail de test.")
                sendMail("Le bot s'est fait ratelimité.", "Je suis ratelimité ! Aide-moi stp 🥺🥺🥺 !")
                break;
            case "z!sartek":
                sartek(message) 
                break;
        default:
            message.channel.send("Cette commande n'existe pas ! ^^ \nVérifie si tu ne t'ai pas trompé en l'écrivant ou tape la commande \`z!help\` pour voir la liste des commandes !")
            sendStatusLog("La commande saisi par l'utilisateur n'existe pas.")
            break;
    }

});

async function stopbot() {
    try {
        await client.users.cache.get(values.properties.userID).send({
            content: "Le bot s'est arrêté avec succès.",
            files: [logfilepath]
        }).then(() => {
            sendWarnLog("Les logs sont envoyés. Le bot va s'arrêter.")
            process.exit(0)
        }).catch((err) => {
            sendErrorLog("Une erreur d'envoi des logs s'est produite.", err)
            process.exit(0)
        })
    } catch (err) {
        sendErrorLog("Impossible d'envoyer les logs. Le bot va s'arrêter.", err)
        process.exit(0)
    }
}

async function sendfileto(message) {
    await message.channel.send({content: "Fichier : ", files: [`./testing/output/output_${message.author.id}.mp3`]})
    return;
}

const embedExecute = new Discord.MessageEmbed()

async function execute(message, serverQueue, voiceChannel, ifSlash, member, argument, author, iftts) {

    //message.channel.send()

    let arg = argument

    const serversettings = await GuildModel.findOne({id: message.guild.id})
    console.log(serversettings.MusicVolume)

    /*
    if (serverQueue && serverQueue.mode == "livestream") {
        if (ifSlash === true) {
            return await message.editReply({ content: "Impossible d'ajouter la musique ou le texte TTS, une vidéo en direct est en cours de lecture. Arrêtez d'abord la musique avec `z!stop` ou `/stop` puis réessayez."})
        } else {
            return await message.channel.send({ content: "Impossible d'ajouter la musique ou le texte TTS, une vidéo en direct est en cours de lecture. Arrêtez d'abord la musique avec `z!stop` ou `/stop` puis réessayez."});
        }
    }
    */

    if (!serversettings) {
        sendStatusLog("Aucun paramètres sont associés à ce serveur, la commande ne peut pas continuer.")
        if (ifSlash) {
            return message.editReply("Le bot n'a pas de paramètres associés à ce serveur. Faites une commande slash ou une commande chat pour que le bot initialise les paramètres.")
        } else {
            return message.channel.send("Le bot n'a pas de paramètres associés à ce serveur. Faites une commande slash ou une commande chat pour que le bot initialise les paramètres.")
        }
    }
    
    if (!voiceChannel) // Si l'utilisateur n'est pas dans un salon vocal
    {
        embedExecute.setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
        embedExecute.setTitle(values.generalText.ErrorMsg.userend.music_oups)
        embedExecute.setDescription(values.generalText.ErrorMsg.userend.music_notinvocal)
        embedExecute.setAuthor({name: `${author.username}#${author.discriminator}`, iconURL:`${author.displayAvatarURL()}`})
        embedExecute.setColor(values.settings.embedColor)
        sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.ErrorMsg.logs.music_notinvocal);
        if (ifSlash === true) {
            return await message.editReply({ embeds: [embedExecute] });
        } else {
            return await message.channel.send({ embeds: [embedExecute] });
        }
    }

    const permissions = voiceChannel.permissionsFor(member.client.user); // On récupère les permissions du bot pour le salon vocal
    if (!permissions.has(Discord.Permissions.FLAGS.CONNECT) || !permissions.has(Discord.Permissions.FLAGS.SPEAK)) { // Si le bot n'a pas les permissions
        embedExecute.setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
        embedExecute.setTitle(values.generalText.ErrorMsg.userend.music_oups)
        embedExecute.setDescription(values.generalText.ErrorMsg.userend.music_missingauthorisation)
        embedExecute.setAuthor({name: `${author.username}#${author.discriminator}`, iconURL:`${author.displayAvatarURL()}`})
        embedExecute.setColor(values.settings.embedColor)
        sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.ErrorMsg.logs.music_missingauthorisation);
        if (ifSlash === true) {
            return await message.editReply({ embeds: [embedExecute] });
        } else {
            return await message.channel.send({ embeds: [embedExecute] });
        }
    }

    if (voiceChannel.type === 'GUILD_STAGE_VOICE') {
        sendStatusLog("Le salon vocal est un salon vocal STAGE.")

        if (!permissions.has(Discord.Permissions.FLAGS.REQUEST_TO_SPEAK)) {
            if (ifSlash === true) {
                return await message.editReply("L'autorisation permettant la prise de parole est manquante.");
            } else {
                return await message.channel.send("L'autorisation permettant la prise de parole est manquante.");
            }

        }

        if (ifSlash === false) {
            if (!serverQueue) return message.channel.send(`Pour utiliser ${client.user.toString()} dans un salon de conférence, il faut utiliser en premier la commande slash \`/play\` ou sélectionner un résultat de recherche pour permettre au bot de se connecter correctement au salon de conférence. Puis pour ajouter des musiques, les deux commandes (\`z!play\` et \`/play\`) peuvent être utilisées.`)
        }
    }

    if (!iftts) {
        let validate = await ytdl.validateURL(arg);

        if (!validate) {
            sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.GeneralLogsMsg.musicLogs.music_usesearchinstead);
            if (ifSlash === true) {
                return ytsearch(message, serverQueue, voiceChannel, true, member, arg, author, false);
            } else {
                return ytsearch(message, serverQueue, voiceChannel, false, member, arg, author, false);
            }
        }
    } else {
        if (!arg) {
            if (ifSlash === true) {
                return message.editReply("Vous n'avez pas mis de texte après la commande. La commande ne peut pas continuer.")
            } else {
                return message.channel.send("Vous n'avez pas mis de texte après la commande. La commande ne peut pas continuer.");
            }
        }

        if (arg.length >= 100) {
            if (ifSlash === true) {
                return message.editReply("Le texte est trop long, réduisez votre texte.")
            } else {
                return message.channel.send("Le texte est trop long, réduisez votre texte.");
            }
        }
    }

    sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.GeneralLogsMsg.musicLogs.music_youtubemetadataget);

    try {
        if (!iftts) {
            var songInfo = await ytdl.getInfo(arg);
            //var basicsongInfo = await ytdl.getBasicInfo(arg)
            //console.log(basicsongInfo)
        }
        //console.log(songInfo)
    } catch (err) {
        if (ifSlash) {
            message.editReply("La musique n'a pas pu être ajoutée car la vidéo est peut-être soumise à une limite d'âge. Désolé !")
        } else {
            message.channel.send("La musique n'a pas pu être ajoutée car la vidéo est peut-être soumise à une limite d'âge. Désolé !")
        }
        return sendErrorLog("La vidéo suivante n'a pas pu être ajoutée. La vidéo est peut-être soumise à une limite d'âge.", err)
    }
    //var songInfo = await ytdl.getInfo(arg);

    if (iftts) {
        var song = {
            tts: true,
            title: "Texte TTS de " + author.username,
            url: "Service Text-to-Speech",
            author: author.username + "#" + author.discriminator,
            thumbnail: author.displayAvatarURL(),
            time: 0,
            likes: "N/A", //songInfo.videoDetails.likes,
            views: "N/A",
            addedby: author.username + "#" + author.discriminator,
            pdp: author.displayAvatarURL(),
            beginplaytimestamp: null,
            texttospeech: arg,
            iflivestream: "tts",
            formats: null
        };
    } else {
        var song = {
            tts: false,
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            author: songInfo.videoDetails.author.name,
            thumbnail: songInfo.videoDetails.thumbnails[0].url,
            time: songInfo.videoDetails.lengthSeconds,
            likes: "N/A", //songInfo.videoDetails.likes,
            views: songInfo.videoDetails.viewCount,
            addedby: author.username + "#" + author.discriminator,
            pdp: author.displayAvatarURL(),
            beginplaytimestamp: null,
            iflivestream: songInfo.videoDetails.isLiveContent,
            formats: songInfo.formats
        };
    }

    switch (song.iflivestream) {
        case true:
            song.mode = "livestream"
            break;
        case false:
            song.mode = "video"
            break;
        case "tts":
            song.mode = "tts"
            break;
    }

    switch (song.mode) {
        case "video":
            sendStatusLog("Le contenu ajouté est une vidéo.")
            break;
        case "livestream":
            sendStatusLog("Le contenu ajouté est une vidéo en direct.")
            break;
        case "tts":
            sendStatusLog("Le contenu ajouté est un texte Text-to-Speech.")
            break;
    }


    //console.log(songInfo)

    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: serversettings.MusicVolume,
            playing: true,
            loop: false,
            Button: false,
            firstmusicpassed: false,
            firstmessage: message
        };

        sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.GeneralLogsMsg.musicLogs.music_addtoplaylistmsg);
        // On ajoute la queue du serveur dans la queue globale:
        queue.set(member.guild.id, queueConstruct);
        // On y ajoute la musique
        queueConstruct.songs.push(song);
        sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.GeneralLogsMsg.musicLogs.music_joinvocal);
        try {
            // On connecte le bot au salon vocal et on sauvegarde l'objet connection

            //const player = Music.createAudioPlayer();
            //const ressource = Music.createAudioResource(stream);

            var connection = await Music.joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.channel.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            });

            //console.log(connection)

            if (ifSlash === true) {
                if (iftts) {
                    await message.editReply(`Le texte TTS de \`${song.addedby}\` va être joué.`)
                } else {
                    await message.editReply("La musique a été ajoutée. La lecture peut commencer.")
                }
            } else {
                if (iftts) {
                    await message.react("🔊")
                }
            }

            queueConstruct.connection = connection;

            // On lance la musique
            sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.GeneralLogsMsg.musicLogs.music_youtubesucess);

            sleep(700);

            play(member.guild, queueConstruct.songs[0], false);

            if (ifSlash === true) {
                if (voiceChannel.type === 'GUILD_STAGE_VOICE') {
                    //console.log("Le salon vocal est un salon vocal STAGE.")
                    sendStatusLog("Fonction execute : Le bot prend la parole.")
                    //console.log(message.guild.me.voice)
                    await message.guild.me.voice.setSuppressed(false)
                }
            }

        }
        catch (err) {
            //On affiche les messages d'erreur si le bot ne réussi pas à se connecter, on supprime également la queue de lecture
            sendErrorLog(values.CmdList.MusicCmds.play + " : " + values.generalText.ErrorMsg.logs.music_failjoinvocal, err);
            queue.delete(member.guild.id);
            sendErrorToDev(Discord, client, err, "execute");
            return message.channel.send(err);
        }
    }
    else {
        serverQueue.Button = false;

        serverQueue.songs.push(song);
        sendStatusLog(values.generalText.GeneralLogsMsg.musicLogs.music_linkadded);
        sendStatusLog(`z!play : Titre : ${song.title}`);
        sendStatusLog(`z!play : URL : ${song.url}`);

        let embedAddPlaylist = new Discord.MessageEmbed()
            .setAuthor({name: "Ajoutée par : " + song.addedby, iconURL:song.pdp})
            .setThumbnail(song.thumbnail)
            .setColor(values.settings.embedColor)
            .addFields(
                { name: 'Titre', value: song.title })
            .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl});
        

        let row = new Discord.MessageActionRow() 
            .addComponents(
                new Discord.MessageButton()
                    .setStyle('SECONDARY')
                    .setLabel("Afficher les détails de la musique en cours")
                    .setCustomId("whatsplaying")
        )

        if (ifSlash === true) {
            return await message.editReply({ embeds: [embedAddPlaylist], content: "La musique a été ajoutée." , components: [row]})
        } else {
            return await message.channel.send({ embeds: [embedAddPlaylist], components: [row]});
        }
    }
}

async function setVolume(message, serverQueue, author, arg, ifSlash) {

    if (!message.member.voice.channel) {
        sendFunctionLog(values.CmdList.MusicCmds.np, values.generalText.ErrorMsg.logs.music_notinvocal)
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_notinvocal);
    }

    //let arg = message.content.split(" ")[1];

    if (!arg || isNaN(arg)) {
        sendStatusLog("Pas d'arguments valides saisis.")
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, "Il n'y a pas d'argument valide après la commande. Mettez un nombre entre `0` et `200`.  \n\n**ATTENTION !!! : Il est FORTEMENT déconseillé de régler le volume au delà de 100% ! Cela peut nuire à votre audition à long terme si vous écoutez de la musique à un volume très élevé !**", serverQueue)
    }

    if (arg < 0 || arg > 200) {
        sendStatusLog("La valeur n'est pas comprise entre 0 et 200.")
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, "La valeur entrée n'est pas entre `0` et `200`. Mettez un nombre entre `0` et `200`. \n\n**ATTENTION !!! : Il est FORTEMENT déconseillé de régler le volume au delà de 100% ! Cela peut nuire à votre audition à long terme si vous écoutez de la musique à un volume très élevé !**", serverQueue)
    }

    await GuildModel.findOneAndUpdate({id : message.guild.id}, { $set: { MusicVolume: arg / 100}})

    sendStatusLog(`Le volume est réglé sur \`${arg}%\`.`)

    let finalmessage = `Le volume est réglé sur ${arg}%.`
    
    if (arg > 100) {
        finalmessage = finalmessage + `\n\n**AVERTISSEMENT : Le volume actuel peut nuire à votre audition à long terme si vous écoutez de la musique sur une grande période de temps !**`
    }

    let row = new Discord.MessageActionRow() 
    .addComponents(
        new Discord.MessageButton()
            .setStyle('SECONDARY')
            .setLabel("Afficher les détails de la musique en cours")
            .setCustomId("whatsplaying")
    );

    let rowdisabled = new Discord.MessageActionRow() 
    .addComponents(
        new Discord.MessageButton()
            .setStyle('SECONDARY')
            .setLabel("Afficher les détails de la musique en cours")
            .setCustomId("whatsplaying")
            .setDisabled(true)
    );

    let embedMusicState = new Discord.MessageEmbed()
    .setAuthor({name: `${author.username}#${author.discriminator}`, iconURL:`${author.displayAvatarURL()}`})
    .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
    .setColor(values.settings.embedColor)
    .setTitle("Réglage du volume")
    .setDescription(finalmessage)

    if (serverQueue) {
        serverQueue.volume = arg / 100
        serverQueue.audioResource.volume.setVolume(arg / 100)

            if (ifSlash) {
                return message.editReply({embeds: [embedMusicState], components: [row]})
            } else {
                return message.channel.send({embeds: [embedMusicState], components: [row]})
            }

    } else {
        if (ifSlash) {
            return message.editReply({embeds: [embedMusicState], components: [rowdisabled]})
        } else {
            return message.channel.send({embeds: [embedMusicState], components: [rowdisabled]})
        }
    }

}


async function skip(message, serverQueue, author, ifSlash, ifButton) {
    if (!message.member.voice.channel) // on vérifie que l'utilisateur est bien dans un salon vocal pour skip
    {
        sendFunctionLog(values.CmdList.MusicCmds.skip, values.generalText.ErrorMsg.logs.music_notinvocal);
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_notinvocal, serverQueue ,ifButton, "not_in_vocal");
    }
    if (!serverQueue) // On vérifie si une musique est en cours
    {
        sendFunctionLog(values.CmdList.MusicCmds.skip, values.generalText.ErrorMsg.logs.music_nomusicplaying);
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.GeneralUserMsg.music_nomusicplaying, serverQueue, ifButton, "no_music");
    }

    serverQueue.Button = ifButton

    if (ifSlash === true) {
        await message.editReply("Passage à la musique suivante...")
    }

    if (ifButton === true) {
        whatsplaying(message, serverQueue, author, false, true, "skip")
    }

    sendFunctionLog(values.CmdList.MusicCmds.skip, values.generalText.GeneralLogsMsg.musicLogs.music_skipmusicmsg);
    await serverQueue.audioPlayer.stop(); // On termine la musique courante, ce qui lance la suivante grâce à l'écoute d'événement


}

async function stop(message, serverQueue, author, ifSlash, ifButton) {
    if (!message.member.voice.channel) // on vérifie que l'utilisateur est bien dans un salon vocal pour skip
    {
        sendFunctionLog(values.CmdList.MusicCmds.stop, values.generalText.ErrorMsg.logs.music_notinvocal);
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_notinvocal, serverQueue, ifButton, "not_in_vocal");
    }
    if (!serverQueue) // On vérifie si une musique est en cours
    {
        sendFunctionLog(values.CmdList.MusicCmds.stop, values.generalText.ErrorMsg.logs.music_nomusicplaying);
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.GeneralUserMsg.music_nomusicplaying, serverQueue, ifButton, "no_music");
    }

    if (!serverQueue.playing) {
        sendStatusLog(values.generalText.GeneralLogsMsg.musicLogs.music_stopproccesslonger); //LOGIK
        serverQueue.audioPlayer.unpause();
    }

    let embedMusicState = new Discord.MessageEmbed()
    .setAuthor({name: `${author.username}#${author.discriminator}`, iconURL:`${author.displayAvatarURL()}`})
    .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
    .setColor(values.settings.embedColor)
    .setDescription(values.generalText.GeneralUserMsg.music_musicstopped)

    serverQueue.songs = [];

    sendStatusLog(values.generalText.GeneralLogsMsg.musicLogs.music_stopmsg);

    await serverQueue.audioPlayer.stop();

    if (ifButton) {
        return whatsplaying(message, serverQueue, author, false, true)
    }
    
    if (ifSlash) {
        return message.editReply({embeds: [embedMusicState]})
    } else {
        return message.channel.send({embeds: [embedMusicState]})
    }

}

async function loop(message, serverQueue, author, ifSlash, ifButton) {
    if (!message.member.voice.channel) {
        sendFunctionLog(values.CmdList.MusicCmds.loop, values.generalText.ErrorMsg.logs.music_notinvocal);
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_notinvocal, serverQueue, ifButton, "not_in_vocal");
    }
    if (!serverQueue) {
        sendFunctionLog(values.CmdList.MusicCmds.loop, values.generalText.ErrorMsg.logs.music_nomusicplaying);
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.GeneralUserMsg.music_nomusicplaying, serverQueue, ifButton, "no_music");
    }

    if (serverQueue.songs[0].mode == "livestream") {
        sendFunctionLog(values.CmdList.MusicCmds.pause, "La musique en cours de lecture est une vidéo en direct, impossible d'activer le loop.");
        return MusicStateEmbed(message, author, ifSlash, null, `${PikachuEmote} La musique en cours de lecture est une vidéo en direct. Impossible d'aciver la fonction de loop ! 😅`, serverQueue);
    }

    serverQueue.loop = !serverQueue.loop
    sendStatusLog(`z!loop : Le bouclage (loop) de la musique en cours de lecture est : ${serverQueue.loop ? `activé` : `**désactivé`}`);
    
    if (ifButton) {
        return whatsplaying(message, serverQueue, author, false, true)
    }
    
    return MusicStateEmbed(message, author, ifSlash, null, `Le loop est ${serverQueue.loop ? `**activé**` : `**désactivé**`} ! 😉`, serverQueue, false, "stop_music") //message.channel.send(`Le loop est ${serverQueue.loop ? `**activé**` : `**désactivé**`} ! 😉`)

}

async function play(guild, song, ifcrashed) {

    const serverQueue = queue.get(guild.id); // On récupère la queue de lecture

    //const connection = serverQueue.connection


    //console.log(serverQueue)

    if (!song) { // Si la musique que l'utilisateur veux lancer n'existe pas on annule tout et on supprime la queue de lecture
        sendStatusLog("Fonction play : Aucune musique détectée.")

        if (!serverQueue.connection) {
            sendStatusLog("Fonction play : Erreur de détection.")
            queue.delete(guild.id);
            return;
        }

        if (serverQueue.connection) {
            sendStatusLog("Fonction play : Connexion détectée.")
            await serverQueue.connection.destroy();
        }
        if (serverQueue) {
            sendStatusLog("Fonction play : Liste de lecture détectée.")
            queue.delete(guild.id);
        }
        sendFunctionLog(values.Functions.play, values.generalText.GeneralLogsMsg.musicLogs.music_musicstopping);
        return;
    }


    const audioplayer = await Music.createAudioPlayer()
    await serverQueue.connection.subscribe(audioplayer)
    serverQueue.audioPlayer = audioplayer

    // On lance la musique

    switch (song.mode) {
        case "tts": 
            serverQueue.audioResource = Music.createAudioResource(discordTTS.getVoiceStream(song.texttospeech, {lang : "fr"}), { seek: 0, inlineVolume: true })
            break;
        case "livestream":
            //format = ytdl.chooseFormat(song.formats, { filter: "audioonly", quality: [128,127,120,96,95,94,93] });
            let streamdata = await stream(song.url)
            serverQueue.audioResource = Music.createAudioResource(streamdata.stream, { seek: 0, inlineVolume: true, inputType: streamdata.type })
            break;
             //ytdl(song.url, { highWaterMark: 1 << 25, dlChunkSize: 1<<12, quality: [91,92,93,94,95], opusEncoded: true, liveBuffer: 4900 });//ytdl(song.url, { filter: 'audioonly', highWaterMark: 1 << 25 }, {quality: [128,127,120,96,95,94,93]}) //format.url;
        case "video":
            //format = ytdl.chooseFormat(song.formats, { filter: "audioonly", quality: [18,137,248,136,247,135,134,140]} )//, { quality: [128,127,120,96,95,94,93] });
            serverQueue.audioResource = Music.createAudioResource(ytdl(song.url, { filter: 'audioonly', highWaterMark: 1 << 25 }), { seek: 0, inlineVolume: true })
            break;
            //format.url;
    }
    

    //serverQueue.audioResource = Music.createAudioResource(streamdata(), { seek: 0, inlineVolume: true })
    //serverQueue.audioResource = Music.createAudioResource(ytdl(song.url, { filter: 'audioonly', highWaterMark: 1 << 25 }), { seek: 0, inlineVolume: true })

    //serverQueue.audioResource = Music.createAudioResource(ytdl(song.url, { filter: 'audioonly', highWaterMark: 1 << 25 }), { seek: 0, inlineVolume: true })
    serverQueue.audioResource.volume.setVolume(serverQueue.volume)

    await audioplayer.play(serverQueue.audioResource)
    song.beginplaytimestamp = Date.now()

    audioplayer.on(Music.AudioPlayerStatus.Idle, async () => { // On écoute l'événement de fin de musique
        if (!serverQueue.loop) serverQueue.songs.shift(); // On passe à la musique suivante quand la courante se termine
        serverQueue.firstmusicpassed = true;
        await serverQueue.audioPlayer.stop()
        //serverQueue = undefined
        play(guild, serverQueue.songs[0], false);
    })

    audioplayer.on("error", async error => {

        //if (serverQueue.connection) {
        //    await serverQueue.connection.destroy()
        //}

        //if (serverQueue) {
        //    queue.delete(guild.id)
        //}

        serverQueue.songs = []

        await serverQueue.audioPlayer.stop()

        sendFunctionLog(values.Functions.play, values.generalText.ErrorMsg.logs.unknownerror)
        sendErrorToDev(Discord, client, error, values.Functions.play);
        serverQueue.textChannel.send(values.generalText.ErrorMsg.userend.music_unknownerror + "\nLa musique n'a pas réussi à être lue.")

        return;

    });

    //dispatcher.setVolume(1); // On définie le volume
    sendStatusLog(values.generalText.GeneralLogsMsg.musicLogs.music_playingmusicmsg);
    sendStatusLog(`Fonction play : Titre : ${song.title}`);
    sendStatusLog(`Fonction play : URL : ${song.url}`);

    let embedIsPlaying = new Discord.MessageEmbed()
        .setAuthor({name:"Musique en cours :", iconURL:song.pdp})
        .setThumbnail(song.thumbnail)
        .addFields(
            { name: 'Titre', value: song.title },
            { name: "Ajoutée par", value: song.addedby })
        .setColor(values.settings.embedColor)
        .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl});
    
    let row = new Discord.MessageActionRow() 
            .addComponents(
                new Discord.MessageButton()
                    .setStyle('SECONDARY')
                    .setLabel("Afficher les détails")
                    .setCustomId("whatsplaying")
            )
        
        if (serverQueue.loop == false) {
            if (serverQueue.Button == false) {
                serverQueue.Button = false
                if (song.tts && !serverQueue.firstmusicpassed) {
                    sendStatusLog("La musique est un texte TTS.")
                } else {
                    serverQueue.textChannel.send({ embeds: [embedIsPlaying], components: [row] });
                }
            }
        }   
    return;
}


async function ytsearch(message, serverQueue, voiceChannel, ifSlash, member, argument, author, ifquickplay) {
    sendStatusLog("Argument de recherche : "+argument)

    if (ifquickplay === true) {
        validate = await ytdl.validateURL(argument);
        if (validate) {
            return execute(message, serverQueue, voiceChannel, ifSlash, member, argument, author)
        }
    }

    var args = argument.trim().split(/ +/g)

    //console.log(args)

    let dropdownmenu = []

        if (!voiceChannel) // Si l'utilisateur n'est pas dans un salon vocal
        {
            embedExecute.setFooter({ text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl })
            embedExecute.setTitle(values.generalText.ErrorMsg.userend.music_oups)
            embedExecute.setDescription(values.generalText.ErrorMsg.userend.music_notinvocal)
            embedExecute.setAuthor({ name: `${author.username}#${author.discriminator}`, iconURL: `${author.displayAvatarURL()}` })
            embedExecute.setColor(values.settings.embedColor)
            sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.ErrorMsg.logs.music_notinvocal);
            if (ifSlash === true) {
                return await message.editReply({ embeds: [embedExecute] });
            } else {
                return await message.channel.send({ embeds: [embedExecute] });
            }
        }

    
    sendFunctionLog(values.Functions.ytsearch, values.generalText.GeneralLogsMsg.musicLogs.music_ytsearchprocessing);
    await yts(args.join(" "), async function (err, res) {

        //console.log(args)
        if (err) {
            sendFunctionLog(values.Functions.ytsearch, values.generalText.ErrorMsg.logs.unknownerror);
            sendErrorToDev(Discord, client, err, values.Functions.ytsearch);
            return message.channel.send(values.generalText.ErrorMsg.userend.music_pikachuerror);
        }

        let videos = res.videos.slice(0, 5);

        //console.log(videos)

        if (videos.length == 0) {
            sendStatusLog("Aucune vidéo n'a été trouvée.")
            const errordescription = "Conseils :\nEssayez avec d'autres mots.\nVérifiez l'orthographe des termes de recherche.\nUtilisez des mots-clés plus généraux.\nSpécifiez un moins grand nombre de mots.\n\nEn derniers recours, effectuez la même recherche sur YouTube directement et copiez-collez le lien de votre vidéo en tant qu'argument."
            return MusicStateEmbed(message, author, ifSlash, "Aucune vidéo n'a été trouvée.", errordescription, serverQueue)
        }

        //onsole.log(videos)
        let resp = '';
        /*
        for await (const i of videos) {
            resp += `**[${parseInt(i) + 1}]:** ${videos[i].title}\n--------------------\n`;
            dropdownmenu.push({
                label: `${videos[i].title}`,
                description: `${videos[i].author.name} ■ ${videos[i].timestamp}`,
                value: `${videos[i].url}`
            })
        }
        */
       /*
       await videos.forEach((v) => {
        resp += `${v.title}\n--------------------\n`;
        dropdownmenu.push({
            label: `${v.title}`,
            description: `${v.author.name} ■ ${v.timestamp}`,
            value: `${v.url}`
        })
       })
       */
       await Promise.all(videos.map(async (v) => {
        resp += `${v.title}\n--------------------\n`;
        dropdownmenu.push({
            label: `${v.title}`,
            description: `${v.author.name} ■ ${v.timestamp}`,
            value: `${v.url}`
        })
       }))
        //code de gros beauf
        //1
        /*
        if (videos[0]) {
            resp += `**[${parseInt(0) + 1}]:** ${videos[0].title}\n--------------------\n`;
            dropdownmenu.push({
                label: `${videos[0].title}`,
                description: `${videos[0].author.name} ■ ${videos[0].timestamp}`,
                value: `${videos[0].url}`
            })
        }
        //2
        if (videos[1]) {
            resp += `**[${parseInt(1) + 1}]:** ${videos[1].title}\n--------------------\n`;
            dropdownmenu.push({
                label: `${videos[1].title}`,
                description: `${videos[1].author.name} ■ ${videos[1].timestamp}`,
                value: `${videos[1].url}`
            })
        }
        //3
        if (videos[2]) {
            resp += `**[${parseInt(2) + 1}]:** ${videos[2].title}\n--------------------\n`;
            dropdownmenu.push({
                label: `${videos[2].title}`,
                description: `${videos[0].author.name} ■ ${videos[2].timestamp}`,
                value: `${videos[2].url}`
            })
        }
        //4
        if (videos[3]) {
            resp += `**[${parseInt(3) + 1}]:** ${videos[3].title}\n--------------------\n`;
            dropdownmenu.push({
                label: `${videos[3].title}`,
                description: `${videos[0].author.name} ■ ${videos[3].timestamp}`,
                value: `${videos[3].url}`
            })
        }
        //5
        if (videos[4]) {
            resp += `**[${parseInt(4) + 1}]:** ${videos[4].title}\n--------------------\n`;
            dropdownmenu.push({
                label: `${videos[4].title}`,
                description: `${videos[4].author.name} ■ ${videos[4].timestamp}`,
                value: `${videos[4].url}`
            })
        }
        */

        const menu = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('Choisissez la musique...')
                    //.setMinValues(1)
                    //.setMaxValues(5)
                    .addOptions(dropdownmenu))

        resp += `\n**Pour choisir la musique, choisissez dans le menu ci-dessous.**`;


        const embedYTSearch = new Discord.MessageEmbed()
            .setAuthor({name: `${author.username}#${author.discriminator}`, iconURL:`${author.displayAvatarURL()}`})
            .setTitle("Résultats de la recherche : ")
            .setDescription(`${resp}`)
            .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
            .setColor(values.settings.embedColor);

        //message.channel.send(`values.generalText.GeneralUserMsg.music_searchresultstext + resp`, {components: [menu]});

        if (ifquickplay === true) {
            return execute(message, serverQueue, voiceChannel, ifSlash, member, videos[0].url, author, false)
        } else {
            if (ifSlash === true) {
                await message.editReply({ components: [menu], embeds: [embedYTSearch] })
            } else {
                message.channel.send({ components: [menu], embeds: [embedYTSearch] })
            }
            sendFunctionLog(values.Functions.ytsearch, values.generalText.GeneralLogsMsg.musicLogs.music_sendsearchresult);
        }
        return;

    });
}

async function showQueue(message, serverQueue, author, ifSlash, ifButton) {

    if (!message.member.voice.channel) {
        sendFunctionLog(values.CmdList.MusicCmds.queue, values.generalText.ErrorMsg.logs.music_notinvocal)
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_notinvocal, serverQueue, ifButton, "not_in_vocal");
    }

    if (!serverQueue) {
        sendFunctionLog(values.CmdList.MusicCmds.queue, values.generalText.ErrorMsg.logs.music_nomusicplaying)
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.GeneralUserMsg.music_nomusicplaying, serverQueue, ifButton, "no_music");
    }

    let embedQueueMsg = new Discord.MessageEmbed()
        .setColor(values.settings.embedColor)
        .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
        .setAuthor({name: author.username + "#" + author.discriminator, iconURL:author.displayAvatarURL()})
        .setThumbnail(serverQueue.songs[0].thumbnail);

    sendFunctionLog(values.CmdList.MusicCmds.queue, values.generalText.GeneralLogsMsg.musicLogs.music_sendqueuemsg);
    let nowPlaying = serverQueue.songs[0];
    let msg = ''
    let description = ''
    let totalduration = parseInt(serverQueue.songs[0].time)
    embedQueueMsg.addField("Musique en cours : ", nowPlaying.title)

    if (serverQueue.songs.length < 2) {
        embedQueueMsg.setDescription(`Aucune autre musique n'a été ajoutée dans la liste de lecture.`)
    } else {

        for (var i = 1; i < serverQueue.songs.length; i++) {
            description = `**Nombre total de musiques :** \`${serverQueue.songs.length}\`\n--------------------\n`
            totalduration = parseInt(totalduration) + parseInt(serverQueue.songs[i].time)

            msg += `**[${i}]** : ${serverQueue.songs[i].title}`

            if (i != serverQueue.songs.length - 1) {
                msg += `\n--------------------\n`
            }

        }

        description += `**Durée total de la liste de lecture :** \`${convertHMS(totalduration)}\`\n--------------------\n`

        if (msg.length > 1024) {
            msg = `**[1]** : ${serverQueue.songs[1].title}\n--------------------\n**[2]** : ${serverQueue.songs[2].title}\n--------------------\n**[3]** : ${serverQueue.songs[3].title}`
            description += "La liste de lecture étant très longue, seulement les 3 prochains titres sont affichés."

        }

        embedQueueMsg.addField("Liste de lecture : ", msg)
        embedQueueMsg.setDescription(description)

    }

    let row = new Discord.MessageActionRow() 
    .addComponents(
        new Discord.MessageButton()
            .setStyle('SECONDARY')
            .setLabel("Afficher les détails de la musique en cours")
            .setCustomId("whatsplaying")
    )

    if (ifButton) {
        return message.update({ embeds: [embedQueueMsg], components: [row] })
    }

    if (ifSlash === true) {
        await message.reply({ embeds: [embedQueueMsg], components: [row] })
    } else {
        message.channel.send({ embeds: [embedQueueMsg], components: [row] })
    }

}

async function pauseMusic(message, serverQueue, author, ifSlash, ifButton) {
    const PikachuEmote = client.emojis.cache.find(emoji => emoji.name === "Pikachu");

    if (!message.member.voice.channel) {
        sendFunctionLog(values.CmdList.MusicCmds.pause, values.generalText.ErrorMsg.logs.music_notinvocal)
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_notinvocal, serverQueue, ifButton, "not_in_vocal");
    }

    if (!serverQueue) {
        sendFunctionLog(values.CmdList.MusicCmds.pause, values.generalText.ErrorMsg.logs.music_nomusicplaying)
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.GeneralUserMsg.music_nomusicplaying, serverQueue, ifButton, "no_music");
    }

    if (!serverQueue.playing) {
        sendFunctionLog(values.CmdList.MusicCmds.pause, values.generalText.ErrorMsg.logs.music_alreadypaused);
        return MusicStateEmbed(message, author, ifSlash, null, `${PikachuEmote} La musique est déja en pause ! 😅`, serverQueue);
    }

    if (serverQueue.songs[0].mode == "livestream") {
        sendFunctionLog(values.CmdList.MusicCmds.pause, "La musique en cours de lecture est une vidéo en direct, impossible de mettre en pause.");
        return MusicStateEmbed(message, author, ifSlash, null, `${PikachuEmote} La musique en cours de lecture est une vidéo en direct. Impossible de mettre en pause la musique ! 😅`, serverQueue);
    }

    serverQueue.playing = false;
    serverQueue.audioPlayer.pause();
    sendFunctionLog(values.CmdList.MusicCmds.pause, values.generalText.GeneralLogsMsg.musicLogs.music_pausing);

    if (ifButton) {
        return whatsplaying(message, serverQueue, author, false, true)
    }

    return MusicStateEmbed(message, author, ifSlash, null, `${PikachuEmote} La musique est en pause ! 😉`, serverQueue);
}

async function resumeMusic(message, serverQueue, author, ifSlash, ifButton) {
    const PikachuEmote = client.emojis.cache.find(emoji => emoji.name === "Pikachu");
    if (!message.member.voice.channel) {
        sendFunctionLog(values.CmdList.MusicCmds.resume, values.generalText.ErrorMsg.logs.music_notinvocal)
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_notinvocal, serverQueue, "not_in_vocal");
    }

    if (!serverQueue) {
        sendFunctionLog(values.CmdList.MusicCmds.resume, values.generalText.ErrorMsg.logs.music_nomusicplaying)
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.GeneralUserMsg.music_nomusicplaying, serverQueue, "no_music");
    }

    if (serverQueue.playing) {
        sendFunctionLog(values.CmdList.MusicCmds.resume, values.generalText.ErrorMsg.logs.music_alreadyplaying);
        return MusicStateEmbed(message, author, ifSlash, null, `${PikachuEmote} La musique est déja en lecture ! 😅`, serverQueue);
    }

    serverQueue.playing = true;
    serverQueue.audioPlayer.unpause();

    sendFunctionLog(values.CmdList.MusicCmds.resume, values.generalText.GeneralLogsMsg.musicLogs.music_resuming);
    sendStatusLog(values.generalText.GeneralLogsMsg.musicLogs.music_resumeproblem);

    if (ifButton) {
        return whatsplaying(message, serverQueue, author, false, true)
    }

    return MusicStateEmbed(message, author, ifSlash, null, `${PikachuEmote} La musique est en lecture ! 😉`, serverQueue);
}


async function whatsplaying(message, serverQueue, author, ifSlash, ifButton, command) {
    /*
    if (!message.member.voice.channel) {
        sendFunctionLog(values.CmdList.MusicCmds.np, values.generalText.ErrorMsg.logs.music_notinvocal)
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_notinvocal, serverQueue, ifButton);
    }
    */

    if (!serverQueue) {
        sendFunctionLog(values.CmdList.MusicCmds.np, values.generalText.ErrorMsg.logs.music_nomusicplaying)
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.GeneralUserMsg.music_nomusicplaying, serverQueue, ifButton);
    }


    if (command == "skip") {
        if (!serverQueue.loop) {
            var nowPlaying = serverQueue.songs[1];
        } else {
            var nowPlaying = serverQueue.songs[0];
        }
    } else {
        var nowPlaying = serverQueue.songs[0];
    }

    //let nowPlaying = serverQueue.songs[0];

    if (!nowPlaying) {
        const embedFinished = new Discord.MessageEmbed()
        .setColor("#FFF305")
        .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
        .setTitle("Liste de lecture finie.")
        .setDescription("Il n'y a plus de musiques dans la liste de lecture. Jouez ou ajoutez de la musique via la commande `z!play` ou `/play`.")

        message.update({ embeds: [embedFinished], components: [] })
        return;
    }
        
    try {
        //const songInfo = await ytdl.getInfo(nowPlaying.url);
        const song = {
            mode: nowPlaying.mode,
            title: nowPlaying.title,
            url: nowPlaying.url,
            author: nowPlaying.author,
            thumbnail: nowPlaying.thumbnail,
            time: nowPlaying.time,
            likes: nowPlaying.likes,
            views: nowPlaying.views,
            addedby: nowPlaying.addedby,
            pdp: nowPlaying.pdp,
            timestamp: nowPlaying.beginplaytimestamp
        }

        switch (song.mode) {
            case "tts":
                duration = "Texte TTS"
                pauseloopbtndisable = true
                break;
            case "livestream": 
                duration = "En live"
                pauseloopbtndisable = true
                break;
            case "video":
                duration = convertHMS(song.time)
                pauseloopbtndisable = false
                break;
        }

        //const duration = convertHMS(song.time);
        //const currenttime = convertHMS(Math.abs(song.timestamp - Date.now()))

        //sendFunctionLog(values.CmdList.MusicCmds.np, values.generalText.GeneralLogsMsg.musicLogs.music_youtubemetadataget)

        let embedMessageNowPlaying = new Discord.MessageEmbed()
            .setColor("#FFF305")
            .setTitle("Musique en cours :")
            .setAuthor({name: "Ajoutée par : " + song.addedby, iconURL:song.pdp})
            .addFields(
                { name: "Titre", value: `${song.title}` },
                { name: "Auteur", value: `${song.author}` },
                { name: "Lien URL vers YouTube", value: `${song.url}` },
                { name: "Durée", value: `${duration}`, inline: true },
                { name: "Nombre de \"J'aime\"", value: `${split(song.likes)}`, inline: true },
                { name: "Nombre de vues", value: `${split(song.views)}`, inline: true },
                { name: "Volume sonore", value: `${serverQueue.volume*100}%`, inline: true },
                { name: "Mode loop", value: `${serverQueue.loop ? `Activé` : `Désactivé`}`, inline: true })
            .setThumbnail(song.thumbnail)
            .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl});
        
        //textcompliqué = ["Reprendre du début", "Suivant", "Liste de lecture", "Reprendre", "Pause", "Activer loop", "Désactiver loop", "Stop"]
        //textesimple = ["⏪", "⏭️", "Liste de lecture", "▶️", "⏸️", "🔁", "🔂", "⏹️" ]

        const row = new Discord.MessageActionRow()
        const serversettings = await GuildModel.findOne({id: message.guild.id})

        console.log(serversettings.SimplifiedMusicMenus)

        switch (serversettings.SimplifiedMusicMenus) {
            default:
                console.log("false")
                if (serverQueue.loop) {
                    row.addComponents(
                        new Discord.MessageButton()
                        .setLabel('Reprendre du début')
                        .setStyle('SECONDARY')
                        .setCustomId("skip_music")
                    )
                } else {
                    row.addComponents(
                        new Discord.MessageButton()
                        .setLabel('Suivant')
                        .setStyle('SECONDARY')
                        .setCustomId("skip_music")
                        //.setDisabled(pauseloopbtndisable)
                    )
                }
        
                if (serverQueue.playing == false) {
                    row.addComponents(
                        new Discord.MessageButton()
                        .setLabel('Reprendre')
                        .setStyle('DANGER')
                        .setCustomId("resume_music")
                    )
                } else {
                    row.addComponents(
                        new Discord.MessageButton()
                        .setLabel('Pause')
                        .setStyle('SECONDARY')
                        .setCustomId("pause_music")
                        .setDisabled(pauseloopbtndisable)
                    )
                }
        
                if (serverQueue.loop == false) {
                    row.addComponents(
                        new Discord.MessageButton()
                        .setLabel('Activer loop')
                        .setStyle('SECONDARY')
                        .setCustomId("toggleloop_music")
                        .setDisabled(pauseloopbtndisable)
                    )
                } else {
                    row.addComponents(
                        new Discord.MessageButton()
                        .setLabel('Désactiver loop')
                        .setStyle('PRIMARY')
                        .setCustomId("toggleloop_music")
                    )
                }
        
                row.addComponents(
                    new Discord.MessageButton()
                    .setLabel('Stop')
                    .setStyle('DANGER')
                    .setCustomId("stop_music")
                )

                row.addComponents(
                    new Discord.MessageButton()
                    .setLabel('Liste de lecture')
                    .setStyle('SECONDARY')
                    .setCustomId("showqueue")
                    //.setDisabled(pauseloopbtndisable)
                )

                break;
            case "true":
                if (serverQueue.loop) {
                    row.addComponents(
                        new Discord.MessageButton()
                        .setStyle('SECONDARY')
                        .setCustomId("skip_music")
                        .setEmoji("⏪")
                    )
                } else {
                    row.addComponents(
                        new Discord.MessageButton()
                        .setStyle('SECONDARY')
                        .setCustomId("skip_music")
                        .setEmoji("⏭️")
                        //.setDisabled(pauseloopbtndisable)
                    )
                }
        
                if (serverQueue.playing == false) {
                    row.addComponents(
                        new Discord.MessageButton()
                        .setStyle('DANGER')
                        .setCustomId("resume_music")
                        .setEmoji("▶️")
                    )
                } else {
                    row.addComponents(
                        new Discord.MessageButton()
                        .setStyle('SECONDARY')
                        .setCustomId("pause_music")
                        .setEmoji("⏸️")
                        .setDisabled(pauseloopbtndisable)
                    )
                }
        
                if (serverQueue.loop == false) {
                    row.addComponents(
                        new Discord.MessageButton()
                        .setStyle('SECONDARY')
                        .setCustomId("toggleloop_music")
                        .setEmoji("🔁")
                        .setDisabled(pauseloopbtndisable)
                    )
                } else {
                    row.addComponents(
                        new Discord.MessageButton()
                        .setStyle('PRIMARY')
                        .setCustomId("toggleloop_music")
                        .setEmoji("🔂")
                    )
                }
        
                row.addComponents(
                    new Discord.MessageButton()
                    .setStyle('DANGER')
                    .setCustomId("stop_music")
                    .setEmoji("⏹️")
                )

                row.addComponents(
                    new Discord.MessageButton()
                    .setLabel('Liste de lecture')
                    .setStyle('SECONDARY')
                    .setCustomId("showqueue")
                    //.setDisabled(pauseloopbtndisable)
                )

                break;
        }

        if (ifButton) {
            if (command != "skip") {
                serverQueue.Button = false;
            }

            message.update({ embeds: [embedMessageNowPlaying], components: [row] })
            return;
        }

        if (ifSlash === true) {
            return await message.editReply({ embeds: [embedMessageNowPlaying], components: [row] })
        } else {
            return message.channel.send({ embeds: [embedMessageNowPlaying], components: [row] });
        }



    } catch (err) {
        sendFunctionLog(values.CmdList.MusicCmds.np, values.generalText.ErrorMsg.logs.music_nperror)
        sendErrorToDev(Discord, client, err, "whatsplaying")
        sendErrorLog("Une erreur de merde est survenue.", err)
        return message.channel.send(values.generalText.ErrorMsg.userend.music_unknownerror)
    }
}

function convertHMS(value) {
    const sec = parseInt(value, 10); // convert value to number if it's string
    let hours = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
    let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds; // Return is HH : MM : SS
}

//console.log(split(78)) //123 456 789

function split(nbr)
{
		var nombre = ''+nbr;
		var retour = '';
		var count=0;
		for(var i=nombre.length-1 ; i>=0 ; i--)
		{
			if(count!=0 && count % 3 == 0)
				retour = nombre[i]+' '+retour ;
			else
				retour = nombre[i]+retour ;
			count++;
		}
		//alert('nb : '+nbr+' => '+retour);
		return retour;
}
function MusicFeatureDisabled(message) {
    sendStatusLog(values.generalText.ErrorMsg.logs.music_featuredisabledmsg)
    return message.channel.send(values.generalText.ErrorMsg.userend.music_featuredisabledmsg);

}

(async () => {
    try {
        sendStatusLog("Connexion aux serveurs...")
        //mongodb://localhost/mangodb-demo
    await connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
    })
    sendStatusLog("Le bot est connecté au serveur MongoDB.")
    await client.login(process.env.BOT_TOKEN);//connexion du bot au serveur de Discord
    sendStatusLog(`Le bot est connecté en tant que ${client.user.tag} et est présent sur ${client.guilds.cache.size} serveurs.`)
} catch (err) {
    sendErrorLog("Impossible de se connecter à l'API de Discord et/ou au serveur MongoDB. Le bot ne peut pas continuer et va par conséquent s'arrêter.", err)
    process.exit(1)
}
})()
/*
client.on("rateLimit", (e) => {
    sendStatusLog("Le bot ne peut pas se connecter à cause du ratelimit. Le bot va redémarrer le conteneur.")
    sendMail("Le bot s'est fait ratelimité.", "Je suis ratelimité ! Aide-moi stp 🥺🥺🥺 !")
    spawn("kill", ["1"])
})
*/
//sends a kill 1 command to the child node if there is a 429 error
client.on("debug", function(info){
    let check429error = info.split(" ");
    //console.log(`info -> ${check429error}`); //debugger
    if (check429error[2] === `429`) {
        sendWarnLog(`Une erreur 429 s'est produite. Le bot va redémarrer le conteneur.`); 
        sendMail("Le bot s'est fait ratelimité.", "Je suis ratelimité ! Aide-moi stp 🥺🥺🥺 !")
            exec('kill 1', (err, output) => {
                if (err) {
                    console.error("Impossible d'éxecuter la commande de redémarrage.", err);
                    return
                }
              console.log(`Commande de redémarrage réussie.`);
            });         
    }
});
/*
if (getConfig().Configuration.EnablePingSite == true && connectionstate != "connecting") {
    setInterval(function () {
        sendStatusLog("Ping du site en cours.")
        try {
            http.get("http://ZbeubBot-v2.dylanvassalo.repl.co") //http://zbeubbot.herokuapp.com
        } catch (error) {
            sendErrorLog("Une erreur de ping du site s'est produite.", error)
        }
    }, 1200000) //Maintien toutes les 20 minutes. 
} else {
    sendWarnLog("La configuration du bot désactive la fonction de ping du site.")
}
*/
