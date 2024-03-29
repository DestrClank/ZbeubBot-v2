require("dotenv").config();
const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./bot.js', { token: process.env.BOT_TOKEN });

manager.on('shardCreate', shard => console.log(`Le shard ${shard.id} est démarré.`));

manager.spawn();