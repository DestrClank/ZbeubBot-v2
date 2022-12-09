const { Schema , model } = require('mongoose')
const values = require("../values.json")

const Guild = Schema({
    id:String,
    SettingsVersion: {
        default: values.version.settingsVersion,
        type: String
    },
    id:String,
    SlashCommandsVersion: {
        default: values.version.slashversionNumber,
        type: String
    },
    id: String,
    MusicVolume: {
        default: "1",
        type: String
    },
    id:String,
    SimplifiedMusicMenus: {
        default: "false",
        type: String
    }
})

module.exports = model('Guild', Guild);
