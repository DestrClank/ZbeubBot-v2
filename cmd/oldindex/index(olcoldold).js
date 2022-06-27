// JavaScript source code
require("dotenv").config(); //token

//Modules et assets
const Discord = require('discord.js'); //Chargement module Discord
const ytdl = require('ytdl-core'); //Chargement module lecture vidéo Youtube
const yts = require('yt-search'); //Chargement module Youtube Data API v3 (eh ouais)
const DiscordSlash = require('discord.js-slash-command'); //Chargement module Discord Slash Commands

const client = new Discord.Client(); //Création du client
const hello = require("../hello"); //Charge le module pour la commande z!hello
const help = require("../help"); //Charge le module de l'aide
const attack = require("../attack");//Charge le module Attaque
const dance = require("../dance");//Charge le module Danse
const slash = new DiscordSlash.Slash(client); //Création des commandes slash
//const playmusicslash = require("./cmd/slash/playmusic.js");


const PikachuEmote = client.emojis.cache.find(emoji => emoji.name === "Pikachu"); //https://cdn.discordapp.com/emojis/830729434058850345.png?v=1

//const youtube = new YouTube(process.env.YTTOKEN) //Recherche Youtube

const queue = new Map();

const embedMessageHelp = new Discord.MessageEmbed() //message Embed pour l'aide
		.setColor("#FFFFFF")
		.setTitle("Aide de Zbeub Bot😊")
    .setDescription(`**Aide**
        \`z!help\` : Affiche l'aide.
        La commande slash \`/help\` affiche aussi l'aide.        

        **Fun**
		\`z!hello @mention\` : Dit bonjour à quelqu'un
		\`z!error\` : Envoie un message d'erreur
		\`z!attack @mention\` : Pikachu fera une attaque Boule Elek à quelqu'un
		\`z!dance @mention\` : Pikachu fera une danse à quelqu'un

        **Commandes slash**
        \`/sendmessage\` : Le bot enverra le message que vous avez saisi.
        \`/embed\` : Le bot enverra le message que vous avez saisi sous la forme d'un "embed".
        \`/error\` : Envoie un message d'erreur.
        \`/test\` : Teste la fonction commande slash.
        \`/playmusic\` : Joue de la musique via le lien YouTube ou effectue une recherche.
        **Conseil** : connectez-vous avant sur un salon vocal avant de faire la commande pour que cela fonctionne correctement, comme pour les autres commandes musicales 😉. 

        **Musique**
        **Pour effectuer ces commandes, soyez dans un salon vocal avant !**
        \`z!play <mots-clés ou lien>\` : Joue de la musique via le lien YouTube ou effectue une recherche. 
        \`z!skip\` : Permet de passer la musique.
        \`z!stop\` : Stoppe la musique.
        \`z!loop\` : Boucle la musique en cours de lecture.
        \`z!queue\` : Affiche la liste de lecture.
        \`z!pause\` : Met en pause la musique.
        \`z!resume\` : Met en lecture la musique.`)
    .setFooter("Zbeub Bot version 0.3.1 bêta");

const embedMessageError = new Discord.MessageEmbed() //message Embed du message d'erreur
	.setDescription("Une erreur est survenue lol mdr jpp ! xD")
	.setImage("https://cdn.discordapp.com/attachments/830828771173990420/830836489238741002/unknown.png");

const guildId = '825631179939119105';

const getApp = (guildId) => {
    const app = client.api.applications(client.user.id)
    if (guildId) {
        app.guilds(guildId)
    }
    return app
}


const sendInteraction = (interaction, message) => {
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: {
                content: message
            }
        }
    })

}

const sendMessage = (interaction, message) => {
    new Discord.WebhookClient(client.user.id, interaction.token).send(message)
}

//initialisation du bot
client.once('ready', async () => {
    console.log('Le bot est initialisé.')

    client.user.setActivity("z!help", { type: "PLAYING" })
    
    const commands = await getApp(guildId).commands.get()
    console.log(`Initialisation Slash Commands : Liste des commandes disponibles : `);
    console.log(commands);

    await getApp(guildId).commands.post({
        data: {
            name: 'test',
            description: 'Une fonction simple de test.',
        }
    })

    //await getApp(guildId).commands('836994748970434560').delete()

    await getApp(guildId).commands.post({
        data: {
            name: 'error',
            description: 'z!error, affiche un message d\'erreur',
        }
    })

    await getApp(guildId).commands.post({
        data: {
            name: 'help',
            description: 'z!help, affiche la liste des commandes disponibles.',
        }
    })

    await getApp(guildId).commands.post({
        data: {
            name: 'embed',
            description: 'Affiche un message en \"embed\"',
            options: [
                {
                    name: 'Message',
                    description: 'Ecrivez le message ici',
                    required: true,
                    type: 3
                }
            ]
        }
    })

    await getApp(guildId).commands.post({
        data: {
            name: 'playmusic',
            description: 'z!play, joue de la musique via un lien YouTube ou effectue une recherche.',
            options: [
                {
                    name: 'Musique',
                    description: 'Saisissez le lien ou une recherche.',
                    required: true,
                    type: 3
                }
            ]
        }
    })

    await getApp(guildId).commands.post({
        data: {
            name: 'sendmessage',
            description: 'Envoie le message que vous avez saisi.',
            options: [
                {
                    name: 'Message',
                    description: 'Ecrivez le message ici',
                    required: true,
                    type: 3
                }
            ]
        }
    })
    
    
    client.ws.on('INTERACTION_CREATE', async (interaction) => {
        const args = interaction.data.options;

        const command = interaction.data.name.toLowerCase();

        //const args = {}

        console.log(`Fonction Slash Command : La commande suivante \"${command}\" a été effectuée.`);

        //console.log(options)
        /*
        if (options) {
            for (const option of options) {
                const { name, value } = option
                args[name] = value
            }
        }
        */
        console.log(args)

        const reply = async (interaction, response) => {

            let data = {
                content: response,
            }

            if (typeof response === 'object') {
                data = await createAPIMessage(interaction, response)
            }

            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data,
                }
            })
        }

        const createAPIMessage = async (interaction, content) => {
            const { data, files } = await Discord.APIMessage.create(
                client.channels.resolve(interaction.channel_id),
                content
            )
                .resolveData()
                .resolveFiles()

            return { ...data, files }
        }

        if (command === 'test') {
            reply(interaction, 'Ca marche !')
        } else if (command === 'embed') {
            const embed = new Discord.MessageEmbed()
                .setTitle('Message Embed')

            for (const arg in args) {
                const value = args[arg]
                embed.addField(arg, value)
            }

            reply(interaction, embed)

        } else if (command === 'error') {
            reply(interaction, embedMessageError);
        } else if (command === 'help') {
            reply(interaction, embedMessageHelp)
        } else if (command === 'sendmessage') {
            const value = ''
            for (const arg in args) {
                const value = args[arg]
                reply(interaction, value)
            }

        } else if (command === 'playmusic') {
            const serverQueue = queue.get(interaction.guild_id);
            const guild = client.guilds.cache.get(interaction.guild_id)
            const member = await guild.members.cache.get(interaction.member.user.id);
            const voiceChannel = member.voice.channel;
            console.log(member)
            //reply(interaction, value)
             //playmusicslash(value, serverQueue, guild, member, voiceChannel)
            executeslash(interaction, serverQueue, guild, member, args);
            }

    })
});

client.once("reconnecting", () => {
	console.log("Le bot est en reconnexion.");
});

client.once("disconnect", () => {
	console.log("Le bot est déconnecté.");
});
/*
slash.on("slashInteraction", async (interaction) => {
    console.log(`Fonction slash : La commande suivante : ${interaction.command.name} a été effectuée.`);
    switch (interaction.command.name) {
        case "sendmessage":
            interaction.callback(interaction.command.options[0].value);
            //console.log(interaction);
            break;
        case "embed":
            //console.log(interaction.command.options)
            var description = interaction.command.options[0].value;
            //var title = interaction.command.options[1].value;
            const embed = new Discord.MessageEmbed()
                .setTitle("Message Embed")
                .setDescription(description);
            if (interaction.command.options[1]) {
                embed.setTitle(interaction.command.options[1].value)
            }

            interaction.callback(embed);

            //console.log(member)
            break;
        case "playmusic":

            const guild = await client.guilds.cache.get(interaction.channel.guild.id);
            const member = await guild.members.cache.get(interaction.author.id);
            //const member = getMember(interaction);
            const serverQueue = queue.get(interaction.channel.guild.id);
            const argument = interaction.command.options[0].value;
            //console.log(member);
            //const voiceChannel = member.voice.channel;
            

            //const voiceChannel = member.voice.channel;
            //console.log(interaction)
            //execute(interaction, serverQueue)
            //execute(interaction, serverQueue, voiceChannel, true, member);
            executeslash(interaction, serverQueue, guild, member).catch(() => {
                console.log("Fonction slash : La commande /playmusic a échouée. Cela est dû à une mauvaise optimisation réseau ou du lag sur la connexion.")
                console.log("Il est possible que le bot soit en train de s'installer correctement.")
                console.log("Pour un meilleur résultat, l'utilisateur doit se connecter à un salon vocal avant d'effectuer la commande.")
                return interaction.callback("La commande a échouée... 🥲 Pour que cela fonctionne correctement, connectez-vous dans un salon vocal et cela devrait marcher ! Si cela ne marche pas, utilisez \`z!play\` à la place.")
            })
            break;

        case "help":
            return interaction.callback(embedMessageHelp);
            break;
        case "error":
            return interaction.callback(embedMessageError);
            break;
        default:
    }
});
*/
async function getMember(interaction) {
    const guild = await client.guilds.cache.get(interaction.channel.guild.id);
    const member = await guild.members.cache.get(interaction.author.id);
    return member
}

//à chaque message envoyé (fonction d'analyse des messages avec préfixe z!)
client.on("message", message => {
	if (message.content === "z!help") { //commande z!help
		message.channel.send("Coucou, tu as besoin d'aide ?");
		message.channel.send(embedMessageHelp);
		console.log("z!help : Une commande d'affichage de l'aide a été effectuée.'");
	}

	if (message.content === "z!error") { //commande z!error
		message.channel.send(embedMessageError);
		console.log("z!error : Une commande de message d'erreur a été effectuée.")
	}

	if (message.content.startsWith("z!hello")) { //commande z!hello
		console.log("z!hello : Une commande Bonjour a été effectuée.")
		return hello(message);
		//message.channel.send("https://tenor.com/view/pokemon-pokemon-pikachu-gif-18775145");

	}

	if (message.content.startsWith("z!attack")) {
		console.log("z!attack : Une commande Attaque a été effecutée.");
		return attack(message);
	}
	
	if (message.content.startsWith("z!dance")) {
		console.log("z!dance : Une commande Danse a été effecutée.");
		return dance(message);
    }

    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith("z!play")) {
        const guild = client.guilds.cache.get(message.guild.id);
        const voiceChannel = message.member.voice.channel;
        const member = guild.members.cache.get(message.author.id);
        console.log("z!play : Une commande de lecture de musique a été effectuée.");
        execute(message, serverQueue, voiceChannel, false, member);
        //console.log()
        return;
    }

    if (message.content.startsWith("z!skip")) {
        console.log("z!skip : La commande skip a été effectuée.");
        skip(message, serverQueue);
        return;
    }

    if (message.content.startsWith("z!stop")) {
        console.log("z!stop : La commande d'arrêt de la musique a été effectuée.");
        stop(message, serverQueue); 
        return;

    

    }
    if (message.content.startsWith("z!loop")) {
        console.log("z!loop : La commande loop a été effectuée.");
        loop(message, serverQueue);
        return;
    }


    if (message.content.startsWith("z!debug")) {
        console.log(message);
    }

    if (message.content.startsWith("z!queue")) {
        console.log("z!queue : Une commande d'affichage de la liste de lecture a été effectuée.")
        showQueue(message, serverQueue);
        return;
    }

    if (message.content.startsWith("z!pause")) {
        console.log("z!pause : Une commande de pause de la musique a été effectuée.");
        pauseMusic(message, serverQueue);
        return;
    }

    if (message.content.startsWith("z!resume")) {
        console.log("z!resume : Une commande de reprise de la musique a été effectuée.");
        resumeMusic(message, serverQueue);
        return;
    }

    if (message.content.startsWith("z!deleteslashcommands")) {
        slash.get(null,guildId).then((res) => {
            console.log(res)
            res.forEach((obj) => {
                slash.delete(obj.id,guildId);
            });
        });

        console.log("z!deleteslashcommands : Les commandes slash ont été supprimés. Redémarrez le bot pour les réinitialiser.");

    }

});

function error() {

}

function getArg(message, ifSlash) {
    //console.log(ifSlash)
    if (ifSlash === false) {
        var args = message.content.trim().split(/ +/g);
        return args[1]
    } else if (ifSlash === true) {
        return message.command.options[0].value;
    }
}

async function execute(message, serverQueue, voiceChannel, ifSlash, member) {

    let arg = getArg(message, ifSlash);

    //console.log(arg)

    //console.log(arg)
    //if (!ifSlash) const args = message.content.split(" "); // On récupère les arguments dans le message pour la suite
    //if (ifSlash) console.log("c une commande slash");
    //const searchString = args.slice(1).join(" ");
    //const url = args[1] ? args[1].replace(/<(._)>/g, '$1') : ''
    if (!voiceChannel) // Si l'utilisateur n'est pas dans un salon vocal
    {
        console.log("z!play : L'utilisateur n'était pas dans un salon vocal avant de faire la commande play.");
        return message.channel.send(
            "Soyez dans un salon vocal pour que cela fonctionne 😉 !"
        );
    }

    const permissions = voiceChannel.permissionsFor(member.client.user); // On récupère les permissions du bot pour le salon vocal
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) { // Si le bot n'a pas les permissions
        console.log("z!play : Le bot ne possède pas les autorisations nécessaires tels que CONNECT et SPEAK. Il ne peut pas continuer.");
        return message.channel.send(
            "Le bot ne possède pas les autorisations nécessaires au fonctionnement de la lecture de musique. Vérifiez les rôles de @Zbeub Bot et leurs autorisations."
        );
    }
    /*
    switch (isSlash) {
        case true:
            const args = message.command.options[0].value;
            break;
        case false:
            const args = message.content.split(" ");
            break;
    }
    */
    let validate = await ytdl.validateURL(arg);

    //const voiceChannel = message.member.voice.channel;

    //console.log(message);

    
    if (!validate) {
        console.log("z!play : Une recherche sur YouTube a été effectuée à la place car l'argument n'est pas un lien.");
        if (ifSlash === true) {
            const search = message.command.options[0].value;
            console.log(search)
            return ytsearchslash(message, serverQueue, voiceChannel, `z!play ${search}`);
        } else {
            return ytsearch(message, serverQueue, voiceChannel);
        }
        
    }
    



    /*
    try {
        var video = await youtube.getVideoById(url)
    } catch {
        try {
            var videos = await youtube.searchVideos(searchString, 1)
            var video = await youtube.getVideoById(videos[0].id)
        } catch {
            return message.channel.send("Pas de résultats trouvés.")
        } 
    }
    */
    /*
    const song = {
        id : video.id,
        title : video.title,
        url : `https://www.youtube.com/watch?v=${video.id}`
    } */

    

    console.log("z!play : Récupération des métadonnées de la vidéo YouTube.");
    const songInfo = await ytdl.getInfo(arg);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
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

        console.log("z!play : Ajout dans la liste de lecture.");
        // On ajoute la queue du serveur dans la queue globale:
        queue.set(member.guild.id, queueConstruct);
        // On y ajoute la musique
        queueConstruct.songs.push(song);
        console.log("z!play : Le bot essaie de rejoindre le salon vocal...");
        try {
            // On connecte le bot au salon vocal et on sauvegarde l'objet connection
            
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            // On lance la musique
            console.log("z!play : La lecture de musique s'est effectuée via un lien YouTube.");
            play(member.guild, queueConstruct.songs[0]);
        }
        catch (err) {
            //On affiche les messages d'erreur si le bot ne réussi pas à se connecter, on supprime également la queue de lecture
            console.log("z!play : Le bot n'a pas réussi à rejoindre le salon vocal.");
            console.log(`Code d'erreur : ${err}`);
            queue.delete(member.guild.id);
            return message.channel.send(err);
        }
    }
    else {
        serverQueue.songs.push(song);
        console.log("z!play : Ajout de la musique suivante (via lien YouTube).");
        console.log(`z!play : Titre : ${song.title}`);
        console.log(`z!play : URL : ${song.url}`);
        //console.log(serverQueue.songs);
        return message.channel.send(`**${song.title}** a été ajoutée dans la liste de lecture ! 😉`);
    }
    
}

//async function executeviaslash(interaction, serverQueue) {
//
//    const args = message.content.split(" "); // On récupère les arguments dans le message pour la suite
//    //const searchString = args.slice(1).join(" ");
//    //const url = args[1] ? args[1].replace(/<(._)>/g, '$1') : ''
//
//    let validate = await ytdl.validateURL(args[1]);
//
//    const voiceChannel = message.member.voice.channel;
//    if (!voiceChannel) // Si l'utilisateur n'est pas dans un salon vocal
//    {
//        console.log("z!play : L'utilisateur n'était pas dans un salon vocal avant de faire la commande play.");
//        return message.channel.send(
//            "Soyez dans un salon vocal pour que cela fonctionne 😉 !"
//        );
//    }
//
//    if (!args[1]) {
//        console.log("z!play : L'utilisateur n'a pas spécifié d'arguments.");
//        return message.channel.send("Pour utiliser la fonction \`z!play\`, vous devez mettre après \`z!play\` des termes de recherche ou un lien vers une vidéo YouTube spécifique.");
//    }
//
//    if (!validate) {
//        console.log("z!play : Une recherche sur YouTube a été effectuée à la place car l'argument n'est pas un lien.");
//        return ytsearch(message, serverQueue);
//    }
//
//
//
//    const permissions = voiceChannel.permissionsFor(message.client.user); // On récupère les permissions du bot pour le salon vocal
//    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) { // Si le bot n'a pas les permissions
//        console.log("z!play : Le bot ne possède pas les autorisations nécessaires tels que CONNECT et SPEAK. Il ne peut pas continuer.");
//        return message.channel.send(
//            "Le bot ne possède pas les autorisations nécessaires au fonctionnement de la lecture de musique. Vérifiez les rôles de @Zbeub Bot et leurs autorisations."
//        );
//    }
//    /*
//    try {
//        var video = await youtube.getVideoById(url)
//    } catch {
//        try {
//            var videos = await youtube.searchVideos(searchString, 1)
//            var video = await youtube.getVideoById(videos[0].id)
//        } catch {
//            return message.channel.send("Pas de résultats trouvés.")
//        }
//    }
//    */
//    /*
//    const song = {
//        id : video.id,
//        title : video.title,
//        url : `https://www.youtube.com/watch?v=${video.id}`
//    } */
//    console.log("z!play : Récupération des métadonnées de la vidéo YouTube.");
//    const songInfo = await ytdl.getInfo(args[1]);
//    const song = {
//        title: songInfo.videoDetails.title,
//        url: songInfo.videoDetails.video_url,
//    };
//
//    if (!serverQueue) {
//        const queueConstruct = {
//           textChannel: message.channel,
//            voiceChannel: voiceChannel,
//            connection: null,
//            songs: [],
//            volume: 1,
//            playing: true,
//            loop: false,
//        };
//
//        console.log("z!play : Ajout dans la liste de lecture.");
//        // On ajoute la queue du serveur dans la queue globale:
//        queue.set(message.guild.id, queueConstruct);
//        // On y ajoute la musique
//       queueConstruct.songs.push(song);
//        console.log("z!play : Le bot essaie de rejoindre le salon vocal...");
//        try {
//            // On connecte le bot au salon vocal et on sauvegarde l'objet connection
//
//            var connection = await voiceChannel.join();
//            queueConstruct.connection = connection;
//            // On lance la musique
//            console.log("z!play : La lecture de musique s'est effectuée via un lien YouTube.");
//            play(message.guild, queueConstruct.songs[0]);
//        }
//        catch (err) {
//            //On affiche les messages d'erreur si le bot ne réussi pas à se connecter, on supprime également la queue de lecture
//            console.log("z!play : Le bot n'a pas réussi à rejoindre le salon vocal.");
//            console.log(`Code d'erreur : ${err}`);
//            queue.delete(message.guild.id);
//            return message.channel.send(err);
//        }
//    }
//    else {
//        serverQueue.songs.push(song);
//        console.log("z!play : Ajout de la musique suivante (via lien YouTube).");
//        console.log(`z!play : Titre : ${song.title}`);
//        console.log(`z!play : URL : ${song.url}`);
//        //console.log(serverQueue.songs);
//        return message.channel.send(`**${song.title}** a été ajoutée dans la liste de lecture ! 😉`);
//    }
//
//}


function skip(message, serverQueue) {
    if (!message.member.voice.channel) // on vérifie que l'utilisateur est bien dans un salon vocal pour skip
    {
        console.log("z!skip : L'utilisateur n'était pas dans un salon vocal avant de faire la commande skip.");
        return message.channel.send(
            "Avant de faire la commande z!skip, soyez dans un salon vocal avant 😉."
        );
    }
    if (!serverQueue) // On vérifie si une musique est en cours
    {
        console.log("z!skip : Aucune musique n'était en cours de lecture avant de faire la commande skip.");
        return message.channel.send("Aucune musique est en cours de lecture.");
    }
    console.log("z!skip : Passage à la musique suivante dans la liste de lecture.");
    serverQueue.connection.dispatcher.end(); // On termine la musique courante, ce qui lance la suivante grâce à l'écoute d'événement
    // finish
}

async function stop(message, serverQueue) {
    if (!message.member.voice.channel) // on vérifie que l'utilisateur est bien dans un salon vocal pour skip
    {
        console.log("z!stop : L'utilisateur n'était pas dans un salon vocal avant de faire la commande stop.");
        return message.channel.send(
            "Avant de faire la commande z!stop, soyez dans un salon vocal avant 😉."
        );
    }
    if (!serverQueue) // On vérifie si une musique est en cours
    {
        console.log("z!stop : Aucune musique était en cours de lecture avant de faire la commande stop.");
        return message.channel.send("Aucune musique est en cours de lecture.");
    }

    if (!serverQueue.playing) {
        //const dispatcher = serverQueue.connection
        console.log("z!stop : La musique étant en pause, le processus d'arrêt sera plus long."); //LOGIK
        //serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        //serverQueue.volume = 0;
        //serverQueue.connection.dispatcher.setVolume(0);
        //return;
    }

    serverQueue.songs = [];
    client.user.setActivity("z!help", { type: "PLAYING" });
    console.log("z!stop : Arrêt de la musique et nettoyage de la liste de lecture.");
    setTimeout(() => {
        serverQueue.connection.dispatcher.end();
    }, 0);
    message.channel.send("Musique arrêtée ! 😉");
}
function fuck(serverQueue) {

}

function loop(message, serverQueue) {
    if (!message.member.voice.channel) {
        console.log("z!loop : L'utilisateur n'était pas dans un salon vocal avant de faire la commande loop.");
        return message.channel.send('Soyez dans un salon vocal pour activer cette fonction ! 😉');
    }
    if (!serverQueue) {
        console.log("z!loop : Aucune musique n'était en cours de lecture avant de faire la commande loop.")
        return message.channel.send('Aucune musique est en cours de lecture.');
    }

    serverQueue.loop = !serverQueue.loop
    console.log(`z!loop : Le bouclage (loop) de la musique en cours de lecture est : ${serverQueue.loop ? `activé` : `**désactivé`}`);
    return message.channel.send(`Le loop est ${serverQueue.loop ? `**activé**` : `**désactivé**`} ! 😉`)
    
}

function play(guild, song) {
    //console.log(song);
    const serverQueue = queue.get(guild.id); // On récupère la queue de lecture
    if (!song) { // Si la musique que l'utilisateur veux lancer n'existe pas on annule tout et on supprime la queue de lecture
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        console.log("Fonction play : Arrêt de la lecture et le bot quitte le salon vocal.");
        client.user.setActivity("z!help", { type: "PLAYING" });
        return;
    }
    // On lance la musique
    const dispatcher = serverQueue.connection
        .play(ytdl(song.url, { filter: 'audioonly' }))
        .on("finish", () => { // On écoute l'événement de fin de musique
            if (!serverQueue.loop) serverQueue.songs.shift(); // On passe à la musique suivante quand la courante se termine
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolume(1); // On définie le volume
    console.log("Fonction play : Lecture de la musique suivante : ");
    console.log(`Fonction play : Titre : ${song.title}`);
    console.log(`Fonction play : URL : ${song.url}`);
    serverQueue.textChannel.send(`Lecture de la musique : **${song.title}**`);
    client.user.setActivity(song.title, { type: "PLAYING" });
}

function transformarg(argument, ifSlash) {
    if (ifSlash === true) {
        var arg = `z!play ${argument}`
        return arg
    } else if (ifSlash === false) {
        return argument
    }
}

function ytsearch(message, serverQueue, voiceChannel, ifSlash) {
    var args = message.content.trim().split(/ +/g);
    //let argument = getArg(message, ifSlash)
    //let args = transformarg(argument, ifSlash);

    

    //const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) // Si l'utilisateur n'est pas dans un salon vocal
    {
        console.log("Fonction ytsearch : L'utilisateur a quitté le salon vocal pendant la sélection de la musique ou n'était pas dans le salon vocal.");
        return message.channel.send(
            "Soyez dans un salon vocal pour que cela fonctionne 😉 !"
        );
    }
    console.log("Fonction ytsearch : Recherche des résultats via YouTube...");
    yts(args.join(' '), function (err, res) {
        

        if (err) {
            console.log("Fonction ytsearch : Une erreur inconnue est survenue.");
            return message.channel.send("Pikachu n'est pas content ! Une erreur étrange s'est produite ! **tête choquée**");
        }
        
        let videos = res.videos.slice(0, 5);

        let resp = '';
        for (var i in videos) {
            resp += `**[${parseInt(i) + 1}]:** \`${videos[i].title}\`\n`;
        }

        resp += `\n**Pour choisir la musique, saisissez un nombre entre \`1-${videos.length}\`**`;

        message.channel.send(resp);
        console.log("Fonction ytsearch : Envoi des résultats à l'utilisateur.");

        const filter = m => !isNaN(m.content) && m.content < videos.length + 1 && m.content > 0;
        const collector = message.channel.createMessageCollector(filter);
        console.log("Fonction ytsearch : Récupération des messages utilisateurs et attente d'une réponse valide.");
        collector.videos = videos

        //this is where I don't know what to do.
        collector.once('collect', async function (m) {
            
            console.log("Fonction ytsearch : Récupération des métadonnées de la vidéo YouTube.");
            console.log("Fonction ytsearch : Réponse valide récupérée.");
            const urlvideo = `https://www.youtube.com/watch?v=${videos[parseInt(m.content) - 1].videoId}`
            const songInfo = await ytdl.getInfo(urlvideo);
            const serverQueue = queue.get(message.guild.id);



            //if (isNan(m.content)) return message.channel.send("Ce n'est pas une commande valide.")

            const song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
            };
            console.log("Fonction ytsearch : Musique préparée : ")
            console.log(`Fonction ytsearch : Titre : ${song.title}`);
            console.log(`Fonction ytsearch : URL : ${urlvideo}`);
            executeytsearch(urlvideo, serverQueue, m);
            
            return;
        });

        
            //message.channel.send("Ce n'est pas une commande valide, tu as peut-être entré du texte ?")
        
    });
}

function ytsearchslash(message, serverQueue, voiceChannel, ifSlash, search) {
    var args = search.trim().split(/ +/g);
    //let argument = getArg(message, ifSlash)
    
    


    //const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) // Si l'utilisateur n'est pas dans un salon vocal
    {
        console.log("Fonction ytsearch : L'utilisateur a quitté le salon vocal pendant la sélection de la musique ou n'était pas dans le salon vocal.");
        return message.channel.send(
            "Soyez dans un salon vocal pour que cela fonctionne 😉 !"
        );
    }
    console.log("Fonction ytsearch : Recherche des résultats via YouTube...");
    yts(args.join(' '), function (err, res) {


        if (err) {
            console.log("Fonction ytsearch : Une erreur inconnue est survenue.");
            return message.channel.send("Pikachu n'est pas content ! Une erreur étrange s'est produite ! **tête choquée**");
        }

        let videos = res.videos.slice(0, 5);

        let resp = '';
        for (var i in videos) {
            resp += `**[${parseInt(i) + 1}]:** \`${videos[i].title}\`\n`;
        }

        resp += `\n**Pour choisir la musique, saisissez un nombre entre \`1-${videos.length}\`**`;

        message.channel.send(resp);
        console.log("Fonction ytsearch : Envoi des résultats à l'utilisateur.");

        const filter = m => !isNaN(m.content) && m.content < videos.length + 1 && m.content > 0;
        const collector = message.channel.createMessageCollector(filter);
        console.log("Fonction ytsearch : Récupération des messages utilisateurs et attente d'une réponse valide.");
        collector.videos = videos

        //this is where I don't know what to do.
        collector.once('collect', async function (m) {

            console.log("Fonction ytsearch : Récupération des métadonnées de la vidéo YouTube.");
            console.log("Fonction ytsearch : Réponse valide récupérée.");
            const urlvideo = `https://www.youtube.com/watch?v=${videos[parseInt(m.content) - 1].videoId}`
            const songInfo = await ytdl.getInfo(urlvideo);
            const serverQueue = queue.get(message.guild.id);



            //if (isNan(m.content)) return message.channel.send("Ce n'est pas une commande valide.")

            const song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
            };
            console.log("Fonction ytsearch : Musique préparée : ")
            console.log(`Fonction ytsearch : Titre : ${song.title}`);
            console.log(`Fonction ytsearch : URL : ${urlvideo}`);
            executeytsearch(urlvideo, serverQueue, m);

            return;
        });


        //message.channel.send("Ce n'est pas une commande valide, tu as peut-être entré du texte ?")

    });
}

async function executeytsearch(message, serverQueue, originalmessage) {
    //const args = message.content.split(" "); // On récupère les arguments dans le message pour la suite
    //const searchString = args.slice(1).join(" ");
    //const url = args[1] ? args[1].replace(/<(._)>/g, '$1') : ''

    const voiceChannel = originalmessage.member.voice.channel;
    if (!voiceChannel) // Si l'utilisateur n'est pas dans un salon vocal
    {
        console.log("Fonction executeytsearch : L'utilisateur n'était pas dans un salon vocal avant de faire la commande ou a quitté un salon vocal pendant le processus.");
        return originalmessage.channel.send(
            "Soyez dans un salon vocal pour que cela fonctionne 😉 !"
        );
    }
    const permissions = voiceChannel.permissionsFor(originalmessage.client.user); // On récupère les permissions du bot pour le salon vocal
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) { // Si le bot n'a pas les permissions
        console.log("Fonction executeytsearch : Le bot ne possède pas les autorisations nécessaires tels que CONNECT et SPEAK. Il ne peut pas continuer.");
        return originalmessage.channel.send(
            "Le bot ne possède pas les autorisations nécessaires au fonctionnement de la lecture de musique. Vérifiez les rôles de @Zbeub Bot et leurs autorisations."
        );
    }
    /*
    try {
        var video = await youtube.getVideoById(url)
    } catch {
        try {
            var videos = await youtube.searchVideos(searchString, 1)
            var video = await youtube.getVideoById(videos[0].id)
        } catch {
            return message.channel.send("Pas de résultats trouvés.")
        } 
    }
    */
    /*
    const song = {
        id : video.id,
        title : video.title,
        url : `https://www.youtube.com/watch?v=${video.id}`
    } */
    console.log("Fonction executeytsearch : Récupération des métadonnées de la vidéo YouTube.");

    const songInfo = await ytdl.getInfo(message);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {
        const queueConstruct = {
            textChannel: originalmessage.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 1,
            playing: true,
            loop: false,
        };
        console.log("Fonction executeytsearch : Ajout dans la liste de lecture.");

        // On ajoute la queue du serveur dans la queue globale:
        queue.set(originalmessage.guild.id, queueConstruct);
        // On y ajoute la musique
        queueConstruct.songs.push(song);
        console.log("Fonction executeytsearch : Le bot essaie de rejoindre le salon vocal.");
        try {
            // On connecte le bot au salon vocal et on sauvegarde l'objet connection
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            // On lance la musique
            console.log("Fonction executeytsearch : La lecture de musique s'est effectuée via une recherche YouTube.");
            play(originalmessage.guild, queueConstruct.songs[0]);
        }
        catch (err) {
            //On affiche les messages d'erreur si le bot ne réussi pas à se connecter, on supprime également la queue de lecture
            console.log("Fonction executeytsearch : Le bot n'a pas réussi à rejoindre le salon vocal.");

            console.log(`Code d'erreur : ${err}`);
            queue.delete(originalmessage.guild.id);
            return originalmessage.channel.send(err);
        }
    }
    else {
        serverQueue.songs.push(song);
        console.log("Fonction executeytsearch : Ajout de la musique suivante (via recherche YouTube).");
        console.log(`Fonction executeytsearch : Titre : ${song.title}`);
        console.log(`Fonction executeytsearch : URL : ${song.url}`);

        //console.log(serverQueue.songs);
        return originalmessage.channel.send(`**${song.title}** a été ajoutée dans la liste de lecture ! 😉`);
    }

}

function showQueue(message, serverQueue) {
    if (!message.member.voice.channel) {
        console.log("z!queue : L'utilisateur n'était pas dans un salon vocal avant de faire la commande queue.");
        return message.channel.send("Soyez dans un salon vocal pour que cela fonctionne !😉");
    }

    if (!serverQueue) {
        console.log("z!queue : Aucune musique n'était en cours de lecture avant de faire la commande queue.");
        return message.channel.send("Aucune musique est en cours de lecture.");
    }

    
    console.log("z!queue : Affichage de la liste de lecture.");
    let nowPlaying = serverQueue.songs[0];
    let msg = `Musique en cours : **${nowPlaying.title}**\n\n`

    msg += `Liste de lecture :\n`

    if (serverQueue.songs.length < 2) {
        msg += `Aucune autre musique n'a été ajoutée dans la liste de lecture.`
    }

    for (var i = 1; i < serverQueue.songs.length; i++) {
        msg += `${i} : \`${serverQueue.songs[i].title}\`\n`
    }

    message.channel.send(msg);
    
}

function pauseMusic(message, serverQueue) {
    const PikachuEmote = client.emojis.cache.find(emoji => emoji.name === "Pikachu");
    if (!message.member.voice.channel) {
        console.log("z!pause : L'utilisateur n'était pas dans un salon vocal avant de faire la commande pause.");
        return message.channel.send("Soyez dans un salon vocal pour que cela fonctionne ! 😉");
    }

    if (!serverQueue) {
        console.log("z!pause : Aucune musique n'était en cours de lecture avant de faire la commande pause.");
        return message.channel.send("Aucune musique est en cours de lecture.");
    }

    if (!serverQueue.playing) {
        console.log("z!pause : La musique est déja en pause.");
        return message.channel.send(`${PikachuEmote} La musique est déja en pause ! 😅`);
    }

    serverQueue.playing = false;
    serverQueue.connection.dispatcher.pause();
    console.log("z!pause : La musique est en pause.");
    return message.channel.send(`${PikachuEmote} La musique est en pause ! 😉`);
}

function resumeMusic(message, serverQueue) {
    const PikachuEmote = client.emojis.cache.find(emoji => emoji.name === "Pikachu");
    if (!message.member.voice.channel) {
        console.log("z!resume : L'utilisateur n'était pas dans un salon vocal avant de faire la commande resume.");
        return message.channel.send("Soyez dans un salon vocal pour que cela fonctionne ! 😉");
    }

    if (!serverQueue) {
        console.log("z!resume : Aucune musique n'était en cours de lecture avant de faire la commande resume.");
        return message.channel.send("Aucune musique est en cours de lecture.");
    }

    if (serverQueue.playing) {
        
        console.log("z!resume : La musique est déja en lecture.");
        return message.channel.send(`${PikachuEmote} La musique est déja en lecture ! 😅`);
    }

    serverQueue.playing = true;
    serverQueue.connection.dispatcher.resume();
    console.log("z!resume : La musique est en lecture.");
    return message.channel.send(`${PikachuEmote} La musique est en lecture ! 😉`);
}

function sendError(message, originalmessage) {
    console.log(`Une erreur est survenue, code d'erreur : ${message}`);
    return originalmessage.channel.send(message)
}

async function executeslash(interaction, serverQueue, guild, member, args) {
    const argument = args.find(arg => arg.name.toLowerCase() == "musique").value;
    //const args = interaction.command.options[0].value; // On récupère les arguments dans le message pour la suite
    //const searchString = args.slice(1).join(" ");
    //const url = args[1] ? args[1].replace(/<(._)>/g, '$1') : ''
    //console.log(args);
    let validate = await ytdl.validateURL(argument);
    console.log(argument);
    //console.log("")

    const voiceChannel = await member.voice.channel;
    //const voiceChannel = member.voice.channel;
    
    if (!voiceChannel) // Si l'utilisateur n'est pas dans un salon vocal
    {
        console.log("Fonction slash playmusic : L'utilisateur n'était pas dans un salon vocal avant de faire la commande play.");
        return sendInteraction(interaction, "Soyez dans un salon vocal pour que cela fonctionne 😉 !");
    }
    
    if (!argument[0]) {
        console.log("Fonction slash playmusic : L'utilisateur n'a pas spécifié d'arguments.");
        return sendInteraction(interaction, "Pour utiliser la fonction \`z!play\`, vous devez mettre après \`z!play\` des termes de recherche ou un lien vers une vidéo YouTube spécifique.");
    }
    
    
    if (!validate) {
        console.log("Fonction slash playmusic : Une recherche sur YouTube a été effectuée à la place car l'argument n'est pas un lien.");
        return ytsearchslasha(interaction, serverQueue, member, `z!play ${args}`);
    }
    

    
 const permissions = voiceChannel.permissionsFor(member.client.user); // On récupère les permissions du bot pour le salon vocal
 if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) { // Si le bot n'a pas les permissions
     console.log("z!play : Le bot ne possède pas les autorisations nécessaires tels que CONNECT et SPEAK. Il ne peut pas continuer.");
     return sendInteraction(interaction,
         "Le bot ne possède pas les autorisations nécessaires au fonctionnement de la lecture de musique. Vérifiez les rôles de @Zbeub Bot et leurs autorisations."
     );
 }
    /*
    try {
        var video = await youtube.getVideoById(url)
    } catch {
        try {
            var videos = await youtube.searchVideos(searchString, 1)
            var video = await youtube.getVideoById(videos[0].id)
        } catch {
            return message.channel.send("Pas de résultats trouvés.")
        } 
    }
    */
    /*
    const song = {
        id : video.id,
        title : video.title,
        url : `https://www.youtube.com/watch?v=${video.id}`
    } 
    */
    console.log("Fonction slash playmusic : Récupération des métadonnées de la vidéo YouTube.");

    sendInteraction(interaction, "Ajout de la musique à la liste de lecture...")

    const songInfo = await ytdl.getInfo(argument);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {
        const queueConstruct = {
            textChannel: interaction.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 1,
            playing: true,
            loop: false,
        };

        console.log("Fonction slash playmusic : Ajout dans la liste de lecture.");
        // On ajoute la queue du serveur dans la queue globale:
        queue.set(interaction.guild_id, queueConstruct);
        // On y ajoute la musique
        queueConstruct.songs.push(song);
        console.log("Fonction slash playmusic : Le bot essaie de rejoindre le salon vocal...");
        try {
            // On connecte le bot au salon vocal et on sauvegarde l'objet connection

            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            // On lance la musique
            console.log("Fonction slash playmusic : La lecture de musique s'est effectuée via un lien YouTube.");
            play(interaction.guild_id, queueConstruct.songs[0], queue);
        }
        catch (err) {
            //On affiche les messages d'erreur si le bot ne réussi pas à se connecter, on supprime également la queue de lecture
            console.log("Fonction slash playmusic : Le bot n'a pas réussi à rejoindre le salon vocal.");
            console.log(`Code d'erreur : ${err}`);
            queue.delete(interaction.guild_id);
            return interaction.callback(err);
        }
    }
    else {
        serverQueue.songs.push(song);
        console.log("Fonction slash playmusic : Ajout de la musique suivante (via lien YouTube).");
        console.log(`Fonction slash playmusic : Titre : ${song.title}`);
        console.log(`Fonction slash playmusic : URL : ${song.url}`);
        //console.log(serverQueue.songs);
        return sendMessage(interaction, `**${song.title}** a été ajoutée dans la liste de lecture ! 😉`);
    }
}

function ytsearchslasha(interaction, serverQueue, member, search) {
    var args = search.trim().split(/ +/g);

    

    const voiceChannel = member.voice.channel;
    if (!voiceChannel) // Si l'utilisateur n'est pas dans un salon vocal
    {
        console.log("Fonction ytsearch : L'utilisateur a quitté le salon vocal pendant la sélection de la musique ou n'était pas dans le salon vocal.");
        return sendMessage(interaction,
            "Soyez dans un salon vocal pour que cela fonctionne 😉 !"
        );
    }

    sendMessage(interaction, "Recherche sur YouTube...");

    console.log("Fonction ytsearch : Recherche des résultats via YouTube...");
    yts(args.join(' '), function (err, res) {


        if (err) {
            console.log("Fonction ytsearch : Une erreur inconnue est survenue.");
            return sendMessage(interaction, "Pikachu n'est pas content ! Une erreur étrange s'est produite ! **tête choquée**");
        }

        let videos = res.videos.slice(0, 5);

        let resp = '';
        for (var i in videos) {
            resp += `**[${parseInt(i) + 1}]:** \`${videos[i].title}\`\n`;
        }

        resp += `\n**Pour choisir la musique, saisissez un nombre entre \`1-${videos.length}\`**`;

        sendMessage(interaction, resp);
        console.log("Fonction ytsearch : Envoi des résultats à l'utilisateur.");

        const filter = m => !isNaN(m.content) && m.content < videos.length + 1 && m.content > 0;
        const collector = new Discord.MessageCollector(interaction.channel, filter);
        console.log("Fonction ytsearch : Récupération des messages utilisateurs et attente d'une réponse valide.");
        collector.videos = videos

        //this is where I don't know what to do.
        collector.once('collect', async function (m) {

            console.log("Fonction ytsearch : Récupération des métadonnées de la vidéo YouTube.");
            console.log("Fonction ytsearch : Réponse valide récupérée.");
            const urlvideo = `https://www.youtube.com/watch?v=${videos[parseInt(m.content) - 1].videoId}`
            const songInfo = await ytdl.getInfo(urlvideo);
            const serverQueue = queue.get(interaction.guild_id);



            //if (isNan(m.content)) return message.channel.send("Ce n'est pas une commande valide.")

            const song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
            };
            console.log("Fonction ytsearch : Musique préparée : ")
            console.log(`Fonction ytsearch : Titre : ${song.title}`);
            console.log(`Fonction ytsearch : URL : ${urlvideo}`);
            executeytsearch(urlvideo, serverQueue, m);

            return;
        });


        //message.channel.send("Ce n'est pas une commande valide, tu as peut-être entré du texte ?")

    });
}

function playslash(guild, song) {
    //console.log(song);
    const serverQueue = queue.get(guild.id); // On récupère la queue de lecture
    if (!song) { // Si la musique que l'utilisateur veux lancer n'existe pas on annule tout et on supprime la queue de lecture
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        console.log("Fonction play : Arrêt de la lecture et le bot quitte le salon vocal.");
        client.user.setActivity("z!help", { type: "PLAYING" });
        return;
    }
    // On lance la musique
    const dispatcher = serverQueue.connection
        .play(ytdl(song.url, { filter: 'audioonly' }))
        .on("finish", () => { // On écoute l'événement de fin de musique
            if (!serverQueue.loop) serverQueue.songs.shift(); // On passe à la musique suivante quand la courante se termine
            playslash(guild, serverQueue.songs[0], queue);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolume(1); // On définie le volume
    console.log("Fonction play : Lecture de la musique suivante : ");
    console.log(`Fonction play : Titre : ${song.title}`);
    console.log(`Fonction play : URL : ${song.url}`);
    serverQueue.textChannel.send(`Lecture de la musique : **${song.title}**`);
    client.user.setActivity(song.title, { type: "PLAYING" });
}


//function sendMessage(ifSlash, message) {
//    if (ifSlash) {
//        let value = message
//        return interaction.channel.send
//    }
//}
client.login(process.env.BOT_TOKEN); //connexion du bot au serveur de Discord