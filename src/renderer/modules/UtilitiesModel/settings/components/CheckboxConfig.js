import React from 'react';
import PropTypes from 'prop-types';
import Switch from '../../../_shared/Switch/Switch';

class CheckboxConfig extends React.Component {

    static propTypes = {
        config: PropTypes.object,
        setConfigKey: PropTypes.func,
        configKey: PropTypes.string,
        name: PropTypes.string,
        onChange: PropTypes.func
    };

    constructor() {
        super();

        this.state = {
            isChecked: null
        };

        this._handleChange = this._handleChange.bind(this);
    }


    render() {
        const { configKey, name, config } = this.props;

        const value = configKey.split('.').reduce((o, i) => o[i], config);

        return (
            <div className="setting d-flex justify-content-between align-items-center">
                <span>{name}</span> <Switch id={configKey} checked={value} onChange={this._handleChange} />
            </div>
        );
    }


    _handleChange(e) {
        const { configKey } = this.props;

        this.props.setConfigKey(configKey, e.target.checked);

        if (this.props.onChange) {
            this.props.onChange(e.target.checked);
        }
    }

}


export default CheckboxConfig;
