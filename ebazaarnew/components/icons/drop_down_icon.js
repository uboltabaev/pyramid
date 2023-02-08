import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Polygon, G } from 'react-native-svg';

const DropDownIcon = React.memo(({width, height, color}) => {
    return (
        <Svg height={height} width={width} viewBox="0 0 255 255" fill={color}>
            <G>
                <G>
                    <Polygon points="0,63.75 127.5,191.25 255,63.75"/>
                </G>
            </G>
        </Svg>
    )
})

DropDownIcon.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    color: PropTypes.string
}

DropDownIcon.defaultProps = {
    color: "#000"
}

export default DropDownIcon;