const Discord = require('discord.js')
const { sendCmdLog, sendStatusLog, sendErrorLog, sendFunctionLog, sendWarnLog } = require("../../debug/consolelogs")
const values = require('../../values.json')

//let randomtextchosen = ""

var addchance = 0

let andreapicked = []
let dylanpicked = []
let tatianapicked = []
let botpicked = []

let rang = 0

const list = [
    "910786353690718259", //Andrea
    "456117123283157002", //Dylan
    "861311210862411786", //Tatiana
    "830766885006999573"  //Zbeub Bot

]

module.exports = {
    "andreaeaster": function (mention) {

        let randomtextchosen = ""

        if (values.settings.RandomfunctionDeployed == false) {
            return randomtextchosen
        }

        const andreaegg = [
            `Faites attention ! **${mention.toString()}** vous dira sûrement \"tg\" !`,
            `**${mention.toString()}** vous conseille vivement de payer en \"u\" ! C'est très utile !`,
            `ZBEEEEEEUUUUUUUB !`,
            `*Le saviez-vous ?* Le verbe *groir* est un verbe qui signifie *grossir* ! Ce verbe a été inventée par ${mention.toString()} !`,
            `zbeub`,
            `yaaaaaaaaaaaaaaaaaaaaaaaa`,
            `UwU`,
            `UnU`,
            `OwO`,
            `ZBEUB !`,
            `*On peut payer en \"U\" !* -${mention.toString()}, 2021.`
        ]

        const tatianaegg = [
            `La bogossitude.`,
            `${mention.toString()}, future présidente !`,
            `La légende raconte que ${mention.toString()} change toujours de couleurs de cheveux xD !`,
            `TN Lacoste, coste, TN Lacoste, coste !`,
            `OnO`,
            `La bogossitude à son paroxysme !`,
            `${mention.toString()} quand elle voit un chat trop mimi sur Pinterest : **hiiiiiiiiiiiiiiiiiii** !`,
            `*Comment on fait danser Éric Zemmour ?* -${mention.toString()}, 2021`
        ]

        const dylanegg = [
            `*Installation de Windows 11...*, la seule phrase qui lui vient en tête.`,
            `*MAIS JE M'EN BR#NLE MATHIS !*, -${mention.toString()}, 2021.`,
            `Il est moche ${mention.toString()} OnO.`,
            `${mention.toString()} est nul à Fortnite...`,
            `${mention.toString()} s'est fait vraiment chier à coder un système d'easter egg aléatoire pour rien ptdr...`,
            `*Le saviez-vous ?* ${mention.toString()} a codé son premier programme sur PSP™ (une console de jeux portable) ! C'était un *homebrew* qui s'appelait le *Multi-fonctionnator* et qui possédait plein de fonctionnalités, tantôt utiles tantôt inutiles...`
        ]

        const zbeubbotegg = [
            `Oh coucou ! ^^`,
            `Pikachu est toujours ravi de te voir ! *Pika pikachu !!*`,
            `${mention.toString()} fait des calculs compliqués OnO... Il est en train de faire 2+2...`,
            `${mention.toString()} fait *bip bop bip bop*... OnO`,
            `Pika pika OwO !`
        ]

        let finduser = find(mention);

        sendStatusLog(`Fonction andreaeaster : L'utilisateur est-il présent sur la liste ? : ${finduser ? `Oui` : `Non`} (${finduser})`)

        if (finduser === false) {
            return randomtextchosen;
        }



        addchance = addchance + 0.02

        if (addchance > 1) {
            addchance = 1;
        }

        sendStatusLog("Fonction andreaeaster : Taux de chance ajoutée : " + Math.floor(addchance * 100) + "%")

        let randomnumberactivation = getRandomArbitrary(0, 0.35) + addchance

        if (randomnumberactivation > 1) {
            addchance = 0;
            randomnumberactivation = 1;
        }


        sendStatusLog(`Fonction andreaeaster : Taux de chance obtenue : ${Math.floor(randomnumberactivation * 100)}%`)

        if (randomnumberactivation <= 0.8) {
            return randomtextchosen;
        }

        addchance = 0;

        switch (mention.user.id) {
            case "910786353690718259": //Andrea
                randomtextchosen = chooserandomtext(andreaegg, andreapicked);
                break;
            case "456117123283157002": //Dylan
                randomtextchosen = chooserandomtext(dylanegg, dylanpicked);
                break;
            case "861311210862411786": //Tatiana
                randomtextchosen = chooserandomtext(tatianaegg, tatianapicked);
                break;
            case "830766885006999573": //Zbeub Bot
                randomtextchosen = chooserandomtext(zbeubbotegg, botpicked);
                break;
        }

        return randomtextchosen;

    },
    "setChanceTo": function (message) {
        const cmd = "z!setchanceto";

        let args = message.content.substr(cmd.length + 1).replace(",", ".");
        //let findargument = message.content.substr(cmd[0].length + 1);

        if (!args) {
            return message.channel.send(`La valeur de chance cumulée est actuellement de \`${addchance}\` (${Math.floor(addchance * 100)}%).`)
        }

        if (args > 1 || args < 0) {
            return message.channel.send("Cette valeur est incorrecte ou manquante.")
        }


        addchance = parseFloat(args)

        sendStatusLog(args)

        return message.channel.send(`La valeur de chance cumulée a été paramétrée sur \`${addchance}\` (${Math.floor(addchance * 100)}%).`)

    },
    "debugtest": (message) => {
        botpicked = [1,2,3,4]
        return message.channel.send("Commande réussie.")
    }
}

function find(mention) {
    for (i in list) {
        if (mention.user.id === list[i]) {
            return true;
        }
        i++;
    }
    return false;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function chooserandomtext(argument, pickedlist) {

    if (pickedlist.length === argument.length) {
        pickedlist.length = 0
    }

    rang = 0;

    functiontimes = 0;

    let randomvalue = Math.floor(Math.random() * argument.length);

    sendStatusLog(`Valeur tirée au sort : ${randomvalue}`)

    if (pickedlist.includes(randomvalue)) {
        sendStatusLog(`Fonction andreaeaster : randomvalue déjà utilisée.(Valeur tirée : ${randomvalue})`)
        while (pickedlist.includes(rang)) {
            functiontimes++
            if (rang > pickedlist.length) {
                rang = 0
            } else {
                rang++
            }
        }
        randomvalue = rang
        sendStatusLog(`Fonction de sélection linéaire utilisée ${functiontimes} fois.`)
    }

    pickedlist.push(randomvalue)

    sendStatusLog("Liste des valeurs déja tirées : "+pickedlist.sort((a, b) => a - b)+"\nValeur finale : "+randomvalue+"\nTaille de la liste : "+pickedlist.length)

    let randomtext = `\n\n${argument[randomvalue]}`

    return randomtext;

}