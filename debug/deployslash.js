const values = require("../values.json")
const versionNumber = values.version.versionNumber


function deployglobalcmd(client) {
    const { exec } = require('child_process');

    const ls = exec('DeploySlash', function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Erreur: ' + error.code);
            console.log('Signal reçu: ' + error.signal);
        }
        console.log('Processus enfant STDOUT: ' + stdout);
        console.log('Processus enfant STDERR: ' + stderr);
    });

    ls.on('exit', function (code) {
        client.user.setActivity(`z!help ■ ${versionNumber}`, { type: "PLAYING" })
        console.log('Le processus enfant s\'est terminé avec comme code : ' + code);
    });
}

module.exports = (client) => {
    deployglobalcmd(client)
}