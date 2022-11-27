const { MessageEmbed } = require('discord.js'); //Chargement module Discord
const values = require('../values.json');

const versionNumber = values.version.versionNumber

var state = false;

const embedMessageHelp = new MessageEmbed() //message Embed pour l'aide
    .setColor(values.settings.embedColor)
	.setTitle("Aide de Zbeub Bot😊")
    .addField("Aide",`
\`z!help\` : Affiche l'aide.
L'aide est aussi disponible sur https://ZbeubBot-v2.dylanvassalo.repl.co !

\`z!about\` : Affiche des informations à propos du bot (patch note).
\`z!changelog\` : Affiche le changelog complet du bot.
\`z!credits\` : Affiche les crédits.
\`z!botusage\` : Affiche des informations statistiques concernant le bot.
\`z!ping\` : Calcule le temps de latence entre le bot et l'API.
\`z!infos\` : Affiche des informations importantes concernant l'avenir des bots musicaux et de Zbeub Bot (il y a aussi les commentaires du créateur).
*Toutes les commandes dans ce paragraphe sont aussi disponibles en commandes slash.*`)
    .addField("Installation",`
**Ces commandes nécessitent d'avoir la permission** \`Administrateur\` **pour être utilisables.**
\`z!installslashcommands\` : Installe les commandes slash et les commandes d'application sur le serveur.
\`z!deleteslashcommands\` : Supprime les commandes slash et les commandes d'application sur le serveur.`)
    .addField("Fun et social", `
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
\`z!bogossitude\` : La bogossitude à son paroxysme.`)
    .addField("Commandes slash", `
*Les commandes slash doivent être installés via une commande décrite dans* **"Installation"** *pour être utilisables.*
\`/sendmessage\` : Le bot enverra le message que vous avez saisi.
\`/embed\` : Le bot enverra le message que vous avez saisi sous la forme d'un "embed".
\`/error\` : Envoie un message d'erreur.
\`/test\` : Teste la fonction commande slash.
\`/ping\`: Fait un ping-pong.`)
    .addField("Informations", `
*Arguments nécessaires :* \`@mention\`
\`z!showinfoaboutmember\` : Affiche des informations à propos d'un membre.
\`z!membercard\` : Envoie une carte de profil d'un membre.`)
    .addField("Autres", `
\`z!ytconvert <lien>\` : Permet de convertir une vidéo YouTube en fichier musique (.mp3).
*Cette commande est utilisable également par commande slash.*
*La vidéo ne doit pas dépasser 20 minutes.*

\`z!record\` : Enregistre la voix d'un utilisateur dans un salon vocal.
*Cette commande est en version alpha pour le moment et doit être testée.*
*L'utilisateur qui réalise la commande est le seul qui est enregistré même si plusieurs personnes sont présents dans un même salon vocal.*
*La fonctionnalité musicale ne peut pas être utilisée en même temps que l'enregistrement de la voix.*`)
    //.setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl})
    .setFooter({text: `Zbeub Bot version ${versionNumber}`, iconURL: values.properties.botprofileurl});

module.exports = async (message, ifslash) => {

    addFieldMusic();
    if (ifslash === true) {
	    return await message.reply({embeds: [embedMessageHelp]});
    } else {
        return message.channel.send({embeds: [embedMessageHelp]})
    }
};

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