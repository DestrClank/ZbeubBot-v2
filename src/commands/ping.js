const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Calcule la latence entre le bot et Discord.'),
  async executeInteraction(interaction) {
    const sent = await interaction.reply({ content: 'Calcul en cours...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const websocket = Math.round(interaction.client.ws.ping);
    await interaction.editReply(`Pong ! Latence du message : ${latency}ms. Latence WebSocket : ${websocket}ms.`);
  },
  async executeMessage(message) {
    const sent = await message.reply('Calcul en cours...');
    const latency = sent.createdTimestamp - message.createdTimestamp;
    const websocket = Math.round(message.client.ws.ping);
    await sent.edit(`Pong ! Latence du message : ${latency}ms. Latence WebSocket : ${websocket}ms.`);
  },
};
