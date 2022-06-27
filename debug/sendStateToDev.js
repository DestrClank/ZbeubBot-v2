const values = require('../values.json')

module.exports = (Discord, client, state) => {
    return client.users.cache.get(values.properties.userID).send(state);
}