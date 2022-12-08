const discordTTS=require("discord-tts");
const {AudioPlayer, AudioPlayerStatus, createAudioResource, StreamType, entersState, VoiceConnectionStatus, joinVoiceChannel} = require("@discordjs/voice");
const { Message } = require("discord.js");
const { Collection } = require("mongoose");



module.exports.speakTTS = speakTTS

/*
    Langues disponibles : 
    fr : Français
    en : Anglais (English)
    pt : Portugais (Português)
*/

async function speakTTS(msg) {
    let text = msg.content.substr(6)

    if (!text) {
        msg.channel.send("Pas de texte après.")
        return;
    }

    let voiceConnection;
    let audioPlayer=new AudioPlayer();

    const stream=discordTTS.getVoiceStream(text, {lang : "fr"});
    const audioResource=createAudioResource(stream, {inputType: StreamType.Arbitrary, inlineVolume:true});
    if(!voiceConnection || voiceConnection?.status===VoiceConnectionStatus.Disconnected){
        voiceConnection = joinVoiceChannel({
            channelId: msg.member.voice.channelId,
            guildId: msg.guildId,
            adapterCreator: msg.guild.voiceAdapterCreator,
        });
        voiceConnection=await entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5_000);
    }
    
    if(voiceConnection.status===VoiceConnectionStatus.Connected){
        voiceConnection.subscribe(audioPlayer);
        audioPlayer.play(audioResource);

        audioPlayer.on(AudioPlayerStatus.Idle, async () => {
            await voiceConnection.destroy()
        }) 
    }

}