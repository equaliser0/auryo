import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import './Spinner.scss'

const Spinner = ({ full, contained }) => (
    <div className={cn('loader', { full: full, contained: contained })}>
        <div>
            <svg version="1.1" id="Layer_1" x="0px" y="0px" width={35} height={26}>

                <rect x="0" y="13" width="4" height="5" fill="#333">

                    <animate attributeName="height" attributeType="XML"
                             values="5;25;5"
                             begin="0s" dur="0.8s" repeatCount="indefinite" />
                    <animate attributeName="y" attributeType="XML"
                             values="13; 1; 13"
                             begin="0s" dur="0.8s" repeatCount="indefinite" />

                </rect>
                <rect x="10" y="13" width="4" height="5" fill="#333">
                    <animate attributeName="height" attributeType="XML"
                             values="5;25;5"
                             begin="0.15s" dur="0.8s" repeatCount="indefinite" />
                    <animate attributeName="y" attributeType="XML"
                             values="13; 1; 13"
                             begin="0.15s" dur="0.8s" repeatCount="indefinite" />
                </rect>
                <rect x="20" y="13" width="4" height="5" fill="#333">
                    <animate attributeName="height" attributeType="XML"
                             values="5;25;5"
                             begin="0.3s" dur="0.8s" repeatCount="indefinite" />
                    <animate attributeName="y" attributeType="XML"
                             values="13; 1; 13"
                             begin="0.3s" dur="0.8s" repeatCount="indefinite" />
                </rect>
                <rect x="30" y="13" width="4" height="5" fill="#333">
                    <animate attributeName="height" attributeType="XML"
                             values="5;25;5"
                             begin="0.7s" dur="0.8s" repeatCount="indefinite" />
                    <animate attributeName="y" attributeType="XML"
                             values="13; 1; 13"
                             begin="0.5s" dur="0.8s" repeatCount="indefinite" />
                </rect>

            </svg>
        </div>
    </div>
)

Spinner.propTypes = {
    full: PropTypes.bool,
    contained: PropTypes.bool
}

export default Spinner
