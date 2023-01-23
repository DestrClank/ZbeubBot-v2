const { Client, Intents, MessageAttachment } = require('discord.js')
const Canvas = require('canvas');
const values = require("../values.json")
const { fillTextWithTwemoji } = require('node-canvas-with-twemoji-and-discord-emoji');

Canvas.registerFont('./cmd/assets/canvasgenerator/DTM-Sans.otf', {family : "Determination"})

const applyText = (canvas, text, fontSize) => {
	const context = canvas.getContext('2d');
	//let fontSize = 70;

	do {
		context.font = `${fontSize -= 5}px Determination`;
	} while (context.measureText(text).width > canvas.width - 250);

	return context.font;
};

module.exports = async (message) => {

    const mention = message.mentions.members.first()

    if (mention) {
        timestampmember = mention.joinedTimestamp;
        username = mention.displayName;
        servername = message.guild.name;
        useravatar = mention.displayAvatarURL({ format: 'jpg' });
    } else {
        timestampmember = message.member.joinedTimestamp;
        username = message.member.displayName;
        servername = message.guild.name;
        useravatar = message.member.displayAvatarURL({ format: 'jpg' });
    }

    var joindate = new Date(timestampmember)
    var textdate = joindate.getDate() + "/" + (joindate.getMonth()+1) + "/" + joindate.getFullYear()

    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage('./cmd/assets/canvasgenerator/canvas.jpg');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.strokeStyle = values.settings.embedColor;
    context.strokeRect(0, 0, canvas.width, canvas.height);

    context.font = '28px Determination';
    context.fillStyle = '#ffffff';
    context.fillText('Carte de profil', canvas.width / 2.8, canvas.height / 4);

    context.font = applyText(canvas, `${username}`, 50);
    context.fillStyle = '#ffffff';
    await fillTextWithTwemoji(context,`${username}`, canvas.width / 2.8, canvas.height / 2.3);
    //context.fillText(`${username}`, canvas.width / 2.8, canvas.height / 2.3);

    context.font = applyText(canvas, `${servername}`, 35);
    context.fillStyle = '#ffffff';
    await fillTextWithTwemoji(context,`${servername}`, canvas.width / 2.8, canvas.height / 1.7);
    //context.fillText(`${servername}`, canvas.width / 2.8, canvas.height / 1.7);

    context.font = applyText(canvas, `A rejoint le serveur le ${textdate}`, 35);
    context.fillStyle = '#ffffff';
    context.fillText(`A rejoint le serveur le ${textdate}`, canvas.width / 2.8, canvas.height / 1.4);

    context.beginPath();
    context.arc(125, 125, 100, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

    const avatar = await Canvas.loadImage(useravatar);
    context.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');

    message.channel.send({ files: [attachment] });

}