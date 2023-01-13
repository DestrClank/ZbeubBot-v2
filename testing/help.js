const { MessageEmbed, Message, MessageActionRow, MessageSelectMenu } = require('discord.js'); //Chargement module Discord
const values = require('../values.json');

const versionNumber = values.version.versionNumber

var state = false;

const embedHelpHome = new MessageEmbed()
    .setColor(values.settings.embedColor)
    .setTitle("Aide de Zbeub Bot 😊")
    .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
    .addFields({
        name : "Bienvenue dans l'aide de Zbeub Bot !", value: "Coucou, tu as besoin d'aide ? Ca tombe bien, je suis là pour t'aider ! ^^ \n Presque toutes les commandes peuvent être utilisées via les commandes textuelles ou via les commandes slash ! \n Choisis en bas la catégorie que tu veux voir et Pikachu t'indiquera le chemin !"
    });

const embedInfoBotCategory = new MessageEmbed()
    .setColor(values.settings.embedColor)
    .setTitle("Aide de Zbeub Bot 😊")
    .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
    .addFields({
        name: "Aide et informations", value: `
\`z!help\`|</help:1051212673439780955> : Affiche l'aide.
L'aide est aussi disponible en ligne sur https://ZbeubBot-v2.dylanvassalo.repl.co !
        
\`z!about\`|</about:1051212409752272916> : Affiche des informations à propos du bot (patch note).
\`z!changelog\`|</changelog:1051212411211886613> : Affiche le changelog complet du bot.
\`z!credits\`|</credits:1051212412923150446> : Affiche les crédits.
\`z!botusage\`|</botusage:1051212415372628140> : Affiche des informations statistiques concernant le bot.
\`z!ping\`|</ping:1051212407487352872> : Calcule le temps de latence entre le bot et l'API.
\`z!infos\`|</infos:1051212496456912927> : Affiche des informations importantes concernant l'avenir des bots musicaux et de Zbeub Bot (il y a aussi les commentaires du créateur).
*Toutes les commandes dans ce paragraphe sont aussi disponibles en commandes slash.*`
    });

const embedInstallCategory = new MessageEmbed()
    .setColor(values.settings.embedColor)
    .setTitle("Aide de Zbeub Bot 😊")
    .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
    .addFields({
        name: "Installation et configuration", value: `
**Ces commandes nécessitent d'avoir la permission** \`Administrateur\` **pour être utilisables.**

Les commandes slash sont désormais déployées de manière globale et ne nécessitent plus d'installation manuelle via la commande \`z!installslashcommands\`.

Cependant, si vous avez installé les commandes slash manuellement auparavant, les commandes peuvent apparaître en double. Utilisez \`z!deleteslashcommands\` pour supprimer la copie installée sur votre serveur et ainsi ne garder que la copie globale.

*Note: Une commande slash qui a été ajoutée suite à une mise à jour du bot peut prendre jusqu'à une heure pour apparaître sur votre serveur. Dans ce cas de figure, utilisez l'équivalent de la commande en textuel, si son équivalent est disponible. Sinon, attendez une heure pour que la commande slash apparaîsse.*`
    });

const embedSocialCategory = new MessageEmbed()
    .setColor(values.settings.embedColor)
    .setTitle("Aide de Zbeub Bot 😊")
    .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
    .addFields({
        name: "Fun et social", value: `
*Arguments acceptés :* \`@mention\`,\`random\`
\`z!hello\`|</hello member:1051212682558185493> : Dit bonjour à quelqu'un.
\`z!error\`|</error:1051212595975163995> : Envoie un message d'erreur.
\`z!attack\`|</attack member:1051213175074324490> : Pikachu fera une attaque Boule Elek à quelqu'un.
\`z!dance\`|</dance member:1051213177041457223> : Pikachu fera une danse à quelqu'un.
\`z!hug\`|</hug member:1051213178819837962> : Pikachu fera un câlin à quelqu'un.
\`z!chewie\`|</chewie member:1063524943809216613> : Christina Pikachu Cordon Bleu vous sortira sa meilleure phrase !
\`z!wala\`|</wala member:1051213180459819139> : Vous jurez que ce n'est pas vous ??
\`z!mtm\`|</mtm member:1051213261447639192> : Kirby vous transmettra un joli message !
\`z!zemmour\`|</zemmour member:1051213263200866447> : Ça ne rigole plus là OnO !
\`z!nice\`|</nice member:1051213264564015116> : Nice...
\`z!bogossitude\`|</bogossitude member:1051213267239972945> : La bogossitude à son paroxysme.
\`z!sartek\`|</sartek member:1059515971980759060> : Sartek, le dégradé !`
    });

const embedSlashCommandsCategory = new MessageEmbed()
.setColor(values.settings.embedColor)
.setTitle("Aide de Zbeub Bot 😊")
.setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
.addField("Commandes slash", `
</sendmessage:1051212592976232588> : Le bot enverra le message que vous avez saisi.
</embed:1051212587167129672> : Le bot enverra le message que vous avez saisi sous la forme d'un "embed".
</error:1051212595975163995> : Envoie un message d'erreur.
</test:1051212585174847609> : Teste la fonction commande slash.
</ping:1051212407487352872>: Fait un ping-pong.
</calc:1063524942139891782>: Affiche une calculatrice permettant des calculs simples.`);

const embedMembersCategory = new MessageEmbed()
.setColor(values.settings.embedColor)
.setTitle("Aide de Zbeub Bot 😊")
.setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
.addField("Informations de membres", `
*Arguments nécessaires :* \`@mention\`
\`z!showinfoaboutmember\`|</showinfoaboutmember:1063524861491814411> : Affiche des informations à propos d'un membre.
\`z!membercard\`|</membercard:1063524859377881120> : Envoie une carte de profil d'un membre.`);

const embedSettingsCategory = new MessageEmbed()
.setColor(values.settings.embedColor)
.setTitle("Aide de Zbeub Bot 😊")
.setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
.addField("Paramètres du bot", `
Commande générale : \`/settings\`

Paramètres disponibles : 
\`simplifiedmenu (activate/deactivate)\` : Active ou désactive le menu musical simplifié.`);

const embedMiscCategory = new MessageEmbed()
.setColor(values.settings.embedColor)
.setTitle("Aide de Zbeub Bot 😊")
.setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
.addField("Autres", `
\`z!ytconvert <lien>\`|</ytconvert:1051212589700501546> : Permet de convertir une vidéo YouTube en fichier musique (.mp3).
*Cette commande est utilisable également par commande slash.*
*La vidéo ne doit pas dépasser 2 heures.*
*Remarque : Cette amélioration de la commande est en cours de test et peut rendre le bot instable.
Il est pour le moment préférable de rester sur l'ancienne règle de 20 minutes.*

\`z!record\` : Enregistre la voix d'un utilisateur dans un salon vocal.
*Cette commande est en version alpha pour le moment et doit être testée.*
*L'utilisateur qui réalise la commande est le seul qui est enregistré même si plusieurs personnes sont présents dans un même salon vocal.*
*La fonctionnalité musicale ne peut pas être utilisée en même temps que l'enregistrement de la voix.*

\`z!createinvite\` : Crée un lien d'invitation vers ce salon.

\`z!tts\`|</tts:1051212680477819001> : Permet au bot de dire des choses.
*Limité à 100 caractères max.*
*Utilisable par commande slash également.*`)

const embedMusicCategory = new MessageEmbed()
.setColor(values.settings.embedColor)
.setTitle("Aide de Zbeub Bot 😊")
.setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
.addField("Musique", `
**Pour effectuer ces commandes, soyez dans un salon vocal avant !**
\`z!play <mots-clés ou lien>\`|</play:1051212676333842483> : Joue de la musique via le lien YouTube ou effectue une recherche. 
\`z!skip\`|</skip:1051213349968412782> : Permet de passer la musique.
\`z!stop\`|</stop:1051213270394097756> : Stoppe la musique.
\`z!loop\`|</loop:1051213353114140722> : Boucle la musique en cours de lecture.
\`z!queue\`|</queue:1051213357170053120> : Affiche la liste de lecture.
\`z!pause\`|</pause:1051213359854407771> : Met en pause la musique.
\`z!resume\`|</resume:1051213362215800894> : Met en lecture la musique.
\`z!volume <0-200>\`|</volume:1051212678644891708> : Règle le volume sonore de la musique.
\`z!np\`|</np:1051213437633572864> : Affiche la musique en cours de lecture.
\`z!qp\`|</qp:1051213439139319818> : Recherche la musique sur YouTube et lance immédiatement la lecture ou l'ajoute dans la liste de lecture. La commande fonctionne avec les liens également.
*Ces commandes sont utilisables par les commandes slash également.*`)

const embedSupportCategory = new MessageEmbed()
.setColor(values.settings.embedColor)
.setTitle("Aide de Zbeub Bot 😊")
.setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
.addField("Support et assistance", `
Si vous rencontrez des problèmes, des bugs, ou vous voulez demander de l'aide ou des conseils pour utiliser le bot, vous pouvez envoyer un MP au développeur :

--> <@456117123283157002>

Vous pouvez aussi rejoindre le serveur d'assistance de Zbeub Bot :

--> https://discord.gg/jBgC2QggeA

Plus d'informations sont présentes dans le serveur d'assistance.

Vous pouvez aussi utiliser la commande \`z!sendcomments\` dans les messages privés du bot pour envoyer des commentaires, faire des rapports de bugs, demander de l'assistance etc...
Vous pourrez joindre des captures d'écran également.

*Privilégiez l'usage du serveur pour expliquer votre problème ou pour demander des conseils sur l'utilisation du bot.
Veuillez respecter les règles mentionnées dans \`z!help\` par message privé si vous utilisez les messages privés du bot.*`)

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
                    label: "Paramètres du bot",
                    description: "Ensemble de paramètres configurables pour personnaliser le bot.",
                    value: "Settings_Category",
                    emoji: {
                        id: "1050825866998988820",
                        name: "settings"
                    }
                },
                {
                    label: "Support et assistance",
                    description: "Assistance en cas de problèmes, de bugs, ou vous avez besoin de conseils pour utiliser le bot.",
                    value: "Support_Category",
                    emoji: {
                        id: "1059843974266900530",
                        name: "support"
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
            case "Settings_Category":
                return message.update({embeds: [embedSettingsCategory]})
            case "Support_Category":
                return message.update({embeds: [embedSupportCategory]})
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