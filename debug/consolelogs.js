const values = require("../values.json");

const { MessageEmbed } = require('discord.js')

const fs = require('fs')
const { Console } = require('console')
const nowfilename = new Date();

//export { sendCmdLog, sendStatusLog, sendErrorLog, sendFunctionLog, sendWarnLog, sendLogToDev } from this

let time = getTimeFileName()
let date = `${nowfilename.getFullYear()}-${(nowfilename.getMonth()+1)}-${nowfilename.getDate()}`

if (!fs.existsSync("logs")) {
    console.warn("Le dossier logs n'existe pas. Par conséquent il sera crée.")
    fs.mkdirSync("logs")
}

const logfilename = `systemlog_${values.version.shortversionNumber}_${date}_${getTimeFileName()}.log`

const logfile = fs.createWriteStream(`logs/${logfilename}`)
//fs.writeFileSync(logfile.path, `///Zbeub Bot Version ${values.version.versionNumber}`)

logfile.write(`///Zbeub Bot Version ${values.version.versionNumber}\n///${getDateAndTime()}\n\n`)

const Logger = new Console({
    stdout: logfile,
    stderr: logfile
})



module.exports = {
    "sendCmdLog": function(cmd, guildname, username) {
        Logger.log("[LOG]"+getDateAndTime()+values.generalText.GeneralLogsMsg.GeneralCmdLog.CmdGet+ " " +cmd+ " sur le serveur : " + guildname + " par l'utilisateur : " + username);
        console.log(values.generalText.GeneralLogsMsg.GeneralCmdLog.CmdGet+ " " +cmd+ " sur le serveur : " + guildname + " par l'utilisateur : " + username);
    },
    "sendStatusLog": function(log) {
        Logger.log("[LOG]"+getDateAndTime()+log);
        console.log(log);
    },
    "sendErrorLog": function(log, error) {
        Logger.error("[ERROR]"+getDateAndTime()+log+"\n"+error.stack)
        console.error(log+"\n"+error.stack)
    },
    "sendCrashLog": function (error) {
        Logger.error("[ERROR]" + getDateAndTime() + "Une erreur sérieuse qui a provoqué l'arrêt du bot s'est produite." + "\n" + error.stack)
        console.error("Une erreur sérieuse qui a provoqué l'arrêt du bot s'est produite." + "\n" + error.stack)
    },
    "sendFunctionLog": function(func, log) {
        Logger.log("[LOG]"+getDateAndTime()+func+" : "+log)
        console.log(func+" : "+log)
    },
    "sendWarnLog": function(log) {
        Logger.warn("[WARN]"+getDateAndTime()+log)
        console.warn(log)
    },
    "sendLogToDev": function(message) {
        statsfile = fs.statSync(logfile.path)
        size = statsfile.size / 1000
        logdate = `${nowfilename.getDate()}/${(nowfilename.getMonth()+1)}/${nowfilename.getFullYear()}`
        return message.channel.send({content: `Voici le fichier log du **${logdate}** : \n\nNom de fichier : \`${logfilename}\`\nHeure de création : \`${getCreationTime()}\`\nTaille : \`${size} KB\`` , files: [logfile.path]})
    },
    "logfilepath": logfile.path
}

function getDateAndTime() {
    let nowtime = new Date()
    let hours = nowtime.getHours()
    let minutes = nowtime.getMinutes()
    let seconds = nowtime.getSeconds()

    if (hours < 10) {
        hours = '0' + hours
    }

    if (minutes < 10) {
        minutes = '0'+ minutes
    }

    if(seconds < 10) {
        seconds = '0' + seconds
    }

    timenow = `[${hours}:${minutes}:${seconds}]`
    datenow = `[${nowtime.getFullYear()}/${(nowtime.getMonth()+1)}/${nowtime.getDate()}]`

    return datenow+timenow+" "

}

function getCreationTime() {
    let hours = nowfilename.getHours()
    let minutes = nowfilename.getMinutes()
    let seconds = nowfilename.getSeconds()

    if (hours < 10) {
        hours = '0' + hours
    }

    if (minutes < 10) {
        minutes = '0'+ minutes
    }

    if(seconds < 10) {
        seconds = '0' + seconds
    }

    return hours + ":" + minutes + ":" + seconds

}

function getTimeFileName() {
    let nowtime = new Date()
    let hours = nowtime.getHours()
    let minutes = nowtime.getMinutes()
    let seconds = nowtime.getSeconds()

    if (hours < 10) {
        hours = '0' + hours
    }

    if (minutes < 10) {
        minutes = '0'+ minutes
    }

    if(seconds < 10) {
        seconds = '0' + seconds
    }

    return hours + "-" + minutes + "-" + seconds

}