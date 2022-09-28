const fs = require('fs')
const ytdl = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')
const Discord = require('discord.js')
const NodeID3 = require('node-id3')
const values = require('../values.json')
const readline = require("readline")
const request = require('request')
const versionNumber = values.version.versionNumber
let users = []

const { sendCmdLog, sendStatusLog, sendErrorLog, sendFunctionLog, sendWarnLog, sendLogToDev } = require("../debug/consolelogs")
const { devNull } = require('os')

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

const charactertoreplace = "_"

const invalidspace = new RegExp(" ", "g")
const invalidesperluette = new RegExp('&', "g")
const invalidslash = new RegExp('/', "g")
const invalidslashinvert = new RegExp(/\\/, "g")
const invalidstar = new RegExp(/.*/, "g")
const invalidaccent = new RegExp('"', "g")
const invalidless = new RegExp('<', "g")
const invalidgreater = new RegExp('>', "g")
const invalidpoints = new RegExp(':', "g")
const invalidquestion = new RegExp(/.?/, "g")
const invalidbar = new RegExp('|', "g")

module.exports = {
    "convertfile": async function (message, args, ifSlash) {

        if (ifSlash === true) {
            var authorid = message.user.id
        } else {
            var authorid = message.author.id
        }

        var doesExist = users.some(function(ele) {
            return ele.id === authorid;
        });

        var data = users.find(function (ele) {
            return ele.id === authorid;
        });

        if (!fs.existsSync("./output")) {
            fs.mkdirSync("./output")
        }

        if (args == "") {
            if (doesExist) {

                if (users[users.findIndex(v => v.id === message.author.id)].progress == null) {
                    var progressnumber = "Pas encore démarrée"
                } else {
                    var progressnumber = `${users[users.findIndex(v => v.id === message.author.id)].progress}% effectuées (${users[users.findIndex(v => v.id === message.author.id)].timestamp}/${convertHMS(users[users.findIndex(v => v.id === message.author.id)].duration)})`
                }

                return message.channel.send(`Votre fichier est en cours de traitement.\nTitre : \`${users[users.findIndex(v => v.id === message.author.id)].songtitle}\`\nDurée : \`${convertHMS(users[users.findIndex(v => v.id === message.author.id)].duration)}\`\nProgression : \`${progressnumber}\``)
            } else {
                return message.channel.send("Pour convertir une vidéo YouTube en fichier musique, copiez-collez un lien YouTube après la commande.\nAttention : la vidéo doit durer moins de 20 minutes.\n\nExemple : \`\`\`\nz!ytconvert https://www.youtube.com/watch?v=dQw4w9WgXcQ\ \n\`\`\`")
            }
        }

        if (doesExist) {
            sendWarnLog("Fonction ytconvert : Une conversion est déjà en cours pour l'utilisateur.")
            if (ifSlash === true) {
                return message.editReply("Une conversion est déjà en cours. Patientez avant de relancer une autre.")
            } else {
                return message.channel.send("Une conversion est déjà en cours. Patientez avant de relancer une autre.")
            }
        }

        let futurefilename = ""
        try {
            let validate = await ytdl.validateURL(args)

            if (!validate) {
                sendWarnLog("Fonction ytconvert : Le lien YouTube n'est pas valide.")
                if (ifSlash === true) {
                    return message.editReply("Ce lien n'est pas valide.")
                } else {
                    return message.channel.send("Ce lien n'est pas valide.")
                }
            }
        } catch (error) {
            sendErrorLog("Une erreur de validation du lien s'est produite.", error)
            if (ifSlash === true) {
                return message.editReply("Une erreur s'est produite lorsque le bot doit valider le lien YouTube.")
            } else {
                return message.channel.send("Une erreur s'est produite lorsque le bot doit valider le lien YouTube.")
            }
        }

        sendStatusLog("Fonction ytconvert : Récupération des métadonnées de la vidéo YouTube.")

        try {
            var songInfo = await ytdl.getInfo(args)
        } catch (error) {
            sendErrorLog("Une erreur de récupération des métadonnées de la vidéo s'est produite.", error)
            if (ifSlash === true) {
                return message.editReply("Une erreur s'est produite pendant la récupération des informations de la vidéo.")
            } else {
                return message.channel.send("Une erreur s'est produite pendant la récupération des informations de la vidéo.")
            }
        }

        let songtitle = songInfo.videoDetails.title
        let duration = songInfo.videoDetails.lengthSeconds
        let artist = songInfo.videoDetails.author.name
        let thumbnail = songInfo.videoDetails.thumbnails[0].url

        let tick = 0;

        //sendStatusLog(songInfo.videoDetails.thumbnails)

        let thumbnailbuffer = await getThumbnail({
            url: songInfo.videoDetails.thumbnails[3].url,
            method: "get",
            encoding: null
        }, authorid)

        let userclient = {
            id: authorid,
            songtitle: songtitle,
            duration: duration,
            artist: artist,
            progress: null,
            timestamp: null
        }

        if (duration > 7200) {
            sendWarnLog("Fonction ytconvert : La vidéo dépasse 2 heures.")
            if (ifSlash === true) {
                return message.editReply("Cette vidéo dépasse 2 heures de longueur. Impossible de la traiter.")
            } else {
                return message.channel.send("Cette vidéo dépasse 2 heures de longueur. Impossible de la traiter.")
            }
        }

        users.push(userclient)

        if (invalidwindowsnames.includes(songtitle.toLowerCase())) {
            sendStatusLog("Fonction ytconvert : Le titre contient un nom incompatible pour les noms de fichiers Windows.")
            futurefilename = "filename_" + songtitle + "_"
        } else {
            futurefilename = songtitle
        }

        let finalfilename = futurefilename.replace(/[/\\?%*:|"<>]/g, "_") + ".mp3"

        //console.log('\\')

        let outputfile = fs.createWriteStream(`./output/output_${authorid}.mp3`)
        

        let mp3tags = {
            title: songtitle,
            artist: artist,
            APIC: thumbnailbuffer
        }

        try {
            var stream = await ytdl(args, { filter: 'audioonly', highWaterMark: 1 << 25 })
        } catch (error) {
            sendErrorLog("Une erreur de récupération du flux s'est produite.", error)
            fs.unlinkSync(`./output/output_${authorid}.mp3`)
            removeItemOnce(users, authorid)
            if (ifSlash === true) {
                return message.editReply("Une erreur s'est produite pendant la récupération de la vidéo.")
            } else {
                return message.channel.send("Une erreur s'est produite pendant la récupération de la vidéo.")
            }
        }



        //let output = fs.createWriteStream('testing/output/outputtemp')

        sendStatusLog("Fonction ytconvert : Conversion de la vidéo en cours...")
        if (ifSlash === true) {
            message.editReply("Conversion de la vidéo en cours...")
        } else {
            var messagestatus = message.channel.send("Conversion de la vidéo en cours...")
        }

        convert = ffmpeg(stream)
            .audioCodec('libmp3lame')
            .format('mp3')
            .on('stderr', function (stderr) {
                sendStatusLog(stderr)
            })
            .on("progress", function (progress) {
                let currenttimemark = progress.timemark.split(".")
                let gethhmmss = currenttimemark[0].split(":")
                let currentseconds = (+gethhmmss[0]) * 60 * 60 + (+gethhmmss[1]) * 60 + (+gethhmmss[2]); 
                let timestamp = Math.floor(currentseconds*100/duration)
                //console.log(progress.timemark)
                tick++
                if (tick == 5) {
                    userclient.progress = timestamp
                    userclient.timestamp = progress.timemark
                    if (ifSlash === true) {
                        message.editReply("Conversion de la vidéo en cours... : \nProgression : \`"+timestamp+"% effectuées\`\nTemps converti/Temps total :\`"+progress.timemark+"/"+convertHMS(duration)+"\`")
                    } 
                    tick = 0
                }
            }) 
            .on('end', async function () {
                await NodeID3.write(mp3tags, outputfile.path)
                rawfilesize = fs.statSync(`./output/output_${authorid}.mp3`).size
                filesize = fs.statSync(`./output/output_${authorid}.mp3`).size / 1000000.0
                sendStatusLog(`Taille de fichier : ${returnfilesize(rawfilesize)}`)
                sendStatusLog(`Nom de fichier final : ${finalfilename}`)
                if (filesize > 8) {
                    sendStatusLog("Le fichier est trop lourd et ne peut pas être envoyé via Discord.")

                    if (fs.existsSync("./.noping")) {
                        var downloadlink = `http://localhost:3000/download/${authorid}`
                    } else {
                        var downloadlink = `https://zbeubbot.herokuapp.com/download/${authorid}`
                    }

                    sendStatusLog("Envoi du message en cours.")

                    let embedFinalResult = new Discord.MessageEmbed()
                    .setColor(values.settings.embedColor)
                    .setThumbnail(thumbnail)
                    .setTitle("Cliquez ici pour télécharger")
                    .setURL(downloadlink)
                    .setDescription("Votre vidéo a été convertie avec succès.")
                    .setFooter({ text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl })
                    .addFields(
                        { name: `Titre de la vidéo :`, value: songtitle },
                        { name: `Auteur de la vidéo :`, value: artist },
                        { name: `Durée de la vidéo :`, value: convertHMS(duration), inline: true },
                        { name: `Taille du fichier :`, value: returnfilesize(rawfilesize), inline: true },
                        { name: "Attention : ", value: "*Votre fichier sera supprimé du serveur au bout d'une heure.*"}
                    )

                    const row = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setLabel('Cliquez ici pour télécharger')
                            .setStyle('LINK')
                            .setURL(downloadlink)
                    );
                    
                    removeItemOnce(users, authorid)
                    if (ifSlash === true) {
                        sendStatusLog("Envoi du message terminé.")
                        return message.editReply({content: "Votre vidéo a été convertie avec succès.",embeds: [embedFinalResult], components: [row]})
                    } else {
                        sendStatusLog("Envoi du message terminé.")
                        return message.channel.send({content: "Votre vidéo a été convertie avec succès." ,embeds: [embedFinalResult], components: [row]})
                    }

                }

                sendStatusLog("La conversion demandée est terminée.")

                if (ifSlash === true) {
                    message.editReply("La conversion est terminée. Votre fichier sera envoyé dans très peu de temps.")
                } else {
                    message.channel.send("La conversion est terminée. Votre fichier sera envoyé dans très peu de temps.")
                }
                
                await sleep(5000)
                sendStatusLog("Envoi du fichier...")

                if (ifSlash === true) {
                    message.editReply("Votre fichier est en cours d'envoi...")
                } else {
                    message.channel.send("Votre fichier est en cours d'envoi...")
                }

                attachment = new Discord.MessageAttachment(`./output/output_${authorid}.mp3`, finalfilename)
                //fs.renameSync(`./output/output_${message.author.id}.mp3`, `./output/${finalfilename}.mp3`)

                let embedFinalResult = new Discord.MessageEmbed()
                    .setColor(values.settings.embedColor)
                    .setThumbnail(thumbnail)
                    .setDescription("Votre vidéo a été convertie avec succès.")
                    .setFooter({ text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl })
                    .addFields(
                        { name: `Titre de la vidéo :`, value: songtitle },
                        { name: `Auteur de la vidéo :`, value: artist },
                        { name: `Durée de la vidéo :`, value: convertHMS(duration), inline: true },
                        { name: `Taille du fichier :`, value: returnfilesize(rawfilesize), inline: true }
                )

                if (ifSlash === true) {
                    await message.editReply({content: "Votre fichier a été envoyé avec succès.", embeds: [embedFinalResult], files: [attachment] })
                        .then(() => {
                            fs.unlinkSync(`./output/output_${authorid}.mp3`)
                            fs.unlinkSync(`./output/thumbnail_${authorid}.png`)
                            removeItemOnce(users, authorid)
                            sendStatusLog("Envoi du fichier terminée.")
                        })
                        .catch((error) => {
                            fs.unlinkSync(`./output/output_${authorid}.mp3`)
                            fs.unlinkSync(`./output/thumbnail_${authorid}.png`)
                            sendErrorLog("Le fichier n'a pas réussi à s'envoyer.", error)
                            removeItemOnce(users, authorid)
                            message.editReply("Le fichier n'a pas pu être envoyée à cause d'une erreur.")
                        })
                } else {
                    await message.channel.send({ embeds: [embedFinalResult], files: [attachment] })
                        .then(() => {
                            fs.unlinkSync(`./output/output_${authorid}.mp3`)
                            fs.unlinkSync(`./output/thumbnail_${authorid}.png`)
                            removeItemOnce(users, authorid)
                            sendStatusLog("Envoi du fichier terminée.")
                        })
                        .catch((error) => {
                            fs.unlinkSync(`./output/output_${authorid}.mp3`)
                            fs.unlinkSync(`./output/thumbnail_${authorid}.png`)
                            sendErrorLog("Le fichier n'a pas réussi à s'envoyer.", error)
                            removeItemOnce(users, authorid)
                            message.channel.send("Le fichier n'a pas pu être envoyée à cause d'une erreur.")
                        })
                }
            })
            .on('error', function (error) {
                sendErrorLog("Une erreur de conversion s'est produite.", error)
                fs.unlinkSync(`./output/output_${authorid}.mp3`)
                fs.unlinkSync(`./output/thumbnail_${authorid}.png`)
                removeItemOnce(users, authorid)
                if (ifSlash === true) {
                    message.editReply("Une erreur s'est produite pendant la conversion.")
                } else {
                    message.channel.send("Une erreur s'est produite pendant la conversion.")
                }
            })
            .pipe(outputfile)

    },
    "convertingprocesses": users
    //await message.channel.send({ content: "La musique demandée a fini d'être convertie.", files: ["testing/output/output.mp3"] })
}

async function getThumbnail(options, authorid) {
    sendStatusLog("Fonction ytconvert : Récupération de la miniature de la vidéo.")
    let thumbnailfile = fs.createWriteStream(`./output/thumbnail_${authorid}.png`)

    await request
        .get(options.url)
        .on('error', (err) => {
            sendErrorLog("Une erreur est survenue pendant la récupération de la miniature.", err)
        })
        .pipe(thumbnailfile)

    return thumbnailfile.path
}

function returnfilesize(size) {

    if (size <= 1000) {
        return `${size} bytes`
    }

    if (size > 1000 && size <= 1000000) {
        return `${(size / 1000).toFixed(2)} KB`
    }

    if (size > 1000000) {
        return `${(size / 1000000).toFixed(2)} MB`
    }

}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function findUser(arr, message) {
    var doesExist = arr.some(function(ele) {
        return ele.id === message.author.id;
    });

    return doesExist;

}

function findValue(arr, message) {
    var data = arr.find(function(ele) {
        return ele.id === message.author.id;
    });

    return data;
}

function removeItemOnce(arr, value) {
    arr.splice(arr.findIndex(v => v.id === value), 1);
    //if (index > -1) {
    //    arr.splice(index, 1);
    //}
    return arr;
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
