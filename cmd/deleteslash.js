const Discord = require('discord.js'); //Chargement module Discord
const DiscordSlash = require('discord.js-slash-command'); //Chargement module Discord Slash Commands
const { sendCmdLog, sendStatusLog, sendErrorLog, sendFunctionLog, sendWarnLog } = require("../debug/consolelogs")

require('dotenv').config();

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = (message, token) => {
    //return message.channel.send("Cette commande est en cours de développement.")
    if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
        sendWarnLog("z!deleteslashcommands : L'utilisateur n'a pas les droits nécessaires et la désinstallation des commandes est annulée.");
        return message.channel.send("Vous n'avez pas les droits nécessaires pour utiliser cette commande.\nPermission nécessaire : \`Administrateur\`")
    }

    sendStatusLog(`z!deleteslashcommands : La désinstallation des commandes slash a commencé sur le serveur demandé.`)
    sendStatusLog(`Guild ID du serveur demandé : : ${message.guild.id}`)

    const clientId = "830766885006999573"
    const guildId = message.guild.id;

    const rest = new REST({ version: '9' }).setToken(token);
    rest.get(Routes.applicationGuildCommands(clientId, guildId))
        .then(data => {
            const promises = [];
            for (const command of data) {
                const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
                promises.push(rest.delete(deleteUrl));
            }
            return Promise.all(promises);
        });

    message.channel.send("Les commandes slash et les commandes d'application sont en cours de désinstallation.")

}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

