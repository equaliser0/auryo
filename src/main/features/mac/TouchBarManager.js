import { CHANGE_TYPES } from '../../../renderer/modules/player/constants/player'
import * as SC from '../../../shared/utils/soundcloudUtils'
import IMacFeature from './IMacFeature'
import { nativeImage, TouchBar } from 'electron'
import path from 'path'
import { EVENTS } from '../../../shared/constants/events'

const {
    TouchBarButton,
    TouchBarSpacer
} = TouchBar

let iconsDirectory

if (process.env.NODE_ENV === 'development') {
    iconsDirectory = path.resolve(__dirname, '..', '..', '..', 'assets', 'img', 'icons')
} else {
    iconsDirectory = path.resolve(__dirname, './assets/img/icons')
}

export default class TouchBarManager extends IMacFeature {

    constructor(app) {
        super(app)

        this._updateStatus = this._updateStatus.bind(this)
        this._checkIfLiked = this._checkIfLiked.bind(this)
    }

    likestates = {
        liked: nativeImage.createFromPath(path.join(iconsDirectory, 'heart-full.png')).resize({
            width: 20
        }),
        unliked: nativeImage.createFromPath(path.join(iconsDirectory, 'heart.png')).resize({
            width: 20
        })
    }

    playstates = {
        'PLAYING': nativeImage.createFromPath(path.join(iconsDirectory, 'pause.png')).resize({
            width: 20
        }),
        'PAUSED': nativeImage.createFromPath(path.join(iconsDirectory, 'play.png')).resize({
            width: 20
        }),
        'STOPPED': nativeImage.createFromPath(path.join(iconsDirectory, 'play.png')).resize({
            width: 20
        })
    }
    prev_btn = new TouchBarButton({
        icon: nativeImage.createFromPath(path.join(iconsDirectory, 'previous.png')).resize({
            width: 20
        }),
        click: () => {
            this.router.send(EVENTS.PLAYER.CHANGE_TRACK, CHANGE_TYPES.PREV)
        }
    })

    playpause_btn = new TouchBarButton({
        icon: this.playstates.PAUSED,
        click: () => {
            this.router.send(EVENTS.PLAYER.TOGGLE_STATUS)
        }
    })
    next_btn = new TouchBarButton({
        icon: nativeImage.createFromPath(path.join(iconsDirectory, 'next.png')).resize({
            width: 20
        }),
        click: () => {
            this.router.send(EVENTS.PLAYER.CHANGE_TRACK, CHANGE_TYPES.NEXT)
        }
    })

    like_btn = new TouchBarButton({
        icon: this.likestates.unliked,
        click: () => {
            const {
                player: {
                    playingTrack
                }
            } = this.store.getState()

            this.router.send(EVENTS.TRACK.LIKE, playingTrack.id)
        }
    })

    register() {

        const touchBar = new TouchBar([
            this.prev_btn,
            this.playpause_btn,
            this.next_btn,
            new TouchBarSpacer({
                size: 'small'
            }),
            this.like_btn,
            new TouchBarSpacer({
                size: 'small'
            })

        ])

        this.win.setTouchBar(touchBar)

        this.on(EVENTS.APP.READY, () => {
            this.subscribe(['player', 'status'], this._updateStatus)

            this.subscribe(['player', 'playingTrack'], this._checkIfLiked)
            this.on(EVENTS.TRACK.LIKED, this._checkIfLiked)
        })

    }

    _checkIfLiked() {
        const {
            entities: {
                track_entities
            },
            player: {
                playingTrack
            },
            auth: {
                likes
            }
        } = this.store.getState()

        const trackID = playingTrack.id
        const track = track_entities[trackID]

        if (track) {
            const liked = SC.hasID(track.id, likes.track)

            this.like_btn.icon = liked ? this.likestates.liked : this.likestates.unliked
        }
    }

    _updateStatus({ currentValue }) {
        this.playpause_btn.icon = this.playstates[currentValue]
    }

    unregister() {
        super.unregister()

        if (!this.app.mainWindow) {
            this.win.setTouchBar(null)
        }
    }

}