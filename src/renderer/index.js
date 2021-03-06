import React from 'react'
import { render } from 'react-dom'
import { configureStore, history } from './configureStore'
import Root from './Root'
import { AppContainer } from 'react-hot-loader'
import { SC } from '../shared/utils'
import './css/app.scss'
import { version } from '../../package.json'
import config from '../config'

/*if (process.env.NODE_ENV !== 'production') {
    const { whyDidYouUpdate } = require('why-did-you-update')
    whyDidYouUpdate(React)
}*/

const store = configureStore()

if (!process.env.TOKEN && process.env.NODE_ENV === 'production') {

    const { config: { app: { analytics, crashReports } } } = store.getState()

    if (crashReports) {
        const Raven = require('raven-js')

        Raven.config(config.SENTRY_URL).install()
    }
    if (analytics) {
        const ua = require('../shared/utils/universalAnalytics')

        ua().set('version', version)

        history.listen(function (location) {
            ua().pv(location.pathname).send()
        })
    }

}

const { config: { token } } = store.getState()

if (token) {
    SC.initialize(token)
}

render(
    <AppContainer>
        <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
)

if (module.hot) {
    module.hot.accept('./Root', () => {
        const NextRoot = require('./Root') // eslint-disable-line global-require
        render(
            <AppContainer>
                <NextRoot store={store} history={history} />
            </AppContainer>,
            document.getElementById('root')
        )
    })
}