const values = require("../values.json");
const { sendCmdLog, sendStatusLog, sendErrorLog, sendFunctionLog, sendWarnLog, sendLogToDev } = require("../debug/consolelogs")
const os = require('os')

function oscpu() {
    let values = [];

    if (process.platform === "android") {
        return ["Modèle indisponible.", "Impossible de récupérer le nombre de coeurs."]
    } else {
        return [os.cpus()[0].model,os.cpus().length]
    }
}

module.exports = () => {
    sendStatusLog("\
    \nCaractéristiques :\n\
    Version : "+values.version.versionNumber+"\n\
    Version courte : "+ values.version.shortversionNumber +"\n\
    Version des commandes slash : "+ values.version.slashversionNumber +"\n\
    Fonction andreaeaster activée : "+values.settings.RandomfunctionDeployed+"\n\
    Fonctionnalités musicales activées : "+values.settings.musicCmdEnable+"\n\
    Fonction z!changelog activée : "+values.settings.ChangelogFunctionDeployed+"\n\
    Fonction en test déployées : "+values.settings.TestFeatureDeployed+"\n\
    Préfixe par défaut : "+values.settings.prefix+"\n\
    Architecture utilisée : "+ os.arch()+"\n\
    Type de système d'exploitation : "+os.type()+"\n\
    Système d'exploitation : "+os.release()+"\n\
    Version du système d'exploitation : "+os.version()+"\n\
    Processeur : "+oscpu()[0]+"\n\
    Nombre de coeurs : "+oscpu()[1]+"\n\
    Mémoire libre sur l'ordinateur : "+os.freemem()/(1*10**6)+" MB\n\
    Mémoire RAM totale sur l'ordinateur : "+os.totalmem()/(1*10**9)+" GB\n\
    Version de l'installateur de commandes slash de Zbeub Bot : "+values.version.deployerVersion+"\n\
    Version de Node.js utilisée : "+process.versions.node)
}