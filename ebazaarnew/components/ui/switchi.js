import React from 'react';
import { Switch } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { APP_MAIN_COLOR, APP_MAIN_COLOR_OPACITY_30 } from "../../constants/app";

const SwitchI = React.memo(({ isEnabled, onToggle }) => {
    const toggleSwitch = (val) => {
        if (_.isFunction(onToggle))
            onToggle(val)
    }

    return (
        <Switch trackColor={{ false: "#b2b2b2", true: APP_MAIN_COLOR_OPACITY_30() }}
            thumbColor={isEnabled ? APP_MAIN_COLOR : "#ececec"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
        />
    )
})

SwitchI.propTypes = {
    isEnabled: PropTypes.bool,
    onToggle: PropTypes.func
}

SwitchI.defaultProps = {
    isEnabled: false
}

export default SwitchI;