const rateLimit = require('express-rate-limit')
const {  logEvents } = require('./logger')

const logLimiter = rateLimit({
    windowMs: 60 * 1000, //1 min
    max: 5,
    message: {
        message:'Too many login attempts from this IP, please try again after a60 second pause'
    },
    handler: (req, res, next, options) => {
        logEvents(`Too Many Request: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true,
    legacyHeader: false
})

module.exports = logLimiter