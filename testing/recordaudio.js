const { entersState, joinVoiceChannel, VoiceConnectionStatus, EndBehaviorType } = require('@discordjs/voice');
const { createWriteStream } = require('node:fs');
const prism = require('prism-media');
const { pipeline } = require('node:stream');
const { Client, Intents, MessageAttachment, Collection } = require('discord.js');
const ffmpeg = require('ffmpeg');
const sleep = require('util').promisify(setTimeout);
const fs = require('fs');
const { sendCmdLog, sendStatusLog, sendErrorLog, sendFunctionLog, sendWarnLog, sendLogToDev } = require("../debug/consolelogs")

var ifrecording = true;
var usertalked = false;

/* When message is sent*/
module.exports = async (message, client) => {
    /* If content starts with `!record` */
        /* If member do not have admin perms */
        //if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send("Vous n'avez pas les autorisations nécessaires pour utiliser cette commande."); 
        /* Get the voice channel the user is in */
        const voiceChannel = message.member.voice.channel
        /* Check if the bot is in voice channel */
        let connection = client.voiceManager.get(message.channel.guild.id)

        /* If the bot is not in voice channel */
        if (!connection) {
            /* if user is not in any voice channel then return the error message */
            if(!voiceChannel) return message.channel.send("Vous devez être dans un salon vocal pour utiliser cette commande.")
            
            /* Join voice channel*/
            connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                selfDeaf: false,
                selfMute: true,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            ifrecording = true
            usertalked = false
            message.guild.me.voice.setDeaf(false)

            if (!fs.existsSync("./output")) {
                fs.mkdirSync("./output")
            }

            if (!fs.existsSync("./output/recordings")) {
                fs.mkdirSync("./output/recordings")
            }

            /* Add voice state to collection */
            client.voiceManager.set(message.channel.guild.id, connection);
            await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
            const receiver = connection.receiver;

            /* When user speaks in vc*/
            receiver.speaking.on('start', (userId) => {
                if(userId !== message.author.id) return;
                /* create live stream to save audio */
                if (ifrecording == true) {
                    usertalked = true;
                    createListeningStream(receiver, userId, client.users.cache.get(userId));
                }
            });

            /* Return success message */
            return message.channel.send(`🎙️ Le bot enregistre ce salon : \`${voiceChannel.name}\` et cet utilisateur : \`${message.author.tag}\`\n\nRefaites \`z!record\` pour arrêter l'enregistrement.`);
        
            /* If the bot is in voice channel */
        } else if (connection) {
            /* Send waiting message */
            sendStatusLog("Arrêt de l'enregistrement en cours...")
            const msg = await message.channel.send("Merci de patienter pendant que le bot prépare l'enregistrement...")
            message.guild.me.voice.setDeaf(true, "Le bot se met en sourdine pour arrêter l'enregistrement. Il rétablira le son à la fin de l'opération.")
            sendStatusLog("Le bot s'est mis en sourdine serveur.")
            ifrecording = false
            /* wait for 5 seconds */
            await sleep(5000)

            if (!usertalked) {
                sendStatusLog("Le bot n'a enregistré aucun son. Le bot va quitter le salon vocal.")
                msg.edit("Le bot n'a enregistré aucun son. Le bot va quitter le salon vocal.")
                client.voiceManager.delete(message.channel.guild.id)
                message.guild.me.voice.setDeaf(false, "Le bot rétablie le son car l'opération est terminée.")
                sendStatusLog("Le bot a rétabli le son sur le serveur.")
                await sleep(1000)
                connection.destroy();
                sendStatusLog("Le bot a quitté le salon vocal sur le serveur.")
                return;
            }
            
            /* disconnect the bot from voice channel */

            /* Remove voice state from collection */
            client.voiceManager.delete(message.channel.guild.id)
            
            const filename = `./output/recordings/${message.author.id}`;

            /* Create ffmpeg command to convert pcm to mp3 */
            const process = new ffmpeg(`${filename}.pcm`);
            process.then(function (audio) {
                audio.fnExtractSoundToMP3(`${filename}.mp3`, async function (error, file) {
                    //edit message with recording as attachment
                    await msg.edit({
                        content: `🔉 Votre enregistrement a été envoyé avec succès.`,
                        files: [new MessageAttachment(`./output/recordings/${message.author.id}.mp3`, 'recording.mp3')]
                    }).catch(async (err) => {
                        sendErrorLog("Le bot n'a pas réussi à envoyer le fichier.", err)
                        fs.unlinkSync(`${filename}.pcm`)
                        fs.unlinkSync(`${filename}.mp3`)
                        message.guild.me.voice.setDeaf(false, "Le bot rétablie le son car l'opération est terminée.")
                        sendStatusLog("Le bot a rétabli le son sur le serveur.")
                        await sleep(1000);
                        connection.destroy();
                        sendStatusLog("Le bot a quitté le salon vocal sur le serveur.")
                        return;
                    });

                    //delete both files
                    fs.unlinkSync(`${filename}.pcm`)
                    fs.unlinkSync(`${filename}.mp3`)
                    
                    message.guild.me.voice.setDeaf(false, "Le bot rétablie le son car l'opération est terminée.")
                    sendStatusLog("Le bot a rétabli le son sur le serveur.")
                    await sleep(1000);
                    connection.destroy();
                    sendStatusLog("Le bot a quitté le salon vocal sur le serveur.")
                    
                    //msg.user.selfMute(false, "L'utilisateur est démuté car l'opération du bot est terminée.")
                });
            }, async function (err) {
                /* handle error by sending error message to discord */
                //msg.user.selfMute(false, "L'utilisateur est démuté car l'opération du bot est terminée.")
                sendErrorLog("Le bot n'a pas réussi à préparer l'enregistrement.", err)
                message.guild.me.voice.setDeaf(false, "Le bot rétablie le son car l'opération est terminée.")
                sendStatusLog("Le bot a rétabli le son sur le serveur.")
                await sleep(1000);
                connection.destroy();
                sendStatusLog("Le bot a quitté le salon vocal sur le serveur.")
                return msg.edit(`❌ Une erreur est survenue pendant la préparation de l'enregistrement. Code d'erreur : ${err.message}`);
            });

        }
}

//------------------------- F U N C T I O N S ----------------------//

/* Function to write audio to file (from discord.js example) */
function createListeningStream(receiver, userId, user) {
    const opusStream = receiver.subscribe(userId, {
        end: {
            behavior: EndBehaviorType.AfterSilence,
            duration: 100,
        },
    });

    const oggStream = new prism.opus.OggLogicalBitstream({
        opusHead: new prism.opus.OpusHead({
            channelCount: 2,
            sampleRate: 48000,
        }),
        pageSizeControl: {
            maxPackets: 10,
        },
    });

    const filename = `./output/recordings/${user.id}.pcm`;

    const out = createWriteStream(filename, { flags: 'a' });
    sendStatusLog(`Démarrage de l'enregistrement de : ${filename}`);

    pipeline(opusStream, oggStream, out, (err) => {
        if (err) {
            sendWarnLog(`❌ Une erreur est survenue pendant l'enregistrement de : ${filename} - ${err.message}`);
        } else {
            sendStatusLog(`✅ Enregistré : ${filename}`);
        }
    });
}