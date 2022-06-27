// JavaScript source codea
// { Client, Intents, MessageEmbed, MessageAttachment }
require("dotenv").config(); //token

//global.AbortController = require("node-abort-controller");
//Modules et assets
const Discord = require('discord.js'); //Chargement module Discord
const ytdl = require('ytdl-core'); //Chargement module lecture vidéo Youtube
const yts = require('yt-search'); //Chargement module Youtube Data API v3 (eh ouais)
//const DiscordSlash = require('discord.js-slash-command'); //Chargement module Discord Slash Commands


//import DSValues from 'discord.js'

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
const Music = require('@discordjs/voice')
const hello = require("./cmd/hello"); //Charge le module pour la commande z!hello
const help = require("./cmd/help"); //Charge le module de l'aide
const attack = require("./cmd/attack");//Charge le module Attaque
const dance = require("./cmd/dance");//Charge le module Danse
//const slash = new DiscordSlash.Slash(client); //Création des commandes slash
const about = require("./cmd/about");//Charge le module about
const installslash = require('./cmd/installslash');
const error = require("./cmd/error");
const deleteslash = require("./cmd/deleteslash");
const informations = require("./cmd/informations");
const hug = require("./cmd/hug");
const musicbotfuture = require("./cmd/about_music_bots");
const sendErrorToDev = require("./debug/sendErrorToDeveloper");
const sendMPToDev = require("./debug/sendMPToDev");
const sendStateToDev = require("./debug/sendStateToDev");
const mphelp = require("./cmd/mp_cmd/mp_help");
const sendCommentsToDev = require("./cmd/mp_cmd/sendCommentsToDev");
const debugsendFile = require("./testing/sendAttachment");
const debugshowInfoAboutMember = require("./testing/sendInfoaboutMember");
const debugNewAboutMessage = require("./testing/newAbout");
const cordula = require("./cmd/cordula");
const debugdeployslash = require('./debug/deployslash');
const restartbot = require('./testing/restartbot')
const botusage = require('./testing/botusage')
const canvasgenerator = require('./testing/profileimage')
const mtm = require("./cmd/mtm")
const wala = require("./cmd/wala")
const { sendCmdLog, sendStatusLog, sendErrorLog, sendFunctionLog } = require("./debug/consolelogs")


const values = require("./values.json");
const { SlashCommandBuilder } = require("@discordjs/builders");


const versionNumber = values.version.versionNumber;
const musicFeatureState = values.settings.musicCmdEnable;

const PikachuEmote = client.emojis.cache.find(emoji => emoji.name === "Pikachu"); //https://cdn.discordapp.com/emojis/830729434058850345.png?v=1

const queue = new Map();

async function MusicStateEmbed(message, author, ifslash, title, description) {
    let embedMusicState = new Discord.MessageEmbed()
        .setAuthor(author.username + "#" + author.discriminator, author.displayAvatarURL())
        .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
        .setColor(values.settings.embedColor);

    if (title) {
        embedMusicState.setTitle(`${title}`)
    }
    if (description) {
        embedMusicState.setDescription(`${description}`)
    }
    if (ifslash === true) {
        await message.reply({ embeds: [embedMusicState] })
    } else {
        message.channel.send({ embeds: [embedMusicState] })
    }
    return
}


const guildId = values.settings.DevelopmentServer


//initialisation du bot
client.once('ready', async () => {
    sendStatusLog(values.generalText.GeneralLogsMsg.BotOperationLog.botInitialized)

    client.user.setActivity(`z!help ■ ${versionNumber}`, { type: "PLAYING" })

    sendStateToDev(Discord.Client, client, `Le bot est initialisé.\n Version : \`${values.version.versionNumber}\``);

    //rest.put(Routes.applicationGuildCommands(values.settings.clientId, values.settings.DevelopmentServer), { body: commands })
    //.then(() => console.log('Successfully registered application commands.'))
    //.catch(console.error);

    //const guilddev = client.guilds.cache.get(guildId)
    /*
    if (guilddev) {
        commands = guilddev.commands
    } else {
        commands = guilddev.application.commands
    }

    commands.create({
        name: "ping",
        description: "Une fonction de test qui permet de ping le bot OnO."
    })

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
    */

});

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


async function getMember(interaction) {
    const guild = await client.guilds.cache.get(interaction.channel.guild.id);
    const member = await guild.members.cache.get(interaction.user.id);
    return member
}



client.on('interactionCreate', async interaction => {
    //if (!interaction.isCommand()) return;

    //console.log(interaction)

    if (interaction.isSelectMenu()) {
        sendStatusLog("Fonction interactionCreate : Une interaction avec une sélection de menu a été effectuée.")
        if (interaction.customId === 'select') {
            const { options } = interaction
            const serverQueue = queue.get(interaction.guild.id)
            const guild = client.guilds.cache.get(interaction.guild.id);
            const voiceChannel = interaction.member.voice.channel;
            const member = guild.members.cache.get(interaction.user.id);
            const cmd = "z!play"
            const author = interaction.user
            let args = interaction.values[0]

            //const value = interaction.value

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
            console.log()
            try {
                execute(interaction, serverQueue, voiceChannel, true, member, args, author)
            } catch (err) {
                sendErrorLog("Fonction execute : La musique n'a pas pu être traitée.", error);
                return interaction.editReply(`${values.generalText.ErrorMsg.userend.music_oups}, ${values.generalText.ErrorMsg.userend.music_linkbroken}`)
            }

        }
    }
    if (interaction.isCommand()) {

        const { commandName, options } = interaction;

        const serverQueue = queue.get(interaction.guild.id)
        const guild = client.guilds.cache.get(interaction.guild.id);
        const voiceChannel = interaction.member.voice.channel;
        const member = guild.members.cache.get(interaction.user.id);
        const author = interaction.user
        let username = interaction.user.username + "#" + interaction.user.discriminator
        let guildname = interaction.guild.name

        sendStatusLog(`Fonction interactionCreate : Une commande slash : ${commandName} a été effectuée sur le serveur : ${guildname} par l'utilisateur : ${username}.`)

        if (commandName === 'ping') {
            await interaction.reply('Pong ! OnO');
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
            help(interaction, true)
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

            let args = options.getString("argument")

            //console.log(args)

            await interaction.deferReply()
            execute(interaction, serverQueue, voiceChannel, true, member, args, author)


        } else if (commandName === 'stop') {
            stop(interaction, serverQueue, author, true)
        } else if (commandName === 'skip') {
            skip(interaction, serverQueue, author, true)
        } else if (commandName === 'loop') {
            loop(interaction, serverQueue, author, true)
        } else if (commandName === 'queue') {
            showQueue(interaction, serverQueue, author, true)
        } else if (commandName === 'pause') {
            pauseMusic(interaction, serverQueue, author, true)
        } else if (commandName === 'resume') {
            resumeMusic(interaction, serverQueue, author, true)
        } else if (commandName === 'np') {
            whatsplaying(interaction, serverQueue, author, true)
        } else if (commandName === 'qp') {
            let args = options.getString("argument")

            await interaction.reply("Ajout de la musique.")

            ytsearch(interaction, serverQueue, voiceChannel, true, member, args, author, true)
        }
    }
});


//à chaque message envoyé (fonction d'analyse des messages avec préfixe z!)
client.on("messageCreate", message => {

    if (message.author.bot) {
        return;
    }

    if (!message.content.startsWith("z!")) {
        return;
    }

    if (message.channel.type === "dm") {
        let cmd = message.content.split(" ");
        console.log(`${values.generalText.GeneralLogsMsg.PrivateMsgLogs.msgget} ${message.author.username}#${message.author.discriminator}.`)
        switch (cmd[0]) {
            case values.PrivateMsgCmdList.help:
                sendStatusLog(` ${values.PrivateMsgCmdList.help} : ${values.generalText.GeneralLogsMsg.PrivateMsgLogs.cmdget} ${message.author.username}#${message.author.discriminator}.`)
                return mphelp(message);
                break;
            case values.PrivateMsgCmdList.sendcomments:
                sendStatusLog(`${values.PrivateMsgCmdList.sendcomments} : ${values.generalText.GeneralLogsMsg.PrivateMsgLogs.cmdget} ${message.author.username}#${message.author.discriminator}. ${values.generalText.GeneralLogsMsg.PrivateMsgLogs.contentSent}`)
                return sendCommentsToDev(message, client, Discord);
                break;
            case values.PrivateMsgCmdList.sendfiles:
                sendStatusLog(`${values.PrivateMsgCmdList.sendfiles} : ${values.generalText.GeneralLogsMsg.PrivateMsgLogs.cmdget} ${message.author.username}#${message.author.discriminator}. ${values.generalText.GeneralLogsMsg.PrivateMsgLogs.contentSent}`)

                if (message.author.id != values.properties.userID) {
                    console.log(values.PrivateMsgCmdList.sendfiles + " : " + values.generalText.featureTestMsg.debug_featureTestBlockedMessage + message.author.username + "#" + message.author.discriminator)
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

    let username = message.author.username + "#" + message.author.discriminator
    let guildname = message.guild.name
    const author = message.author
    let cmd = message.content.split(" ");
    const serverQueue = queue.get(message.guild.id);
    const guild = client.guilds.cache.get(message.guild.id);
    const voiceChannel = message.member.voice.channel;
    const member = guild.members.cache.get(message.author.id);
    let args = message.content.substr(cmd[0].length + 1)
    let findargument = message.content.substr(cmd[0].length + 1);

    sendCmdLog(cmd[0], guildname,username)

    switch (cmd[0]) {
        case values.CmdList.InfoCmds.help:
            message.channel.send("Coucou, tu as besoin d'aide ?");
            help(message);
            break;
        case values.CmdList.InfoCmds.about:
            about(message);
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
                return MusicStateEmbed(message, author, false, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_noargumentprovided)
            }

            execute(message, serverQueue, voiceChannel, false, member, args, author).catch(error => {
                console.log(error.message)

                if (error.message == "410") {
                    sendStatusLog(values.generalText.ErrorMsg.logs.music_servererror)
                    return message.channel.send(values.generalText.ErrorMsg.userend.music_servererror)
                }

                if (error.message == "Video unavailable") {
                    sendErrorLog("z!play : Le lien YouTube est inexistant.", error);
                    return MusicStateEmbed(message, author, false, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_linkbroken)
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

            skip(message, serverQueue, author);
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
            sendStatusLog(message)
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
            console.log(`Guild ID du serveur demandé : ${message.guild.id}`);
    
            if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                console.log(values.generalText.GeneralLogsMsg.InstallSlashCmd.UserNotAdmin);
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
                return MusicStateEmbed(message, author, false, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_noargumentprovided)
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
            debugNewAboutMessage(message);
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
            botusage(message);
            break;
        case values.CmdList.MemberInfoCmds.membercard:
            canvasgenerator(message)
            break;
        case values.CmdList.SocialCmds.mtm:
            mtm(message);
            break;
        case values.CmdList.SocialCmds.wala:
            wala(message);
            break;
        default:
            message.channel.send("Cette commande n'existe pas ! ^^ \n Vérifie si tu ne t'ai pas trompé en l'écrivant ou tape la commande \`z!help\` pour voir la liste des commandes !")
            sendStatusLog("La commande saisi par l'utilisateur n'existe pas.")
            break;
    }

});

const embedExecute = new Discord.MessageEmbed()

async function execute(message, serverQueue, voiceChannel, ifSlash, member, argument, author) {

    //message.channel.send()

    let arg = argument

    if (!voiceChannel) // Si l'utilisateur n'est pas dans un salon vocal
    {
        embedExecute.setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
        embedExecute.setTitle(values.generalText.ErrorMsg.userend.music_oups)
        embedExecute.setDescription(values.generalText.ErrorMsg.userend.music_notinvocal)
        embedExecute.setAuthor(author.username + "#" + author.discriminator, author.displayAvatarURL())
        embedExecute.setColor(values.settings.embedColor)
        sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.ErrorMsg.logs.music_notinvocal);
        if (ifSlash === true) {
            return await message.editReply({ embeds: [embedExecute] });
        } else {
            return await message.channel.send({ embeds: [embedExecute] });
        }
    }

    const permissions = voiceChannel.permissionsFor(member.client.user); // On récupère les permissions du bot pour le salon vocal
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) { // Si le bot n'a pas les permissions
        embedExecute.setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
        embedExecute.setTitle(values.generalText.ErrorMsg.userend.music_oups)
        embedExecute.setDescription(values.generalText.ErrorMsg.userend.music_missingauthorisation)
        embedExecute.setAuthor(author.username + "#" + author.discriminator, author.displayAvatarURL())
        embedExecute.setColor(values.settings.embedColor)
        sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.ErrorMsg.logs.music_missingauthorisation);
        if (ifSlash === true) {
            return await message.editReply({ embeds: [embedExecute] });
        } else {
            return await message.channel.send({ embeds: [embedExecute] });
        }
    }

    let validate = await ytdl.validateURL(arg);


    if (!validate) {
        sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.GeneralLogsMsg.musicLogs.music_usesearchinstead);
        if (ifSlash === true) {
            return ytsearch(message, serverQueue, voiceChannel, true, member, arg, author, false);
        } else {
            return ytsearch(message, serverQueue, voiceChannel, false, member, arg, author, false);
        }

    }



    sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.GeneralLogsMsg.musicLogs.music_youtubemetadataget);
    const songInfo = await ytdl.getInfo(arg);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        author: songInfo.videoDetails.author.name,
        thumbnail: songInfo.videoDetails.thumbnails[0].url,
        time: songInfo.videoDetails.lengthSeconds,
        likes: songInfo.videoDetails.likes,
        views: songInfo.videoDetails.viewCount,
        addedby: author.username + "#" + author.discriminator,
        pdp: author.displayAvatarURL()
    };

    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 1,
            playing: true,
            loop: false,
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



            if (ifSlash === true) {
                await message.editReply("La musique a été préparée. La lecture va commencer.")
            }

            queueConstruct.connection = connection;


            // On lance la musique
            sendFunctionLog(values.CmdList.MusicCmds.play, values.generalText.GeneralLogsMsg.musicLogs.music_youtubesucess);
            play(member.guild, queueConstruct.songs[0], false);
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
        serverQueue.songs.push(song);
        sendStatusLog(values.generalText.GeneralLogsMsg.musicLogs.music_linkadded);
        sendStatusLog(`z!play : Titre : ${song.title}`);
        sendStatusLog(`z!play : URL : ${song.url}`);


        let embedAddPlaylist = new Discord.MessageEmbed()
            .setAuthor("Ajoutée par : " + song.addedby, song.pdp)
            .setThumbnail(song.thumbnail)
            .setColor(values.settings.embedColor)
            .addFields(
                { name: 'Titre', value: song.title })
            .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl});

        if (ifSlash === true) {
            return await message.editReply({ embeds: [embedAddPlaylist], content: "La musique a été ajoutée." })
        } else {
            return await message.channel.send({ embeds: [embedAddPlaylist] });
        }

    }

}


async function skip(message, serverQueue, author, ifSlash) {
    if (!message.member.voice.channel) // on vérifie que l'utilisateur est bien dans un salon vocal pour skip
    {
        sendFunctionLog(values.CmdList.MusicCmds.skip, values.generalText.ErrorMsg.logs.music_notinvocal);
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_notinvocal
        );
    }
    if (!serverQueue) // On vérifie si une musique est en cours
    {
        sendFunctionLog(values.CmdList.MusicCmds.skip, values.generalText.ErrorMsg.logs.music_nomusicplaying);
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.GeneralUserMsg.music_nomusicplaying);
    }

    if (ifSlash === true) {
        await message.reply("Passage à la musique suivante...")
    }

    sendFunctionLog(values.CmdList.MusicCmds.skip, values.generalText.GeneralLogsMsg.musicLogs.music_skipmusicmsg);
    await serverQueue.audioPlayer.stop(); // On termine la musique courante, ce qui lance la suivante grâce à l'écoute d'événement
    // finish
}

async function stop(message, serverQueue, author, ifSlash) {
    if (!message.member.voice.channel) // on vérifie que l'utilisateur est bien dans un salon vocal pour skip
    {
        sendFunctionLog(values.CmdList.MusicCmds.stop, values.generalText.ErrorMsg.logs.music_notinvocal);
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_notinvocal);
    }
    if (!serverQueue) // On vérifie si une musique est en cours
    {
        sendFunctionLog(values.CmdList.MusicCmds.stop, values.generalText.ErrorMsg.logs.music_nomusicplaying);
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.GeneralUserMsg.music_nomusicplaying);
    }

    if (!serverQueue.playing) {
        sendStatusLog(values.generalText.GeneralLogsMsg.musicLogs.music_stopproccesslonger); //LOGIK
        serverQueue.audioPlayer.unpause();

    }

    serverQueue.songs = [];

    sendStatusLog(values.generalText.GeneralLogsMsg.musicLogs.music_stopmsg);

    await serverQueue.audioPlayer.stop();
    MusicStateEmbed(message, author, ifSlash, null, values.generalText.GeneralUserMsg.music_musicstopped);
}

async function loop(message, serverQueue, author, ifSlash) {
    if (!message.member.voice.channel) {
        sendFunctionLog(values.CmdList.MusicCmds.loop, values.generalText.ErrorMsg.logs.music_notinvocal);
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_notinvocal);
    }
    if (!serverQueue) {
        sendFunctionLog(values.CmdList.MusicCmds.loop, values.generalText.ErrorMsg.logs.music_nomusicplaying);
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.GeneralUserMsg.music_nomusicplaying);
    }

    serverQueue.loop = !serverQueue.loop
    sendStatusLog(`z!loop : Le bouclage (loop) de la musique en cours de lecture est : ${serverQueue.loop ? `activé` : `**désactivé`}`);
    return MusicStateEmbed(message, author, ifSlash, null, `Le loop est ${serverQueue.loop ? `**activé**` : `**désactivé**`} ! 😉`) //message.channel.send(`Le loop est ${serverQueue.loop ? `**activé**` : `**désactivé**`} ! 😉`)

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

    await audioplayer.play(Music.createAudioResource(ytdl(song.url, { filter: 'audioonly', highWaterMark: 1 << 25 }), { seek: 0, volume: 1 }))

    audioplayer.on(Music.AudioPlayerStatus.Idle, async () => { // On écoute l'événement de fin de musique
        if (!serverQueue.loop) serverQueue.songs.shift(); // On passe à la musique suivante quand la courante se termine
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
        .setAuthor("Musique en cours :", song.pdp)
        .setThumbnail(song.thumbnail)
        .addFields(
            { name: 'Titre', value: song.title },
            { name: "Ajoutée par", value: song.addedby })
        .setColor(values.settings.embedColor)
        .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl});

    if (!serverQueue.loop) {
        serverQueue.textChannel.send({ embeds: [embedIsPlaying] });
    }

    return;
}


async function ytsearch(message, serverQueue, voiceChannel, ifSlash, member, argument, author, ifquickplay) {
    console.log(argument)

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
        sendFunctionLog(values.Functions.ytsearch, values.generalText.ErrorMsg.logs.music_notinvocal);
        return message.channel.send(
            values.generalText.ErrorMsg.userend.music_notinvocal
        );
    }
    sendFunctionLog(values.Functions.ytsearch, values.generalText.GeneralLogsMsg.musicLogs.music_ytsearchprocessing);
    yts(args.join(" "), async function (err, res) {

        //console.log(args)
        if (err) {
            sendFunctionLog(values.Functions.ytsearch, values.generalText.ErrorMsg.logs.unknownerror);
            sendErrorToDev(Discord, client, err, values.Functions.ytsearch);
            return message.channel.send(values.generalText.ErrorMsg.userend.music_pikachuerror);
        }

        let videos = res.videos.slice(0, 5);
        //onsole.log(videos)
        let resp = '';
        for (var i in videos) {
            resp += `**[${parseInt(i) + 1}]:** ${videos[i].title}\n--------------------\n`;
            dropdownmenu.push({
                label: `${videos[i].title}`,
                description: `${videos[i].author.name}`,
                value: `${videos[i].url}`
            })
        }

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
            .setAuthor(author.username + "#" + author.discriminator, author.displayAvatarURL())
            .setTitle("Résultats de la recherche : ")
            .setDescription(`${resp}`)
            .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
            .setColor(values.settings.embedColor);

        //message.channel.send(`values.generalText.GeneralUserMsg.music_searchresultstext + resp`, {components: [menu]});

        if (ifquickplay === true) {
            return execute(message, serverQueue, voiceChannel, false, member, videos[0].url, author)
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

async function showQueue(message, serverQueue, author, ifSlash) {

    if (!message.member.voice.channel) {
        sendFunctionLog(values.CmdList.MusicCmds.queue, values.generalText.ErrorMsg.logs.music_notinvocal)
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_notinvocal);
    }

    if (!serverQueue) {
        sendFunctionLog(values.CmdList.MusicCmds.queue, values.generalText.ErrorMsg.logs.music_nomusicplaying)
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.GeneralUserMsg.music_nomusicplaying);
    }

    let embedQueueMsg = new Discord.MessageEmbed()
        .setColor(values.settings.embedColor)
        .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
        .setAuthor(author.username + "#" + author.discriminator, author.displayAvatarURL())
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

    if (ifSlash === true) {
        await message.reply({ embeds: [embedQueueMsg] })
    } else {
        message.channel.send({ embeds: [embedQueueMsg] })
    }

}

async function pauseMusic(message, serverQueue, author, ifSlash) {
    const PikachuEmote = client.emojis.cache.find(emoji => emoji.name === "Pikachu");

    if (!message.member.voice.channel) {
        sendFunctionLog(values.CmdList.MusicCmds.pause, values.generalText.ErrorMsg.logs.music_notinvocal)
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_notinvocal);
    }

    if (!serverQueue) {
        sendFunctionLog(values.CmdList.MusicCmds.pause, values.generalText.ErrorMsg.logs.music_nomusicplaying)
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.GeneralUserMsg.music_nomusicplaying);
    }

    if (!serverQueue.playing) {
        sendFunctionLog(values.CmdList.MusicCmds.pause, values.generalText.ErrorMsg.logs.music_alreadypaused);
        return MusicStateEmbed(message, author, ifSlash, null, `${PikachuEmote} La musique est déja en pause ! 😅`);
    }

    serverQueue.playing = false;
    serverQueue.audioPlayer.pause();
    sendFunctionLog(values.CmdList.MusicCmds.pause, values.generalText.GeneralLogsMsg.musicLogs.music_pausing);
    return MusicStateEmbed(message, author, ifSlash, null, `${PikachuEmote} La musique est en pause ! 😉`);
}

async function resumeMusic(message, serverQueue, author, ifSlash) {
    const PikachuEmote = client.emojis.cache.find(emoji => emoji.name === "Pikachu");
    if (!message.member.voice.channel) {
        sendFunctionLog(values.CmdList.MusicCmds.resume, values.generalText.ErrorMsg.logs.music_notinvocal)
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_notinvocal);
    }

    if (!serverQueue) {
        sendFunctionLog(values.CmdList.MusicCmds.resume, values.generalText.ErrorMsg.logs.music_nomusicplaying)
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.GeneralUserMsg.music_nomusicplaying);
    }

    if (serverQueue.playing) {
        sendFunctionLog(values.CmdList.MusicCmds.resume, values.generalText.ErrorMsg.logs.music_alreadyplaying);
        return MusicStateEmbed(message, author, ifSlash, null, `${PikachuEmote} La musique est déja en lecture ! 😅`);
    }

    serverQueue.playing = true;
    serverQueue.audioPlayer.unpause();

    sendFunctionLog(values.CmdList.MusicCmds.resume, values.generalText.GeneralLogsMsg.musicLogs.music_resuming);
    sendStatusLog(values.generalText.GeneralLogsMsg.musicLogs.music_resumeproblem);

    return MusicStateEmbed(message, author, ifSlash, null, `${PikachuEmote} La musique est en lecture ! 😉`);
}


async function whatsplaying(message, serverQueue, author, ifSlash) {

    if (!message.member.voice.channel) {
        sendFunctionLog(values.CmdList.MusicCmds.np, values.generalText.ErrorMsg.logs.music_notinvocal)
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.ErrorMsg.userend.music_notinvocal);
    }

    if (!serverQueue) {
        sendFunctionLog(values.CmdList.MusicCmds.np, values.generalText.ErrorMsg.logs.music_nomusicplaying)
        return MusicStateEmbed(message, author, ifSlash, values.generalText.ErrorMsg.userend.music_oups, values.generalText.GeneralUserMsg.music_nomusicplaying);
    }

    let nowPlaying = serverQueue.songs[0];
    try {
        //const songInfo = await ytdl.getInfo(nowPlaying.url);

        const song = {
            title: nowPlaying.title,
            url: nowPlaying.url,
            author: nowPlaying.author,
            thumbnail: nowPlaying.thumbnail,
            time: nowPlaying.time,
            likes: nowPlaying.likes,
            views: nowPlaying.views,
            addedby: nowPlaying.addedby,
            pdp: nowPlaying.pdp
        }

        const duration = convertHMS(song.time);

        sendFunctionLog(values.CmdList.MusicCmds.np, values.generalText.GeneralLogsMsg.musicLogs.music_youtubemetadataget)

        let embedMessageNowPlaying = new Discord.MessageEmbed()
            .setColor("#FFF305")
            .setTitle("Musique en cours :")
            .setAuthor("Ajoutée par : " + song.addedby, song.pdp)
            .addFields(
                { name: "Titre", value: `${song.title}` },
                { name: "Auteur", value: `${song.author}` },
                { name: "Lien URL vers YouTube", value: `${song.url}` },
                { name: "Durée", value: `${duration}`, inline: true },
                { name: "Nombre de \"J'aime\"", value: `${song.likes}`, inline: true },
                { name: "Nombre de vues", value: `${song.views}`, inline: true })
            .setThumbnail(song.thumbnail)
            .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl});

        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel('Lien de la vidéo YouTube')
                    .setStyle('LINK')
                    .setURL(song.url)
            );

        if (ifSlash === true) {
            return await message.reply({ embeds: [embedMessageNowPlaying], components: [row] })
        } else {
            return message.channel.send({ embeds: [embedMessageNowPlaying], components: [row] });
        }



    } catch (err) {
        sendFunctionLog(values.CmdList.MusicCmds.np, values.generalText.ErrorMsg.logs.music_nperror)
        sendErrorToDev(Discord, client, err, "whatsplaying")
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

function MusicFeatureDisabled(message) {
    sendStatusLog(values.generalText.ErrorMsg.logs.music_featuredisabledmsg)
    return message.channel.send(values.generalText.ErrorMsg.userend.music_featuredisabledmsg);

}


client.login(process.env.BOT_TOKEN); //connexion du bot au serveur de Discord