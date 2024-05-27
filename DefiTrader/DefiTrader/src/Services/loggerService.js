const pino = require('pino')
const parent = pino({
    transport: {
        target: 'pino-pretty',
        messageFormat: '{filename}: {msg}',
        options: {
            colorize: true
        }
    }
})
global.loggerParent = parent
module.exports = function (scriptName){
    return parent.child({a: scriptName})
};