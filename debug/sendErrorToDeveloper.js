const values = require('../values.json')

module.exports = (Discord, client, error, sys) => {
    return client.users.cache.get(values.properties.userID).send(`Une erreur est survenue dans la fonction \`${sys}\` : ${error}`)
}