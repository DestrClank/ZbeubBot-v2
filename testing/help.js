const { MessageEmbed, Message, MessageActionRow, MessageSelectMenu } = require('discord.js'); //Chargement module Discord
const values = require('../values.json');

const versionNumber = values.version.versionNumber

var state = false;

const embedHelpHome = new MessageEmbed()
    .setColor(values.settings.embedColor)
    .setTitle("Aide de Zbeub Bot 😊")
    .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
    .addFields({
        name : "Bienvenue dans l'aide de Zbeub Bot !", value: "Coucou, tu as besoin d'aide ? Ca tombe bien, je suis là pour t'aider ! ^^ \n Choisis en bas la catégorie que tu veux voir et Pikachu t'indiquera le chemin !"
    });

const embedInfoBotCategory = new MessageEmbed()
    .setColor(values.settings.embedColor)
    .setTitle("Aide de Zbeub Bot 😊")
    .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
    .addFields({
        name: "Aide et informations", value: `
\`z!help\` : Affiche l'aide.
L'aide est aussi disponible en ligne sur https://ZbeubBot-v2.dylanvassalo.repl.co !
        
\`z!about\` : Affiche des informations à propos du bot (patch note).
\`z!changelog\` : Affiche le changelog complet du bot.
\`z!credits\` : Affiche les crédits.
\`z!botusage\` : Affiche des informations statistiques concernant le bot.
\`z!ping\` : Calcule le temps de latence entre le bot et l'API.
\`z!infos\` : Affiche des informations importantes concernant l'avenir des bots musicaux et de Zbeub Bot (il y a aussi les commentaires du créateur).
*Toutes les commandes dans ce paragraphe sont aussi disponibles en commandes slash.*`
    });

const embedInstallCategory = new MessageEmbed()
    .setColor(values.settings.embedColor)
    .setTitle("Aide de Zbeub Bot 😊")
    .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
    .addFields({
        name: "Installation et configuration", value: `
**Ces commandes nécessitent d'avoir la permission** \`Administrateur\` **pour être utilisables.**
\`z!installslashcommands\` : Installe les commandes slash et les commandes d'application sur le serveur.
\`z!deleteslashcommands\` : Supprime les commandes slash et les commandes d'application sur le serveur.`
    });

const embedSocialCategory = new MessageEmbed()
    .setColor(values.settings.embedColor)
    .setTitle("Aide de Zbeub Bot 😊")
    .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
    .addFields({
        name: "Fun et social", value: `
*Arguments acceptés :* \`@mention\`,\`random\`
\`z!hello\` : Dit bonjour à quelqu'un.
\`z!error\` : Envoie un message d'erreur.
\`z!attack\` : Pikachu fera une attaque Boule Elek à quelqu'un.
\`z!dance\` : Pikachu fera une danse à quelqu'un.
\`z!hug\` : Pikachu fera un câlin à quelqu'un.
\`z!chewie\` : Christina Pikachu Cordon Bleu vous sortira sa meilleure phrase !
\`z!wala\` : Vous jurez que ce n'est pas vous ??
\`z!mtm\` : Kirby vous transmettra un joli message !
\`z!zemmour\` : Ça ne rigole plus là OnO !
\`z!nice\` : Nice...
\`z!bogossitude\` : La bogossitude à son paroxysme.`
    });

const embedSlashCommandsCategory = new MessageEmbed()
.setColor(values.settings.embedColor)
.setTitle("Aide de Zbeub Bot 😊")
.setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
.addField("Commandes slash", `
*Les commandes slash doivent être installés via une commande décrite dans* **"Installation"** *pour être utilisables.*
\`/sendmessage\` : Le bot enverra le message que vous avez saisi.
\`/embed\` : Le bot enverra le message que vous avez saisi sous la forme d'un "embed".
\`/error\` : Envoie un message d'erreur.
\`/test\` : Teste la fonction commande slash.
\`/ping\`: Fait un ping-pong.`);

const embedMembersCategory = new MessageEmbed()
.setColor(values.settings.embedColor)
.setTitle("Aide de Zbeub Bot 😊")
.setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
.addField("Informations de membres", `
*Arguments nécessaires :* \`@mention\`
\`z!showinfoaboutmember\` : Affiche des informations à propos d'un membre.
\`z!membercard\` : Envoie une carte de profil d'un membre.`);

const embedMiscCategory = new MessageEmbed()
.setColor(values.settings.embedColor)
.setTitle("Aide de Zbeub Bot 😊")
.setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
.addField("Autres", `
\`z!ytconvert <lien>\` : Permet de convertir une vidéo YouTube en fichier musique (.mp3).
*Cette commande est utilisable également par commande slash.*
*La vidéo ne doit pas dépasser 2 heures.*
*Remarque : Cette amélioration de la commande est en cours de test et peut rendre le bot instable.
Il est pour le moment préférable de rester sur l'ancienne règle de 20 minutes.*

\`z!record\` : Enregistre la voix d'un utilisateur dans un salon vocal.
*Cette commande est en version alpha pour le moment et doit être testée.*
*L'utilisateur qui réalise la commande est le seul qui est enregistré même si plusieurs personnes sont présents dans un même salon vocal.*
*La fonctionnalité musicale ne peut pas être utilisée en même temps que l'enregistrement de la voix.*

\`z!createinvite\` : Crée un lien d'invitation vers ce salon.`)

const embedMusicCategory = new MessageEmbed()
.setColor(values.settings.embedColor)
.setTitle("Aide de Zbeub Bot 😊")
.setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
.addField("Musique", `
**Pour effectuer ces commandes, soyez dans un salon vocal avant !**
\`z!play <mots-clés ou lien>\` : Joue de la musique via le lien YouTube ou effectue une recherche. 
\`z!skip\` : Permet de passer la musique.
\`z!stop\` : Stoppe la musique.
\`z!loop\` : Boucle la musique en cours de lecture.
\`z!queue\` : Affiche la liste de lecture.
\`z!pause\` : Met en pause la musique.
\`z!resume\` : Met en lecture la musique.
\`z!volume <0-200>\` : Règle le volume sonore de la musique.
\`z!np\` : Affiche la musique en cours de lecture.
\`z!qp\` : Recherche la musique sur YouTube et lance immédiatement la lecture ou l'ajoute dans la liste de lecture. La commande fonctionne avec les liens également.
*Ces commandes sont utilisables par les commandes slash également.*`)
//.addField("Musique", "Les commandes musicales sont désactivées, tapez la commande \`z!infos\` pour avoir plus d'informations concernant la désactivation des commandes musicales.");

const menu = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
            .setCustomId('helpselect')
            .setPlaceholder('Choisissez la catégorie...')
            //.setMinValues(1)
            //.setMaxValues(5)
            .addOptions([
                {
                    label: "Accueil",
                    description: "Retourne à l'accueil.",
                    value: "Home_Page",
                    emoji: {
                        id: "996019618630086696",
                        name: "home"
                    }
                },
                {
                    label: "Aide et informations",
                    description: "Utilisation du bot, informations sur le bot, patch notes et changelogs.",
                    value: "InfoBot_Category",
                    emoji: {
                        id: "996019621775814706",
                        name: "help"
                    }
                },
                {
                    label: "Installation et configuration",
                    description: "Installation des commandes slash et configuration du bot.",
                    value: "Install_Category",
                    emoji: {
                        id: "996019609369059328",
                        name: "install"
                    }
                },
                {
                    label: "Fun et social",
                    description: "Commandes d'interactions sociales amusantes.",
                    value: "Social_Category",
                    emoji: {
                        id: "996019626980946000",
                        name: "social"
                    }
                },
                {
                    label: "Commandes slash",
                    description: "Envoyer un embed, envoyer un message, effectuer un ping serveur...",
                    value: "SlashCmd_Category",
                    emoji: {
                        id: "996026046082207754",
                        name: "slashcmd"
                    }
                },
                {
                    label: "Informations de membres",
                    description: "Commandes qui donnent des informations concernant des membres d'un serveur.",
                    value: "Member_Category",
                    emoji: {
                        id: "996019614297362503",
                        name: "member"
                    }
                },
                {
                    label: "Musique",
                    description: "Le bot peut lire de la musique dans un salon vocal via YouTube.",
                    value: "Music_Category",
                    emoji: {
                        id: "996019605246054452",
                        name: "music"
                    }
                },
                {
                    label: "Autres commandes",
                    description: "Commandes spécifiques et particulières.",
                    value: "Misc_Category",
                    emoji: {
                        id: "996019630915199026",
                        name: "misc"
                    }
                },
                {
                    label: "Fermer",
                    description: "Quitte l'aide",
                    value: "Close_Help",
                    emoji: {
                        id: "996026042290544701",
                        name: "close"
                    }
                }
            ]))

module.exports = {
    "sendHelp" : async function (message, ifslash) {

    //addFieldMusic();
    if (ifslash === true) {
	    return await message.reply({embeds: [embedHelpHome], components: [menu]});
    } else {
        let channel = message.channel
        message.delete()
        return channel.send({embeds: [embedHelpHome], components: [menu]})
    }
    },
    "modifyHelp": async function (message, ifSlash, value) {
        switch (value) {
            case "Home_Page":
                return message.update({embeds: [embedHelpHome]})
            case "InfoBot_Category":
                return message.update({embeds: [embedInfoBotCategory]})
            case "Install_Category":
                return message.update({embeds: [embedInstallCategory]})
            case "Social_Category":
                return message.update({embeds: [embedSocialCategory]})
            case "SlashCmd_Category":
                return message.update({embeds: [embedSlashCommandsCategory]})
            case "Member_Category":
                return message.update({embeds: [embedMembersCategory]})
            case "Music_Category": 
                return message.update({embeds: [embedMusicCategory]})
            case "Misc_Category":
                return message.update({embeds: [embedMiscCategory]})
            case "Close_Help": 
                return message.message.delete()
        }
    }
}























/*
function addFieldMusic() {
    
    if (state == true) {
        return;
    }

    const musicFeatureState = values.settings.musicCmdEnable;

    if (musicFeatureState == false) {
        embedMessageHelp.addField("Musique", "Les commandes musicales sont désactivées, tapez la commande \`z!infos\` pour avoir plus d'informations concernant la désactivation des commandes musicales.");
    } else {
        embedMessageHelp.addField("Musique", `
**Pour effectuer ces commandes, soyez dans un salon vocal avant !**
\`z!play <mots-clés ou lien>\` : Joue de la musique via le lien YouTube ou effectue une recherche. 
\`z!skip\` : Permet de passer la musique.
\`z!stop\` : Stoppe la musique.
\`z!loop\` : Boucle la musique en cours de lecture.
\`z!queue\` : Affiche la liste de lecture.
\`z!pause\` : Met en pause la musique.
\`z!resume\` : Met en lecture la musique.
\`z!volume <0-200>\` : Règle le volume sonore de la musique.
\`z!np\` : Affiche la musique en cours de lecture.
\`z!qp\` : Recherche la musique sur YouTube et lance immédiatement la lecture ou l'ajoute dans la liste de lecture. La commande fonctionne avec les liens également.
*Ces commandes sont utilisables par les commandes slash également.*`);
    }

    return state = true;

}
*/