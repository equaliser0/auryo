import ILinuxFeature from './ILinuxFeature'
import * as SC from '../../../shared/utils/soundcloudUtils'
import { IMAGE_SIZES } from '../../../shared/constants/Soundcloud'
import { CHANGE_TYPES, PLAYER_STATUS } from '../../../renderer/modules/player/constants/player'
import path from 'path'
import * as _ from 'lodash'
import Logger from '../../utils/logger'
import { EVENTS } from '../../../shared/constants/events'

let logosPath

if (process.env.NODE_ENV === 'development') {
    logosPath = path.resolve(__dirname, '..', '..', '..', 'assets', 'img', 'logos')
} else {
    logosPath = path.resolve(__dirname, './assets/img/logos')
}

export default class MprisService extends ILinuxFeature {

    constructor(app) {
        super(app)

        this._updateTime = this._updateTime.bind(this)
        this._updateStatus = this._updateStatus.bind(this)
    }

    shouldRun() {
        return super.shouldRun() && !process.env.TOKEN
    }

    meta = {}
    player

    register() {
        let mpris

        try {
            mpris = require('mpris-service')

            this.player = mpris({
                name: 'auryo-player',
                identity: 'Auryo',
                canRaise: true,
                supportedInterfaces: ['player'],
                desktopEntry: 'Auryo'
            })
        } catch (e) {
            Logger.warn('Mpris not supported', e)
            return
        }

        this.player.playbackStatus = 'Stopped'
        this.player.canEditTracks = false
        this.player.canSeek = false
        //this.player.canGoPrevious = false;
        //this.player.canGoNext = false;
        this.player.shuffle = false
        this.player.canControl = true
        this.player.loopStatus = 'None'
        this.player.rate = 1.0

        this.player.metadata = {
            'xesam:title': 'Auryo',
            'mpris:artUrl': 'file://' + path.join(logosPath, 'auryo-128.png')
        }

        this.player.on('raise', () => {
            this.win.setSkipTaskbar(false)
            this.win.show()
        })

        this.player.on('quit', () => {
            app.quit()
        })

        this.player.on('play', () => this.win.webContents.send(EVENTS.PLAYER.TOGGLE_STATUS, PLAYER_STATUS.PLAYING))

        this.player.on('pause', () => this.win.webContents.send(EVENTS.PLAYER.TOGGLE_STATUS, PLAYER_STATUS.PAUSED))

        this.player.on('playpause', () => this.win.webContents.send(EVENTS.PLAYER.TOGGLE_STATUS))

        this.player.on('stop', () => this.win.webContents.send(EVENTS.PLAYER.TOGGLE_STATUS, PLAYER_STATUS.STOPPED))

        this.player.on('next', () => this.win.webContents.send(EVENTS.PLAYER.CHANGE_TRACK, CHANGE_TYPES.NEXT))

        this.player.on('previous', () => this.win.webContents.send(EVENTS.PLAYER.CHANGE_TRACK, CHANGE_TYPES.PREV))


        //
        // WATCHERS
        //

        this.on(EVENTS.APP.READY, () => {
            /**
             * Update track information
             */
            this.subscribe(['player', 'playingTrack'], ({ currentState }) => {
                const { entities: { track_entities, user_entities }, player: { playingTrack, queue } } = currentState

                const trackID = playingTrack.id
                const track = track_entities[trackID]
                const position = queue.indexOf(playingTrack)
                const user = user_entities[track.user || track.user_id]

                this.player.canGoPrevious = (queue.length > 0 && position > 0)
                this.player.canGoNext = (queue.length > 0 && (position + 1 <= queue.length))

                this.meta = {
                    ...this.meta,
                    ...this.player.metadata
                }

                this.meta['mpris:trackid'] = track.id
                this.meta['xesam:title'] = track.title
                this.meta['xesam:artist'] = [user && user.username ? user.username : 'Unknown artist']
                this.meta['mpris:artUrl'] = SC.getImageUrl(track, IMAGE_SIZES.SMALL)
                this.meta['xesam:url'] = track.uri || ''
                this.meta['xesam:useCount'] = track.playback_count || 0
                this.meta['xesam:genre'] = track.genre || ''
                this.meta['xesam:contentCreated'] = track.created_at || 'Unknown release date'

                if (!_.isEqual(meta, this.player.metadata)) {
                    this.player.metadata = meta
                }

            })

            /**
             * Update time
             */
            this.subscribe(['player', 'status'], this._updateStatus)
            this.subscribe(['player', 'currentTime'], this._updateTime)
            this.subscribe(['player', 'duration'], this._updateTime)
        })
    }

    _updateStatus({ currentValue }) {
        if (currentValue) {
            this.player.playbackStatus = currentValue.toLowerCase().charAt(0).toUpperCase() + currentValue.toLowerCase().slice(1)
        }
    }

    _updateTime({ currentState: { player: { currentTime, duration } } }) {

        this.meta = {
            ...this.meta,
            ...this.player.metadata
        }

        this.meta['mpris:length'] = duration * 1e3

        this.player.position = currentTime * 1e3

        if (!_.isEqual(this.meta, this.player.metadata)) {
            this.player.metadata = this.meta
        }
    }

    unregister() {
        super.unregister()
    }

}