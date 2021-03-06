import ReduxWatcher from 'redux-watcher'
import isEqual from 'lodash/isEqual'

export default class IFeature {

    waitUntil = 'default'
    listeners = []
    ipclisteners = []

    constructor(auryo) {
        this.win = auryo.mainWindow
        this.router = auryo.router
        this.store = auryo.store
        this.app = auryo

        this.watcher = new ReduxWatcher(auryo.store)
    }

    subscribe(path, callback) {
        const listener = this.watcher.watch(path, callback)

        this.listeners.push({
            path,
            handler: listener
        })
    }

    on(path, callback) {
        this.router.on(path, callback)

        this.ipclisteners.push({
            name: path,
            handler: callback
        })
    }

    register() {

    }

    /**
     * Unregister listener
     *
     * @param {Array} [path]
     */
    unregister(path) {

        if (path) {
            const listener = this.listeners.find(l => isEqual(l.path, path))
            const listenerIndex = this.listeners.findIndex(l => isEqual(l.path, path))

            if (listener && typeof listener.unsubscribe === 'function') {
                listener.unsubscribe()
                this.listeners.splice(listenerIndex)
            }
        } else {
            this.listeners.forEach(listener => {
                try {
                    this.watcher.off(listener.path, listener.handler)
                } catch (err) {
                    if (!err.message.startsWith('No such listener for')) {
                        throw err
                    }
                }
            })
            this.ipclisteners.forEach(listener => {
                this.router.removeListener(listener.name, listener.handler)
            })
        }


    }

    shouldRun() {
        return true
    }
}