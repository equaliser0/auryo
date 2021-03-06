import React from 'react'
import PropTypes from 'prop-types'
import { SC } from '../../../../shared/utils/index'
import { PLAYER_STATUS } from '../../../../shared/constants/index'
import TrackListItem from './trackListItem.component'

class trackList extends React.PureComponent {

    playTrack(id, dbl, e) {
        const { playTrackFunc, player } = this.props

        if (!e) {
            e = dbl
        }

        if (dbl) {
            e.preventDefault()
            playTrackFunc(id)
        } else {
            if (e.target.tagName === 'TD' && (player.playingTrack.id !== id || player.status !== PLAYER_STATUS.PLAYING)) {
                playTrackFunc(id)
            }
        }

    }

    render() {
        const {
            items,
            likes,
            reposts,
            hideFirstTrack,
            player,

            likeFunc,
            toggleRepost,
            show,
            addUpNext
        } = this.props

        const _this = this

        return (
            <div className="table-responsive trackList">
                <table className="table">
                    <thead>
                    <tr className="trackListHeader">
                        <th className="row-play" />
                        <th className="row-title">
                            Title
                        </th>
                        <th className="trackArtist row-artist">
                            Artist
                        </th>
                        <th className="text-xs-center row-timer">
                            <i className="icon-timer" />
                        </th>
                        <th className="trackitemActions row-actions">

                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        items.map((track, i) => {
                            if (i === 0 && hideFirstTrack) return

                            if (!track) {
                                console.error('no track', track)
                                return null
                            }

                            const liked = SC.hasID(track.id, likes.track)
                            const reposted = SC.hasID(track.id, reposts)

                            return (
                                <TrackListItem
                                    key={`track-list-${track.id}`}
                                    track={track}
                                    isPlaying={track.id === player.playingTrack.id}
                                    liked={liked}
                                    reposted={reposted}

                                    addUpNext={addUpNext}
                                    playTrackFunc={_this.playTrack.bind(_this, track.id)}
                                    likeFunc={likeFunc}
                                    toggleRepost={toggleRepost}
                                    show={show}
                                />
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}

trackList.propTypes = {
    playingTrack: PropTypes.object,
    items: PropTypes.array.isRequired,
    player: PropTypes.object.isRequired,
    likes: PropTypes.object.isRequired,
    reposts: PropTypes.object.isRequired,
    hideFirstTrack: PropTypes.bool,

    likeFunc: PropTypes.func.isRequired,
    show: PropTypes.func.isRequired,
    addUpNext: PropTypes.func.isRequired,
    toggleRepost: PropTypes.func.isRequired

}

trackList.defaultProps = {
    items: [],
    hideFirstTrack: false
}

export default trackList
