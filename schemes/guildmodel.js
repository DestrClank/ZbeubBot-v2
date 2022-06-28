const { Schema , model } = require('mongoose')

const Guild = Schema({
    id: String,
    MusicVolume: {
        default: "1",
        type: String
    }
})

module.exports = model('Guild', Guild);
