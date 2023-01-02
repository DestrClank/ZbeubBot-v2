const request = require('request')
const Discord = require("discord.js")
const convertyoutubetomp3 = require('./convertyoutubetomp3');
const values = require("../values.json");
const { spawn, exec } = require("child_process")

module.exports = {
    "restartbot" : function(message) {

      if (message.user.id != "456117123283157002") {
        return message.reply({content: "EHHH twa là, espèce de petit chenapan !!! Seul le développeur peut redémarrer le bot mdrrr !!!!", ephemeral:true})
      }

      const embedMessage = new Discord.MessageEmbed()
      .setAuthor("Redémarrage du bot", "https://cdn.discordapp.com/emojis/996019609369059328.webp?size=96&quality=lossless")
      .setTitle("Redémarrage du bot en cours...")
      .setDescription("Je me redémarre à l'heure actuelle. Je vous dirai quand j'aurais fini.")
      .setFooter({text: `Zbeub Bot version ${values.version.versionNumber}`, iconURL: values.properties.botprofileurl})
      .setColor("#FF0000");

      message.update({embeds: [embedMessage], components: []})

      /*
      request.delete(
        {
            url: 'https://api.heroku.com/apps/' + "zbeubbot" + '/dynos/',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.heroku+json; version=3',
                'Authorization': 'Bearer ' + process.env.HEROKU_API_TOKEN
            }
        },
        function(error, response, body) {
            console.log(error)
            console.log(response)
            console.log(body)
        });
        */
        exec('kill 1', (err, output) => {
          if (err) {
              console.error("Impossible d'éxecuter la commande de redémarrage.", err);
              return
          }
        console.log(`Commande de redémarrage réussie.`);
      });  

    },
    "sendConfirmationMsg": function(message, queue) {
      const embedMessage = new Discord.MessageEmbed()
        .setAuthor("Redémarrage du bot", "https://cdn.discordapp.com/emojis/996019609369059328.webp?size=96&quality=lossless")
        .setTitle("Voulez vous vraiment me redémarrer, chef OnO ?")
        .setDescription("Etat des fonctionnalités actuels :")
        .addFields(
          {name: "Fonctionnalité musicale utilisée sur :", value: `${queue.size} serveurs`,inline: true},
          {name: "Nombre de musiques en conversion : ", value: `${convertyoutubetomp3.convertingprocesses.length} musiques`}
        )
        .setFooter({text: `Zbeub Bot version ${values.version.versionNumber}`, iconURL: values.properties.botprofileurl})
        .setColor("#FF0000");

      const buttonSelect = new Discord.MessageActionRow()
          .addComponents(
            new Discord.MessageButton()
              .setStyle("SUCCESS")
              .setCustomId("restart_confirmed")
              .setLabel("Oui")
          )
          .addComponents(
            new Discord.MessageButton()
            .setStyle("DANGER")
            .setCustomId("restart_declined")
            .setLabel("Non")
          )
          message.channel.send({embeds: [embedMessage], components: [buttonSelect]})
          return;
    },
    "deleteMsg": async function(message) {

      if (message.user.id != "456117123283157002") {
        return message.reply({content: "EHHH twa là, hop hop hop, espèce de petit mécréant !!! Seul le développeur peut choisir mdrrr !!!!", ephemeral:true})
      }

      const embedMessage = new Discord.MessageEmbed()
      .setAuthor("Redémarrage du bot", "https://cdn.discordapp.com/emojis/996019609369059328.webp?size=96&quality=lossless")
      .setTitle("Le redémarrage est annulé.")
      .setDescription("D'accord, merci chef ! ^^ Je ne me redémarrerai pas ! UwU")
      .setFooter({text: `Zbeub Bot version ${values.version.versionNumber}`, iconURL: values.properties.botprofileurl})
      .setColor("#00FF00");

      message.update({embeds: [embedMessage], components: []})

      await sleep(10000);

      return message.message.delete();
    }

} 

function sleep(ms) {
  return new Promise((resolve) => {
      setTimeout(resolve, ms);
  });
}

