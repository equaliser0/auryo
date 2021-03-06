import { version } from './package.json'

const BASE_URL = 'http://api.auryo.com'

export default {
    // SoundCloud
    BASE_URL,
    CLIENT_ID: process.env.CLIENT_ID,
    SENTRY_URL: process.env.SENTRY_URL,

    getConnectUrl: (socketID) => {
        return `${BASE_URL}/connect?state=${socketID}&env=${process.env.NODE_ENV}`
    },

    // Google

    GOOGLE_GA: process.env.GOOGLE_GA,

    // App

    MAIN_WINDOW: 'file://' + __dirname + '/renderer/app.html',
    STREAM_CHECK_INTERVAL: 60000,
    UPDATE_SERVER_HOST: 'https://api.github.com/repos/Superjo149/Auryo/releases/latest',

    // Config

    DEFAULT_CONFIG: {
        token: process.env.TOKEN ? process.env.TOKEN : null,
        volume: .5,
        version: version,
        hideReposts: false,
        enableProxy: false,
        proxy: {
            host: null,
            port: null,
            username: null,
            password: null
        },
        app: {
            analytics: true,
            crashReports: true
        }
    }
}

