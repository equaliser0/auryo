import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../shared/actions/index'
import { OBJECT_TYPES } from '../../../shared/constants/index'
import Player from './components/player.component'
import './player.scss'

function mapStateToProps(state) {
    const { entities: { track_entities, user_entities }, player, objects, app, config, ui } = state
    const playlists = objects[OBJECT_TYPES.PLAYLISTS] || {}

    return {
        player,
        playlists,
        track_entities,
        user_entities,
        app,
        config,
        ui
    }
}

export default connect(mapStateToProps, actions)(Player)
