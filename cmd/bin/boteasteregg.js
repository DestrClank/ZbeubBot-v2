const values = require('../../values.json')
const fs = require('fs')
const readline = require('readline')
const { sendCmdLog, sendStatusLog, sendErrorLog, sendFunctionLog, sendWarnLog, sendLogToDev } = require("../../debug/consolelogs")


//fs.readFileSync('cmd/assets/boteasteregg/goodwords.txt', 'utf8'); sendStatusLog("Chargement du fichier \"cmd/assets/boteasteregg/goodwords.txt\"")

const goodwords = []

////////////Compliments
const eastereggphrases = [ //compliment "bon toutou"
    "merki OnO",
    "Je suis à ton service ^^ !",
    "Toujours là à ton service 😊 !",
    "Merci !! ^^",
    "Je suis pas un toutou, mais un Pikachu mais c'est pas grave tkt xD",
    "UwU",
    "OwO",
    "OnO",
    "UnU",
    "xD",
    "pika pika pikachuuuu 🥺",
    "Merci le reuf !",
    "Merci le sang, ça fait plaise 👍👍!",
    "Cimer le reuf 👍👍"
]

const compliments = [ // texte compliments
    "Ohhhhhw, merciii beaucoup ✨OwO✨ ! 🥺🥺😅",
    "Merci le reuf !",
    "Merci le sang, ça fait plaise 👍👍!",
    "Cimer le reuf 👍👍",
    "Merci !! ^^",
    "UwU",
    "OwO",
    "pika pika pikachuuuu 🥺"
]

const complimentsimage = [ //images compliments
    "https://cdn.discordapp.com/attachments/861314701668122644/935116775308283924/e132cafec428e6e02c31da5d57085531.jpg", //Pikachu yeux cute
    "https://cdn.discordapp.com/attachments/861314701668122644/935116775597678652/795021ade607f0bd5319636b546aa947.jpg", //Pikachu souriant 
    "https://cdn.discordapp.com/attachments/861314701668122644/935117589003268136/2e09fea1b1d06486ba5acec08f8fba98.jpg", //Pikachu souriant et saluant
    "https://cdn.discordapp.com/attachments/861314701668122644/935116775010467880/bd484a9e1fbc9c42d79dd1a1b8ccc028.jpg"  //Pikachu avec une casquette
]
////////////Injures
const injureseasteregg = [ //texte injures
     "toi-même",
     "\"C'est celui qui dit qui est.\" *-Sunnu, 2022.*",
     "C'est pas gentil ça.... 🥺🥺🥺",
     "\"Si vous le dites.\" *-Cortana, 20xx*"
]

const insultesimage = [ //images injures
    "https://cdn.discordapp.com/attachments/861314701668122644/935117589229740062/8200354424b3f05d99de413bb4a9c448.jpg", //Pikachu malheureux
    "https://cdn.discordapp.com/attachments/861314701668122644/935095324614213653/4a49a516b3b141d57c0f1b3b931252b0.jpg", //Pikachu triste avec les larmes aux yeux
    "https://cdn.discordapp.com/attachments/861314701668122644/935095324836524043/79f47ea128ee146ff6b69f6ffa051ca8.jpg", //Pikachu énervé
]

module.exports = async (message) => {

    const botmention = message.mentions.users.first() //récupération de la première mention
    var foundtest = false
    var analysiscount = 0

    if (botmention) { //si il y a une mention
        if (botmention.id === values.settings.ClientId) { //si le bot est mentionné
            sendStatusLog(`Le bot a été mentionné.`)
            if (message.content.toLowerCase().includes("bon toutou")) { //si quelqu'un dit "bon toutou"
                sendStatusLog(`${message.author.tag} a complimenté Zbeub Bot en disant \"bon toutou\".`)

                message.channel.sendTyping()
                await sleep(3000)
                sendStatusLog(`Envoi de la réponse.`)
                return message.channel.send(eastereggphrases[Math.floor(Math.random() * eastereggphrases.length)])
            }

              //si quelqu'un dit un compliment
            

            if (message.content.toLowerCase().includes("stupide") ||
                message.content.toLowerCase().includes("idiot") ||
                message.content.toLowerCase().includes("idiotte") ||
                message.content.toLowerCase().includes("inutile") ||
                message.content.toLowerCase().includes("con") || 
                message.content.toLowerCase().includes("conne")) {
                sendStatusLog(`${message.author.tag} a insulté Zbeub Bot.`) //si quelqu'un dit une insulte

                message.channel.sendTyping()
                await sleep(3000)
                sendStatusLog(`Envoi de la réponse.`)
                message.channel.send({ content: injureseasteregg[Math.floor(Math.random() * injureseasteregg.length)], files: [insultesimage[Math.floor(Math.random() * insultesimage.length)]] })

                return;
            }

            if (message.content.toLowerCase().includes("tu es en tn lacoste") ||
                message.content.toLowerCase().includes("tu est en tn lacoste") ||
                message.content.toLowerCase().includes("tu est en tn") ||
                message.content.toLowerCase().includes("tu es en tn") ||
                message.content.toLowerCase().includes("t'es en tn") ||
                message.content.toLowerCase().includes("t'est en tn") ||
                message.content.toLowerCase().includes("t'es en tn lacoste") ||
                message.content.toLowerCase().includes("t'est en tn lacoste")) { //si quelqu'un demande si il est en mode TN Lacoste
                sendStatusLog(`${message.author.tag} a fait remarquer à Zbeub Bot qu'il est en mode TN Lacoste.`)

                message.channel.sendTyping()
                await sleep(3000)
                sendStatusLog(`Envoi de la réponse.`)
                message.channel.send({ content: "Oue le sang 👍", files: ["https://cdn.discordapp.com/attachments/861314701668122644/935116775010467880/bd484a9e1fbc9c42d79dd1a1b8ccc028.jpg"] })

            }

            fs.readFileSync("cmd/assets/boteasteregg/goodwords.txt").toString().split(/\r?\n/).forEach(function (line) {
                analysiscount++
                if (message.content.toLowerCase().includes(line)) {
                    foundtest = true
                }
            })

            sendStatusLog(`${analysiscount} mots ont été comparés.`)

            if (foundtest == true) {

                sendStatusLog(`${message.author.tag} a complimenté Zbeub Bot.`)

                message.channel.sendTyping()
                await sleep(3000)
                sendStatusLog(`Envoi de la réponse.`)
                message.channel.send({ content: compliments[Math.floor(Math.random() * compliments.length)], files: [complimentsimage[Math.floor(Math.random() * complimentsimage.length)]] })

                return;
            } else {
                sendStatusLog(`Aucun compliment n'a été trouvé dans le message.`)
            }

        }
    }
}

function searchforgoodwords(message) {

    fs.readFileSync("cmd/assets/boteasteregg/goodwords.txt", 'utf-8').split(/\r?\n/).forEach(function (line) {
        if (message.content.toLowerCase().includes(line)) {
            return "true"
        } else {
            return "false"
        }
    })
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}