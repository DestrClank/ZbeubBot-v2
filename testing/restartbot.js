//var spawn = require('child_process').spawn;
/*
function main() {

  if (process.env.process_restarting) {
    delete process.env.process_restarting;
    // Give old process one second to shut down before continuing ...
    setTimeout(main, 1000);
    return;
  }

  // ...

  // Restart process ...
  spawn(process.argv[0], process.argv.slice(1), {
    env: { process_restarting: 1 },
    stdio: 'ignore'
  }).unref();
};
*/
/*
function deployglobalcmd(client) {
  const { exec } = require('child_process');

  const ls = exec('node index.js', function (error, stdout, stderr) {
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
*/
module.exports = () => {
  //main()
}